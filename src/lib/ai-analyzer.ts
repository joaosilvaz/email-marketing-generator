import Anthropic from '@anthropic-ai/sdk'
import { AnalysisResult, EmailBlock, BrandId } from './types'
import { v4 as uuidv4 } from 'uuid'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ANALYSIS_PROMPT = `Você é um especialista em e-mail marketing e design de e-mails HTML.
Analise esta imagem de um layout de e-mail marketing e identifique todos os blocos de conteúdo.

Retorne um JSON com a seguinte estrutura exata:
{
  "blocks": [
    {
      "type": "header|hero|text|cta|banner|bannerText|cards|columns2|columns3|divider|spacer|footer",
      "order": 0,
      "content": {
        // campos específicos para cada tipo de bloco
      }
    }
  ],
  "detectedColors": ["#hex1", "#hex2"],
  "detectedFonts": ["FontName1"],
  "rawDescription": "descrição geral do layout"
}

Tipos de blocos e campos:
- header: { logoUrl: string, logoWidth: string }
- hero: { imageUrl: string, link: string, alt: string }
- text: { headline: string, body: string, headlineSize: string }
- cta: { buttonText: string, buttonUrl: string, text: string, buttonBg: string }
- banner: { imageUrl: string, link: string, alt: string }
- bannerText: { imageUrl: string, headline: string, body: string, buttonText: string, buttonUrl: string }
- cards: { title: string, card1Text: string, card2Text: string, card3Text: string }
- columns2: { col1Text: string, col2Text: string }
- divider: { color: string }
- spacer: { height: string }
- footer: {}

Extraia todos os textos reais visíveis na imagem.
Identifique as cores predominantes em formato hexadecimal.
Retorne APENAS o JSON, sem markdown ou explicações.`

export async function analyzeImageWithAI(
  imageBase64: string,
  mimeType: string,
  brandId: BrandId
): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
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
          {
            type: 'text',
            text: ANALYSIS_PROMPT + `\n\nA marca é: ${brandId}`,
          },
        ],
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Resposta inesperada da IA')

  let raw = content.text.trim()
  // Remove markdown code blocks if present
  raw = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

  const parsed = JSON.parse(raw) as {
    blocks: Array<{ type: string; order: number; content: Record<string, string> }>
    detectedColors: string[]
    detectedFonts: string[]
    rawDescription: string
  }

  const blocks: EmailBlock[] = parsed.blocks.map(b => ({
    id: uuidv4(),
    type: b.type as EmailBlock['type'],
    order: b.order,
    content: b.content,
  }))

  return {
    blocks,
    detectedColors: parsed.detectedColors || [],
    detectedFonts: parsed.detectedFonts || [],
    assets: [],
    rawDescription: parsed.rawDescription || '',
  }
}

export async function analyzeHTMLWithAI(htmlContent: string, brandId: BrandId): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Analise este HTML de e-mail marketing e identifique a estrutura de blocos.
A marca é: ${brandId}

HTML:
\`\`\`html
${htmlContent.slice(0, 8000)}
\`\`\`

${ANALYSIS_PROMPT}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Resposta inesperada da IA')

  let raw = content.text.trim()
  raw = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

  const parsed = JSON.parse(raw) as {
    blocks: Array<{ type: string; order: number; content: Record<string, string> }>
    detectedColors: string[]
    detectedFonts: string[]
    rawDescription: string
  }

  const blocks: EmailBlock[] = parsed.blocks.map(b => ({
    id: uuidv4(),
    type: b.type as EmailBlock['type'],
    order: b.order,
    content: b.content,
  }))

  return {
    blocks,
    detectedColors: parsed.detectedColors || [],
    detectedFonts: parsed.detectedFonts || [],
    assets: [],
    rawDescription: parsed.rawDescription || '',
  }
}
