'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FolderOpen, LayoutTemplate, Zap, TrendingUp } from 'lucide-react'
import { Project } from '@/lib/types'
import BrandBadge from '@/components/BrandBadge'
import StatusBadge from '@/components/StatusBadge'

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then((data: Project[]) => setProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const ready = projects.filter(p => p.status === 'ready').length
  const drafts = projects.filter(p => p.status === 'draft').length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Bem-vindo à plataforma de e-mail marketing</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Novo Projeto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {([
          { label: 'Total de Projetos', value: projects.length, icon: FolderOpen, color: 'blue' },
          { label: 'Prontos', value: ready, icon: Zap, color: 'green' },
          { label: 'Rascunhos', value: drafts, icon: TrendingUp, color: 'yellow' },
          { label: 'Templates', value: 6, icon: LayoutTemplate, color: 'purple' },
        ] as const).map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              color === 'blue' ? 'bg-blue-500/10' :
              color === 'green' ? 'bg-green-500/10' :
              color === 'yellow' ? 'bg-yellow-500/10' : 'bg-purple-500/10'
            }`}>
              <Icon size={18} className={
                color === 'blue' ? 'text-blue-400' :
                color === 'green' ? 'text-green-400' :
                color === 'yellow' ? 'text-yellow-400' : 'text-purple-400'
              } />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-zinc-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link href="/projects/new" className="group bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-xl p-5 transition-all">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
            <Plus size={18} className="text-blue-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Novo Projeto</h3>
          <p className="text-zinc-500 text-xs mt-1">Comece pelo upload de imagem, HTML ou Figma</p>
        </Link>
        <Link href="/templates" className="group bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-xl p-5 transition-all">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
            <LayoutTemplate size={18} className="text-purple-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Templates</h3>
          <p className="text-zinc-500 text-xs mt-1">6 templates prontos por marca</p>
        </Link>
        <Link href="/brands" className="group bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl p-5 transition-all">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
            <Zap size={18} className="text-orange-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Marcas</h3>
          <p className="text-zinc-500 text-xs mt-1">Citroën, Fiat, Jeep, Peugeot, RAM, Leapmotor</p>
        </Link>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Projetos Recentes</h2>
          <Link href="/projects" className="text-blue-400 hover:text-blue-300 text-sm">Ver todos →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <FolderOpen size={40} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Nenhum projeto ainda</p>
            <Link href="/projects/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors">
              <Plus size={14} /> Criar primeiro projeto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.slice(0, 6).map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <BrandBadge brandId={project.brandId} />
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">{project.name}</h3>
                <p className="text-zinc-600 text-xs mt-2">
                  {new Date(project.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
