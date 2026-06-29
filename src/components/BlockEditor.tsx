'use client'

import { useState } from 'react'
import { EmailBlock } from '@/lib/types'
import { ChevronDown, ChevronUp, Trash2, GripVertical, Plus } from 'lucide-react'

const BLOCK_LABELS: Record<string, string> = {
  header: 'Cabeçalho',
  hero: 'Imagem Hero',
  text: 'Texto',
  cta: 'Botão CTA',
  banner: 'Banner',
  bannerText: 'Banner + Texto',
  cards: 'Cards',
  columns2: '2 Colunas',
  columns3: '3 Colunas',
  divider: 'Divisor',
  spacer: 'Espaçamento',
  footer: 'Rodapé',
}

const FIELD_LABELS: Record<string, string> = {
  logoUrl: 'URL do Logo',
  logoWidth: 'Largura do Logo',
  imageUrl: 'URL da Imagem',
  link: 'Link',
  alt: 'Texto Alternativo',
  headline: 'Título',
  body: 'Corpo do Texto',
  headlineSize: 'Tamanho do Título',
  buttonText: 'Texto do Botão',
  buttonUrl: 'URL do Botão',
  buttonBg: 'Cor do Botão',
  text: 'Texto Acima do Botão',
  title: 'Título da Seção',
  card1Text: 'Texto Card 1',
  card2Text: 'Texto Card 2',
  card3Text: 'Texto Card 3',
  card1Image: 'Imagem Card 1',
  card2Image: 'Imagem Card 2',
  card3Image: 'Imagem Card 3',
  col1Text: 'Texto Coluna 1',
  col2Text: 'Texto Coluna 2',
  col1Image: 'Imagem Coluna 1',
  col2Image: 'Imagem Coluna 2',
  height: 'Altura',
  color: 'Cor',
  bg: 'Cor de Fundo',
  padding: 'Espaçamento',
}

const NEW_BLOCK_TYPES: EmailBlock['type'][] = [
  'text', 'cta', 'banner', 'bannerText', 'cards', 'columns2', 'divider', 'spacer',
]

interface Props {
  blocks: EmailBlock[]
  onChange: (blocks: EmailBlock[]) => void
}

function BlockFieldEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  return (
    <div className="space-y-2 px-4 pb-4">
      {Object.entries(content).map(([key, val]) => (
        <div key={key}>
          <label className="text-xs text-zinc-500 block mb-1">{FIELD_LABELS[key] || key}</label>
          {String(val).length > 80 ? (
            <textarea
              value={String(val)}
              rows={3}
              onChange={e => onChange({ ...content, [key]: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
            />
          ) : (
            <input
              value={String(val)}
              onChange={e => onChange({ ...content, [key]: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const arr = [...blocks]
    const target = idx + dir
    if (target < 0 || target >= arr.length) return
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    arr.forEach((b, i) => { b.order = i })
    onChange(arr)
  }

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id).map((b, i) => ({ ...b, order: i })))
  }

  const updateContent = (id: string, content: Record<string, unknown>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content } : b))
  }

  const addBlock = (type: EmailBlock['type']) => {
    const defaults: Partial<Record<EmailBlock['type'], Record<string, string>>> = {
      text: { headline: 'Novo Título', body: 'Texto do bloco' },
      cta: { buttonText: 'Clique Aqui', buttonUrl: '#' },
      banner: { imageUrl: 'https://via.placeholder.com/600x200', link: '#', alt: 'Banner' },
      bannerText: { imageUrl: 'https://via.placeholder.com/280x240', headline: 'Título', body: 'Texto', buttonText: 'Ver Mais', buttonUrl: '#' },
      cards: { title: 'Destaques', card1Text: 'Card 1', card2Text: 'Card 2', card3Text: 'Card 3' },
      columns2: { col1Text: 'Coluna 1', col2Text: 'Coluna 2' },
      divider: { color: '#E0E0E0' },
      spacer: { height: '24px' },
    }
    const defaultContent: Record<string, string> = defaults[type] ?? {}

    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type,
      order: blocks.length,
      content: defaultContent,
    }
    onChange([...blocks, newBlock])
  }

  return (
    <div className="flex flex-col gap-2">
      {blocks
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((block, idx) => (
          <div key={block.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            {/* Block header */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              <GripVertical size={14} className="text-zinc-600 flex-shrink-0" />
              <button
                onClick={() => setExpanded(expanded === block.id ? null : block.id)}
                className="flex-1 flex items-center justify-between text-left"
              >
                <span className="text-sm text-white font-medium">{BLOCK_LABELS[block.type] || block.type}</span>
                {expanded === block.id ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0} className="p-1 text-zinc-600 hover:text-white disabled:opacity-30"><ChevronUp size={14} /></button>
                <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} className="p-1 text-zinc-600 hover:text-white disabled:opacity-30"><ChevronDown size={14} /></button>
                <button onClick={() => removeBlock(block.id)} className="p-1 text-zinc-600 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Fields */}
            {expanded === block.id && Object.keys(block.content).length > 0 && (
              <div className="border-t border-zinc-800">
                <BlockFieldEditor
                  content={block.content as Record<string, unknown>}
                  onChange={c => updateContent(block.id, c)}
                />
              </div>
            )}
          </div>
        ))}

      {/* Add block */}
      <div className="mt-2">
        <p className="text-xs text-zinc-600 mb-2 px-1">Adicionar bloco</p>
        <div className="flex flex-wrap gap-2">
          {NEW_BLOCK_TYPES.map(type => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-300 transition-colors"
            >
              <Plus size={11} />
              {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
