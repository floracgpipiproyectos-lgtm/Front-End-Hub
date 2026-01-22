import apiClient from '../apiClient'
import { PROJECT_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de proyectos
 * Maneja la obtención, búsqueda y gestión de proyectos
 */
export const projectService = {
  /**
   * Obtener todos los proyectos
   * @param {Object} filters - Filtros (page, limit, skills, level, etc.)
   * @returns {Promise} Lista de proyectos
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
   * Obtener proyectos recomendados para el usuario
   * @param {Object} options - Opciones de recomendación
   * @returns {Promise} Lista de proyectos recomendados
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
   * Unirse a un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise} Confirmación de unión
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
