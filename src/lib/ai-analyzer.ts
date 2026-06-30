import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { AnalysisResult, EmailBlock, BrandId } from './types'
import { v4 as uuidv4 } from 'uuid'

// ─── Prompt ───────────────────────────────────────────────────────────────────

const ANALYSIS_PROMPT = `Você é um especialista em e-mail marketing e design de e-mails HTML.
Analise este layout de e-mail marketing e identifique TODOS os blocos de conteúdo, do topo até o final da imagem, na ordem em que aparecem.

REGRAS CRÍTICAS DE EXTRAÇÃO DE TEXTO:
1. Transcreva o texto PALAVRA POR PALAVRA, exatamente como aparece na imagem. Não resuma, não parafraseie, não abrevie.
2. Se um bloco de texto tiver várias frases ou parágrafos, inclua TODOS eles completos no campo "body", separados por "\\n\\n" se forem parágrafos distintos.
3. Nunca corte um texto no meio de uma frase. Se não conseguir ler com certeza alguma palavra, mantenha o restante do texto e marque a palavra ilegível como "[ilegível]" — não pule o trecho inteiro.
4. Não invente conteúdo que não esteja visível na imagem.
5. Inclua TODOS os blocos visíveis na imagem, incluindo textos legais/disclaimers pequenos no final, mesmo que estejam em fonte pequena ou longos — transcreva o texto legal INTEIRO, sem resumir.
6. Se a imagem tiver múltiplas seções de texto (ex: introdução, texto de seção, texto de corpo, texto legal), crie um bloco "text" separado para cada uma — não junte tudo em um único bloco.
7. IMPORTANTE — texto sobreposto a imagens: se um título/texto estiver desenhado SOBRE uma foto/imagem de fundo (ex: texto sobre uma foto de carro), esse texto faz parte da imagem (hero/banner) e NÃO deve virar um bloco "text" ou "bannerText" separado — apenas descreva no campo "alt" da imagem. Só crie blocos "text" para textos que estão sobre fundo sólido/liso (fora de fotos).
8. Se houver uma seção com TÍTULO + LISTA de itens (com marcadores • ou números 1,2,3...), SEMPRE use o tipo "list" — nunca classifique como "banner" vazio e nunca descarte os itens da lista.
9. Se houver 3 ou mais itens lado a lado com imagem + texto curto cada (formato "card"), use o tipo "cards". Se houver exatamente 2 colunas de conteúdo (imagem+texto cada), use "columns2". Se houver exatamente 3 colunas, use "columns3".
10. Preserve a ORDEM EXATA em que os blocos aparecem na imagem, de cima para baixo. O campo "order" deve refletir essa ordem (0, 1, 2, 3...).
11. Não pule nenhuma seção visível, mesmo que pareça repetida ou pouco importante (ex: múltiplos banners de produtos similares devem virar múltiplos blocos "banner" separados, um para cada).
12. NEGRITO: se uma palavra ou trecho estiver visualmente em negrito (mais grosso que o texto ao redor), marque envolvendo com **dois asteriscos**, exemplo: "Você e mais um acompanhante são **convidados especiais**". Não marque como negrito texto que não está em negrito.
13. QUEBRAS DE LINHA: reproduza as quebras de linha exatamente como estão na imagem usando "\\n" (uma quebra) entre linhas dentro do mesmo parágrafo, e "\\n\\n" entre parágrafos diferentes. Preste atenção em onde o texto realmente quebra de linha no design — não junte tudo em uma linha só nem invente quebras que não existem.

Tipos de bloco disponíveis e quando usar cada um:
- hero: imagem principal/banner do topo (pode ter texto sobreposto na própria imagem)
- text: parágrafo de texto sobre fundo sólido (introdução, texto de corpo, título de seção)
- cta: botão de ação com texto e link
- banner: imagem decorativa/promocional sem texto editável separado
- bannerText: imagem + bloco de texto lado a lado (e não dentro da imagem)
- list: título + lista de itens (com marcador • ou numeração 1,2,3), opcionalmente com imagem ao lado
- cards: 3+ itens lado a lado, cada um com imagem pequena + texto curto
- columns2: exatamente 2 colunas de conteúdo (imagem+texto)
- columns3: exatamente 3 colunas de conteúdo (imagem+texto)
- footer: rodapé com texto legal/disclaimers

Retorne SOMENTE um JSON válido com esta estrutura:
{
  "blocks": [
    {
      "type": "hero|text|cta|banner|bannerText|list|cards|columns2|columns3|footer",
      "order": 0,
      "content": {}
    }
  ],
  "detectedColors": ["#hex"],
  "rawDescription": "descrição do layout"
}

Campos por tipo (todos os campos de texto devem usar **negrito** e \\n conforme as regras 12 e 13 acima):
- hero: { "imageUrl": "", "link": "#", "alt": "descreva inclusive qualquer texto sobreposto na imagem" }
- text: { "headline": "texto exato e completo, com **negrito** e \\n onde houver", "body": "texto exato e completo, sem cortes, com **negrito** e \\n onde houver" }
- cta: { "buttonText": "texto exato do botão", "buttonUrl": "#", "text": "" }
- banner: { "imageUrl": "", "link": "#", "alt": "" }
- bannerText: { "imageUrl": "", "headline": "título", "body": "texto completo, com **negrito** e \\n onde houver", "buttonText": "botão", "buttonUrl": "#" }
- list: { "title": "título da seção", "items": "item 1\\nitem 2\\nitem 3" (um item por linha, separados por \\n; use **negrito** dentro do item se houver), "ordered": "true ou false", "imageUrl": "" }
- cards: { "title": "título da seção (opcional)", "card1Image": "", "card1Text": "texto exato", "card2Image": "", "card2Text": "texto exato", "card3Image": "", "card3Text": "texto exato" }
- columns2: { "col1Image": "", "col1Text": "texto exato", "col2Image": "", "col2Text": "texto exato" }
- columns3: { "col1Image": "", "col1Text": "", "col2Image": "", "col2Text": "", "col3Image": "", "col3Text": "" }
- footer: { "legalText": "texto legal completo e exato, palavra por palavra, sem resumir nem cortar, com **negrito** e \\n onde houver" }

Retorne APENAS o JSON, sem markdown, sem comentários, sem truncar a resposta.`

