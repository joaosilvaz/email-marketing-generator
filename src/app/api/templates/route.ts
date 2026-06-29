import { NextResponse } from 'next/server'
import { getTemplates, saveTemplate } from '@/lib/storage'
import { Template } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  return NextResponse.json(getTemplates())
}

export async function POST(req: Request) {
  const body = await req.json() as Partial<Template>
  const template: Template = {
    id: uuidv4(),
    name: body.name || 'Novo Template',
    brandId: body.brandId || 'fiat',
    description: body.description || '',
    htmlContent: body.htmlContent || '',
    thumbnail: body.thumbnail || '',
    tags: body.tags || [],
    createdAt: new Date().toISOString(),
    isDefault: false,
  }
  saveTemplate(template)
  return NextResponse.json(template, { status: 201 })
}
