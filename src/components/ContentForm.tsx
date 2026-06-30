'use client'

import { useState } from 'react'
import { BrandId, EmailBlock } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

// ─── Campos por marca ──────────────────────────────────────────────────────────

interface Field {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean
  hint?: string
}

const COMMON_FIELDS: Field[] = [
  { key: 'heroImage', label: 'URL do Hero (imagem principal)', placeholder: 'https://...', hint: 'Imagem 600×300px' },
  { key: 'ctaUrl', label: 'URL principal (link do botão)', placeholder: 'https://...' },
  { key: 'ctaText1', label: 'Texto do botão CTA', placeholder: 'Saiba Mais' },
  { key: 'introHeadline', label: 'Nome/personalização', placeholder: '%Nome%,' },
  { key: 'introBody', label: 'Texto de introdução', placeholder: 'Seu Citroën está mais perto do que você imagina...', multiline: true },
  { key: 'sectionTitle', label: 'Título da seção (ex: "Confira as oportunidades:")', placeholder: '' },
  { key: 'banner1Image', label: 'Banner 1 — URL da imagem', placeholder: 'https://...' },
  { key: 'banner2Image', label: 'Banner 2 — URL da imagem', placeholder: 'https://' },
  { key: 'banner3Image', label: 'Banner 3 — URL da imagem', placeholder: 'https://' },
  { key: 'bodyText', label: 'Texto do corpo (abaixo dos banners)', placeholder: '', multiline: true },
  { key: 'ctaText2', label: 'Texto do 2º botão CTA', placeholder: 'Quero Meu Carro' },
  { key: 'sideBannerImage', label: 'Imagem lateral (300×330px)', placeholder: 'https://...' },
  { key: 'sideBannerTitle', label: 'Título do bloco lateral', placeholder: '' },
  { key: 'sideBannerText', label: 'Texto do bloco lateral', placeholder: '', multiline: true },
  { key: 'sideBannerCtaText', label: 'Botão do bloco lateral', placeholder: 'Conheça' },
  { key: 'legalText', label: 'Texto legal / condições', placeholder: 'Condição válida para...', multiline: true },
]

const EXTRA_FIELDS: Partial<Record<BrandId, Field[]>> = {
  peugeot: [
    { key: 'banner4Image', label: 'Banner 4 — URL da imagem (Peugeot usa 4 versões)', placeholder: 'https://...' },
    { key: 'headerImage', label: 'Header — imagem do logo/topo', placeholder: 'https://...' },
  ],
  ram: [
    { key: 'tagline', label: 'Tagline (ex: "AS OFERTAS CONTINUAM EM CAMPO.")', placeholder: '' },
    { key: 'vehicleImage', label: 'Imagem do veículo (280px)', placeholder: 'https://...' },
    { key: 'priceLabel', label: 'Label do preço (ex: "RAMPAGE A PARTIR DE:")', placeholder: '' },
    { key: 'price', label: 'Preço (ex: "R$ 199.990,00")', placeholder: '' },
    { key: 'priceSubtitle', label: 'Subtítulo do preço (ex: "+ TAXA ZERO")', placeholder: '' },
  ],
  leapmotor: [
    { key: 'darkSectionTitle', label: 'Título da seção escura', placeholder: '' },
    { key: 'darkSectionText', label: 'Texto da seção escura', placeholder: '', multiline: true },
  ],
  jeep: [
    { key: 'col1Title', label: 'Título coluna 1 (laranja)', placeholder: '' },
    { key: 'col1Text', label: 'Texto coluna 1', placeholder: '', multiline: true },
    { key: 'col1Image', label: 'Imagem coluna 1', placeholder: 'https://...' },
    { key: 'col2Title', label: 'Título coluna 2', placeholder: '' },
    { key: 'col2Text', label: 'Texto coluna 2', placeholder: '', multiline: true },
    { key: 'col2Image', label: 'Imagem coluna 2', placeholder: 'https://...' },
    { key: 'darkSectionTitle', label: 'Título seção escura (#662802)', placeholder: '' },
    { key: 'darkSectionText', label: 'Texto seção escura', placeholder: '' },
    { key: 'darkSectionImage', label: 'Imagem seção escura', placeholder: 'https://...' },
  ],
}

// ─── Converter formulário em blocos ──────────────────────────────────────────

