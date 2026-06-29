import { BrandConfig, EmailBlock, Asset } from './types'

function replacePlaceholders(html: string): string {
  const year = new Date().getFullYear()
  return html
    .replace(/\{\{year\}\}/g, String(year))
    .replace(/\{\{unsubscribeUrl\}\}/g, '#unsubscribe')
}

function renderBlock(block: EmailBlock, brand: BrandConfig): string {
  const c = block.content as Record<string, string>
  const { colors, fonts, buttonStyle } = brand

  switch (block.type) {
    case 'header':
      return `
      <!-- HEADER -->
      <tr>
        <td align="center" style="background-color:${colors.headerBg};padding:20px 40px;">
          <img src="${c.logoUrl || brand.logoUrl}" width="${c.logoWidth || brand.logoWidth}" alt="${brand.displayName}" style="display:block;border:0;"/>
        </td>
      </tr>`

    case 'hero':
      return `
      <!-- HERO -->
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <a href="${c.link || '#'}" style="display:block;">
            <img src="${c.imageUrl || 'https://via.placeholder.com/600x300'}" width="600" alt="${c.alt || 'Hero Image'}" style="display:block;width:100%;max-width:600px;border:0;"/>
          </a>
        </td>
      </tr>`

    case 'text':
      return `
      <!-- TEXT -->
      <tr>
        <td style="padding:${c.padding || '32px 40px'};background-color:${c.bg || colors.background};">
          ${c.headline ? `<h2 style="margin:0 0 12px 0;font-family:${fonts.heading.fallback};font-size:${c.headlineSize || '24px'};color:${c.headlineColor || colors.text};font-weight:700;line-height:1.3;">${c.headline}</h2>` : ''}
          ${c.body ? `<p style="margin:0;font-family:${fonts.body.fallback};font-size:${c.bodySize || '15px'};color:${c.bodyColor || colors.textLight};line-height:1.7;">${c.body}</p>` : ''}
        </td>
      </tr>`

    case 'cta':
      return `
      <!-- CTA -->
      <tr>
        <td align="center" style="padding:${c.padding || '24px 40px'};background-color:${c.bg || colors.background};">
          ${c.text ? `<p style="margin:0 0 20px;font-family:${fonts.body.fallback};font-size:15px;color:${c.textColor || colors.textLight};text-align:center;">${c.text}</p>` : ''}
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="border-radius:${buttonStyle.borderRadius};background-color:${c.buttonBg || colors.buttonBg};">
                <a href="${c.buttonUrl || '#'}" style="display:inline-block;padding:${buttonStyle.padding};font-family:${fonts.heading.fallback};font-size:${buttonStyle.fontSize};font-weight:${buttonStyle.fontWeight};color:${c.buttonColor || colors.buttonText};text-decoration:none;text-transform:${buttonStyle.textTransform};border-radius:${buttonStyle.borderRadius};background-color:${c.buttonBg || colors.buttonBg};">${c.buttonText || 'Saiba Mais'}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`

    case 'banner':
      return `
      <!-- BANNER -->
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <a href="${c.link || '#'}" style="display:block;">
            <img src="${c.imageUrl || 'https://via.placeholder.com/600x200'}" width="600" alt="${c.alt || 'Banner'}" style="display:block;width:100%;max-width:600px;border:0;"/>
          </a>
        </td>
      </tr>`

    case 'bannerText':
      return `
      <!-- BANNER + TEXT -->
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
            <tr>
              <td width="280" valign="top" style="padding:0;font-size:0;line-height:0;">
                <img src="${c.imageUrl || 'https://via.placeholder.com/280x240'}" width="280" alt="${c.alt || 'Banner'}" style="display:block;border:0;"/>
              </td>
              <td width="320" valign="middle" style="padding:24px;background-color:${c.bg || colors.background};">
                ${c.headline ? `<h3 style="margin:0 0 12px;font-family:${fonts.heading.fallback};font-size:20px;color:${colors.text};font-weight:700;">${c.headline}</h3>` : ''}
                ${c.body ? `<p style="margin:0 0 20px;font-family:${fonts.body.fallback};font-size:14px;color:${colors.textLight};line-height:1.6;">${c.body}</p>` : ''}
                ${c.buttonText ? `<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:${buttonStyle.borderRadius};background-color:${colors.buttonBg};"><a href="${c.buttonUrl || '#'}" style="display:inline-block;padding:10px 24px;font-family:${fonts.heading.fallback};font-size:13px;font-weight:700;color:${colors.buttonText};text-decoration:none;border-radius:${buttonStyle.borderRadius};">${c.buttonText}</a></td></tr></table>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>`

    case 'cards':
      return `
      <!-- CARDS -->
      <tr>
        <td style="padding:32px 20px;background-color:${c.bg || '#F5F5F5'};">
          ${c.title ? `<h2 style="text-align:center;font-family:${fonts.heading.fallback};font-size:22px;color:${colors.text};margin:0 0 24px;">${c.title}</h2>` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="33%" valign="top" style="padding:0 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:4px;overflow:hidden;">
                  <tr><td><img src="${c.card1Image || 'https://via.placeholder.com/170x130'}" width="170" style="display:block;width:100%;border:0;"/></td></tr>
                  <tr><td style="padding:16px;font-family:${fonts.body.fallback};font-size:13px;color:${colors.text};">${c.card1Text || 'Card 1'}</td></tr>
                </table>
              </td>
              <td width="33%" valign="top" style="padding:0 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:4px;overflow:hidden;">
                  <tr><td><img src="${c.card2Image || 'https://via.placeholder.com/170x130'}" width="170" style="display:block;width:100%;border:0;"/></td></tr>
                  <tr><td style="padding:16px;font-family:${fonts.body.fallback};font-size:13px;color:${colors.text};">${c.card2Text || 'Card 2'}</td></tr>
                </table>
              </td>
              <td width="33%" valign="top" style="padding:0 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:4px;overflow:hidden;">
                  <tr><td><img src="${c.card3Image || 'https://via.placeholder.com/170x130'}" width="170" style="display:block;width:100%;border:0;"/></td></tr>
                  <tr><td style="padding:16px;font-family:${fonts.body.fallback};font-size:13px;color:${colors.text};">${c.card3Text || 'Card 3'}</td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`

    case 'columns2':
      return `
      <!-- 2 COLUMNS -->
      <tr>
        <td style="padding:0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="300" valign="top" style="padding:0;font-size:0;line-height:0;">
                <img src="${c.col1Image || 'https://via.placeholder.com/300x200'}" width="300" alt="Col 1" style="display:block;border:0;"/>
                <div style="padding:20px;font-family:${fonts.body.fallback};font-size:14px;color:${colors.text};">${c.col1Text || 'Coluna 1'}</div>
              </td>
              <td width="300" valign="top" style="padding:0;font-size:0;line-height:0;">
                <img src="${c.col2Image || 'https://via.placeholder.com/300x200'}" width="300" alt="Col 2" style="display:block;border:0;"/>
                <div style="padding:20px;font-family:${fonts.body.fallback};font-size:14px;color:${colors.text};">${c.col2Text || 'Coluna 2'}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`

    case 'divider':
      return `
      <!-- DIVIDER -->
      <tr>
        <td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="height:1px;background-color:${c.color || '#E0E0E0'};font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>`

    case 'spacer':
      return `
      <!-- SPACER -->
      <tr><td style="height:${c.height || '24px'};font-size:0;line-height:0;">&nbsp;</td></tr>`

    case 'footer':
      return `
      <!-- FOOTER -->
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
  const blocksHTML = sortedBlocks.map(b => renderBlock(b, brand)).join('\n')

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <!--<![endif]-->
  <title>${brand.displayName} Email</title>
  <style type="text/css">
    body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
    a { text-decoration:none; }
    @media only screen and (max-width:600px) {
      .email-wrapper { width:100% !important; }
      .responsive-img { width:100% !important; height:auto !important; }
      .mobile-padding { padding-left:16px !important; padding-right:16px !important; }
      .hide-mobile { display:none !important; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F0F0F0;">
  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#F0F0F0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">&nbsp;</div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0F0F0;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <!--[if mso]>
        <table width="600" cellpadding="0" cellspacing="0" border="0"><tr><td>
        <![endif]-->
        <table class="email-wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#FFFFFF;">
          ${blocksHTML}
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function generateDefaultBlocks(brand: BrandConfig): EmailBlock[] {
  return [
    {
      id: 'block-header',
      type: 'header',
      order: 0,
      content: { logoUrl: brand.logoUrl, logoWidth: String(brand.logoWidth) },
    },
    {
      id: 'block-hero',
      type: 'hero',
      order: 1,
      content: { imageUrl: 'https://via.placeholder.com/600x300', link: '#', alt: 'Hero' },
    },
    {
      id: 'block-text',
      type: 'text',
      order: 2,
      content: { headline: 'Título Principal', body: 'Insira aqui o texto de introdução do e-mail. Descreva sua oferta de forma clara e objetiva.' },
    },
    {
      id: 'block-cta',
      type: 'cta',
      order: 3,
      content: { buttonText: 'Saiba Mais', buttonUrl: '#', text: '' },
    },
    {
      id: 'block-banner',
      type: 'banner',
      order: 4,
      content: { imageUrl: 'https://via.placeholder.com/600x200', link: '#', alt: 'Banner' },
    },
    {
      id: 'block-footer',
      type: 'footer',
      order: 5,
      content: {},
    },
  ]
}
