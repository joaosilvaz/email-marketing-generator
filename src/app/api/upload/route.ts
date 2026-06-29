import { NextResponse } from 'next/server'
import { saveUploadedFile } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = saveUploadedFile(buffer, file.name)

  return NextResponse.json({
    url,
    name: file.name,
    size: file.size,
    type: file.type,
  })
}
