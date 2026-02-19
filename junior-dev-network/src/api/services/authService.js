// authService.js - VERSIÓN ACTUALIZADA CON SEGURIDAD MEJORADA
// noinspection JSValidateJSDoc,GrazieInspection

import apiClient from '../apiClient'
import { AUTH_ENDPOINTS } from '@/constants/apiEndpoints'
import { STORAGE_KEYS, API_CONFIG } from '@/constants/apiConfig'
import { VALIDATION_RULES, VALIDATION_HELPERS } from '@/constants/validationRules'
import { CACHE_CONFIG } from '@/constants/cacheConfig'
import { secureStorage } from '@/utils/security'

// =============================================
// ESTRUCTURAS DE DATOS Y CONSTANTES
// =============================================

// ELIMINAMOS las constantes locales y usamos las centralizadas
const TOKEN_KEYS = {
  AUTH: STORAGE_KEYS.AUTH_TOKEN,
  REFRESH: STORAGE_KEYS.REFRESH_TOKEN
}

/**
 * Wrapper seguro para almacenamiento de tokens
 * Ahora usa encriptación para mayor seguridad
 * @type {Object}
 */
const STORAGE = {
  /**
   * Guarda un token de forma segura con encriptación
   */
  set: (key, value) => {
    if (value) {
      secureStorage.setItem(key, value)
    }
  },
  
  /**
   * Obtiene un token con validación de timeout
   */
  get: (key) => {
    // Usar el timeout de autenticación configurado
    return secureStorage.getItem(key, API_CONFIG.TIMEOUTS.AUTH)
  },
  
  /**
   * Elimina todos los tokens de autenticación
   */
  clearTokens: () => {
    secureStorage.clearTokens([TOKEN_KEYS.AUTH, TOKEN_KEYS.REFRESH])
  }
}

// =============================================
// HELPERS INTERNOS ACTUALIZADOS
// =============================================

/**
 * Valida las credenciales antes de enviarlas
 * @private
 * @param {UserCredentials} credentials
 * @returns {{isValid: boolean, errors: string[]}}
 */
