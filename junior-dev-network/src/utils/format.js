/**
 * @fileoverview Funciones de formateo y transformación de datos
 */

/**
 * Formatea fecha para display
 * @param {Date|string|number} date - Fecha a formatear
 * @param {string} format - Formato deseado ('short', 'long', 'relative')
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return ''

  const d = new Date(date)

  if (isNaN(d.getTime())) return 'Fecha inválida'

  switch (format) {
    case 'short':
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

    case 'long':
      return d.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

    case 'relative':
      return formatRelativeDate(d)

    case 'time':
      return d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })

    case 'datetime':
      return d.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

    default:
      return d.toLocaleDateString('es-ES')
  }
}

/**
 * Formatea fecha relativa (hace X tiempo)
 * @param {Date} date - Fecha a comparar
 * @returns {string} Fecha relativa
 */
export const formatRelativeDate = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`

  return formatDate(date, 'short')
}

/**
 * Capitaliza primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Convierte string a kebab-case
 * @param {string} str - String a convertir
 * @returns {string} String en kebab-case
 */
export const kebabCase = (str) => {
  if (!str) return ''
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convierte string a camelCase
 * @param {string} str - String a convertir
 * @returns {string} String en camelCase
 */
export const camelCase = (str) => {
  if (!str) return ''
  return str
    .replace(/^\w|[A-Z]|\b\w/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
}

/**
 * Trunca texto a longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo (default: '...')
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Formatea número como porcentaje
 * @param {number} value - Valor numérico
 * @param {number} decimals - Decimales (default: 1)
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Formatea número con separadores de miles
 * @param {number} num - Número a formatear
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} Número formateado
 */
export const formatNumber = (num, locale = 'es-ES') => {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Formatea bytes a unidades legibles
 * @param {number} bytes - Bytes
 * @param {number} decimals - Decimales (default: 2)
 * @returns {string} Tamaño formateado
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Formatea duración en segundos a formato legible
 * @param {number} seconds - Segundos
 * @returns {string} Duración formateada
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Formatea skills como string separado por comas
 * @param {string[]} skills - Array de skills
 * @param {number} maxItems - Máximo de items a mostrar
 * @returns {string} Skills formateados
 */
export const formatSkills = (skills, maxItems = 3) => {
  if (!skills || skills.length === 0) return 'Sin skills especificados'

  const visibleSkills = skills.slice(0, maxItems)
  const remaining = skills.length - maxItems

  let result = visibleSkills.join(', ')

  if (remaining > 0) {
    result += ` y ${remaining} más`
  }

  return result
}

/**
 * Genera slug URL-friendly
 * @param {string} text - Texto a convertir
 * @returns {string} Slug generado
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Formatea precio con símbolo de moneda
 * @param {number} amount - Monto
 * @param {string} currency - Moneda (default: 'EUR')
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} Precio formateado
 */
export const formatCurrency = (amount, currency = 'EUR', locale = 'es-ES') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}
