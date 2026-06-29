import { NextResponse } from 'next/server'
import { getProject } from '@/lib/storage'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require('archiver') as (format: string, opts?: object) => import('archiver').Archiver
import { PassThrough } from 'stream'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const projectId = url.searchParams.get('projectId')
  const format = url.searchParams.get('format') || 'zip'

  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

  const project = getProject(projectId)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (format === 'html') {
    return new Response(project.htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '-')}.html"`,
      },
    })
  }

  // ZIP
  const pass = new PassThrough()
  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.pipe(pass)

  archive.append(project.htmlContent, { name: 'email/index.html' })

  if (project.mjmlContent) {
    archive.append(project.mjmlContent, { name: 'email/index.mjml' })
  }

  const readme = `# ${project.name}
Marca: ${project.brandId}
Gerado em: ${new Date().toLocaleString('pt-BR')}

## Estrutura
- email/index.html — HTML final do e-mail
- email/assets/   — imagens do e-mail
`
  archive.append(readme, { name: 'README.md' })

  archive.finalize()

  const chunks: Buffer[] = []
  for await (const chunk of pass) {
    chunks.push(chunk as Buffer)
  }
  const buffer = Buffer.concat(chunks)

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '-')}.zip"`,
    },
  })
}
