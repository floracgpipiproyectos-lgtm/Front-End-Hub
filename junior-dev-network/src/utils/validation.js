/**
 * @fileoverview Funciones de validación reutilizables
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida fortaleza de contraseña
 * @param {string} password - Contraseña a validar
 * @returns {boolean} true si cumple con los requisitos
 */
export const validatePassword = (password) => {
  // Mínimo 8 caracteres, al menos una mayúscula, minúscula, número y símbolo especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  return passwordRegex.test(password) && password.length >= 8
}

/**
 * Valida tipo de archivo contra tipos permitidos
 * @param {File} file - Archivo a validar
 * @param {string[]} allowedTypes - Tipos MIME permitidos
 * @returns {boolean} true si el tipo es válido
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const mainType = type.split('/')[0]
      return file.type.startsWith(mainType)
    }
    return file.type === type
  })
}

/**
 * Valida tamaño de archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean} true si el tamaño es válido
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize
}

/**
 * Convierte bytes a formato legible
 * @param {number} bytes - Bytes a convertir
 * @returns {string} Tamaño formateado
 */
export const getFileSizeReadable = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Valida alias de usuario
 * @param {string} alias - Alias a validar
 * @returns {boolean} true si es válido
 */
export const validateAlias = (alias) => {
  const aliasRegex = /^[a-zA-Z0-9_]+$/
  return aliasRegex.test(alias) && alias.length >= 3 && alias.length <= 30
}

/**
 * Valida URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida
 */
export const validateUrl = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return urlRegex.test(url)
}

/**
 * Valida rango numérico
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en rango
 */
export const validateRange = (value, min, max) => {
  return value >= min && value <= max
}

/**
 * Valida longitud de string
 * @param {string} str - String a validar
 * @param {number} minLength - Longitud mínima
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si la longitud es válida
 */
export const validateLength = (str, minLength, maxLength) => {
  const length = str.length
  return length >= minLength && length <= maxLength
}
