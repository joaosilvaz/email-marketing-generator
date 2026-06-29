import { NextResponse } from 'next/server'
import { getProjects, saveProject } from '@/lib/storage'
import { Project } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const projects = getProjects()
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const body = await req.json() as Partial<Project>
  const now = new Date().toISOString()
  const project: Project = {
    id: uuidv4(),
    name: body.name || 'Novo Projeto',
    brandId: body.brandId || 'fiat',
    status: 'draft',
    inputType: body.inputType || 'image',
    inputSource: body.inputSource || '',
    createdAt: now,
    updatedAt: now,
    htmlContent: '',
    mjmlContent: '',
    blocks: [],
    assets: [],
    version: 1,
    thumbnail: '',
    tags: body.tags || [],
    description: body.description || '',
    versions: [],
  }
  saveProject(project)
  return NextResponse.json(project, { status: 201 })
}
