import { BrandConfig, BrandId } from './types'

export const BRANDS: Record<BrandId, BrandConfig> = {
  citroen: {
    id: 'citroen',
    name: 'citroen',
    displayName: 'Citroën',
    colors: {
      primary: '#E21017',
      secondary: '#656565',
      accent: '#E21017',
      background: '#FFFFFF',
      text: '#000000',
      textLight: '#656565',
      buttonBg: '#E21017',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      footerBg: '#F5F5F5',
      footerText: '#656565',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
    },
    logoUrl: '/brands/citroen/logo.png',
    logoWidth: 250,
    headerHeight: 0,
    buttonStyle: {
      borderRadius: '0px',
      padding: '0 24px',
      fontSize: '24px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    baseTemplate: 'citroen',
    footer: {
      backgroundColor: '#F5F5F5',
      textColor: '#656565',
      html: `
        <!-- FOOTER CITROËN -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- Central de Serviços -->
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center"
              style="color:#656565;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.2;padding:0 40px;text-align:center;font-weight:bold;">
              CENTRAL DE SERVIÇOS AO CLIENTE
            </td>
          </tr>
          <!-- WhatsApp + Telefone -->
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-top:20px;padding-left:64px;" width="300">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.2;color:#656565;">
                          <b>WHATSAPP CITROËN</b><br>
                          <span style="font-size:16px;">(31) 2123-2300</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="padding-top:20px;padding-right:64px;" width="300">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.2;color:#656565;">
                          <b>TELEFONE</b><br>
                          <span style="font-size:16px;">0800 011 8088</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center" style="padding:20px 60px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td bgcolor="#CCCCCC" style="height:1px;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <!-- Redes sociais -->
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center">
              <table width="500" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-size:0;padding:20px 0;">
                    <a href="https://www.facebook.com/citroen.brasil" style="display:inline-block;padding:0 32px;" target="_blank">
                      <img src="https://image.relacionamento.citroen.com.br/lib/fe3411727564047f761378/m/1/21774aad-7fb4-4efb-9bf2-d605d5c0fd7e.png" alt="Facebook" width="40" style="display:block;">
                    </a>
                    <a href="https://www.instagram.com/citroenbrasil" style="display:inline-block;padding:0 32px;" target="_blank">
                      <img src="https://image.relacionamento.citroen.com.br/lib/fe3411727564047f761378/m/1/a621943b-b668-4704-8a24-7c48364df93b.png" alt="Instagram" width="40" style="display:block;">
                    </a>
                    <a href="https://www.youtube.com/citroenbrasil" style="display:inline-block;padding:0 32px;" target="_blank">
                      <img src="https://image.relacionamento.citroen.com.br/lib/fe3411727564047f761378/m/1/beef8f4c-b5b8-4bcf-943f-fd5c97703b69.png" alt="Youtube" width="40" style="display:block;">
                    </a>
                    <a href="https://x.com/citroenbrasil" style="display:inline-block;padding:0 32px;" target="_blank">
                      <img src="https://image.relacionamento.citroen.com.br/lib/fe3411727564047f761378/m/1/d4cd3d5c-a175-4cc2-ac8b-457093873f91.png" alt="X" width="40" style="display:block;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- IBAMA + logo -->
          <tr>
            <td width="600" bgcolor="#F5F5F5">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="padding:20px 32px;">
                    <span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.3;color:#000000;">
                      Desacelere. Seu bem maior é a vida.
                    </span>
                  </td>
                  <td align="right" style="padding:20px 32px;">
                    <img src="https://image.relacionamento.citroen.com.br/lib/fe3411727564047f761378/m/1/b843115a-2883-423f-ae68-a6fa6f36ec15.png"
                      alt="Citroën" width="160" style="display:block;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Legal -->
          <tr>
            <td width="600" bgcolor="#F5F5F5"
              style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.2;color:#000000;padding:24px 32px 50px;text-align:left;">
              {{legalText}}
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
      primary: '#FF0C2D',
      secondary: '#FAF7E6',
      accent: '#FF0C2D',
      background: '#FAF7E6',
      text: '#000000',
      textLight: '#000000',
      buttonBg: '#FF0C2D',
      buttonText: '#FAF7E6',
      headerBg: '#FAF7E6',
      footerBg: '#F5F5F5',
      footerText: '#656565',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
    },
    logoUrl: '/brands/fiat/logo.png',
    logoWidth: 67,
    headerHeight: 0,
    buttonStyle: {
      borderRadius: '0px',
      padding: '0 24px',
      fontSize: '24px',
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    baseTemplate: 'fiat',
    footer: {
      backgroundColor: '#F5F5F5',
      textColor: '#656565',
      html: `
        <!-- FOOTER FIAT -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td bgcolor="#F5F5F5"><div style="line-height:16px;height:16px;font-size:16px">&#8202;</div></td></tr>
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center"
              style="color:#656565;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;padding:48px 40px 20px;text-align:center;font-weight:bold;">
              CENTRAL DE SERVIÇOS AO CLIENTE
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-top:20px;padding-left:54px;" width="300">
                    <table cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;color:#656565;">
                        <b>WHATSAPP FIAT</b><br>
                        <div style="border-top:2px solid #656565;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                        <span style="font-size:18px;">(31) 2123-6000</span>
                      </td>
                    </tr></table>
                  </td>
                  <td align="center" style="padding-top:20px;padding-right:30px;" width="300">
                    <table cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;color:#656565;">
                        <b>TELEFONE</b><br>
                        <div style="border-top:2px solid #656565;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                        <span style="font-size:18px;">0800 007 7128</span>
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center" style="padding:30px 0 20px;">
              <table width="480" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:2px solid #656565;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F5F5F5" align="center">
              <table width="500" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="center" style="font-size:0;padding:20px 0;">
                  <a href="https://www.facebook.com/fiatbr" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/2409fdd9-8656-4715-b72e-6e2117def8d6.png" alt="Facebook" width="45" style="display:block;"></a>
                  <a href="https://www.youtube.com/fiatbr" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/151ae1d7-7669-4fe6-8f8c-b8ebfc97e56b.png" alt="Youtube" width="45" style="display:block;"></a>
                  <a href="https://www.instagram.com/fiatbr" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/afcdb2ae-acea-4e4e-ac74-48c1b41f9ecb.png" alt="Instagram" width="45" style="display:block;"></a>
                  <a href="https://x.com/fiatbr" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/55fc44bf-18b5-44ee-bae2-e68c01578bda.png" alt="X" width="45" style="display:block;"></a>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F5F5F5">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="left" style="padding:20px 0 20px 20px;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.3;color:#000000;">Desacelere. Seu bem maior é a vida.</span>
                </td>
                <td align="right" style="padding:20px 32px;">
                  <img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/abe6da28-3d4d-400f-a148-78c30224523b.png" alt="Fiat" width="67" style="display:block;">
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F5F5F5"
              style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.1;color:#000000;padding:24px 32px 50px;text-align:left;">
              {{legalText}}
            </td>
          </tr>
        </table>`,
    },
    signature: 'Equipe Fiat Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://www.facebook.com/fiatbr', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/2409fdd9-8656-4715-b72e-6e2117def8d6.png' },
      { platform: 'YouTube', url: 'https://www.youtube.com/fiatbr', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/151ae1d7-7669-4fe6-8f8c-b8ebfc97e56b.png' },
      { platform: 'Instagram', url: 'https://www.instagram.com/fiatbr', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/afcdb2ae-acea-4e4e-ac74-48c1b41f9ecb.png' },
      { platform: 'X', url: 'https://x.com/fiatbr', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/55fc44bf-18b5-44ee-bae2-e68c01578bda.png' },
    ],
    legalText: 'Desacelere. Seu bem maior é a vida.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  jeep: {
    id: 'jeep',
    name: 'jeep',
    displayName: 'Jeep',
    colors: {
      primary: '#cc5105',
      secondary: '#662802',
      accent: '#ffe39c',
      background: '#FFF9E7',
      text: '#000000',
      textLight: '#000000',
      buttonBg: '#cc5105',
      buttonText: '#FFFFFF',
      headerBg: '#FFF9E7',
      footerBg: '#FFFFFF',
      footerText: '#656565',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
    },
    logoUrl: '/brands/jeep/logo.png',
    logoWidth: 80,
    headerHeight: 0,
    buttonStyle: {
      borderRadius: '0px',
      padding: '0 24px',
      fontSize: '20px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    baseTemplate: 'jeep',
    footer: {
      backgroundColor: '#FFFFFF',
      textColor: '#656565',
      html: `
        <!-- FOOTER JEEP -->
        <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center"
              style="color:#656565;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;padding:25px 40px 20px;text-align:center;font-weight:bold;">
              CENTRAL DE SERVIÇOS AO CLIENTE
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-top:20px;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;color:#656565;">
                      <b>WHATSAPP JEEP</b><br>
                      <div style="border-top:2px solid #656565;width:40px;margin:4px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <span style="font-size:18px;">(31) 2123-4000</span>
                    </td>
                  </tr></table>
                </td>
                <td align="center" style="padding-top:20px;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;color:#656565;">
                      <b>TELEFONE</b><br>
                      <div style="border-top:2px solid #656565;width:40px;margin:4px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <span style="font-size:18px;">0800 703 7150</span>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
          <tr><td align="center" style="padding:30px 0 20px;">
            <table width="550" cellpadding="0" cellspacing="0">
              <tr><td style="border-top:2px solid #656565;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
          <tr><td align="center">
            <table width="500" cellpadding="0" cellspacing="0"><tr>
              <td align="center" style="font-size:0;padding:20px 0;">
                <a href="https://www.facebook.com/jeepbrasil" style="display:inline-block;padding:0 40px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/2409fdd9-8656-4715-b72e-6e2117def8d6.png" alt="Facebook" width="45" style="display:block;"></a>
                <a href="https://www.youtube.com/jeepbrasil" style="display:inline-block;padding:0 40px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/151ae1d7-7669-4fe6-8f8c-b8ebfc97e56b.png" alt="Youtube" width="45" style="display:block;"></a>
                <a href="https://www.instagram.com/jeepbrasil" style="display:inline-block;padding:0 40px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/afcdb2ae-acea-4e4e-ac74-48c1b41f9ecb.png" alt="Instagram" width="45" style="display:block;"></a>
                <a href="https://x.com/jeepbrasil" style="display:inline-block;padding:0 40px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/55fc44bf-18b5-44ee-bae2-e68c01578bda.png" alt="X" width="45" style="display:block;"></a>
              </td>
            </tr></table>
          </td></tr>
        </table>
        <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="left" style="padding:20px 0 20px 20px;">
              <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.3;color:#000000;">Desacelere. Seu bem maior é a vida.</span>
            </td>
            <td align="right" style="padding:20px;">
              <img src="/brands/jeep/logo.png" alt="Jeep" width="80" style="display:block;">
            </td>
          </tr>
        </table>`,
    },
    signature: 'Equipe Jeep Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://www.facebook.com/jeepbrasil', iconUrl: '' },
      { platform: 'YouTube', url: 'https://www.youtube.com/jeepbrasil', iconUrl: '' },
      { platform: 'Instagram', url: 'https://www.instagram.com/jeepbrasil', iconUrl: '' },
      { platform: 'X', url: 'https://x.com/jeepbrasil', iconUrl: '' },
    ],
    legalText: 'Desacelere. Seu bem maior é a vida.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  peugeot: {
    id: 'peugeot',
    name: 'peugeot',
    displayName: 'Peugeot',
    colors: {
      primary: '#00A3E0',
      secondary: '#191919',
      accent: '#00A3E0',
      background: '#FFFFFF',
      text: '#191919',
      textLight: '#252525',
      buttonBg: '#00A3E0',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      footerBg: '#F5F5F5',
      footerText: '#656565',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, Helvetica, sans-serif' },
    },
    logoUrl: '/brands/peugeot/logo.png',
    logoWidth: 235,
    headerHeight: 0,
    buttonStyle: {
      borderRadius: '0px',
      padding: '0 24px',
      fontSize: '32px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    baseTemplate: 'peugeot',
    footer: {
      backgroundColor: '#F5F5F5',
      textColor: '#656565',
      html: `
        <!-- FOOTER PEUGEOT -->
        <table bgcolor="#f5f5f5" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr><td align="center" style="padding:32px;">
            <img src="https://image.relacionamento.peugeot.com.br/lib/fe3311727564047f761379/m/1/98030793-1a8c-4eaa-99b4-341798b288c9.png"
              alt="Logo Peugeot" style="border:0;display:block;margin:0;width:235px;">
          </td></tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="600" bgcolor="#f5f5f5" align="center"
              style="color:#656565;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.2;padding:20px 40px;text-align:center;font-weight:bold;">
              CENTRAL DE SERVIÇOS AO CLIENTE
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#f5f5f5" align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="center" style="padding-top:20px;padding-left:64px;" width="300">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;color:#656565;">
                      <b>WHATSAPP<br>PEUGEOT</b>
                      <div style="border-top:2px solid #656565;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <a href="tel:11989208825" style="color:#656565;font-size:14px;text-decoration:none;">(11) 98920-8825</a>
                    </td>
                  </tr></table>
                </td>
                <td align="center" style="padding-top:20px;padding-right:64px;" width="300">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;color:#656565;">
                      <b>TELEFONE</b>
                      <div style="border-top:2px solid #656565;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <a href="tel:08007032424" style="color:#656565;font-size:14px;text-decoration:none;">0800 703 2424</a>
                    </td>
                  </tr></table>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr><td bgcolor="#f5f5f5"><div style="line-height:32px;height:32px;font-size:32px">&#8202;</div></td></tr>
          <tr>
            <td align="center" style="padding:0;" bgcolor="#f5f5f5">
              <table cellspacing="0" cellpadding="0" border="0" width="480" bgcolor="#f5f5f5">
                <tr><td width="480" style="border-top:2px solid #656565;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr><td bgcolor="#f5f5f5"><div style="line-height:16px;height:16px;font-size:16px">&#8202;</div></td></tr>
          <tr>
            <td width="600" bgcolor="#f5f5f5" align="center">
              <table width="500" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="center" style="font-size:0;padding:20px 0;">
                  <a href="https://www.facebook.com/peugeotbrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/7721128f-22ba-4cb4-9f2f-770b345e4a18.png" alt="Facebook" width="40" style="display:block;"></a>
                  <a href="https://www.youtube.com/peugeotbrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/5994d725-b606-4359-80f4-94995bee3de6.png" alt="Youtube" width="40" style="display:block;"></a>
                  <a href="https://www.instagram.com/peugeotbrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/e5cc3198-9f91-4952-863a-ebd386c1335f.png" alt="Instagram" width="40" style="display:block;"></a>
                  <a href="https://x.com/peugeotbrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/8d8bc6e1-243e-4110-92fd-cfab774bc0b9.png" alt="X" width="40" style="display:block;"></a>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#f5f5f5">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="left" style="padding:20px 32px;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#191919;">Desacelere. Seu bem maior é a vida.</span>
                </td>
                <td align="right" style="padding:20px 32px;">
                  <img src="https://image.relacionamento.peugeot.com.br/lib/fe3311727564047f761379/m/1/22c4fc7e-cad5-40ca-9516-007cf480b999.png"
                    alt="Peugeot" width="156" style="display:block;">
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#f5f5f5"
              style="color:#191919;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.2;padding:24px 32px;text-align:left;">
              {{legalText}}
            </td>
          </tr>
        </table>`,
    },
    signature: 'Equipe Peugeot Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://www.facebook.com/peugeotbrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/7721128f-22ba-4cb4-9f2f-770b345e4a18.png' },
      { platform: 'YouTube', url: 'https://www.youtube.com/peugeotbrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/5994d725-b606-4359-80f4-94995bee3de6.png' },
      { platform: 'Instagram', url: 'https://www.instagram.com/peugeotbrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/e5cc3198-9f91-4952-863a-ebd386c1335f.png' },
      { platform: 'X', url: 'https://x.com/peugeotbrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe9912747463077d74/m/1/8d8bc6e1-243e-4110-92fd-cfab774bc0b9.png' },
    ],
    legalText: 'Desacelere. Seu bem maior é a vida.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  ram: {
    id: 'ram',
    name: 'ram',
    displayName: 'RAM',
    colors: {
      primary: '#918155',
      secondary: '#000000',
      accent: '#918155',
      background: '#FFFFFF',
      text: '#000000',
      textLight: '#918155',
      buttonBg: '#918155',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      footerBg: '#F9F9F9',
      footerText: '#000000',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/ram/logo.png',
    logoWidth: 162,
    headerHeight: 0,
    buttonStyle: {
      borderRadius: '0px',
      padding: '0 24px',
      fontSize: '16px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    baseTemplate: 'ram',
    footer: {
      backgroundColor: '#F9F9F9',
      textColor: '#000000',
      html: `
        <!-- FOOTER RAM -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="600" bgcolor="#F9F9F9" align="center"
              style="color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;padding:48px 40px 20px;text-align:center;font-weight:bold;">
              CENTRAL DE SERVIÇOS AO CLIENTE
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F9F9F9" align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="center" style="padding-top:20px;padding-left:64px;" width="300">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;color:#000000;">
                      <b>WHATSAPP RAM</b>
                      <div style="border-top:2px solid #000000;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <span style="font-size:14px;">(31) 2123-8000</span>
                    </td>
                  </tr></table>
                </td>
                <td align="right" style="padding-top:20px;padding-right:64px;" width="300">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;color:#000000;">
                      <b>TELEFONE</b>
                      <div style="border-top:2px solid #000000;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <span style="font-size:14px;">0800 730 7660</span>
                    </td>
                  </tr></table>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr><td bgcolor="#F9F9F9"><div style="line-height:16px;height:16px;font-size:16px">&#8202;</div></td></tr>
          <tr>
            <td align="center" style="padding:0;" bgcolor="#F9F9F9">
              <table cellspacing="0" cellpadding="0" border="0" width="480">
                <tr><td width="480" style="border-top:2px solid #000000;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr><td bgcolor="#F9F9F9"><div style="line-height:16px;height:16px;font-size:16px">&#8202;</div></td></tr>
          <tr>
            <td width="600" bgcolor="#F9F9F9" align="center">
              <table width="500" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="center" style="font-size:0;padding:20px 0;">
                  <a href="https://www.facebook.com/ramdobrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/769dc7a3-55d3-4d58-af5f-b67779a3a099.png" alt="Facebook" width="40" style="display:block;"></a>
                  <a href="https://www.youtube.com/user/RAMdoBrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/e891472b-0531-46c5-8403-644d77e26b99.png" alt="Youtube" width="40" style="display:block;"></a>
                  <a href="https://www.instagram.com/ramdobrasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/c670c040-9352-4291-8286-87ab6d8666b0.png" alt="Instagram" width="40" style="display:block;"></a>
                  <a href="https://www.linkedin.com/company/ram-brasil" style="display:inline-block;padding:0 32px;" target="_blank"><img src="https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/556b7728-144d-4e4c-8568-31979c263807.png" alt="LinkedIn" width="40" style="display:block;"></a>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td width="600" bgcolor="#F9F9F9">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="left" style="padding:20px 32px;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.3;color:#000000;">Desacelere. Seu bem maior é a vida.</span>
                </td>
                <td align="right" style="padding:20px 32px;">
                  <img src="https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/046e06f7-3a85-4d16-9a38-50e12776f53b.png"
                    alt="RAM" width="162" style="display:block;">
                </td>
              </tr></table>
            </td>
          </tr>
        </table>`,
    },
    signature: 'Equipe RAM Brasil',
    socialLinks: [
      { platform: 'Facebook', url: 'https://www.facebook.com/ramdobrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/769dc7a3-55d3-4d58-af5f-b67779a3a099.png' },
      { platform: 'YouTube', url: 'https://www.youtube.com/user/RAMdoBrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/e891472b-0531-46c5-8403-644d77e26b99.png' },
      { platform: 'Instagram', url: 'https://www.instagram.com/ramdobrasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/c670c040-9352-4291-8286-87ab6d8666b0.png' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/ram-brasil', iconUrl: 'https://image.s6.sfmc-content.com/lib/fe931274746c017c76/m/1/556b7728-144d-4e4c-8568-31979c263807.png' },
    ],
    legalText: 'Desacelere. Seu bem maior é a vida.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },

  leapmotor: {
    id: 'leapmotor',
    name: 'leapmotor',
    displayName: 'Leapmotor',
    colors: {
      primary: '#12472e',
      secondary: '#e2dfd5',
      accent: '#12472D',
      background: '#FFFFFF',
      text: '#052923',
      textLight: '#e2dfd5',
      buttonBg: '#12472e',
      buttonText: '#e2dfd5',
      headerBg: '#12472D',
      footerBg: '#F5F5F5',
      footerText: '#656565',
    },
    fonts: {
      heading: { family: 'Arial', fallback: 'Arial, sans-serif' },
      body: { family: 'Arial', fallback: 'Arial, sans-serif' },
    },
    logoUrl: '/brands/leapmotor/logo.png',
    logoWidth: 350,
    headerHeight: 0,
    buttonStyle: {
      borderRadius: '0px',
      padding: '0 24px',
      fontSize: '24px',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    baseTemplate: 'leapmotor',
    footer: {
      backgroundColor: '#F5F5F5',
      textColor: '#656565',
      html: `
        <!-- FOOTER LEAPMOTOR -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="600" align="center" style="vertical-align:middle;background-color:#f5f5f5;" bgcolor="#f5f5f5">
              <div style="line-height:24px;height:24px;font-size:24px">&#8202;</div>
              <img src="http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/ccb96c80-55d3-49ed-a51e-d7ff7749e2a9.png"
                width="350" border="0" style="width:100%;max-width:350px;height:auto;display:block;margin:0 auto;">
              <div style="line-height:32px;height:32px;font-size:32px">&#8202;</div>
              <div style="text-align:center;">
                <span style="color:#656565;font-weight:700;font-family:Arial,Arial,sans-serif;font-size:20px;line-height:103%;">CENTRAL DE SERVIÇOS AO CLIENTE</span>
              </div>
              <div style="line-height:40px;height:40px;font-size:40px">&#8202;</div>
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr><td width="100%" align="center" style="padding-left:32px;padding-right:32px;">
                  <table border="0" cellpadding="0" cellspacing="0"><tr>
                    <td style="vertical-align:middle;font-family:Arial,Arial,sans-serif;font-size:20px;line-height:103%;color:#656565;">
                      <b>WHATSAPP<br>LEAPMOTOR</b>
                      <div style="border-top:2px solid #656565;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <span style="color:#656565;font-family:Arial,Arial,sans-serif;font-size:16px;line-height:120%;">(31) 97155-3700</span>
                    </td>
                    <td style="width:32px;min-width:32px;">&#8202;</td>
                    <td style="vertical-align:middle;font-family:Arial,Arial,sans-serif;font-size:20px;line-height:103%;color:#656565;">
                      <b>TELEFONE</b>
                      <div style="border-top:2px solid #656565;width:40px;margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
                      <span style="color:#656565;font-family:Arial,Arial,sans-serif;font-size:16px;line-height:120%;">0800 028 6060</span>
                    </td>
                  </tr></table>
                </td></tr>
              </table>
              <div style="line-height:32px;height:32px;font-size:32px">&#8202;</div>
              <table width="454" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr><td style="border-top:2px solid #5b5b5b;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <div style="line-height:32px;height:32px;font-size:32px">&#8202;</div>
              <!-- Redes: TikTok, YouTube, Instagram, LinkedIn -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
                <td style="vertical-align:middle;" width="40" align="center">
                  <a href="https://www.tiktok.com/@leapmotorbrasil" target="_blank" style="border:0;margin:0;text-decoration:none;">
                    <img src="http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/96c09a7c-107f-43cd-ba80-f74707f77356.png" width="40" border="0" style="min-width:40px;width:40px;height:auto;display:block;">
                  </a>
                </td>
                <td style="width:64px;min-width:64px;">&#8202;</td>
                <td style="vertical-align:middle;" width="40" align="center">
                  <a href="https://www.youtube.com/@leapmotorbrasil" target="_blank" style="border:0;margin:0;text-decoration:none;">
                    <img src="http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/0f1dcd3e-232d-45c7-9465-19d8b881e02d.png" width="40" border="0" style="min-width:40px;width:40px;height:auto;display:block;">
                  </a>
                </td>
                <td style="width:64px;min-width:64px;">&#8202;</td>
                <td style="vertical-align:middle;" width="40" align="center">
                  <a href="https://www.instagram.com/leapmotorbrasil" target="_blank" style="margin:0;border:0;text-decoration:none;">
                    <img src="http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/5b928904-b27a-4973-808a-683fe5e15d53.png" width="40" border="0" style="min-width:40px;width:40px;height:auto;display:block;">
                  </a>
                </td>
                <td style="width:64px;min-width:64px;">&#8202;</td>
                <td style="vertical-align:middle;" width="40" align="center">
                  <a href="https://www.linkedin.com/company/leapmotor-brasil" target="_blank" style="border:0;margin:0;text-decoration:none;">
                    <img src="http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/051846c3-6800-4563-b6ce-9a56e154d754.png" width="40" border="0" style="min-width:40px;width:40px;height:auto;display:block;">
                  </a>
                </td>
              </tr></table>
              <div style="line-height:16px;height:16px;font-size:16px">&#8202;</div>
            </td>
          </tr>
          <tr>
            <td width="600" style="vertical-align:middle;background-color:#f5f5f5;padding-left:32px;padding-right:32px;" bgcolor="#f5f5f5">
              <table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>
                <td style="vertical-align:middle;" width="250">
                  <span style="color:#000000;font-family:Arial,Arial,sans-serif;font-size:12px;line-height:normal;">Desacelere. Seu bem maior é a vida.</span>
                </td>
                <td>&#8202;</td>
                <td style="vertical-align:middle;" width="190">
                  <img src="http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/a74614d7-42e8-47de-867f-0d60c3c590cb.png"
                    width="190" border="0" style="min-width:190px;width:190px;height:auto;display:block;">
                </td>
              </tr></table>
              <div style="line-height:16px;height:16px;font-size:16px">&#8202;</div>
            </td>
          </tr>
          <tr>
            <td style="vertical-align:middle;padding-left:32px;padding-right:32px;" align="center">
              <div style="text-align:left;letter-spacing:0;line-height:1;">
                <span style="color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:400;">{{legalText}}</span>
              </div>
            </td>
          </tr>
          <tr><td><div style="line-height:56px;height:56px;font-size:56px">&#8202;</div></td></tr>
        </table>`,
    },
    signature: 'Equipe Leapmotor Brasil',
    socialLinks: [
      { platform: 'TikTok', url: 'https://www.tiktok.com/@leapmotorbrasil', iconUrl: 'http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/96c09a7c-107f-43cd-ba80-f74707f77356.png' },
      { platform: 'YouTube', url: 'https://www.youtube.com/@leapmotorbrasil', iconUrl: 'http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/0f1dcd3e-232d-45c7-9465-19d8b881e02d.png' },
      { platform: 'Instagram', url: 'https://www.instagram.com/leapmotorbrasil', iconUrl: 'http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/5b928904-b27a-4973-808a-683fe5e15d53.png' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/leapmotor-brasil', iconUrl: 'http://image.relacionamento.leapmotor.com.br/lib/fe921274746c017c71/m/1/051846c3-6800-4563-b6ce-9a56e154d754.png' },
    ],
    legalText: 'Desacelere. Seu bem maior é a vida.',
    unsubscribeText: 'Para descadastrar, <a href="{{unsubscribeUrl}}">clique aqui</a>.',
  },
}

export function getBrand(id: BrandId): BrandConfig {
  return BRANDS[id]
}

export const BRAND_LIST = Object.values(BRANDS)

export const BRAND_COLORS_MAP: Record<BrandId, string> = {
  citroen: '#E21017',
  fiat: '#FF0C2D',
  jeep: '#cc5105',
  peugeot: '#00A3E0',
  ram: '#918155',
  leapmotor: '#12472e',
}
