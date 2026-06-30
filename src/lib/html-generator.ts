import fs from 'fs'
import path from 'path'
import { BrandConfig, EmailBlock, Asset } from './types'

// ─── Unsubscribe block (obrigatório em todos os e-mails) ──────────────────────

const UNSUBSCRIBE_BLOCK = `
<!-- Unsubscribe -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;">
  <tr>
    <td align="center" style="padding:24px 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A8A;">
      <p style="margin:0 0 10px;">Esse email foi enviado para %%emailaddr%%.</p>
      <p style="margin:0 0 10px;">Caso não queira mais receber nossos emails acesse <a href="%%unsub_center_url%%" style="color:#8A8A8A;text-decoration:underline;">esse link</a>.</p>
    </td>
  </tr>
</table>`

function injectUnsubscribe(html: string): string {
  // Remove bloco já existente no template para não duplicar
  const cleaned = html.replace(
    /<!--\s*Unsubscribe\s*-->[\s\S]*?<\/table>/i,
    ''
  )
  // Injeta antes do </body>
  if (cleaned.includes('</body>')) {
    return cleaned.replace('</body>', `${UNSUBSCRIBE_BLOCK}\n</body>`)
  }
  return cleaned + UNSUBSCRIBE_BLOCK
}

// ─── Template loader ───────────────────────────────────────────────────────────

function loadBaseTemplate(brandId: string): string | null {
  try {
    const p = path.join(process.cwd(), 'src', 'lib', 'templates', `${brandId}-base.html`)
    if (!fs.existsSync(p)) return null
    return fs.readFileSync(p, 'utf-8')
  } catch {
    return null
  }
}

// ─── Block helpers ─────────────────────────────────────────────────────────────

function blocksByType(blocks: EmailBlock[], type: EmailBlock['type']) {
  return blocks
    .filter(b => b.type === type)
    .sort((a, b) => a.order - b.order)
}

function content(block: EmailBlock | undefined): Record<string, string> {
  return (block?.content ?? {}) as Record<string, string>
}

// ─── Template-based generator (uses real brand HTML files) ────────────────────

