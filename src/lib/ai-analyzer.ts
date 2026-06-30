import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { AnalysisResult, EmailBlock, BrandId } from './types'
import { v4 as uuidv4 } from 'uuid'

// ─── Prompt ───────────────────────────────────────────────────────────────────

const ANALYSIS_PROMPT = `Você é um especialista em e-mail marketing e design de e-mails HTML.
Analise este layout de e-mail marketing e identifique TODOS os blocos de conteúdo.

IMPORTANTE: Extraia todos os textos reais visíveis. Não invente conteúdo.

Retorne SOMENTE um JSON válido com esta estrutura:
{
  "blocks": [
    {
      "type": "hero|text|cta|banner|bannerText|footer",
      "order": 0,
      "content": {}
    }
  ],
  "detectedColors": ["#hex"],
  "rawDescription": "descrição do layout"
}

Campos por tipo:
- hero: { "imageUrl": "", "link": "#", "alt": "" }
- text: { "headline": "texto exato", "body": "texto exato" }
- cta: { "buttonText": "texto exato do botão", "buttonUrl": "#", "text": "" }
- banner: { "imageUrl": "", "link": "#", "alt": "" }
- bannerText: { "imageUrl": "", "headline": "título", "body": "texto", "buttonText": "botão", "buttonUrl": "#" }
- footer: {}

Retorne APENAS o JSON, sem markdown.`

// ─── Parser compartilhado ─────────────────────────────────────────────────────

function parseAIResponse(raw: string): AnalysisResult {
  const cleaned = raw
    .trim()
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim()

  const parsed = JSON.parse(cleaned) as {
    blocks: Array<{ type: string; order: number; content: Record<string, string> }>
    detectedColors?: string[]
    rawDescription?: string
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
    max_tokens: 4096,
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
      model: 'claude-opus-4-8',
      max_tokens: 4096,
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
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = res.choices[0]?.message?.content
    if (!text) throw new Error('Resposta vazia')
    return parseAIResponse(text)
  }

  throw new Error('Nenhuma chave de API configurada')
}