// ─── Parser compartilhado ─────────────────────────────────────────────────────

// A IA às vezes coloca quebras de linha/tabs LITERAIS dentro de strings do JSON
// (em vez de \n escapado), o que quebra o JSON.parse. Esse sanitizador percorre
// o texto caractere a caractere, rastreando se está dentro de uma string JSON,
// e escapa esses caracteres de controle só quando estão dentro de uma string.
function sanitizeJsonControlChars(text: string): string {
  let result = ''
  let inString = false
  let escaped = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (inString) {
      if (escaped) {
        result += ch
        escaped = false
        continue
      }
      if (ch === '\\') {
        result += ch
        escaped = true
        continue
      }
      if (ch === '"') {
        inString = false
        result += ch
        continue
      }
      if (ch === '\n') { result += '\\n'; continue }
      if (ch === '\r') { continue } // ignora \r solto
      if (ch === '\t') { result += '\\t'; continue }
      result += ch
    } else {
      if (ch === '"') inString = true
      result += ch
    }
  }

  return result
}

function parseAIResponse(raw: string): AnalysisResult {
  const cleaned = raw
    .trim()
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim()

  let parsed: {
    blocks: Array<{ type: string; order: number; content: Record<string, string> }>
    detectedColors?: string[]
    rawDescription?: string
  }

  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // Resposta com quebras de linha literais dentro de strings — tenta sanitizar
    try {
      parsed = JSON.parse(sanitizeJsonControlChars(cleaned))
    } catch (err2) {
      const msg = err2 instanceof Error ? err2.message : 'erro desconhecido'
      throw new Error(`A IA retornou um JSON inválido (${msg}). Tente gerar novamente.`)
    }
  }

  const blocks: EmailBlock[] = parsed.blocks.map((b, i) => ({
    id: uuidv4(),
    type: b.type as EmailBlock['type'],
    order: b.order ?? i,
    content: b.content ?? {},
  }))

  return {
    blocks,
    detectedColors: parsed.detectedColors ?? [],
    detectedFonts: [],
    assets: [],
    rawDescription: parsed.rawDescription ?? '',
  }
}

// ─── Claude Vision ────────────────────────────────────────────────────────────

export async function analyzeImageWithClaude(
  imageBase64: string,
  mimeType: string,
  brandId: BrandId,
): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageBase64,
            },
          },
          { type: 'text', text: ANALYSIS_PROMPT + `\n\nMarca: ${brandId}` },
        ],
      },
    ],
  })

  const content = msg.content[0]
  if (content.type !== 'text') throw new Error('Resposta inesperada do Claude')
  return parseAIResponse(content.text)
}

