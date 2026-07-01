'use client'

import { useState, useEffect, useRef, use } from 'react'
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
  const [accentColor, setAccentColor] = useState('')
  const initialLoad = useRef(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const projectRef = useRef<Project | null>(null)
  const blocksRef = useRef<EmailBlock[]>([])
  const accentColorRef = useRef('')

  const load = async () => {
    const res = await fetch(`/api/projects/${id}`)
    if (!res.ok) { router.push('/projects'); return }
    const p = await res.json() as Project
    projectRef.current = p
    setProject(p)
    setBlocks(p.blocks || [])
    blocksRef.current = p.blocks || []
    setHtml(p.htmlContent || '')
    setAccentColor(p.accentColor || '')
    accentColorRef.current = p.accentColor || ''
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  // Mantém ref sincronizada para o auto-generate não ter closure stale
  useEffect(() => { blocksRef.current = blocks }, [blocks])
  useEffect(() => { accentColorRef.current = accentColor }, [accentColor])

  // Auto-gera preview 600ms após qualquer mudança nos blocos
  useEffect(() => {
    if (initialLoad.current) { initialLoad.current = false; return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => generateHtml(false), 600)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [blocks])

  const generateHtml = async (switchTab = false) => {
    const p = projectRef.current
    if (!p) return
    setGenerating(true)
    try {
      await fetch(`/api/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accentColor: accentColorRef.current || null }),
      })
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: p.id, blocks: blocksRef.current }),
      })
      const data = await res.json() as { html: string }
      setHtml(data.html)
      if (switchTab) setTab('preview')
    } finally {
      setGenerating(false)
    }
  }

  const generate = () => generateHtml(true)

  const save = async () => {
    const p = projectRef.current
    if (!p) return
    setSaving(true)
    await fetch(`/api/projects/${p.id}`, {
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
      <div className="flex items-center gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-950 shrink-0">
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
          {/* Cor de acento */}
          <div className="flex items-center gap-1.5" title="Cor de destaque — botões e títulos (vazio = cor padrão da marca)">
            <input
              type="color"
              value={accentColor || '#888888'}
              onChange={e => setAccentColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-zinc-700 bg-transparent p-0.5"
            />
            {accentColor && (
              <button onClick={() => setAccentColor('')} className="text-zinc-500 hover:text-white text-xs">✕</button>
            )}
            {/* Chips das cores detectadas pela IA */}
            {(project?.detectedColors ?? []).filter(c => c && c !== '#000000' && c !== '#ffffff').slice(0, 4).map(c => (
              <button
                key={c}
                onClick={() => setAccentColor(c)}
                title={c}
                style={{ backgroundColor: c }}
                className="w-5 h-5 rounded-full border-2 border-zinc-700 hover:border-white transition-colors"
              />
            ))}
          </div>
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
            <div className="w-80 border-r border-zinc-800 overflow-y-auto p-4 shrink-0">
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
