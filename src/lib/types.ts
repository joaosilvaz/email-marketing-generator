export type BrandId = 'citroen' | 'fiat' | 'jeep' | 'peugeot' | 'ram' | 'leapmotor'

export interface BrandColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  textLight: string
  buttonBg: string
  buttonText: string
  headerBg: string
  footerBg: string
  footerText: string
}

export interface BrandFont {
  family: string
  url?: string
  fallback: string
}

export interface BrandSocial {
  platform: string
  url: string
  iconUrl: string
}

export interface BrandConfig {
  id: BrandId
  name: string
  displayName: string
  colors: BrandColors
  fonts: {
    heading: BrandFont
    body: BrandFont
  }
  logoUrl: string
  logoWidth: number
  headerHeight: number
  buttonStyle: {
    borderRadius: string
    padding: string
    fontSize: string
    fontWeight: string
    textTransform: string
  }
  footer: {
    html: string
    backgroundColor: string
    textColor: string
  }
  signature: string
  socialLinks: BrandSocial[]
  legalText: string
  unsubscribeText: string
  baseTemplate?: string
}

export type ProjectStatus = 'draft' | 'analyzing' | 'generating' | 'ready' | 'error'

export type InputType = 'figma' | 'image' | 'html' | 'zip'

export interface EmailBlock {
  id: string
  type: 'header' | 'hero' | 'cta' | 'text' | 'banner' | 'bannerText' | 'footer' | 'cards' | 'columns2' | 'columns3' | 'list' | 'gif' | 'video' | 'faq' | 'divider' | 'spacer'
  content: Record<string, unknown>
  order: number
}

export interface Project {
  id: string
  name: string
  brandId: BrandId
  status: ProjectStatus
  inputType: InputType
  inputSource: string
  createdAt: string
  updatedAt: string
  htmlContent: string
  mjmlContent: string
  blocks: EmailBlock[]
  assets: Asset[]
  version: number
  thumbnail: string
  tags: string[]
  description: string
  versions: ProjectVersion[]
}

export interface ProjectVersion {
  version: number
  htmlContent: string
  mjmlContent: string
  createdAt: string
  note: string
}

export interface Asset {
  id: string
  originalName: string
  url: string
  localPath: string
  width?: number
  height?: number
  mimeType: string
}

export interface Template {
  id: string
  name: string
  brandId: BrandId
  description: string
  htmlContent: string
  thumbnail: string
  tags: string[]
  createdAt: string
  isDefault: boolean
}

export interface AnalysisResult {
  blocks: EmailBlock[]
  detectedColors: string[]
  detectedFonts: string[]
  assets: Asset[]
  rawDescription: string
}

export interface GenerateRequest {
  projectId: string
  brandId: BrandId
  blocks: EmailBlock[]
  assets: Asset[]
  overrides?: Record<string, unknown>
}