export function generateFromTemplate(
  brand: BrandConfig,
  blocks: EmailBlock[],
  _assets: Asset[],
  legalText?: string,
): string {
  const tpl = loadBaseTemplate(brand.id)
  if (!tpl) return generateHTML(brand, blocks, _assets)

  const sorted = [...blocks].sort((a, b) => a.order - b.order)

  const heroes      = blocksByType(sorted, 'hero')
  const ctas        = blocksByType(sorted, 'cta')
  const texts       = blocksByType(sorted, 'text')
  const banners     = blocksByType(sorted, 'banner')
  const bannerTexts = blocksByType(sorted, 'bannerText')

  const hero      = heroes[0]
  const cta1      = ctas[0]
  const cta2      = ctas[1]
  const intro     = texts[0]
  const section   = texts[1]
  const body      = texts[2]
  const banner1   = banners[0]
  const banner2   = banners[1]
  const banner3   = banners[2]
  const sideBlock = bannerTexts[0]

  const filled = tpl
    // ── Hero ──────────────────────────────────────────────────────────────────
    .replace(/\{\{heroImage\}\}/g, content(hero).imageUrl || 'https://via.placeholder.com/600x300')
    .replace(/\{\{heroAlt\}\}/g,   content(hero).alt       || brand.displayName)
    .replace(/\{\{headerImage\}\}/g, content(hero).imageUrl || 'https://via.placeholder.com/600x80')

    // ── CTAs ──────────────────────────────────────────────────────────────────
    .replace(/\{\{ctaUrl\}\}/g,    content(cta1).buttonUrl  || content(cta2).buttonUrl || '#')
    .replace(/\{\{ctaText1\}\}/g,  content(cta1).buttonText || 'Saiba Mais')
    .replace(/\{\{ctaText2\}\}/g,  content(cta2 ?? cta1).buttonText || 'Saiba Mais')

    // CTA button images (RAM uses image CTAs — keep fallback URL)
    .replace(/\{\{ctaButtonImage\}\}/g,        content(cta1).buttonImage        || 'https://via.placeholder.com/385x49')
    .replace(/\{\{ctaButton2Image\}\}/g,        content(cta2 ?? cta1).buttonImage || 'https://via.placeholder.com/371x49')
    .replace(/\{\{ctaProductButtonImage\}\}/g,  content(cta1).buttonImage        || 'https://via.placeholder.com/130x43')
    .replace(/\{\{ctaProductButtonAlt\}\}/g,    content(cta1).buttonText         || 'Saiba Mais')

    // ── Intro text ────────────────────────────────────────────────────────────
    .replace(/\{\{introText\}\}/g,           content(intro).body       || '')
    .replace(/\{\{personalizationName\}\}/g, content(intro).headline   || '%Nome%,')

    // ── Section title / body ──────────────────────────────────────────────────
    .replace(/\{\{sectionTitle\}\}/g, content(section).headline || content(section).body || '')
    .replace(/\{\{bodyText\}\}/g,     content(body).body        || content(body).headline || '')

    // ── Banners ───────────────────────────────────────────────────────────────
    .replace(/\{\{banner1Image\}\}/g, content(banner1).imageUrl || 'https://via.placeholder.com/600x200')
    .replace(/\{\{banner1Alt\}\}/g,   content(banner1).alt      || 'Banner')
    .replace(/\{\{banner1Url\}\}/g,   content(banner1).link     || content(cta1).buttonUrl || '#')

    .replace(/\{\{banner2Image\}\}/g, content(banner2).imageUrl || 'https://via.placeholder.com/600x200')
    .replace(/\{\{banner2Alt\}\}/g,   content(banner2).alt      || 'Banner')
    .replace(/\{\{banner2Url\}\}/g,   content(banner2).link     || content(cta1).buttonUrl || '#')

    .replace(/\{\{banner3Image\}\}/g, content(banner3).imageUrl || 'https://via.placeholder.com/600x200')
    .replace(/\{\{banner3Alt\}\}/g,   content(banner3).alt      || 'Banner')
    .replace(/\{\{banner3Url\}\}/g,   content(banner3).link     || content(cta1).buttonUrl || '#')

    // Peugeot usa 4 banners (versões do modelo)
    .replace(/\{\{banner4Image\}\}/g, content(banners[3]).imageUrl || 'https://via.placeholder.com/600x200')
    .replace(/\{\{banner4Alt\}\}/g,   content(banners[3]).alt      || 'Banner')
    .replace(/\{\{banner4Url\}\}/g,   content(banners[3]).link     || content(cta1).buttonUrl || '#')

    // ── Side banner (bannerText) ───────────────────────────────────────────────
    .replace(/\{\{sideBannerImage\}\}/g,   content(sideBlock).imageUrl   || 'https://via.placeholder.com/300x330')
    .replace(/\{\{sideBannerTitle\}\}/g,   content(sideBlock).headline   || '')
    .replace(/\{\{sideBannerText\}\}/g,    content(sideBlock).body       || '')
    .replace(/\{\{sideBannerCtaText\}\}/g, content(sideBlock).buttonText || 'Saiba Mais')
    .replace(/\{\{sideBannerCtaUrl\}\}/g,  content(sideBlock).buttonUrl  || content(cta1).buttonUrl || '#')

    // ── Jeep dark section ─────────────────────────────────────────────────────
    .replace(/\{\{darkSectionTitle\}\}/g, content(section ?? body ?? intro).headline || '')
    .replace(/\{\{darkSectionText\}\}/g,  content(section ?? body ?? intro).body     || '')
    .replace(/\{\{darkSectionImage\}\}/g, content(banner2 ?? banner1).imageUrl       || 'https://via.placeholder.com/600x300')
    .replace(/\{\{darkCtaImage\}\}/g,     content(cta2 ?? cta1).buttonImage          || 'https://via.placeholder.com/335x49')
    .replace(/\{\{darkCtaText\}\}/g,      content(cta2 ?? cta1).buttonText           || 'Saiba Mais')
    .replace(/\{\{jeepLogoWhite\}\}/g,    '/brands/jeep/logo-white.png')

    // Jeep col (text+image side by side sections)
    .replace(/\{\{col1Title\}\}/g,  content(texts[1]).headline  || '')
    .replace(/\{\{col1Text\}\}/g,   content(texts[1]).body      || '')
    .replace(/\{\{col1Image\}\}/g,  content(banner1).imageUrl   || 'https://via.placeholder.com/300x300')
    .replace(/\{\{col1Alt\}\}/g,    content(banner1).alt        || '')
    .replace(/\{\{col2Title\}\}/g,  content(texts[2]).headline  || '')
    .replace(/\{\{col2Text\}\}/g,   content(texts[2]).body      || '')
    .replace(/\{\{col2Image\}\}/g,  content(banner2).imageUrl   || 'https://via.placeholder.com/300x300')
    .replace(/\{\{col2Alt\}\}/g,    content(banner2).alt        || '')

    // ── RAM specific ──────────────────────────────────────────────────────────
    .replace(/\{\{tagline\}\}/g,         content(intro).headline || brand.displayName.toUpperCase())
    .replace(/\{\{vehicleImage\}\}/g,    content(banner1).imageUrl || 'https://via.placeholder.com/280x200')
    .replace(/\{\{vehicleAlt\}\}/g,      content(banner1).alt      || brand.displayName)
    .replace(/\{\{priceLabel\}\}/g,      content(texts[1]).headline || 'A PARTIR DE:')
    .replace(/\{\{price\}\}/g,           content(texts[1]).body     || 'Consulte')
    .replace(/\{\{priceSubtitle\}\}/g,   content(texts[2]).body     || '')
    .replace(/\{\{priceDisclaimer\}\}/g, content(texts[3]).body     || '*CONSULTE CONDIÇÕES')
    .replace(/\{\{dividerImage\}\}/g,    'https://via.placeholder.com/600x8')

    // ── Leapmotor specific ────────────────────────────────────────────────────
    .replace(/\{\{sideBannerTitle\}\}/g, content(sideBlock ?? texts[1]).headline || '')
    .replace(/\{\{sideBannerText\}\}/g,  content(sideBlock ?? texts[1]).body     || '')

    // ── Legal / footer ────────────────────────────────────────────────────────
    .replace(/\{\{legalText\}\}/g, legalText || brand.legalText || 'Desacelere. Seu bem maior é a vida.')
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()))
    .replace(/\{\{unsubscribeUrl\}\}/g, '%%unsub_center_url%%')

    // Limpa placeholders não preenchidos
    .replace(/\{\{[a-zA-Z0-9_]+\}\}/g, '')

  return injectUnsubscribe(filled)
}

