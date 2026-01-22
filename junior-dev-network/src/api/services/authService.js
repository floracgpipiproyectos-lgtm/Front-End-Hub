import apiClient from '../apiClient'
import { AUTH_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Servicio de autenticación
 * Maneja todas las operaciones relacionadas con autenticación y autorización
 */
export const authService = {
  /**
   * Registro de nuevo usuario
   * @param {Object} userData - Datos del usuario (email, password, alias, etc.)
   * @returns {Promise} Respuesta con token y datos del usuario
   */
  register: async (userData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData)
    return response.data
  },

  /**
   * Inicio de sesión
   * @param {Object} credentials - Credenciales (email, password)
   * @returns {Promise} Respuesta con token y datos del usuario
   */
  login: async (credentials) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials)
    const { token, refreshToken, user } = response.data
    
    // Guardar tokens en localStorage
    if (token) localStorage.setItem('authToken', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    
    return { token, refreshToken, user }
  },

  /**
   * Cerrar sesión
   * @returns {Promise} Respuesta del servidor
   */
  logout: async () => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
    
    // Eliminar tokens del localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    
    return response.data
  },

  /**
   * Refrescar token de autenticación
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise} Nuevo token de acceso
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    })
    
    const { token } = response.data
    if (token) localStorage.setItem('authToken', token)
    
    return response.data
  },

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise} Respuesta del servidor
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    })
    return response.data
  },

  /**
   * Restablecer contraseña
   * @param {Object} resetData - Datos de restablecimiento (token, newPassword)
   * @returns {Promise} Respuesta del servidor
   */
  resetPassword: async (resetData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData)
    return response.data
  },

  /**
   * Verificar email
   * @param {string} token - Token de verificación
   * @returns {Promise} Respuesta del servidor
   */
  verifyEmail: async (token) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token })
    return response.data
  },

  /**
   * Autenticación con LinkedIn OAuth
   * @param {string} code - Código de autorización de LinkedIn
   * @returns {Promise} Respuesta con token y datos del usuario
   */
  loginWithLinkedIn: async (code) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.OAUTH_LINKEDIN, { code })
    const { token, refreshToken, user } = response.data
    
    if (token) localStorage.setItem('authToken', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    
    return { token, refreshToken, user }
  },

  /**
   * Autenticación con GitHub OAuth
   * @param {string} code - Código de autorización de GitHub
   * @returns {Promise} Respuesta con token y datos del usuario
   */
  loginWithGitHub: async (code) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.OAUTH_GITHUB, { code })
    const { token, refreshToken, user } = response.data
    
    if (token) localStorage.setItem('authToken', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    
    return { token, refreshToken, user }
  },

  /**
   * Obtener usuario actual autenticado
   * @returns {Promise} Datos del usuario
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
