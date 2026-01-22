import apiClient from '../apiClient'
import { CV_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de análisis de CV
 * Maneja la subida, análisis y extracción de información de CVs
 */
export const cvService = {
  /**
   * Sube un archivo de CV (PDF o DOC) al servidor para su procesamiento posterior.
   * Soporta seguimiento del progreso de subida mediante callback.
   * 
   * @param {File} file - Archivo del CV en formato PDF o DOC/DOCX
   * @param {Function} [onUploadProgress] - Callback opcional que recibe el porcentaje de progreso (0-100)
   * @returns {Promise<{cvId: string, fileName: string, fileSize: number, uploadedAt: string}>} 
   *          Objeto con el ID del CV subido, nombre del archivo, tamaño y fecha de subida
   * @throws {Error} Si el archivo no es válido o la subida falla
   * 
   * @example
   * const handleUpload = async (file) => {
   *   const onProgress = (percent) => console.log(`Progreso: ${percent}%`)
   *   const result = await cvService.uploadCV(file, onProgress)
   *   console.log('CV subido con ID:', result.cvId)
   * }
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
   * Inicia el análisis automático de un CV previamente subido.
   * Utiliza OCR y NLP para extraer información relevante como skills, experiencia y educación.
   * 
   * @param {string} cvId - ID único del CV obtenido de la función uploadCV
   * @returns {Promise<{analysisId: string, status: string, skills: string[], experience: Array, education: Array, estimatedLevel: string}>} 
   *          Objeto con el ID del análisis, estado, skills detectadas, experiencia, educación y nivel estimado
   * @throws {Error} Si el CV no existe o el análisis falla
   * 
   * @example
   * const analysis = await cvService.analyzeCV('cv-123')
   * console.log('Skills detectadas:', analysis.skills)
   */
  analyzeCV: async (cvId) => {
    const response = await apiClient.post(CV_ENDPOINTS.ANALYZE, { cvId })
    return response.data
  },

  /**
   * Obtiene los resultados completos de un análisis de CV por su ID.
   * Útil para consultar análisis asíncronos o recuperar resultados previos.
   * 
   * @param {string} analysisId - ID único del análisis obtenido de analyzeCV
   * @returns {Promise<{id: string, cvId: string, status: 'pending'|'processing'|'completed'|'failed', 
   *                    skills: Array<{name: string, level: string, confidence: number}>, 
   *                    experience: Array, education: Array, 
   *                    suggestions: Array, createdAt: string, completedAt: string}>} 
   *          Objeto completo con todos los datos del análisis
   * @throws {Error} Si el análisis no existe
   * 
   * @example
   * const analysis = await cvService.getAnalysis('analysis-456')
   * if (analysis.status === 'completed') {
   *   console.log('Análisis completado:', analysis.skills)
   * }
   */
  getAnalysis: async (analysisId) => {
    const endpoint = buildEndpoint(CV_ENDPOINTS.GET_ANALYSIS, { id: analysisId })
    const response = await apiClient.get(endpoint)
    return response.data
  },

  /**
   * Obtiene todas las skills extraídas del CV del usuario actual.
   * Retorna las skills detectadas automáticamente más las agregadas manualmente.
   * 
   * @returns {Promise<Array<{id: string, name: string, level: 'beginner'|'intermediate'|'advanced', 
   *                          source: 'cv'|'manual', confidence?: number}>>} 
   *          Array de objetos con información detallada de cada skill
   * @throws {Error} Si el usuario no está autenticado
   * 
   * @example
   * const skills = await cvService.getSkills()
   * const advancedSkills = skills.filter(s => s.level === 'advanced')
   */
  getSkills: async () => {
    const response = await apiClient.get(CV_ENDPOINTS.GET_SKILLS)
    return response.data
  },

  /**
   * Actualiza la lista de skills del usuario.
   * Reemplaza completamente las skills existentes con las nuevas proporcionadas.
   * 
   * @param {Array<string>|Array<{name: string, level?: string}>} skills - 
   *        Array de strings con nombres de skills o array de objetos con name y level opcional
   * @returns {Promise<{skills: Array, updatedAt: string}>} 
   *          Objeto con las skills actualizadas y fecha de actualización
   * @throws {Error} Si la validación de skills falla
   * 
   * @example
   * // Con array de strings
   * await cvService.updateSkills(['React', 'JavaScript', 'TypeScript'])
   * 
   * // Con array de objetos
   * await cvService.updateSkills([
   *   { name: 'React', level: 'advanced' },
   *   { name: 'JavaScript', level: 'intermediate' }
   * ])
   */
  updateSkills: async (skills) => {
    const response = await apiClient.put(CV_ENDPOINTS.UPDATE_SKILLS, { skills })
    return response.data
  },

  /**
   * Obtiene sugerencias personalizadas basadas en el análisis del CV del usuario.
   * Incluye recomendaciones de proyectos, skills a desarrollar, mentores y comunidades.
   * 
   * @param {Object} [options={}] - Opciones para filtrar las sugerencias
   * @param {Array<string>} [options.types] - Tipos de sugerencias: 'projects', 'skills', 'mentors', 'communities'
   * @param {number} [options.limit=10] - Número máximo de sugerencias por tipo
   * @param {string} [options.priority] - Prioridad: 'skills' o 'projects'
   * @returns {Promise<{projects: Array, skills: Array, mentors: Array, communities: Array}>} 
   *          Objeto con arrays de sugerencias organizadas por tipo
   * @throws {Error} Si no hay CV analizado o el usuario no está autenticado
   * 
   * @example
   * const suggestions = await cvService.getSuggestions({ 
   *   types: ['projects', 'skills'],
   *   limit: 5 
   * })
   * console.log('Proyectos sugeridos:', suggestions.projects)
   */
  getSuggestions: async (options = {}) => {
    const response = await apiClient.get(CV_ENDPOINTS.GET_SUGGESTIONS, {
      params: options,
    })
    return response.data
  },
}
