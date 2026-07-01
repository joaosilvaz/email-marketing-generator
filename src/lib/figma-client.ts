// ─── Cliente da API do Figma ────────────────────────────────────────────────
// Extrai texto exato + imagens diretamente da árvore de nós do Figma,
// sem depender de OCR/visão — muito mais preciso para texto.

interface FigmaNode {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
  characters?: string
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number }
  fills?: Array<{ type: string; visible?: boolean }>
  style?: { fontSize?: number; fontWeight?: number }
}

interface FigmaFileResponse {
  document: FigmaNode
}

interface FigmaNodesResponse {
  nodes: Record<string, { document: FigmaNode }>
}

export interface FigmaItem {
  kind: 'text' | 'image'
  nodeId: string
  y: number
  text?: string
  fontSize?: number
  fontWeight?: number
  width?: number
  height?: number
}

export interface FigmaExtraction {
  items: FigmaItem[]
  imageUrls: Record<string, string> // nodeId -> URL exportada
}

// ─── Parse da URL do Figma ──────────────────────────────────────────────────

export function parseFigmaUrl(url: string): { fileKey: string; nodeId?: string } {
  // Formatos aceitos:
  // https://www.figma.com/file/FILEKEY/Nome?node-id=123-456
  // https://www.figma.com/design/FILEKEY/Nome?node-id=123-456
  const fileMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/)
  if (!fileMatch) throw new Error('URL do Figma inválida — não foi possível extrair o file key')

  const fileKey = fileMatch[1]

  // node-id pode vir como "123-456", "123:456" ou URL-encoded "123%3A456"
  const nodeMatch = url.match(/node-id=([^&#]+)/)
  let nodeId: string | undefined
  if (nodeMatch) {
    nodeId = decodeURIComponent(nodeMatch[1])
      .replace(/-/g, ':')   // converte hífens em dois-pontos
      .replace(/::+/g, ':') // remove colons duplicados caso já fosse ":"
  }

  return { fileKey, nodeId }
}

// ─── Busca o nó raiz (arquivo inteiro ou nó específico) ────────────────────

async function fetchFigmaNode(fileKey: string, nodeId: string | undefined, token: string): Promise<FigmaNode> {
  const headers = { 'X-Figma-Token': token }

  if (nodeId) {
    const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, { headers })
    if (res.ok) {
      const data = await res.json() as FigmaNodesResponse
      const node = data.nodes[nodeId]?.document ?? data.nodes[Object.keys(data.nodes)[0]]?.document
      if (node) return node
    }
    // Node ID falhou — tenta o arquivo inteiro como fallback
    console.warn(`[Figma] Node ${nodeId} retornou ${res.status}, tentando arquivo inteiro...`)
  }

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, { headers })
  if (!res.ok) {
    if (res.status === 403) throw new Error('Acesso negado ao arquivo do Figma. Verifique se o token tem o escopo "file_content:read" e se você tem acesso ao arquivo.')
    if (res.status === 404) throw new Error('Arquivo do Figma não encontrado. Verifique se o link está correto e se o arquivo é acessível com sua conta.')
    throw new Error(`Erro ao buscar arquivo do Figma: ${res.status} ${res.statusText}`)
  }
  const data = await res.json() as FigmaFileResponse

  const firstPage = data.document.children?.[0]
  const firstFrame = firstPage?.children?.find(c => c.type === 'FRAME') ?? firstPage
  if (!firstFrame) throw new Error('Nenhum frame encontrado no arquivo do Figma')
  return firstFrame
}

// ─── Caminha a árvore coletando textos e imagens, em ordem vertical ────────

function walkTree(node: FigmaNode, items: FigmaItem[]): void {
  const y = node.absoluteBoundingBox?.y ?? 0

  if (node.type === 'TEXT' && node.characters?.trim()) {
    items.push({
      kind: 'text',
      nodeId: node.id,
      y,
      text: node.characters.trim(),
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
    })
    return // texto não tem filhos relevantes
  }

  const hasImageFill = node.fills?.some(f => f.type === 'IMAGE' && f.visible !== false)
  const w = node.absoluteBoundingBox?.width ?? 0
  const h = node.absoluteBoundingBox?.height ?? 0

  if (hasImageFill && w > 40 && h > 40) {
    items.push({ kind: 'image', nodeId: node.id, y, width: w, height: h })
    // não desce mais — a imagem é o conteúdo final desse nó
    return
  }

  for (const child of node.children ?? []) {
    walkTree(child, items)
  }
}

// ─── Exporta as imagens encontradas como PNG ────────────────────────────────

async function exportImages(fileKey: string, nodeIds: string[], token: string): Promise<Record<string, string>> {
  if (nodeIds.length === 0) return {}

  const ids = nodeIds.slice(0, 25).join(',') // limite de segurança
  const res = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=png&scale=2`,
    { headers: { 'X-Figma-Token': token } },
  )
  if (!res.ok) throw new Error(`Erro ao exportar imagens do Figma: ${res.status} ${res.statusText}`)
  const data = await res.json() as { images: Record<string, string | null> }

  const result: Record<string, string> = {}
  for (const [id, url] of Object.entries(data.images)) {
    if (url) result[id] = url
  }
  return result
}

// ─── Função principal: extrai estrutura completa de um frame do Figma ─────

export async function extractFigmaFrame(figmaUrl: string): Promise<FigmaExtraction> {
  const token = process.env.FIGMA_ACCESS_TOKEN
  if (!token) throw new Error('FIGMA_ACCESS_TOKEN não configurado no .env.local')

  const { fileKey, nodeId } = parseFigmaUrl(figmaUrl)
  const root = await fetchFigmaNode(fileKey, nodeId, token)

  const items: FigmaItem[] = []
  walkTree(root, items)
  items.sort((a, b) => a.y - b.y)

  const imageNodeIds = items.filter(i => i.kind === 'image').map(i => i.nodeId)
  const imageUrls = await exportImages(fileKey, imageNodeIds, token)

  return { items, imageUrls }
}

// ─── Monta um "digest" textual legível pra IA classificar ─────────────────

export function buildFigmaDigest(extraction: FigmaExtraction): string {
  return extraction.items
    .map((item, i) => {
      if (item.kind === 'text') {
        const weight = item.fontWeight && item.fontWeight >= 600 ? ' (negrito)' : ''
        const size = item.fontSize ? ` (${Math.round(item.fontSize)}px${weight})` : ''
        return `${i + 1}. [TEXTO]${size}: "${item.text}"`
      }
      return `${i + 1}. [IMAGEM id=${item.nodeId}] (${Math.round(item.width ?? 0)}x${Math.round(item.height ?? 0)}px)`
    })
    .join('\n')
}
