import { NextResponse } from 'next/server'
import { generateFromTemplate } from '@/lib/html-generator'
import { getBrand } from '@/lib/brands'
import { getProject, saveProject } from '@/lib/storage'
import { BrandId, EmailBlock, Asset } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json() as {
    projectId: string
    blocks: EmailBlock[]
    legalText?: string
    assets?: Asset[]
  }

  const project = getProject(body.projectId)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  try {
    const brand = getBrand(project.brandId as BrandId)
    const html = generateFromTemplate(brand, body.blocks, body.assets ?? [], body.legalText, project.accentColor || undefined)

    const updated = {
      ...project,
      htmlContent: html,
      blocks: body.blocks,
      assets: body.assets ?? project.assets,
      status: 'ready' as const,
      updatedAt: new Date().toISOString(),
    }
    saveProject(updated)

    return NextResponse.json({ html })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Erro'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