// ─── Fallback block-by-block generator ────────────────────────────────────────
// Usado quando não existe template real para a marca

function replacePlaceholders(html: string): string {
  const year = new Date().getFullYear()
  return html
    .replace(/\{\{year\}\}/g, String(year))
    .replace(/\{\{unsubscribeUrl\}\}/g, '#unsubscribe')
    .replace(/\{\{legalText\}\}/g, '')
}

function renderBlock(block: EmailBlock, brand: BrandConfig): string {
  const c = block.content as Record<string, string>
  const { colors, fonts, buttonStyle } = brand

  switch (block.type) {
    case 'header':
      return `
      <tr>
        <td align="center" style="background-color:${colors.headerBg};padding:20px 40px;">
          <img src="${c.logoUrl || brand.logoUrl}" width="${c.logoWidth || brand.logoWidth}" alt="${brand.displayName}" style="display:block;border:0;"/>
        </td>
      </tr>`

    case 'hero':
      return `
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <a href="${c.link || '#'}" style="display:block;">
            <img src="${c.imageUrl || 'https://via.placeholder.com/600x300'}" width="600" alt="${c.alt || ''}" style="display:block;width:100%;max-width:600px;border:0;"/>
          </a>
        </td>
      </tr>`

    case 'text':
      return `
      <tr>
        <td style="padding:${c.padding || '32px 40px'};background-color:${c.bg || colors.background};">
          ${c.headline ? `<p style="margin:0 0 12px;font-family:${fonts.heading.fallback};font-size:${c.headlineSize || '22px'};color:${colors.text};font-weight:700;line-height:1.3;">${c.headline}</p>` : ''}
          ${c.body ? `<p style="margin:0;font-family:${fonts.body.fallback};font-size:${c.bodySize || '20px'};color:${colors.textLight};line-height:1.4;">${c.body}</p>` : ''}
        </td>
      </tr>`

    case 'cta': {
      const btnBg    = c.buttonBg    || colors.buttonBg
      const btnColor = c.buttonColor || colors.buttonText
      const btnText  = c.buttonText  || 'Saiba Mais'
      const btnUrl   = c.buttonUrl   || '#'
      const btnFs    = buttonStyle.fontSize
      const btnFw    = buttonStyle.fontWeight
      const btnTt    = buttonStyle.textTransform
      const btnPad   = buttonStyle.padding    // ex: "0 24px"
      const sectionBg = c.bg || colors.background
      return `
      <tr>
        <td style="padding:${c.padding || '24px 40px'};background-color:${sectionBg};" align="center">
          ${c.text ? `<p style="margin:0 0 16px;font-family:${fonts.body.fallback};font-size:20px;color:${colors.textLight};text-align:center;">${c.text}</p>` : ''}
          <div>
            <!--[if mso]>
            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
              href="${btnUrl}" style="height:49px; v-text-anchor:middle; width:328px;"
              fillcolor="${btnBg}" strokecolor="${btnColor}" strokeweight="1pt">
              <w:anchorlock/>
              <center style="color:${btnColor}; font-family:Arial,sans-serif; font-size:${btnFs}; font-weight:${btnFw}; text-transform:${btnTt}; white-space:nowrap;">
                ${btnText}
              </center>
            </v:rect>
            <![endif]-->
            <!--[if !mso]><!-->
            <a href="${btnUrl}" target="_blank"
              style="white-space:nowrap; background-color:${btnBg}; display:inline-block; text-align:center; text-decoration:none; color:${btnColor}; font-weight:${btnFw}; font-family:Arial,sans-serif; font-size:${btnFs}; text-transform:${btnTt}; line-height:49px; padding:${btnPad}; mso-hide:all; -webkit-text-size-adjust:none;">${btnText}</a>
            <!--<![endif]-->
          </div>
        </td>
      </tr>`
    }

    case 'banner':
      return `
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <a href="${c.link || '#'}" style="display:block;">
            <img src="${c.imageUrl || 'https://via.placeholder.com/600x200'}" width="600" alt="${c.alt || ''}" style="display:block;width:100%;max-width:600px;border:0;"/>
          </a>
        </td>
      </tr>`

    case 'bannerText':
      return `
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="300" valign="top" style="padding:0;font-size:0;line-height:0;">
                <img src="${c.imageUrl || 'https://via.placeholder.com/300x280'}" width="300" alt="${c.alt || ''}" style="display:block;border:0;"/>
              </td>
              <td width="300" valign="middle" style="padding:24px 32px;background-color:${c.bg || colors.background};">
                ${c.headline ? `<p style="margin:0 0 12px;font-family:${fonts.heading.fallback};font-size:22px;color:${colors.primary};font-weight:700;line-height:1.3;">${c.headline}</p>` : ''}
                ${c.body ? `<p style="margin:0 0 20px;font-family:${fonts.body.fallback};font-size:16px;color:${colors.text};line-height:1.5;">${c.body}</p>` : ''}
                ${c.buttonText ? `
                  <!--[if mso]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                    href="${c.buttonUrl || '#'}" style="height:43px; v-text-anchor:middle; width:160px;"
                    fillcolor="${colors.buttonBg}" strokecolor="${colors.buttonText}" strokeweight="1pt">
                    <w:anchorlock/>
                    <center style="color:${colors.buttonText}; font-family:Arial,sans-serif; font-size:${buttonStyle.fontSize}; font-weight:${buttonStyle.fontWeight}; text-transform:${buttonStyle.textTransform}; white-space:nowrap;">${c.buttonText}</center>
                  </v:rect>
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <a href="${c.buttonUrl || '#'}" target="_blank"
                    style="white-space:nowrap; background-color:${colors.buttonBg}; display:inline-block; text-align:center; text-decoration:none; color:${colors.buttonText}; font-weight:${buttonStyle.fontWeight}; font-family:Arial,sans-serif; font-size:${buttonStyle.fontSize}; text-transform:${buttonStyle.textTransform}; line-height:43px; padding:0 24px; mso-hide:all; -webkit-text-size-adjust:none;">${c.buttonText}</a>
                  <!--<![endif]-->` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>`

    case 'divider':
      return `
      <tr>
        <td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="height:1px;background-color:${c.color || '#E0E0E0'};font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>`

    case 'spacer':
      return `<tr><td style="height:${c.height || '32px'};font-size:0;line-height:0;">&nbsp;</td></tr>`

    case 'footer':
      return `
      <tr>
        <td style="padding:0;">
          ${replacePlaceholders(brand.footer.html)}
        </td>
      </tr>`

    default:
      return ''
  }
}