// ─── OpenAI Vision ────────────────────────────────────────────────────────────

export async function analyzeImageWithOpenAI(
  imageBase64: string,
  mimeType: string,
  brandId: BrandId,
): Promise<AnalysisResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: 'high' },
          },
          { type: 'text', text: ANALYSIS_PROMPT + `\n\nMarca: ${brandId}` },
        ],
      },
    ],
  })

  const text = response.choices[0]?.message?.content
  if (!text) throw new Error('Resposta vazia do OpenAI')
  return parseAIResponse(text)
}

// ─── Auto-seleção: tenta Claude, depois OpenAI ────────────────────────────────

export async function analyzeImageWithAI(
  imageBase64: string,
  mimeType: string,
  brandId: BrandId,
): Promise<AnalysisResult> {
  if (process.env.ANTHROPIC_API_KEY) {
    return analyzeImageWithClaude(imageBase64, mimeType, brandId)
  }
  if (process.env.OPENAI_API_KEY) {
    return analyzeImageWithOpenAI(imageBase64, mimeType, brandId)
  }
  throw new Error('Nenhuma chave de API configurada (ANTHROPIC_API_KEY ou OPENAI_API_KEY)')
}

// ─── Análise de HTML ──────────────────────────────────────────────────────────

export async function analyzeHTMLWithAI(htmlContent: string, brandId: BrandId): Promise<AnalysisResult> {
  const prompt = `Analise este HTML de e-mail marketing e identifique a estrutura de blocos.\nMarca: ${brandId}\n\nHTML:\n\`\`\`html\n${htmlContent.slice(0, 8000)}\n\`\`\`\n\n${ANALYSIS_PROMPT}`

  if (process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
    const c = msg.content[0]
    if (c.type !== 'text') throw new Error('Resposta inesperada')
    return parseAIResponse(c.text)
  }

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const res = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = res.choices[0]?.message?.content
    if (!text) throw new Error('Resposta vazia')
    return parseAIResponse(text)
  }

  throw new Error('Nenhuma chave de API configurada')
}

// ─── Análise via Figma (texto exato extraído via API, sem OCR) ────────────────
//
// O texto vem diretamente dos nós do Figma (100% fiel, sem risco de erro de
// leitura). A IA só precisa classificar esse conteúdo já correto nos tipos de
// bloco — não precisa "ler" nada, só organizar. Imagens chegam como tokens
// {{IMG:nodeId}} que são substituídos pela URL real exportada após a resposta.

export async function analyzeFigmaDigestWithAI(
  digest: string,
  imageUrls: Record<string, string>,
  brandId: BrandId,
): Promise<AnalysisResult> {
  const prompt = `Os itens abaixo foram extraídos DIRETAMENTE da árvore de nós de um arquivo do Figma (texto 100% exato, sem erro de leitura), na ordem vertical em que aparecem no design (de cima para baixo).

Marca: ${brandId}

Itens extraídos:
${digest}

Sua tarefa é ORGANIZAR esses itens nos blocos de e-mail marketing corretos. Para os itens do tipo [IMAGEM id=XXX], use exatamente "{{IMG:XXX}}" como valor de imageUrl (vamos substituir pela URL real depois) — não invente outra URL.

${ANALYSIS_PROMPT}`

  let raw: string

  if (process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
    const c = msg.content[0]
    if (c.type !== 'text') throw new Error('Resposta inesperada')
    raw = c.text
  } else if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const res = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = res.choices[0]?.message?.content
    if (!text) throw new Error('Resposta vazia')
    raw = text
  } else {
    throw new Error('Nenhuma chave de API configurada (ANTHROPIC_API_KEY ou OPENAI_API_KEY)')
  }

  const result = parseAIResponse(raw)

  // Substitui {{IMG:nodeId}} pelas URLs reais exportadas do Figma
  for (const block of result.blocks) {
    for (const [key, value] of Object.entries(block.content)) {
      if (typeof value !== 'string') continue
      const match = value.match(/^\{\{IMG:(.+)\}\}$/)
      if (match) {
        const nodeId = match[1]
        block.content[key] = imageUrls[nodeId] || 'https://via.placeholder.com/600x300'
      }
    }
  }

  return result
}
