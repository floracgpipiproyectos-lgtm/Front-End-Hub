import apiClient from '../apiClient'
import { AUTH_ENDPOINTS } from '@/constants/apiEndpoints'

// =============================================
// ESTRUCTURAS DE DATOS Y CONSTANTES
// =============================================

/**
 * @typedef {Object} UserCredentials
 * @property {string} email - Email del usuario
 * @property {string} password - Contraseña del usuario
 */

/**
 * @typedef {Object} UserData
 * @property {string} email - Email del usuario
 * @property {string} password - Contraseña del usuario
 * @property {string} alias - Alias/nombre público
 * @property {string} [fullName] - Nombre completo (opcional)
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - Token de autenticación
 * @property {string} refreshToken - Token de refresco
 * @property {Object} user - Datos del usuario
 */

/**
 * @typedef {Object} ResetPasswordData
 * @property {string} token - Token de restablecimiento
 * @property {string} newPassword - Nueva contraseña
 */

/**
 * Claves de almacenamiento para tokens
 * @enum {string}
 */
const TOKEN_KEYS = {
  AUTH: 'authToken',
  REFRESH: 'refreshToken'
}

/**
 * Wrapper para localStorage con interfaz consistente
 * @type {Object}
 */
const STORAGE = {
  /**
   * Guarda un token en localStorage
   * @param {string} key - Clave del token
   * @param {string} value - Valor del token
   */
  set: (key, value) => {
    if (value) localStorage.setItem(key, value)
  },
  
  /**
   * Obtiene un token de localStorage
   * @param {string} key - Clave del token
   * @returns {string|null} Token o null
   */
  get: (key) => localStorage.getItem(key),
  
  /**
   * Elimina un token de localStorage
   * @param {string} key - Clave del token
   */
  remove: (key) => localStorage.removeItem(key),
  
  /**
   * Elimina todos los tokens de autenticación
   */
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEYS.AUTH)
    localStorage.removeItem(TOKEN_KEYS.REFRESH)
  }
}

// =============================================
// HELPERS INTERNOS
// =============================================

/**
 * Procesa la respuesta de autenticación y guarda los tokens
 * @private
 * @param {AuthResponse} responseData - Datos de respuesta
 * @returns {AuthResponse} Datos procesados
 */
const handleAuthResponse = (responseData) => {
  const { token, refreshToken, user } = responseData
  
  STORAGE.set(TOKEN_KEYS.AUTH, token)
  STORAGE.set(TOKEN_KEYS.REFRESH, refreshToken)
  
  return { token, refreshToken, user }
}

// =============================================
// FACTORY METHODS
// =============================================

/**
 * Factory para crear instancias de authService con diferentes configuraciones
 */
export const AuthServiceFactory = {
  /**
   * Crea una instancia estándar de authService
   * @returns {Object} Instancia de authService
   */
  createDefault: () => authService,
  
  /**
   * Crea una instancia con URL base personalizada
   * @param {string} baseUrl - URL base personalizada
   * @returns {Object} Instancia de authService
   */
  createWithCustomConfig: (baseUrl) => {
    // En una implementación real, aquí se configuraría un apiClient personalizado
    return authService
  }
}

// =============================================
// SERVICIO DE AUTENTICACIÓN PRINCIPAL
// =============================================

/**
 * Servicio de autenticación para JuniorDev Network
 * Implementa patrones de diseño y principios SOLID
 */
