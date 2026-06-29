import { ProjectStatus } from '@/lib/types'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-zinc-800 text-zinc-400' },
  analyzing: { label: 'Analisando...', className: 'bg-yellow-900/50 text-yellow-400 animate-pulse' },
  generating: { label: 'Gerando...', className: 'bg-blue-900/50 text-blue-400 animate-pulse' },
  ready: { label: 'Pronto', className: 'bg-green-900/50 text-green-400' },
  error: { label: 'Erro', className: 'bg-red-900/50 text-red-400' },
}

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
