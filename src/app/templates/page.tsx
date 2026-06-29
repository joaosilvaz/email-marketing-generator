'use client'

import { useState, useEffect } from 'react'
import { Template } from '@/lib/types'
import BrandBadge from '@/components/BrandBadge'
import { LayoutTemplate, Copy, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then((d: Template[]) => setTemplates(Array.isArray(d) ? d : []))
  }, [])

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.brandId.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

  const useTemplate = async (tpl: Template) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${tpl.name} — ${new Date().toLocaleDateString('pt-BR')}`,
        brandId: tpl.brandId,
        inputType: 'html',
      }),
    })
    const p = await res.json() as { id: string }
    router.push(`/projects/${p.id}`)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-zinc-400 text-sm mt-1">{templates.length} templates disponíveis</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar templates..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-600"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <LayoutTemplate size={40} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Nenhum template encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(tpl => (
            <div key={tpl.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-all group">
              {/* Thumbnail placeholder */}
              <div className="h-36 bg-zinc-800 flex items-center justify-center">
                <LayoutTemplate size={32} className="text-zinc-700" />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <BrandBadge brandId={tpl.brandId} />
                  {tpl.isDefault && (
                    <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">Padrão</span>
                  )}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{tpl.name}</h3>
                {tpl.description && <p className="text-zinc-500 text-xs mb-3">{tpl.description}</p>}

                {tpl.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tpl.tags.map(tag => (
                      <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => useTemplate(tpl)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-medium transition-colors"
                >
                  <Copy size={12} /> Usar Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
