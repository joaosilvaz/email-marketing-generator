import { NextResponse } from 'next/server'
import { getProject, saveProject, deleteProject } from '@/lib/storage'
import { Project } from '@/lib/types'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = getProject(id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = getProject(id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json() as Partial<Project>

  if (body.htmlContent && body.htmlContent !== project.htmlContent) {
    project.versions = [
      ...(project.versions || []),
      {
        version: project.version,
        htmlContent: project.htmlContent,
        mjmlContent: project.mjmlContent,
        createdAt: project.updatedAt,
        note: `v${project.version}`,
      },
    ]
    project.version = (project.version || 1) + 1
  }

  const updated: Project = {
    ...project,
    ...body,
    id: project.id,
    updatedAt: new Date().toISOString(),
  }
  saveProject(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  deleteProject(id)
  return NextResponse.json({ ok: true })
}
