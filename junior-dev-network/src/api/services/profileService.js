import apiClient from '../apiClient'
import { PROFILE_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de perfil de usuario
 * Maneja la obtención y actualización de perfiles
 */
export const profileService = {
  /**
   * Obtiene el perfil completo del usuario actualmente autenticado.
   * Incluye información personal, skills, proyectos, badges y estadísticas.
   * 
   * @returns {Promise<{id: string, email: string, alias: string, 
   *                   fullName?: string, avatar?: string, bio?: string,
   *                   skills: Array, projects: Array, badges: Array,
   *                   location?: string, website?: string, 
   *                   socialLinks: Object, createdAt: string}>} 
   *          Objeto con todos los datos del perfil del usuario
   * @throws {Error} Si el usuario no está autenticado
   * 
   * @example
   * const profile = await profileService.getProfile()
   * console.log('Perfil:', profile.alias, '- Skills:', profile.skills.length)
   */
  getProfile: async () => {
    const response = await apiClient.get(PROFILE_ENDPOINTS.GET_PROFILE)
    return response.data
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} profileData - Datos del perfil a actualizar
   * @returns {Promise} Perfil actualizado
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put(PROFILE_ENDPOINTS.UPDATE_PROFILE, profileData)
    return response.data
  },

  /**
   * Obtener perfil público por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise} Datos del perfil público
   */
  getPublicProfile: async (userId) => {
    const endpoint = buildEndpoint(PROFILE_ENDPOINTS.GET_PUBLIC_PROFILE, { id: userId })
    const response = await apiClient.get(endpoint)
    return response.data
  },

  /**
   * Subir avatar
   * @param {File} file - Archivo de imagen
   * @param {Function} onUploadProgress - Callback para progreso de subida
   * @returns {Promise} URL del avatar subido
   */
  uploadAvatar: async (file, onUploadProgress) => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post(PROFILE_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onUploadProgress(percentCompleted)
        }
      },
    })

    return response.data
  },

  /**
   * Actualizar preferencias del usuario
   * @param {Object} preferences - Preferencias (notifications, privacy, etc.)
   * @returns {Promise} Preferencias actualizadas
   */
  updatePreferences: async (preferences) => {
    const response = await apiClient.put(PROFILE_ENDPOINTS.UPDATE_PREFERENCES, preferences)
    return response.data
  },

  /**
   * Eliminar cuenta del usuario
   * @param {Object} confirmationData - Datos de confirmación
   * @returns {Promise} Confirmación de eliminación
   */
  deleteAccount: async (confirmationData) => {
    const response = await apiClient.delete(PROFILE_ENDPOINTS.DELETE_ACCOUNT, {
      data: confirmationData,
    })
    return response.data
  },
}
