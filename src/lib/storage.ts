import fs from 'fs'
import path from 'path'
import { Project, Template } from './types'

const DATA_DIR = path.join(process.cwd(), '.data')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json')
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

function readJSON<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJSON(file: string, data: unknown) {
  ensureDirs()
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// --- Projects ---

export function getProjects(): Project[] {
  ensureDirs()
  return readJSON<Project[]>(PROJECTS_FILE, [])
}

export function getProject(id: string): Project | null {
  const projects = getProjects()
  return projects.find(p => p.id === id) ?? null
}

export function saveProject(project: Project): void {
  const projects = getProjects()
  const idx = projects.findIndex(p => p.id === project.id)
  if (idx >= 0) {
    projects[idx] = project
  } else {
    projects.unshift(project)
  }
  writeJSON(PROJECTS_FILE, projects)
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter(p => p.id !== id)
  writeJSON(PROJECTS_FILE, projects)
}

// --- Templates ---

export function getTemplates(): Template[] {
  ensureDirs()
  return readJSON<Template[]>(TEMPLATES_FILE, DEFAULT_TEMPLATES)
}

export function getTemplate(id: string): Template | null {
  return getTemplates().find(t => t.id === id) ?? null
}

export function saveTemplate(template: Template): void {
  const templates = getTemplates()
  const idx = templates.findIndex(t => t.id === template.id)
  if (idx >= 0) {
    templates[idx] = template
  } else {
    templates.unshift(template)
  }
  writeJSON(TEMPLATES_FILE, templates)
}

// --- File upload ---

export function saveUploadedFile(buffer: Buffer, filename: string): string {
  ensureDirs()
  const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const filePath = path.join(UPLOADS_DIR, safeFilename)
  fs.writeFileSync(filePath, buffer)
  return `/uploads/${safeFilename}`
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'tpl-citroen-promo',
    name: 'Citroën Promoção',
    brandId: 'citroen',
    description: 'Template padrão de promoção Citroën com hero, CTA e footer',
    htmlContent: '',
    thumbnail: '',
    tags: ['promoção', 'hero', 'cta'],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'tpl-fiat-pulse',
    name: 'Fiat Pulse',
    brandId: 'fiat',
    description: 'Template do Fiat Pulse com galeria de imagens',
    htmlContent: '',
    thumbnail: '',
    tags: ['pulse', 'suv', 'galeria'],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'tpl-jeep-compass',
    name: 'Jeep Compass',
    brandId: 'jeep',
    description: 'Template do Jeep Compass com banner e CTA',
    htmlContent: '',
    thumbnail: '',
    tags: ['compass', 'suv', 'banner'],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'tpl-ram-rampage',
    name: 'RAM Rampage',
    brandId: 'ram',
    description: 'Template da RAM Rampage com hero de impacto',
    htmlContent: '',
    thumbnail: '',
    tags: ['rampage', 'pickup', 'hero'],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'tpl-peugeot-208',
    name: 'Peugeot 208',
    brandId: 'peugeot',
    description: 'Template do Peugeot 208 com cards de benefícios',
    htmlContent: '',
    thumbnail: '',
    tags: ['208', 'hatch', 'benefícios'],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'tpl-leapmotor-c10',
    name: 'Leapmotor C10',
    brandId: 'leapmotor',
    description: 'Template elétrico da Leapmotor com dois paineis',
    htmlContent: '',
    thumbnail: '',
    tags: ['C10', 'elétrico', 'EV'],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
]