export const authService = {
  // =============================================
  // OPERACIONES PRINCIPALES
  // =============================================
  
  /**
   * Registra un nuevo usuario en la plataforma
   * @param {UserData} userData - Datos del usuario
   * @returns {Promise<AuthResponse>} Respuesta con tokens y usuario
   * @throws {Error} Si el registro falla
   * 
   * @example
   * const response = await authService.registerUser({
   *   email: 'dev@junior.com',
   *   password: 'SecurePass123',
   *   alias: 'juniorDev',
   *   fullName: 'Junior Developer'
   * })
   */
  registerUser: async (userData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData)
    return handleAuthResponse(response.data)
  },
  
  /**
   * Inicia sesión con credenciales de usuario
   * @param {UserCredentials} credentials - Credenciales del usuario
   * @returns {Promise<AuthResponse>} Respuesta con tokens y usuario
   * @throws {Error} Si las credenciales son incorrectas
   * 
   * @example
   * const response = await authService.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * })
   */
  login: async (credentials) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials)
    return handleAuthResponse(response.data)
  },
  
  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<Object>} Confirmación del logout
   * @throws {Error} Si no hay sesión activa
   * 
   * @example
   * await authService.logout()
   */
  logout: async () => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
    STORAGE.clearTokens()
    return response.data
  },
  
  /**
   * Refresca el token de acceso usando el refresh token
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<Object>} Nuevo token y tiempo de expiración
   * @throws {Error} Si el refresh token es inválido
   * 
   * @example
   * const newToken = await authService.refreshToken('old-refresh-token')
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken })
    
    const { token } = response.data
    if (token) {
      STORAGE.set(TOKEN_KEYS.AUTH, token)
    }
    
    return response.data
  },
  
  // =============================================
  // OPERACIONES DE RECUPERACIÓN
  // =============================================
  
  /**
   * Solicita recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Confirmación del envío
   * 
   * @example
   * await authService.forgotPassword('user@example.com')
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email })
    return response.data
  },
  
  /**
   * Restablece la contraseña del usuario
   * @param {ResetPasswordData} resetData - Datos para restablecimiento
   * @returns {Promise<Object>} Confirmación del cambio
   * 
   * @example
   * await authService.resetPassword({
   *   token: 'reset-token-123',
   *   newPassword: 'NewSecurePass456'
   * })
   */
  resetPassword: async (resetData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData)
    return response.data
  },
  
  /**
   * Verifica dirección de email
   * @param {string} token - Token de verificación
   * @returns {Promise<Object>} Confirmación de verificación
   * 
   * @example
   * await authService.verifyEmail('verification-token-123')
   */
  verifyEmail: async (token) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token })
    return response.data
  },
  
  // =============================================
  // AUTENTICACIÓN CON OAUTH
  // =============================================
  
  /**
   * Autenticación con LinkedIn OAuth
   * @param {string} code - Código de autorización de LinkedIn
   * @returns {Promise<AuthResponse>} Respuesta con tokens y usuario
   * 
   * @example
   * const response = await authService.loginWithLinkedIn('linkedin-auth-code')
   */
  loginWithLinkedIn: async (code) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.OAUTH_LINKEDIN, { code })
    return handleAuthResponse(response.data)
  },
  
  /**
   * Autenticación con GitHub OAuth
   * @param {string} code - Código de autorización de GitHub
   * @returns {Promise<AuthResponse>} Respuesta con tokens y usuario
   * 
   * @example
   * const response = await authService.loginWithGitHub('github-auth-code')
   */
  loginWithGitHub: async (code) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.OAUTH_GITHUB, { code })
    return handleAuthResponse(response.data)
  },
  
  // =============================================
  // OPERACIONES DEL USUARIO ACTUAL
  // =============================================
  
  /**
   * Obtiene datos del usuario actualmente autenticado
   * @returns {Promise<Object>} Datos del usuario
   * @throws {Error} Si no hay sesión activa
   * 
   * @example
   * const user = await authService.getCurrentUser()
   * console.log('Usuario:', user.alias)
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
  
  // =============================================
  // UTILIDADES Y GETTERS
  // =============================================
  
  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} True si hay token de autenticación
   * 
   * @example
   * if (authService.isAuthenticated()) {
   *   // Usuario autenticado
   * }
   */
  isAuthenticated: () => {
    return !!STORAGE.get(TOKEN_KEYS.AUTH)
  },
  
  /**
   * Obtiene el token de autenticación actual
   * @returns {string|null} Token de autenticación o null
   * 
   * @example
   * const token = authService.getAuthToken()
   */
  getAuthToken: () => {
    return STORAGE.get(TOKEN_KEYS.AUTH)
  },
  
  /**
   * Obtiene el refresh token actual
   * @returns {string|null} Refresh token o null
   */
  getRefreshToken: () => {
    return STORAGE.get(TOKEN_KEYS.REFRESH)
  },
  
  /**
   * Limpia todos los tokens localmente sin hacer logout en el servidor
   * Útil para limpieza en caso de errores o pruebas
   * 
   * @example
   * authService.clearLocalTokens()
   */
  clearLocalTokens: () => {
    STORAGE.clearTokens()
  }
}

// =============================================
// EXPORTACIONES
// =============================================

/**
 * Servicio de autenticación principal
 * @type {Object}
 */
export default authService

/**
 * Factory para crear instancias personalizadas
 * @type {Object}
 */
export { AuthServiceFactory }