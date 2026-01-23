// Rutas de assets del proyecto
// En Vite, las importaciones de assets se resuelven automáticamente
// Estas constantes proporcionan rutas centralizadas para facilitar el uso
//
// Ejemplos de uso:
// import { ICONS, ILLUSTRATIONS, ASSETS } from '@/constants'
// 
// // Uso directo
// <img src={ICONS.LOGO} alt="Logo" />
// <img src={ILLUSTRATIONS.EMPTY_STATE} alt="Estado vacío" />
//
// // Uso con objeto consolidado
// <img src={ASSETS.ICONS.LOGO} alt="Logo" />
// <img src={ASSETS.ILLUSTRATIONS.SUCCESS} alt="Éxito" />
//
// // Uso con helper
// import { getAsset } from '@/constants'
// <img src={getAsset('illustration', 'SUCCESS')} alt="Éxito" />

// Icons
import logoIcon from '@/assets/icons/logo.svg'
import logoIconSmall from '@/assets/icons/logo-icon.svg'

// Images - Hero
import heroBanner from '@/assets/images/hero/hero-banner.svg'

// Images - Illustrations
import emptyStateIllustration from '@/assets/images/illustrations/empty-state.svg'
import successIllustration from '@/assets/images/illustrations/success.svg'
import errorIllustration from '@/assets/images/illustrations/error.svg'

// Images - Avatars
import defaultAvatar from '@/assets/images/avatars/default-avatar.svg'

// Images - Backgrounds
import gradientBackground from '@/assets/images/backgrounds/gradient-bg.svg'

// Exportar como constantes organizadas
export const ICONS = {
  LOGO: logoIcon,
  LOGO_ICON: logoIconSmall,
}

export const HERO_IMAGES = {
  BANNER: heroBanner,
}

export const ILLUSTRATIONS = {
  EMPTY_STATE: emptyStateIllustration,
  SUCCESS: successIllustration,
  ERROR: errorIllustration,
}

export const AVATARS = {
  DEFAULT: defaultAvatar,
}

export const BACKGROUNDS = {
  GRADIENT: gradientBackground,
}

// Objeto consolidado para acceso fácil
export const ASSETS = {
  ICONS,
  HERO_IMAGES,
  ILLUSTRATIONS,
  AVATARS,
  BACKGROUNDS,
}

// Helper para obtener asset por tipo y nombre
export const getAsset = (type, name) => {
  const assetMap = {
    icon: ICONS,
    hero: HERO_IMAGES,
    illustration: ILLUSTRATIONS,
    avatar: AVATARS,
    background: BACKGROUNDS,
  }
  
  return assetMap[type]?.[name] || null
}
