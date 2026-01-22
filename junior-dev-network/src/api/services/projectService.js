import apiClient from '../apiClient'
import { PROJECT_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de proyectos
 * Maneja la obtención, búsqueda y gestión de proyectos
 */
export const projectService = {
  /**
   * Obtiene todos los proyectos disponibles con filtros opcionales.
   * Soporta paginación y filtrado por skills, nivel de dificultad, tipo, etc.
   * 
   * @param {Object} [filters={}] - Filtros y opciones de paginación
   * @param {number} [filters.page=1] - Número de página
   * @param {number} [filters.limit=10] - Cantidad de resultados por página
   * @param {Array<string>} [filters.skills] - Skills requeridas para filtrar proyectos
   * @param {string} [filters.level] - Nivel: 'beginner', 'intermediate', 'advanced'
   * @param {string} [filters.type] - Tipo: 'open-source', 'freelance', 'challenge'
   * @returns {Promise<{projects: Array, total: number, page: number, limit: number}>} 
   *          Objeto con array de proyectos y metadatos de paginación
   * 
   * @example
   * const { projects } = await projectService.getAllProjects({
   *   skills: ['React', 'JavaScript'],
   *   level: 'beginner',
   *   page: 1,
   *   limit: 20
   * })
   */
  getAllProjects: async (filters = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.GET_ALL, {
      params: filters,
    })
    return response.data
  },

  /**
   * Obtener proyecto por ID
   * @param {string} projectId - ID del proyecto
   * @returns {Promise} Datos del proyecto
   */
  getProjectById: async (projectId) => {
    const endpoint = buildEndpoint(PROJECT_ENDPOINTS.GET_BY_ID, { id: projectId })
    const response = await apiClient.get(endpoint)
    return response.data
  },

  /**
   * Obtiene proyectos recomendados personalizados para el usuario actual.
   * Utiliza el algoritmo de matching basado en skills del usuario y nivel de experiencia.
   * 
   * @param {Object} [options={}] - Opciones de recomendación
   * @param {number} [options.limit=10] - Número máximo de recomendaciones
   * @param {boolean} [options.includeJoined=false] - Incluir proyectos en los que ya está unido
   * @returns {Promise<Array<{id: string, title: string, description: string, 
   *                          skills: Array, level: string, matchScore: number, 
   *                          type: string, url: string}>>} 
   *          Array de proyectos recomendados ordenados por relevancia
   * @throws {Error} Si el usuario no está autenticado o no tiene CV analizado
   * 
   * @example
   * const recommended = await projectService.getRecommendedProjects({ limit: 5 })
   * console.log('Proyectos recomendados:', recommended)
   */
  getRecommendedProjects: async (options = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.GET_RECOMMENDED, {
      params: options,
    })
    return response.data
  },

  /**
   * Obtener proyectos open-source
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} Lista de proyectos open-source
   */
  getOpenSourceProjects: async (filters = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.GET_OPEN_SOURCE, {
      params: filters,
    })
    return response.data
  },

  /**
   * Obtener oportunidades freelance
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} Lista de proyectos freelance
   */
  getFreelanceProjects: async (filters = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.GET_FREELANCE, {
      params: filters,
    })
    return response.data
  },

  /**
   * Obtener challenges educativos
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} Lista de challenges
   */
  getChallenges: async (filters = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.GET_CHALLENGES, {
      params: filters,
    })
    return response.data
  },

  /**
   * Permite al usuario unirse a un proyecto.
   * Agrega el proyecto a la lista de proyectos activos del usuario.
   * 
   * @param {string} projectId - ID único del proyecto al que se desea unir
   * @returns {Promise<{message: string, project: Object, joinedAt: string}>} 
   *          Confirmación de unión con datos del proyecto y fecha
   * @throws {Error} Si el proyecto no existe, ya está unido, o requiere permisos especiales
   * 
   * @example
   * await projectService.joinProject('project-123')
   * // Proyecto agregado a la lista de proyectos activos
   */
  joinProject: async (projectId) => {
    const endpoint = buildEndpoint(PROJECT_ENDPOINTS.JOIN_PROJECT, { id: projectId })
    const response = await apiClient.post(endpoint)
    return response.data
  },

  /**
   * Abandonar un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise} Confirmación de abandono
   */
  leaveProject: async (projectId) => {
    const endpoint = buildEndpoint(PROJECT_ENDPOINTS.LEAVE_PROJECT, { id: projectId })
    const response = await apiClient.post(endpoint)
    return response.data
  },

  /**
   * Marcar proyecto como completado
   * @param {string} projectId - ID del proyecto
   * @param {Object} completionData - Datos de completación
   * @returns {Promise} Confirmación de completación
   */
  completeProject: async (projectId, completionData = {}) => {
    const endpoint = buildEndpoint(PROJECT_ENDPOINTS.COMPLETE_PROJECT, { id: projectId })
    const response = await apiClient.post(endpoint, completionData)
    return response.data
  },

  /**
   * Obtener proyectos del usuario actual
   * @param {Object} filters - Filtros (status, type, etc.)
   * @returns {Promise} Lista de proyectos del usuario
   */
  getUserProjects: async (filters = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.GET_USER_PROJECTS, {
      params: filters,
    })
    return response.data
  },

  /**
   * Buscar proyectos
   * @param {string} query - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} Resultados de búsqueda
   */
  searchProjects: async (query, filters = {}) => {
    const response = await apiClient.get(PROJECT_ENDPOINTS.SEARCH, {
      params: { q: query, ...filters },
    })
    return response.data
  },
}
