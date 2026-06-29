'use client'

import { useState } from 'react'
import { Monitor, Smartphone, Copy, Check } from 'lucide-react'

interface Props {
  html: string
  title?: string
}

export default function PreviewFrame({ html, title }: Props) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
        <span className="text-zinc-400 text-sm">{title || 'Preview'}</span>
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === 'desktop' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor size={13} /> Desktop
            </button>
            <button
              onClick={() => setMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === 'mobile' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone size={13} /> Mobile
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 font-medium transition-colors"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? 'Copiado!' : 'Copiar HTML'}
          </button>
        </div>
      </div>

      {/* Frame */}
      <div className="flex-1 overflow-auto bg-zinc-800 flex justify-center py-6 px-4">
        {html ? (
          <div
            className="transition-all duration-300 bg-white shadow-2xl"
            style={{ width: mode === 'mobile' ? 375 : 660 }}
          >
            <iframe
              srcDoc={html}
              className="w-full block border-0"
              style={{ height: '800px' }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 gap-3 py-20">
            <Monitor size={40} />
            <p className="text-sm">Nenhum HTML gerado ainda</p>
            <p className="text-xs text-zinc-700">Gere o HTML para visualizar o preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