export function generateHTML(brand: BrandConfig, blocks: EmailBlock[], _assets: Asset[]): string {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)
  const bodyBg = brand.colors.background

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt-BR">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
  <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection"/>
  <title>${brand.displayName}</title>
  <!--[if mso]><style>* { font-family: sans-serif !important; }</style><![endif]-->
  <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
  <style type="text/css">
    html { margin:0!important; padding:0!important; }
    * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
    td { vertical-align:top; mso-table-lspace:0pt!important; mso-table-rspace:0pt!important; }
    a { text-decoration:none; }
    img { -ms-interpolation-mode:bicubic; }
    @media only screen and (min-device-width:320px) and (max-device-width:374px) { u~div .email-container { min-width:320px!important; } }
    @media only screen and (min-device-width:375px) and (max-device-width:413px) { u~div .email-container { min-width:375px!important; } }
    @media only screen and (min-device-width:414px) { u~div .email-container { min-width:414px!important; } }
    @media only screen and (max-device-width:599px), only screen and (max-width:599px) {
      .email-container { width:100%!important; margin:auto!important; }
      .stack-column { display:block!important; width:100%!important; max-width:100%!important; direction:ltr!important; }
      .full-width { width:100%!important; }
      .mobile-center { text-align:center!important; }
      .hide { display:none!important; }
    }
  </style>
