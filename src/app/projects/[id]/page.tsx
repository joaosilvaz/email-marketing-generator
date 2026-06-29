'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Project, EmailBlock } from '@/lib/types'
import BrandBadge from '@/components/BrandBadge'
import StatusBadge from '@/components/StatusBadge'
import PreviewFrame from '@/components/PreviewFrame'
import BlockEditor from '@/components/BlockEditor'
import { ArrowLeft, Zap, Download, Save, Code, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [blocks, setBlocks] = useState<EmailBlock[]>([])
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'preview' | 'blocks' | 'code'>('preview')
  const [saved, setSaved] = useState(false)

  const load = async () => {
    const res = await fetch(`/api/projects/${id}`)
    if (!res.ok) { router.push('/projects'); return }
    const p = await res.json() as Project
    setProject(p)
    setBlocks(p.blocks || [])
    setHtml(p.htmlContent || '')
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const generate = async () => {
    if (!project) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, blocks }),
      })
      const data = await res.json() as { html: string }
      setHtml(data.html)
      setTab('preview')
      await load()
    } finally {
      setGenerating(false)
    }
  }

  const save = async () => {
    if (!project) return
    setSaving(true)
    await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks, htmlContent: html }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exportZip = () => {
    if (!project) return
    window.open(`/api/export?projectId=${project.id}&format=zip`)
  }

  const exportHTML = () => {
    if (!project) return
    window.open(`/api/export?projectId=${project.id}&format=html`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={24} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
        <Link href="/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-white font-semibold text-sm">{project.name}</h1>
          <BrandBadge brandId={project.brandId} />
          <StatusBadge status={project.status} />
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 rounded-lg p-0.5 gap-0.5">
          {(['preview', 'blocks', 'code'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tab === t ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {t === 'preview' ? 'Preview' : t === 'blocks' ? 'Blocos' : 'HTML'}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            disabled={generating || blocks.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-white text-xs font-medium transition-colors"
          >
            {generating ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
            Gerar HTML
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-xs font-medium transition-colors"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saved ? 'Salvo!' : 'Salvar'}
          </button>
          {html && (
            <div className="flex items-center gap-1">
              <button
                onClick={exportHTML}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-xs font-medium transition-colors"
              >
                <Code size={13} /> HTML
              </button>
              <button
                onClick={exportZip}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-xs font-medium transition-colors"
              >
                <Download size={13} /> ZIP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {tab === 'preview' && (
          <div className="flex-1">
            <PreviewFrame html={html} title={project.name} />
          </div>
        )}

        {tab === 'blocks' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Block editor panel */}
            <div className="w-80 border-r border-zinc-800 overflow-y-auto p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-sm font-semibold">Blocos do E-mail</h2>
                <button
                  onClick={load}
                  className="p-1.5 rounded text-zinc-500 hover:text-white transition-colors"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>

            {/* Live preview */}
            <div className="flex-1">
              <PreviewFrame html={html} title="Preview" />
            </div>
          </div>
        )}

        {tab === 'code' && (
          <div className="flex-1 overflow-auto p-4 bg-zinc-950">
            {html ? (
              <pre className="text-zinc-300 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                {html}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-600">
                <Code size={40} />
                <p className="text-sm">Gere o HTML para ver o código</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
