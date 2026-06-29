import { BrandId } from '@/lib/types'
import { BRANDS, BRAND_COLORS_MAP } from '@/lib/brands'

interface Props {
  brandId: BrandId
  size?: 'sm' | 'md'
}

export default function BrandBadge({ brandId, size = 'sm' }: Props) {
  const brand = BRANDS[brandId]
  const color = BRAND_COLORS_MAP[brandId]

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ backgroundColor: color + '22', color }}
    >
      <span
        className="rounded-full"
        style={{ width: size === 'sm' ? 6 : 8, height: size === 'sm' ? 6 : 8, backgroundColor: color, display: 'inline-block' }}
      />
      {brand.displayName}
    </span>
  )
}
