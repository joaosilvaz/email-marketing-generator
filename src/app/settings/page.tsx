'use client'

import { useState } from 'react'
import { Save, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [anthropicKey, setAnthropicKey] = useState('')
  const [figmaToken, setFigmaToken] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In production, these would be saved securely server-side
    // For now they guide the user to configure .env
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-400 text-sm mt-1">Configure as integrações da plataforma</p>
      </div>

      <div className="space-y-6">
        {/* API Keys section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Chaves de API</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Anthropic API Key (Claude Vision)</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={anthropicKey}
                  onChange={e => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 pr-12"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-zinc-600 text-xs mt-1.5">
                Configure via variável de ambiente: <code className="text-zinc-400">ANTHROPIC_API_KEY</code>
              </p>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Figma Personal Access Token</label>
              <input
                type="password"
                value={figmaToken}
                onChange={e => setFigmaToken(e.target.value)}
                placeholder="figd_..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500"
              />
              <p className="text-zinc-600 text-xs mt-1.5">
                Configure via variável de ambiente: <code className="text-zinc-400">FIGMA_ACCESS_TOKEN</code>
              </p>
            </div>
          </div>
        </div>

        {/* .env instructions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3">Configuração via .env</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Crie um arquivo <code className="text-blue-400">.env.local</code> na raiz do projeto:
          </p>
          <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono leading-relaxed">
{`# IA Vision (obrigatório para análise automática)
ANTHROPIC_API_KEY=sk-ant-...

# Figma API (opcional — para importar diretamente do Figma)
FIGMA_ACCESS_TOKEN=figd_...

# Storage (opcional — padrão: local /public/uploads)
# CLOUDINARY_URL=cloudinary://...
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_S3_BUCKET=...`}
          </pre>
        </div>

        {/* Storage section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-2">Storage de Imagens</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Por padrão, imagens são salvas localmente em <code className="text-blue-400">public/uploads/</code>.
            Para produção, configure AWS S3 ou Cloudinary via .env.
          </p>
          <div className="flex gap-3">
            {['Local (padrão)', 'AWS S3', 'Cloudinary'].map((opt, i) => (
              <div
                key={opt}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  i === 0
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-zinc-700 text-zinc-500'
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <Save size={15} />
          {saved ? 'Salvo!' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  )
}
