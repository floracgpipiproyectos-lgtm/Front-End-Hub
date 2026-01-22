import apiClient from '../apiClient'
import { AUTH_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Servicio de autenticación
 * Maneja todas las operaciones relacionadas con autenticación y autorización
 */
export const authService = {
  /**
   * Registra un nuevo usuario en la plataforma.
   * Crea una cuenta y retorna los tokens de autenticación.
   * 
   * @param {Object} userData - Datos del usuario para registro
   * @param {string} userData.email - Email del usuario (requerido)
   * @param {string} userData.password - Contraseña (mínimo 8 caracteres, requerido)
   * @param {string} userData.alias - Nombre público/alias del usuario (requerido)
   * @param {string} [userData.fullName] - Nombre completo (opcional)
   * @returns {Promise<{token: string, refreshToken: string, user: Object}>} 
   *          Objeto con tokens de autenticación y datos del usuario creado
   * @throws {Error} Si el email ya existe, la contraseña es inválida o faltan campos requeridos
   * 
   * @example
   * const result = await authService.register({
   *   email: 'user@example.com',
   *   password: 'securePassword123',
   *   alias: 'johndoe',
   *   fullName: 'John Doe'
   * })
   * console.log('Usuario registrado:', result.user)
   */
  register: async (userData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData)
    return response.data
  },

  /**
   * Inicia sesión con email y contraseña.
   * Los tokens se guardan automáticamente en localStorage.
   * 
   * @param {Object} credentials - Credenciales de acceso
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<{token: string, refreshToken: string, user: Object}>} 
   *          Objeto con tokens de autenticación y datos del usuario
   * @throws {Error} Si las credenciales son incorrectas o el usuario no existe
   * 
   * @example
   * const { token, user } = await authService.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * })
   * // Token guardado automáticamente en localStorage
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
   * Cierra la sesión del usuario actual.
   * Invalida los tokens en el servidor y los elimina del localStorage.
   * 
   * @returns {Promise<{message: string}>} Confirmación de cierre de sesión
   * @throws {Error} Si no hay sesión activa o el servidor rechaza la petición
   * 
   * @example
   * await authService.logout()
   * // Tokens eliminados automáticamente del localStorage
   */
  logout: async () => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
    
    // Eliminar tokens del localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    
    return response.data
  },

  /**
   * Refresca el token de acceso usando el refresh token.
   * Útil cuando el token de acceso ha expirado.
   * El nuevo token se guarda automáticamente en localStorage.
   * 
   * @param {string} refreshToken - Token de refresco obtenido durante el login
   * @returns {Promise<{token: string, expiresIn: number}>} 
   *          Nuevo token de acceso y tiempo de expiración
   * @throws {Error} Si el refresh token es inválido o ha expirado
   * 
   * @example
   * const newToken = await authService.refreshToken(refreshToken)
   * // Nuevo token guardado automáticamente
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
   * Obtiene los datos del usuario actualmente autenticado.
   * Requiere token de autenticación válido.
   * 
   * @returns {Promise<{id: string, email: string, alias: string, 
   *                    fullName?: string, avatar?: string, 
   *                    skills: Array, createdAt: string}>} 
   *          Datos completos del usuario autenticado
   * @throws {Error} Si no hay token válido o el usuario no existe
   * 
   * @example
   * const user = await authService.getCurrentUser()
   * console.log('Usuario actual:', user.alias)
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
