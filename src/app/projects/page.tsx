'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Trash2, Copy, ExternalLink } from 'lucide-react'
import { Project } from '@/lib/types'
import BrandBadge from '@/components/BrandBadge'
import StatusBadge from '@/components/StatusBadge'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/projects')
      .then(r => r.json())
      .then((d: Project[]) => setProjects(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brandId.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este projeto?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    load()
  }

  const handleDuplicate = async (project: Project) => {
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${project.name} (cópia)`,
        brandId: project.brandId,
        inputType: project.inputType,
        tags: project.tags,
        description: project.description,
      }),
    })
    load()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projetos</h1>
          <p className="text-zinc-400 text-sm mt-1">{projects.length} projeto{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Novo Projeto
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar projetos..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-600"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <p className="text-zinc-500 text-sm">
            {search ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
          </p>
          {!search && (
            <Link href="/projects/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors">
              <Plus size={14} /> Criar projeto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(project => (
            <div key={project.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-all group">
              {/* Card body */}
              <Link href={`/projects/${project.id}`} className="block p-5">
                <div className="flex items-start justify-between mb-3">
                  <BrandBadge brandId={project.brandId} />
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors mb-1">{project.name}</h3>
                {project.description && <p className="text-zinc-500 text-xs line-clamp-2 mb-2">{project.description}</p>}
                <p className="text-zinc-700 text-xs">
                  {new Date(project.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </Link>

              {/* Actions */}
              <div className="border-t border-zinc-800 px-4 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/projects/${project.id}`} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800">
                  <ExternalLink size={12} /> Abrir
                </Link>
                <button onClick={() => handleDuplicate(project)} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800">
                  <Copy size={12} /> Duplicar
                </button>
                <button onClick={() => handleDelete(project.id)} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-zinc-800 ml-auto">
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
