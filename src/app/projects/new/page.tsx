'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BRAND_LIST, BRAND_COLORS_MAP } from '@/lib/brands'
import { BrandId, EmailBlock } from '@/lib/types'
import FileUpload from '@/components/FileUpload'
import ContentForm from '@/components/ContentForm'
import { ArrowLeft, ArrowRight, Loader2, PenLine, Cpu } from 'lucide-react'

type Step = 1 | 2 | 3
type Mode = 'ai' | 'manual'

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [brandId, setBrandId] = useState<BrandId>('fiat')
  const [mode, setMode] = useState<Mode>('manual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)

  // Cria o projeto e retorna o id
  const createProject = async (inputType: string) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name || 'Novo Projeto', brandId, inputType }),
    })
    const p = await res.json() as { id: string }
    return p.id
  }

  // Modo IA: upload → analyze → redireciona para o projeto
  const handleFileSelect = async (
    type: 'figma' | 'image' | 'html' | 'zip',
    data: { file?: File; url?: string }
  ) => {
    setLoading(true)
    setError('')
    try {
      const id = await createProject(type)
      setProjectId(id)

      let fileUrl: string | undefined
      let htmlContent: string | undefined

      if (data.file) {
        const fd = new FormData()
        fd.append('file', data.file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        const uploaded = await uploadRes.json() as { url: string }
        fileUrl = uploaded.url
        if (type === 'html') htmlContent = await data.file.text()
      }

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, type, fileUrl, htmlContent, figmaUrl: data.url }),
      })

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json() as { error: string }
        throw new Error(err.error || 'Erro na análise')
      }

      router.push(`/projects/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto')
      setLoading(false)
    }
  }

  // Modo manual: formulário → generate-manual → redireciona
  const handleManualSubmit = async (blocks: EmailBlock[], legalText: string) => {
    setLoading(true)
    setError('')
    try {
      const id = projectId ?? await createProject('manual')
      if (!projectId) setProjectId(id)

      const res = await fetch('/api/generate-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, blocks, legalText }),
      })

      if (!res.ok) {
        const err = await res.json() as { error: string }
        throw new Error(err.error || 'Erro ao gerar HTML')
      }

      router.push(`/projects/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as const).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}>{s}</div>
              {s < 3 && <div className={`h-0.5 w-12 ${step > s ? 'bg-blue-600' : 'bg-zinc-800'}`} />}
            </div>
          ))}
          <span className="ml-2 text-zinc-500 text-sm">
            {step === 1 ? 'Marca' : step === 2 ? 'Método' : 'Conteúdo'}
          </span>
        </div>

        {/* ─── Step 1: marca + nome ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-1">Novo Projeto</h1>
            <p className="text-zinc-400 text-sm mb-6">Nome e marca do e-mail</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nome do projeto</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Fiat Pulse — Julho 2025"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-3">Marca</label>
                <div className="grid grid-cols-3 gap-3">
                  {BRAND_LIST.map(brand => {
                    const color = BRAND_COLORS_MAP[brand.id]
                    const selected = brandId === brand.id
                    return (
                      <button
                        key={brand.id}
                        onClick={() => setBrandId(brand.id)}
                        className="p-4 rounded-xl border-2 transition-all text-left"
                        style={selected
                          ? { borderColor: color, backgroundColor: color + '18' }
                          : { borderColor: '#3f3f46', backgroundColor: '#27272a' }}
                      >
                        <div className="w-4 h-4 rounded-full mb-2" style={{ backgroundColor: color }} />
                        <p className="text-white font-semibold text-sm">{brand.displayName}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Próximo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: escolha do método ───────────────────────────────────── */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft size={15} /> Voltar
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Como quer criar?</h2>
            <p className="text-zinc-400 text-sm mb-6">Escolha o método de entrada do conteúdo</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setMode('manual'); setStep(3) }}
                className="group bg-zinc-900 border-2 border-zinc-700 hover:border-blue-500 rounded-xl p-6 text-left transition-all"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PenLine size={18} className="text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Preencher manualmente</h3>
                <p className="text-zinc-500 text-xs">
                  Você digita as URLs das imagens, textos e links. O sistema monta o HTML no template real da marca.
                </p>
                <span className="inline-block mt-3 text-xs text-green-400 font-medium">✓ Funciona sem API</span>
              </button>

              <button
                onClick={() => { setMode('ai'); setStep(3) }}
                className="group bg-zinc-900 border-2 border-zinc-700 hover:border-purple-500 rounded-xl p-6 text-left transition-all"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Cpu size={18} className="text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Analisar com IA</h3>
                <p className="text-zinc-500 text-xs">
                  Envie uma imagem ou HTML. Claude Vision ou GPT-4o extraem textos e estrutura automaticamente.
                </p>
                <span className="inline-block mt-3 text-xs text-yellow-400 font-medium">⚠ Requer chave de API</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3a: formulário manual ──────────────────────────────────── */}
        {step === 3 && mode === 'manual' && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft size={15} /> Voltar
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Conteúdo do e-mail</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Preencha os campos. Deixe em branco o que não usar — o template da <span className="text-white font-medium capitalize">{brandId}</span> já tem a estrutura certa.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-h-[60vh] overflow-y-auto">
              <ContentForm brandId={brandId} onSubmit={handleManualSubmit} loading={loading} />
            </div>
          </div>
        )}

        {/* ─── Step 3b: upload para IA ─────────────────────────────────────── */}
        {step === 3 && mode === 'ai' && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft size={15} /> Voltar
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Enviar layout</h2>
            <p className="text-zinc-400 text-sm mb-2">A IA vai extrair textos e estrutura automaticamente.</p>
            <p className="text-zinc-600 text-xs mb-6">
              Configure <code className="text-zinc-400">ANTHROPIC_API_KEY</code> ou <code className="text-zinc-400">OPENAI_API_KEY</code> no <code className="text-zinc-400">.env.local</code>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            {loading ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-16 flex flex-col items-center gap-4">
                <Loader2 size={32} className="text-purple-400 animate-spin" />
                <p className="text-white font-medium">Analisando com IA...</p>
                <p className="text-zinc-500 text-sm">Identificando textos, blocos e estrutura</p>
              </div>
            ) : (
              <FileUpload onSelect={handleFileSelect} />
            )}
          </div>
        )}

      </div>
    </div>
  )
}
