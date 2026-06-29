import { BrandConfig, BrandId } from './types'

export const BRANDS: Record<BrandId, BrandConfig> = {
  citroen: {
    id: 'citroen',
    name: 'citroen',
    displayName: 'Citroën',
    colors: {
      primary: '#FF4B00',
      secondary: '#1A1A1A',
      accent: '#FF4B00',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#666666',
      buttonBg: '#FF4B00',
      buttonText: '#FFFFFF',
      headerBg: '#1A1A1A',
      footerBg: '#1A1A1A',
      footerText: '#FFFFFF',
    },
    fonts: {
      heading: { family: 'CitroenType', fallback: 'Arial, sans-serif' },
      body: { family: 'CitroenType', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/citroen/logo.png',
    logoWidth: 120,
    headerHeight: 80,
    buttonStyle: {
      borderRadius: '0px',
      padding: '14px 32px',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    footer: {
      backgroundColor: '#1A1A1A',
      textColor: '#FFFFFF',
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1A1A1A;">
          <tr>
            <td align="center" style="padding:30px 40px 20px;">
              <img src="/brands/citroen/logo-white.png" width="100" alt="Citroën" style="display:block;"/>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 16px;">
              <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/citroen/social-facebook.png" width="24" alt="Facebook"/></a>
              <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/citroen/social-instagram.png" width="24" alt="Instagram"/></a>
              <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/citroen/social-youtube.png" width="24" alt="YouTube"/></a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 20px;font-family:Arial,sans-serif;font-size:11px;color:#999999;line-height:1.6;">
              © {{year}} Citroën Brasil — Todos os direitos reservados.<br/>
              Citroën do Brasil Automóveis Ltda. | CNPJ: 00.000.000/0000-00<br/>
              <a href="#" style="color:#FF4B00;text-decoration:none;">Descadastrar</a> ·
              <a href="#" style="color:#FF4B00;text-decoration:none;">Política de Privacidade</a>
            </td>
          </tr>
        </table>`,
    },
    signature: 'Equipe Citroën Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/citroen.brasil', iconUrl: '/brands/citroen/social-facebook.png' },
      { platform: 'Instagram', url: 'https://instagram.com/citroen.brasil', iconUrl: '/brands/citroen/social-instagram.png' },
      { platform: 'YouTube', url: 'https://youtube.com/citroen.brasil', iconUrl: '/brands/citroen/social-youtube.png' },
    ],
    legalText: '© {{year}} Citroën Brasil — Todos os direitos reservados.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  fiat: {
    id: 'fiat',
    name: 'fiat',
    displayName: 'Fiat',
    colors: {
      primary: '#8B0000',
      secondary: '#1A1A1A',
      accent: '#C8102E',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#555555',
      buttonBg: '#C8102E',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      footerBg: '#1A1A1A',
      footerText: '#FFFFFF',
    },
    fonts: {
      heading: { family: 'Fiat Sans', fallback: 'Arial, sans-serif' },
      body: { family: 'Fiat Sans', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/fiat/logo.png',
    logoWidth: 60,
    headerHeight: 80,
    buttonStyle: {
      borderRadius: '4px',
      padding: '14px 32px',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    footer: {
      backgroundColor: '#1A1A1A',
      textColor: '#FFFFFF',
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1A1A1A;">
          <tr>
            <td align="center" style="padding:30px 40px 20px;">
              <img src="/brands/fiat/logo-white.png" width="60" alt="Fiat" style="display:block;margin:0 auto;"/>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 16px;">
              <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/fiat/social-facebook.png" width="24" alt="Facebook"/></a>
              <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/fiat/social-instagram.png" width="24" alt="Instagram"/></a>
              <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/fiat/social-youtube.png" width="24" alt="YouTube"/></a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 20px;font-family:Arial,sans-serif;font-size:11px;color:#999999;line-height:1.6;">
              © {{year}} FCA — Todos os direitos reservados.<br/>
              FCA Fiat Chrysler Automóveis Brasil Ltda. | CNPJ: 00.000.000/0000-00<br/>
              <a href="#" style="color:#C8102E;text-decoration:none;">Descadastrar</a> ·
              <a href="#" style="color:#C8102E;text-decoration:none;">Política de Privacidade</a>
            </td>
          </tr>
        </table>`,
    },
    signature: 'Equipe Fiat Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/fiatbrasil', iconUrl: '/brands/fiat/social-facebook.png' },
      { platform: 'Instagram', url: 'https://instagram.com/fiatbrasil', iconUrl: '/brands/fiat/social-instagram.png' },
      { platform: 'YouTube', url: 'https://youtube.com/fiatbrasil', iconUrl: '/brands/fiat/social-youtube.png' },
    ],
    legalText: '© {{year}} FCA — Todos os direitos reservados.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  jeep: {
    id: 'jeep',
    name: 'jeep',
    displayName: 'Jeep',
    colors: {
      primary: '#2C5F2E',
      secondary: '#1A1A1A',
      accent: '#2C5F2E',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#555555',
      buttonBg: '#2C5F2E',
      buttonText: '#FFFFFF',
      headerBg: '#1A1A1A',
      footerBg: '#1A1A1A',
      footerText: '#FFFFFF',
    },
    fonts: {
      heading: { family: 'Arial Black', fallback: 'Arial, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/jeep/logo.png',
    logoWidth: 100,
    headerHeight: 70,
    buttonStyle: {
      borderRadius: '0px',
      padding: '14px 32px',
      fontSize: '14px',
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    footer: {
      backgroundColor: '#1A1A1A',
      textColor: '#FFFFFF',
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1A1A1A;">
          <tr><td align="center" style="padding:30px 40px 20px;">
            <img src="/brands/jeep/logo-white.png" width="80" alt="Jeep" style="display:block;margin:0 auto;"/>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 16px;">
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/jeep/social-facebook.png" width="24" alt="Facebook"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/jeep/social-instagram.png" width="24" alt="Instagram"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/jeep/social-youtube.png" width="24" alt="YouTube"/></a>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 20px;font-family:Arial,sans-serif;font-size:11px;color:#999999;line-height:1.6;">
            © {{year}} Jeep Brasil — Todos os direitos reservados.<br/>
            <a href="#" style="color:#2C5F2E;text-decoration:none;">Descadastrar</a> ·
            <a href="#" style="color:#2C5F2E;text-decoration:none;">Política de Privacidade</a>
          </td></tr>
        </table>`,
    },
    signature: 'Equipe Jeep Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/jeepbrasil', iconUrl: '/brands/jeep/social-facebook.png' },
      { platform: 'Instagram', url: 'https://instagram.com/jeepbrasil', iconUrl: '/brands/jeep/social-instagram.png' },
    ],
    legalText: '© {{year}} Jeep Brasil — Todos os direitos reservados.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  peugeot: {
    id: 'peugeot',
    name: 'peugeot',
    displayName: 'Peugeot',
    colors: {
      primary: '#0F2D6E',
      secondary: '#1A1A1A',
      accent: '#0F2D6E',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#555555',
      buttonBg: '#0F2D6E',
      buttonText: '#FFFFFF',
      headerBg: '#0F2D6E',
      footerBg: '#0F2D6E',
      footerText: '#FFFFFF',
    },
    fonts: {
      heading: { family: 'Peugeot New', fallback: 'Arial, sans-serif' },
      body: { family: 'Peugeot New', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/peugeot/logo.png',
    logoWidth: 50,
    headerHeight: 80,
    buttonStyle: {
      borderRadius: '2px',
      padding: '14px 32px',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    footer: {
      backgroundColor: '#0F2D6E',
      textColor: '#FFFFFF',
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F2D6E;">
          <tr><td align="center" style="padding:30px 40px 20px;">
            <img src="/brands/peugeot/logo-white.png" width="50" alt="Peugeot" style="display:block;margin:0 auto;"/>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 16px;">
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/peugeot/social-facebook.png" width="24" alt="Facebook"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/peugeot/social-instagram.png" width="24" alt="Instagram"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/peugeot/social-youtube.png" width="24" alt="YouTube"/></a>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 20px;font-family:Arial,sans-serif;font-size:11px;color:#B0BEC5;line-height:1.6;">
            © {{year}} Peugeot Brasil — Todos os direitos reservados.<br/>
            <a href="#" style="color:#FFFFFF;text-decoration:none;">Descadastrar</a> ·
            <a href="#" style="color:#FFFFFF;text-decoration:none;">Política de Privacidade</a>
          </td></tr>
        </table>`,
    },
    signature: 'Equipe Peugeot Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/peugeotbrasil', iconUrl: '/brands/peugeot/social-facebook.png' },
      { platform: 'Instagram', url: 'https://instagram.com/peugeotbrasil', iconUrl: '/brands/peugeot/social-instagram.png' },
    ],
    legalText: '© {{year}} Peugeot Brasil — Todos os direitos reservados.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  ram: {
    id: 'ram',
    name: 'ram',
    displayName: 'RAM',
    colors: {
      primary: '#CC0000',
      secondary: '#1A1A1A',
      accent: '#CC0000',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#555555',
      buttonBg: '#CC0000',
      buttonText: '#FFFFFF',
      headerBg: '#1A1A1A',
      footerBg: '#1A1A1A',
      footerText: '#FFFFFF',
    },
    fonts: {
      heading: { family: 'Arial Black', fallback: 'Arial, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/ram/logo.png',
    logoWidth: 110,
    headerHeight: 70,
    buttonStyle: {
      borderRadius: '0px',
      padding: '14px 36px',
      fontSize: '14px',
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    footer: {
      backgroundColor: '#1A1A1A',
      textColor: '#FFFFFF',
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1A1A1A;">
          <tr><td align="center" style="padding:30px 40px 20px;">
            <img src="/brands/ram/logo-white.png" width="90" alt="RAM" style="display:block;margin:0 auto;"/>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 16px;">
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/ram/social-facebook.png" width="24" alt="Facebook"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/ram/social-instagram.png" width="24" alt="Instagram"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/ram/social-youtube.png" width="24" alt="YouTube"/></a>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 20px;font-family:Arial,sans-serif;font-size:11px;color:#999999;line-height:1.6;">
            © {{year}} RAM Brasil — Todos os direitos reservados.<br/>
            <a href="#" style="color:#CC0000;text-decoration:none;">Descadastrar</a> ·
            <a href="#" style="color:#CC0000;text-decoration:none;">Política de Privacidade</a>
          </td></tr>
        </table>`,
    },
    signature: 'Equipe RAM Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/rambrasil', iconUrl: '/brands/ram/social-facebook.png' },
      { platform: 'Instagram', url: 'https://instagram.com/rambrasil', iconUrl: '/brands/ram/social-instagram.png' },
    ],
    legalText: '© {{year}} RAM Brasil — Todos os direitos reservados.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  leapmotor: {
    id: 'leapmotor',
    name: 'leapmotor',
    displayName: 'Leapmotor',
    colors: {
      primary: '#00A0D2',
      secondary: '#0D0D0D',
      accent: '#00A0D2',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#555555',
      buttonBg: '#00A0D2',
      buttonText: '#FFFFFF',
      headerBg: '#0D0D0D',
      footerBg: '#0D0D0D',
      footerText: '#FFFFFF',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/leapmotor/logo.png',
    logoWidth: 130,
    headerHeight: 70,
    buttonStyle: {
      borderRadius: '40px',
      padding: '14px 36px',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    footer: {
      backgroundColor: '#0D0D0D',
      textColor: '#FFFFFF',
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0D0D0D;">
          <tr><td align="center" style="padding:30px 40px 20px;">
            <img src="/brands/leapmotor/logo-white.png" width="110" alt="Leapmotor" style="display:block;margin:0 auto;"/>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 16px;">
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/leapmotor/social-facebook.png" width="24" alt="Facebook"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/leapmotor/social-instagram.png" width="24" alt="Instagram"/></a>
            <a href="#" style="display:inline-block;margin:0 8px;"><img src="/brands/leapmotor/social-youtube.png" width="24" alt="YouTube"/></a>
          </td></tr>
          <tr><td align="center" style="padding:0 40px 20px;font-family:Arial,sans-serif;font-size:11px;color:#999999;line-height:1.6;">
            © {{year}} Leapmotor Brasil — Todos os direitos reservados.<br/>
            <a href="#" style="color:#00A0D2;text-decoration:none;">Descadastrar</a> ·
            <a href="#" style="color:#00A0D2;text-decoration:none;">Política de Privacidade</a>
          </td></tr>
        </table>`,
    },
    signature: 'Equipe Leapmotor Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/leapmotorbrasil', iconUrl: '/brands/leapmotor/social-facebook.png' },
      { platform: 'Instagram', url: 'https://instagram.com/leapmotorbrasil', iconUrl: '/brands/leapmotor/social-instagram.png' },
    ],
    legalText: '© {{year}} Leapmotor Brasil — Todos os direitos reservados.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },
}

export function getBrand(id: BrandId): BrandConfig {
  return BRANDS[id]
}

export const BRAND_LIST = Object.values(BRANDS)

export const BRAND_COLORS_MAP: Record<BrandId, string> = {
  citroen: '#FF4B00',
  fiat: '#C8102E',
  jeep: '#2C5F2E',
  peugeot: '#0F2D6E',
  ram: '#CC0000',
  leapmotor: '#00A0D2',
}
