'use client'

import { useState, useCallback } from 'react'
import { Upload, Image, FileCode, Link as LinkIcon } from 'lucide-react'

type InputType = 'figma' | 'image' | 'html' | 'zip'

interface Props {
  onSelect: (type: InputType, data: { file?: File; url?: string; html?: string }) => void
}

export default function FileUpload({ onSelect }: Props) {
  const [activeTab, setActiveTab] = useState<InputType>('image')
  const [dragging, setDragging] = useState(false)
  const [figmaUrl, setFigmaUrl] = useState('')

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    let type: InputType = 'image'
    if (ext === 'html' || ext === 'htm') type = 'html'
    else if (ext === 'zip') type = 'zip'
    onSelect(type, { file })
  }, [onSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const tabs: { id: InputType; label: string; icon: React.ReactNode }[] = [
    { id: 'figma', label: 'Link Figma', icon: <LinkIcon size={14} /> },
    { id: 'image', label: 'Imagem', icon: <Image size={14} /> },
    { id: 'html', label: 'HTML / ZIP', icon: <FileCode size={14} /> },
  ]

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-blue-500 bg-zinc-800/50'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'figma' && (
          <div className="space-y-3">
            <label className="block text-sm text-zinc-400">URL do arquivo Figma</label>
            <input
              type="url"
              value={figmaUrl}
              onChange={e => setFigmaUrl(e.target.value)}
              placeholder="https://www.figma.com/file/..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => figmaUrl && onSelect('figma', { url: figmaUrl })}
              disabled={!figmaUrl}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Analisar com IA
            </button>
            <p className="text-xs text-zinc-600">Requer token de acesso à API do Figma nas configurações</p>
          </div>
        )}

        {(activeTab === 'image' || activeTab === 'html') && (
          <label
            className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all ${
              dragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className={`p-4 rounded-full ${dragging ? 'bg-blue-500/20' : 'bg-zinc-800'}`}>
              <Upload size={24} className={dragging ? 'text-blue-400' : 'text-zinc-400'} />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">
                {activeTab === 'image' ? 'Arraste uma imagem' : 'Arraste HTML ou ZIP'}
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                {activeTab === 'image' ? 'PNG, JPG, WEBP até 10MB' : 'index.html ou export.zip do Figma'}
              </p>
            </div>
            <span className="text-blue-400 text-sm font-medium underline">ou clique para selecionar</span>
            <input
              type="file"
              className="hidden"
              accept={activeTab === 'image' ? 'image/*' : '.html,.htm,.zip'}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </label>
        )}
      </div>
    </div>
  )
}