function formToBlocks(values: Record<string, string>): EmailBlock[] {
  const blocks: EmailBlock[] = []
  let order = 0

  if (values.heroImage) {
    blocks.push({ id: uuidv4(), type: 'hero', order: order++, content: { imageUrl: values.heroImage, link: values.ctaUrl || '#', alt: '' } })
  }
  if (values.ctaText1) {
    blocks.push({ id: uuidv4(), type: 'cta', order: order++, content: { buttonText: values.ctaText1, buttonUrl: values.ctaUrl || '#' } })
  }
  if (values.introHeadline || values.introBody) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.introHeadline || '', body: values.introBody || '' } })
  }
  if (values.sectionTitle) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.sectionTitle, body: '' } })
  }
  if (values.headerImage) {
    blocks.push({ id: uuidv4(), type: 'hero', order: order++, content: { imageUrl: values.headerImage, link: values.ctaUrl || '#', alt: 'Header' } })
  }
  for (const key of ['banner1Image', 'banner2Image', 'banner3Image', 'banner4Image']) {
    if (values[key]) {
      blocks.push({ id: uuidv4(), type: 'banner', order: order++, content: { imageUrl: values[key], link: values.ctaUrl || '#', alt: '' } })
    }
  }
  if (values.bodyText) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { body: values.bodyText, headline: '' } })
  }
  if (values.ctaText2) {
    blocks.push({ id: uuidv4(), type: 'cta', order: order++, content: { buttonText: values.ctaText2, buttonUrl: values.ctaUrl || '#' } })
  }
  // RAM
  if (values.tagline) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.tagline, body: '' } })
  }
  if (values.vehicleImage) {
    blocks.push({ id: uuidv4(), type: 'banner', order: order++, content: { imageUrl: values.vehicleImage, link: values.ctaUrl || '#', alt: '' } })
  }
  if (values.priceLabel || values.price) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.priceLabel || '', body: values.price || '' } })
  }
  if (values.priceSubtitle) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { body: values.priceSubtitle, headline: '' } })
  }
  // Jeep columns
  if (values.col1Title || values.col1Text) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.col1Title || '', body: values.col1Text || '' } })
  }
  if (values.col1Image) {
    blocks.push({ id: uuidv4(), type: 'banner', order: order++, content: { imageUrl: values.col1Image, link: values.ctaUrl || '#', alt: '' } })
  }
  if (values.col2Title || values.col2Text) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.col2Title || '', body: values.col2Text || '' } })
  }
  if (values.col2Image) {
    blocks.push({ id: uuidv4(), type: 'banner', order: order++, content: { imageUrl: values.col2Image, link: values.ctaUrl || '#', alt: '' } })
  }
  // Dark section (Jeep/Leapmotor)
  if (values.darkSectionTitle || values.darkSectionText) {
    blocks.push({ id: uuidv4(), type: 'text', order: order++, content: { headline: values.darkSectionTitle || '', body: values.darkSectionText || '' } })
  }
  if (values.darkSectionImage) {
    blocks.push({ id: uuidv4(), type: 'banner', order: order++, content: { imageUrl: values.darkSectionImage, link: values.ctaUrl || '#', alt: '' } })
  }
  // Side banner
  if (values.sideBannerImage || values.sideBannerTitle) {
    blocks.push({
      id: uuidv4(),
      type: 'bannerText',
      order: order++,
      content: {
        imageUrl: values.sideBannerImage || '',
        headline: values.sideBannerTitle || '',
        body: values.sideBannerText || '',
        buttonText: values.sideBannerCtaText || 'Conheça',
        buttonUrl: values.ctaUrl || '#',
      },
    })
  }
  blocks.push({ id: uuidv4(), type: 'footer', order: order++, content: {} })

  return blocks
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface Props {
  brandId: BrandId
  onSubmit: (blocks: EmailBlock[], legalText: string) => void
  loading?: boolean
}

export default function ContentForm({ brandId, onSubmit, loading }: Props) {
  const [values, setValues] = useState<Record<string, string>>({})

  const fields = [...COMMON_FIELDS, ...(EXTRA_FIELDS[brandId] ?? [])]

  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const blocks = formToBlocks(values)
    onSubmit(blocks, values.legalText || '')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-xs text-zinc-400 mb-1.5 font-medium">{field.label}</label>
          {field.hint && <p className="text-zinc-600 text-xs mb-1">{field.hint}</p>}
          {field.multiline ? (
            <textarea
              value={values[field.key] || ''}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          ) : (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors"
      >
        {loading ? 'Gerando HTML...' : 'Gerar HTML'}
      </button>
    </form>
  )
}