</head>
<body width="100%" style="margin:0;padding:0!important;mso-line-height-rule:exactly;border:0;">
  <div style="display:none;font-size:1px;color:#F0F0F0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">&nbsp;</div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td valign="top" align="center">
        <table bgcolor="${bodyBg}" style="margin:0 auto;" align="center" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container">
          <tr>
            <td style="vertical-align:middle;" width="600">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                ${sortedBlocks.map(b => renderBlock(b, brand)).join('\n')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return injectUnsubscribe(html)
}

// ─── Default blocks per brand ──────────────────────────────────────────────────

export function generateDefaultBlocks(brand: BrandConfig): EmailBlock[] {
  return [
    {
      id: 'block-hero',
      type: 'hero',
      order: 0,
      content: { imageUrl: 'https://via.placeholder.com/600x300', link: '#', alt: brand.displayName },
    },
    {
      id: 'block-cta1',
      type: 'cta',
      order: 1,
      content: { buttonText: 'Saiba Mais', buttonUrl: '#' },
    },
    {
      id: 'block-intro',
      type: 'text',
      order: 2,
      content: { headline: '%Nome%,', body: 'Insira aqui o texto de introdução do e-mail.' },
    },
    {
      id: 'block-banner1',
      type: 'banner',
      order: 3,
      content: { imageUrl: 'https://via.placeholder.com/600x220', link: '#', alt: 'Banner 1' },
    },
    {
      id: 'block-banner2',
      type: 'banner',
      order: 4,
      content: { imageUrl: 'https://via.placeholder.com/600x220', link: '#', alt: 'Banner 2' },
    },
    {
      id: 'block-body',
      type: 'text',
      order: 5,
      content: { body: 'Texto complementar da campanha.' },
    },
    {
      id: 'block-cta2',
      type: 'cta',
      order: 6,
      content: { buttonText: 'Saiba Mais', buttonUrl: '#' },
    },
    {
      id: 'block-sidebanner',
      type: 'bannerText',
      order: 7,
      content: {
        imageUrl: 'https://via.placeholder.com/300x330',
        headline: `${brand.displayName} — Conheça`,
        body: 'Seu novo carro com segurança e condições exclusivas.',
        buttonText: 'Conheça',
        buttonUrl: '#',
      },
    },
    {
      id: 'block-footer',
      type: 'footer',
      order: 8,
      content: {},
    },
  ]
}
