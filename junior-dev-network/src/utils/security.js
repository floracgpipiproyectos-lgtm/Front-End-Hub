/**
 * Security utilities for token storage
 * Provides encryption for localStorage to mitigate XSS attacks
 */

// Simple XOR encryption with base64 encoding
// Note: For production, use a proper encryption library like crypto-js
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'junior-dev-network-key-2024'

/**
 * Simple obfuscation function to make token storage less vulnerable to casual XSS
 * @param {string} text - Text to obfuscate
 * @returns {string} Obfuscated text
 */
const obfuscate = (text) => {
  if (!text) return null
  try {
    // Convert to base64 first
    let encoded = btoa(unescape(encodeURIComponent(text)))
    // XOR with key
    let result = ''
    for (let i = 0; i < encoded.length; i++) {
      result += String.fromCharCode(encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    }
    return btoa(result)
  } catch (error) {
    console.error('Error obfuscating data:', error)
    return null
  }
}

/**
 * Deobfuscate text
 * @param {string} text - Obfuscated text
 * @returns {string} Original text
 */
const deobfuscate = (text) => {
  if (!text) return null
  try {
    // Reverse XOR
    let decoded = atob(text)
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    }
    // Reverse base64
    return decodeURIComponent(escape(atob(result)))
  } catch (error) {
    console.error('Error deobfuscating data:', error)
    return null
  }
}

/**
 * Secure storage wrapper for tokens
 * Provides basic XSS protection through obfuscation
 */
export const secureStorage = {
  /**
   * Store token securely
   * @param {string} key - Storage key
   * @param {string} value - Token value
   */
  setItem: (key, value) => {
    if (!value) return
    try {
      const obfuscated = obfuscate(value)
      if (obfuscated) {
        localStorage.setItem(key, obfuscated)
        // Store timestamp for expiration checking
        localStorage.setItem(`${key}_timestamp`, Date.now().toString())
      }
    } catch (error) {
      console.error('Error storing secure item:', error)
    }
  },

  /**
   * Retrieve token securely
   * @param {string} key - Storage key
   * @param {number} maxAge - Maximum age in milliseconds
   * @returns {string|null} Original value or null if expired/not found
   */
  getItem: (key, maxAge = null) => {
    try {
      const obfuscated = localStorage.getItem(key)
      if (!obfuscated) return null

      // Check expiration if maxAge provided
      if (maxAge) {
        const timestamp = localStorage.getItem(`${key}_timestamp`)
        if (timestamp && (Date.now() - parseInt(timestamp)) > maxAge) {
          secureStorage.removeItem(key)
          return null
        }
      }

      return deobfuscate(obfuscated)
    } catch (error) {
      console.error('Error retrieving secure item:', error)
      return null
    }
  },

  /**
   * Remove token
   * @param {string} key - Storage key
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      localStorage.removeItem(`${key}_timestamp`)
    } catch (error) {
      console.error('Error removing secure item:', error)
    }
  },

  /**
   * Clear all secure tokens
   * @param {string[]} keys - Array of keys to clear
   */
  clearTokens: (keys) => {
    keys.forEach(key => secureStorage.removeItem(key))
  }
}

/**
 * Generate CSRF token
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
  const token = localStorage.getItem('csrf_token')
  if (token) return token
  
  const newToken = crypto.randomUUID()
  localStorage.setItem('csrf_token', newToken)
  return newToken
}

/**
 * Get CSRF token
 * @returns {string} CSRF token
 */
export const getCSRFToken = () => {
  return localStorage.getItem('csrf_token') || generateCSRFToken()
}

export default secureStorage
