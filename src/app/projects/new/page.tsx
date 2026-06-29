'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BRAND_LIST, BRAND_COLORS_MAP } from '@/lib/brands'
import { BrandId } from '@/lib/types'
import FileUpload from '@/components/FileUpload'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

type Step = 1 | 2 | 3

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [brandId, setBrandId] = useState<BrandId>('fiat')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (
    type: 'figma' | 'image' | 'html' | 'zip',
    data: { file?: File; url?: string }
  ) => {
    setLoading(true)
    setError('')
    try {
      // 1. Create project
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Novo Projeto', brandId, inputType: type }),
      })
      const project = await res.json() as { id: string }

      let fileUrl: string | undefined
      let htmlContent: string | undefined

      // 2. Upload file if exists
      if (data.file) {
        const fd = new FormData()
        fd.append('file', data.file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        const uploaded = await uploadRes.json() as { url: string }
        fileUrl = uploaded.url

        if (type === 'html') {
          htmlContent = await data.file.text()
        }
      }

      // 3. Analyze
      await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          type,
          fileUrl,
          htmlContent,
          figmaUrl: data.url,
        }),
      })

      router.push(`/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto')
      setLoading(false)
    }
  }

  const handleSkipToEditor = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Novo Projeto', brandId, inputType: 'image' }),
      })
      const project = await res.json() as { id: string }
      router.push(`/projects/${project.id}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2] as const).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}>{s}</div>
              {s < 2 && <div className={`flex-1 h-0.5 w-16 ${step > s ? 'bg-blue-600' : 'bg-zinc-800'}`} />}
            </div>
          ))}
          <span className="ml-2 text-zinc-500 text-sm">
            {step === 1 ? 'Configurar projeto' : 'Enviar layout'}
          </span>
        </div>

        {step === 1 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-1">Novo Projeto</h1>
            <p className="text-zinc-400 text-sm mb-6">Configure o nome e a marca do e-mail</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nome do projeto</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Fiat Pulse — Setembro 2025"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-3">Selecionar marca</label>
                <div className="grid grid-cols-3 gap-3">
                  {BRAND_LIST.map(brand => {
                    const color = BRAND_COLORS_MAP[brand.id]
                    const selected = brandId === brand.id
                    return (
                      <button
                        key={brand.id}
                        onClick={() => setBrandId(brand.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selected
                            ? 'border-current bg-current/10'
                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800'
                        }`}
                        style={selected ? { borderColor: color, backgroundColor: color + '18' } : {}}
                      >
                        <div
                          className="w-4 h-4 rounded-full mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-white font-semibold text-sm">{brand.displayName}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleSkipToEditor}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
              >
                Criar em branco
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Próximo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft size={15} /> Voltar
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Enviar layout</h2>
            <p className="text-zinc-400 text-sm mb-6">
              A IA vai analisar o layout e gerar o HTML automaticamente
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-16 flex flex-col items-center gap-4">
                <Loader2 size={32} className="text-blue-400 animate-spin" />
                <p className="text-white font-medium">Analisando com IA...</p>
                <p className="text-zinc-500 text-sm">Identificando blocos, cores e textos do layout</p>
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
