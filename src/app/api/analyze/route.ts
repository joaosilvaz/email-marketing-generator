import { NextResponse } from 'next/server'
import { analyzeImageWithAI, analyzeHTMLWithAI, analyzeFigmaDigestWithAI } from '@/lib/ai-analyzer'
import { extractFigmaFrame, buildFigmaDigest } from '@/lib/figma-client'
import { getProject, saveProject } from '@/lib/storage'
import { generateDefaultBlocks } from '@/lib/html-generator'
import { getBrand } from '@/lib/brands'
import { BrandId } from '@/lib/types'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const HAS_AI_KEY = !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)

export async function POST(req: Request) {
  const body = await req.json() as {
    projectId: string
    type: 'image' | 'html' | 'figma'
    fileUrl?: string
    htmlContent?: string
    figmaUrl?: string
  }

  const project = getProject(body.projectId)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  saveProject({ ...project, status: 'analyzing', updatedAt: new Date().toISOString() })

  if (!HAS_AI_KEY) {
    const brand = getBrand(project.brandId as BrandId)
    const blocks = generateDefaultBlocks(brand)
    saveProject({ ...project, blocks, status: 'ready' as const, updatedAt: new Date().toISOString() })
    return NextResponse.json({
      blocks,
      detectedColors: [brand.colors.primary],
      detectedFonts: [],
      rawDescription: 'Template padrão gerado (sem chave de API configurada)',
    })
  }

  try {
    let result

    if (body.type === 'image' && body.fileUrl) {
      const publicDir = path.join(process.cwd(), 'public')
      const filePath = path.join(publicDir, body.fileUrl.replace(/^\//, ''))
      const buffer = fs.readFileSync(filePath)
      const base64 = buffer.toString('base64')
      const ext = path.extname(body.fileUrl).toLowerCase()
      const mimeMap: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }
      const mimeType = mimeMap[ext] || 'image/jpeg'
      result = await analyzeImageWithAI(base64, mimeType, project.brandId as BrandId)
    } else if (body.type === 'html' && body.htmlContent) {
      result = await analyzeHTMLWithAI(body.htmlContent, project.brandId as BrandId)
    } else if (body.type === 'figma' && body.figmaUrl) {
      if (!process.env.FIGMA_ACCESS_TOKEN) {
        throw new Error('FIGMA_ACCESS_TOKEN não configurado. Adicione no .env.local ou use upload de imagem/HTML.')
      }
      const extraction = await extractFigmaFrame(body.figmaUrl)
      const digest = buildFigmaDigest(extraction)
      result = await analyzeFigmaDigestWithAI(digest, extraction.imageUrls, project.brandId as BrandId)
    } else {
      const brand = getBrand(project.brandId as BrandId)
      result = {
        blocks: generateDefaultBlocks(brand),
        detectedColors: [brand.colors.primary],
        detectedFonts: [],
        assets: [],
        rawDescription: 'Nenhuma fonte de conteúdo válida foi enviada',
      }
    }

    const updated = {
      ...project,
      blocks: result.blocks,
      status: 'ready' as const,
      updatedAt: new Date().toISOString(),
    }
    saveProject(updated)
    return NextResponse.json(result)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Erro desconhecido'
    saveProject({ ...project, status: 'error', updatedAt: new Date().toISOString() })
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
