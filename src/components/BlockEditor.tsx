'use client'

import { useState } from 'react'
import { EmailBlock } from '@/lib/types'
import { ChevronDown, ChevronUp, Trash2, GripVertical, Plus, Upload, Loader2 } from 'lucide-react'

function isImageField(key: string): boolean {
  return /image|logoUrl/i.test(key)
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Falha no upload')
  const data = await res.json() as { url: string }
  return data.url
}

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

function ImageFieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string
  value: string
  onChange: (v: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      onChange(url)
    } catch {
      // silenciosamente ignora — usuário pode tentar de novo
    } finally {
      setUploading(false)
    }
  }

  const isPlaceholder = value.includes('via.placeholder.com') || !value

  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1">{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <div className="flex gap-2 items-start">
        {value && !isPlaceholder && (
          <img
            src={value}
            alt=""
            className="w-12 h-12 object-cover rounded border border-zinc-700 flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="flex-1 space-y-1.5">
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Cole uma URL ou faça upload"
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
          />
          <label className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-300 cursor-pointer transition-colors">
            {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
            {uploading ? 'Enviando...' : 'Upload de imagem'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>
      {isPlaceholder && (
        <p className="text-amber-500/80 text-xs mt-1">⚠ Placeholder — envie a imagem real</p>
      )}
    </div>
  )
}

function BlockFieldEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  return (
    <div className="space-y-3 px-4 pb-4">
      {Object.entries(content).map(([key, val]) =>
        isImageField(key) ? (
          <ImageFieldEditor
            key={key}
            fieldKey={key}
            value={String(val)}
            onChange={v => onChange({ ...content, [key]: v })}
          />
        ) : (
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
        )
      )}
    </div>
  )
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sorted = [...blocks].sort((a, b) => a.order - b.order)

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
      list: { title: 'Lista', items: 'Item 1\nItem 2\nItem 3', ordered: 'false' },
      divider: { color: '#E0E0E0' },
      spacer: { height: '24px' },
    }
    const defaultContent: Record<string, string> = defaults[type] ?? {}
    onChange([...blocks, { id: `block-${Date.now()}`, type, order: blocks.length, content: defaultContent }])
  }

  const handleDragStart = (id: string) => {
    setDragId(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== dragId) setOverId(id)
  }

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setOverId(null); return }
    const arr = [...sorted]
    const fromIdx = arr.findIndex(b => b.id === dragId)
    const toIdx = arr.findIndex(b => b.id === targetId)
    const [moved] = arr.splice(fromIdx, 1)
    arr.splice(toIdx, 0, moved)
    onChange(arr.map((b, i) => ({ ...b, order: i })))
    setDragId(null)
    setOverId(null)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setOverId(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((block) => (
        <div
          key={block.id}
          draggable
          onDragStart={() => handleDragStart(block.id)}
          onDragOver={e => handleDragOver(e, block.id)}
          onDrop={() => handleDrop(block.id)}
          onDragEnd={handleDragEnd}
          className={`bg-zinc-900 border rounded-lg overflow-hidden transition-all ${
            dragId === block.id
              ? 'opacity-40 border-zinc-600'
              : overId === block.id
              ? 'border-blue-500 shadow-lg shadow-blue-500/20'
              : 'border-zinc-800'
          }`}
        >
          {/* Block header */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <GripVertical size={14} className="text-zinc-500 flex-shrink-0 cursor-grab active:cursor-grabbing" />
            <button
              onClick={() => setExpanded(expanded === block.id ? null : block.id)}
              className="flex-1 flex items-center justify-between text-left"
            >
              <span className="text-sm text-white font-medium">{BLOCK_LABELS[block.type] || block.type}</span>
              {expanded === block.id ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
            </button>
            <button onClick={() => removeBlock(block.id)} className="p-1 text-zinc-600 hover:text-red-400">
              <Trash2 size={14} />
            </button>
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
          {([...NEW_BLOCK_TYPES, 'list'] as EmailBlock['type'][]).map(type => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-300 transition-colors"
            >
              <Plus size={11} />
              {BLOCK_LABELS[type] ?? type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
