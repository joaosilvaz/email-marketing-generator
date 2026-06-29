import { BRAND_LIST, BRAND_COLORS_MAP } from '@/lib/brands'

export default function BrandsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Marcas</h1>
        <p className="text-zinc-400 text-sm mt-1">Identidades visuais configuradas na plataforma</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {BRAND_LIST.map(brand => {
          const color = BRAND_COLORS_MAP[brand.id]
          return (
            <div key={brand.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* Header colorido */}
              <div className="h-2" style={{ backgroundColor: color }} />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: color }}
                  >
                    {brand.displayName[0]}
                  </div>
                  <div>
                    <h2 className="text-white font-bold">{brand.displayName}</h2>
                    <p className="text-zinc-500 text-xs">{brand.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Colors */}
                  <div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Cores</p>
                    <div className="space-y-1.5">
                      {Object.entries(brand.colors).slice(0, 5).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-zinc-700" style={{ backgroundColor: val }} />
                          <span className="text-zinc-400 text-xs">{val}</span>
                          <span className="text-zinc-600 text-xs">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Config */}
                  <div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Config</p>
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div>
                        <span className="text-zinc-600">Fonte: </span>
                        {brand.fonts.heading.fallback}
                      </div>
                      <div>
                        <span className="text-zinc-600">Logo: </span>
                        {brand.logoWidth}px
                      </div>
                      <div>
                        <span className="text-zinc-600">Botão: </span>
                        r{brand.buttonStyle.borderRadius}
                      </div>
                      <div>
                        <span className="text-zinc-600">Redes: </span>
                        {brand.socialLinks.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button preview */}
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Preview do Botão</p>
                  <div
                    className="inline-flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: brand.colors.buttonBg,
                      padding: '8px 20px',
                      borderRadius: brand.buttonStyle.borderRadius,
                      textTransform: brand.buttonStyle.textTransform as 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Saiba Mais
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