const validateCredentials = (credentials) => {
  const errors = []
  
  if (!VALIDATION_HELPERS.validateEmail(credentials.email)) {
    errors.push(VALIDATION_RULES.USER.EMAIL.MESSAGE.INVALID)
  }
  
  if (credentials.password.length < VALIDATION_RULES.USER.PASSWORD.MIN_LENGTH) {
    errors.push(VALIDATION_RULES.USER.PASSWORD.MESSAGE.LENGTH)
  }
  
  if (!VALIDATION_HELPERS.validatePassword(credentials.password)) {
    errors.push(VALIDATION_RULES.USER.PASSWORD.MESSAGE.COMPLEXITY)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Valida datos de registro antes de enviarlos
 * @private
 * @param {UserData} userData
 * @returns {{isValid: boolean, errors: string[]}}
 */
const validateRegistrationData = (userData) => {
  const errors = []
  
  // Validar alias
  if (!userData.alias || userData.alias.length < 3) {
    errors.push('El alias debe tener al menos 3 caracteres')
  }
  
  // Validar email
  if (!VALIDATION_HELPERS.validateEmail(userData.email)) {
    errors.push(VALIDATION_RULES.USER.EMAIL.MESSAGE.INVALID)
  }
  
  // Validar contraseña
  if (userData.password.length < VALIDATION_RULES.USER.PASSWORD.MIN_LENGTH) {
    errors.push(VALIDATION_RULES.USER.PASSWORD.MESSAGE.LENGTH)
  }
  
  if (!VALIDATION_HELPERS.validatePassword(userData.password)) {
    errors.push(VALIDATION_RULES.USER.PASSWORD.MESSAGE.COMPLEXITY)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Procesa la respuesta de autenticación con configuración mejorada
 * @private
 * @param {AuthResponse} responseData
 * @returns {{token: *, refreshToken: *, user: *}}
 */
const handleAuthResponse = (responseData) => {
  const { token, refreshToken, user } = responseData
  
  // Guardar tokens con configuración de timeout
  STORAGE.set(TOKEN_KEYS.AUTH, token)
  STORAGE.set(TOKEN_KEYS.REFRESH, refreshToken)
  
  // Guardar datos del usuario con timestamp
  localStorage.setItem(
    STORAGE_KEYS.USER_DATA, 
    JSON.stringify({
      ...user,
      _cachedAt: Date.now()
    })
  )
  
  return { token, refreshToken, user }
}

// =============================================
// SERVICIO ACTUALIZADO
// =============================================

export const authService = {
  // =============================================
  // OPERACIONES PRINCIPALES (ACTUALIZADAS)
  // =============================================
  
  /**
   * Registra un nuevo usuario con validación mejorada
   */
  registerUser: async (userData) => {
    // Validar datos del usuario antes de enviar
    const validation = validateRegistrationData(userData)
    if (!validation.isValid) {
      throw new Error(`Validación falló: ${validation.errors.join(', ')}`)
    }
    
    // Usar timeout específico para registro
    const response = await apiClient.post(
      AUTH_ENDPOINTS.REGISTER, 
      userData,
      { timeout: API_CONFIG.TIMEOUTS.AUTH }
    )
    return handleAuthResponse(response.data)
  },
  
  /**
   * Inicia sesión con validación y manejo de errores mejorado
   */
  login: async (credentials) => {
    // Validar credenciales
    const validation = validateCredentials(credentials)
    if (!validation.isValid) {
      throw new Error(`Credenciales inválidas: ${validation.errors.join(', ')}`)
    }
    
    try {
      const response = await apiClient.post(
        AUTH_ENDPOINTS.LOGIN, 
        credentials,
        { 
          timeout: API_CONFIG.TIMEOUTS.AUTH,
          maxRetryAttempts: API_CONFIG.RETRY_CONFIG.AUTH.MAX_ATTEMPTS
        }
      )
      return handleAuthResponse(response.data)
    } catch (error) {
      // Manejo específico de errores de autenticación
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas')
      }
      if (error.response?.status === 429) {
        throw new Error('Demasiados intentos. Intenta más tarde')
      }
      throw error
    }
  },
  
  /**
   * Cierra sesión con limpieza completa
   */
  logout: async () => {
    try {
      const response = await apiClient.post(
        AUTH_ENDPOINTS.LOGOUT,
        {},
        { timeout: API_CONFIG.TIMEOUTS.AUTH }
      )
      
      // Limpieza completa de almacenamiento
      STORAGE.clearTokens()
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT)
      
      return response.data
    } catch (error) {
      // Aún así limpiamos localmente si falla el logout remoto
      STORAGE.clearTokens()
      throw error
    }
  },
  
  /**
   * Refresca el token con reintentos configurados
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post(
        AUTH_ENDPOINTS.REFRESH_TOKEN, 
        { refreshToken },
        { 
          timeout: API_CONFIG.TIMEOUTS.AUTH,
          maxRetryAttempts: API_CONFIG.RETRY_CONFIG.DEFAULT.MAX_ATTEMPTS
        }
      )
      
      const { token } = response.data
      if (token) {
        STORAGE.set(TOKEN_KEYS.AUTH, token)
      }
      
      return response.data
    } catch (error) {
      // Si falla el refresh, forzar logout
      STORAGE.clearTokens()
      throw error
    }
  },
  
  // =============================================
  // OPERACIONES DE RECUPERACIÓN (ACTUALIZADAS)
  // =============================================
  
  // =============================================
  // UTILIDADES MEJORADAS
  // =============================================
  
  /**
   * Verifica si hay un usuario autenticado con sesión válida
   */
  isAuthenticated: () => {
    const token = STORAGE.get(TOKEN_KEYS.AUTH)
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    
    if (!token || !userData) return false
    
    try {
      const user = JSON.parse(userData)
      // Verificar si la caché está expirada
      if (user._cachedAt && (Date.now() - user._cachedAt) > CACHE_CONFIG.TTL.USER_DATA) {
        return false
      }
    } catch {
      return false
    }
    
    return true
  },
  
  /**
   * Obtiene el usuario desde cache con validación
   */
  getCachedUser: () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      if (!userData) return null
      
      const user = JSON.parse(userData)
      
      // Verificar expiración
      if (user._cachedAt && (Date.now() - user._cachedAt) > CACHE_CONFIG.TTL.USER_DATA) {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        return null
      }
      
      // Remover metadatos internos
      delete user._cachedAt
      return user
    } catch (error) {
      console.error('Error obteniendo usuario cacheado:', error)
      return null
    }
  },
  
  /**
   * Obtiene la edad del token en minutos
   * @private
   */
  getTokenAge: () => {
    const timestamp = localStorage.getItem(`${TOKEN_KEYS.AUTH}_timestamp`)
    if (!timestamp) return null
    return Math.floor((Date.now() - parseInt(timestamp)) / (1000 * 60))
  }
}