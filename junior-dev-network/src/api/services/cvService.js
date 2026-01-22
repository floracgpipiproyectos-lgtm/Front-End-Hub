import apiClient from '../apiClient'
import { CV_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de análisis de CV
 * Maneja la subida, análisis y extracción de información de CVs
 */
export const cvService = {
  /**
   * Subir CV (PDF/DOC)
   * @param {File} file - Archivo del CV
   * @param {Function} onUploadProgress - Callback para progreso de subida
   * @returns {Promise} Respuesta con ID del CV subido
   */
  uploadCV: async (file, onUploadProgress) => {
    const formData = new FormData()
    formData.append('cv', file)

    const response = await apiClient.post(CV_ENDPOINTS.UPLOAD, formData, {
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
   * Analizar CV subido
   * @param {string} cvId - ID del CV subido
   * @returns {Promise} Resultado del análisis
   */
  analyzeCV: async (cvId) => {
    const response = await apiClient.post(CV_ENDPOINTS.ANALYZE, { cvId })
    return response.data
  },

  /**
   * Obtener análisis de CV por ID
   * @param {string} analysisId - ID del análisis
   * @returns {Promise} Datos del análisis
   */
  getAnalysis: async (analysisId) => {
    const endpoint = buildEndpoint(CV_ENDPOINTS.GET_ANALYSIS, { id: analysisId })
    const response = await apiClient.get(endpoint)
    return response.data
  },

  /**
   * Obtener skills extraídas del CV
   * @returns {Promise} Lista de skills detectadas
   */
  getSkills: async () => {
    const response = await apiClient.get(CV_ENDPOINTS.GET_SKILLS)
    return response.data
  },

  /**
   * Actualizar skills del usuario
   * @param {Array<string>} skills - Lista de skills
   * @returns {Promise} Skills actualizadas
   */
  updateSkills: async (skills) => {
    const response = await apiClient.put(CV_ENDPOINTS.UPDATE_SKILLS, { skills })
    return response.data
  },

  /**
   * Obtener sugerencias basadas en el CV
   * @param {Object} options - Opciones de sugerencias
   * @returns {Promise} Sugerencias de proyectos, skills, etc.
   */
  getSuggestions: async (options = {}) => {
    const response = await apiClient.get(CV_ENDPOINTS.GET_SUGGESTIONS, {
      params: options,
    })
    return response.data
  },
}
