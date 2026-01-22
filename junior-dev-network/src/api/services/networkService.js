import apiClient from '../apiClient'
import { NETWORK_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de networking
 * Maneja mentores, comunidades, conexiones y mensajería
 */
export const networkService = {
  /**
   * Obtiene una lista de mentores disponibles con filtros opcionales.
   * Los mentores se ordenan por relevancia basada en skills y ubicación del usuario.
   * 
   * @param {Object} [filters={}] - Filtros para buscar mentores
   * @param {Array<string>} [filters.skills] - Skills específicas del mentor
   * @param {string} [filters.location] - Ubicación del mentor (ciudad, país)
   * @param {boolean} [filters.available] - Solo mentores disponibles actualmente
   * @param {number} [filters.limit=20] - Número máximo de resultados
   * @returns {Promise<Array<{id: string, name: string, alias: string, 
   *                          skills: Array, location: string, 
   *                          availability: boolean, rating: number, 
   *                          menteesCount: number}>>} 
   *          Array de mentores que coinciden con los filtros
   * 
   * @example
   * const mentors = await networkService.getMentors({
   *   skills: ['React', 'TypeScript'],
   *   location: 'Buenos Aires',
   *   available: true
   * })
   */
  getMentors: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_MENTORS, {
      params: filters,
    })
    return response.data
  },

  /**
   * Obtener mentor por ID
   * @param {string} mentorId - ID del mentor
   * @returns {Promise} Datos del mentor
   */
  getMentorById: async (mentorId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.GET_MENTOR_BY_ID, { id: mentorId })
    const response = await apiClient.get(endpoint)
    return response.data
  },

  /**
   * Solicitar mentoría
   * @param {string} mentorId - ID del mentor
   * @param {Object} requestData - Datos de la solicitud (message, goals, etc.)
   * @returns {Promise} Confirmación de solicitud
   */
  requestMentor: async (mentorId, requestData = {}) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.REQUEST_MENTOR, { id: mentorId })
    const response = await apiClient.post(endpoint, requestData)
    return response.data
  },

  /**
   * Obtener comunidades disponibles
   * @param {Object} filters - Filtros (topic, platform, etc.)
   * @returns {Promise} Lista de comunidades
   */
  getCommunities: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_COMMUNITIES, {
      params: filters,
    })
    return response.data
  },

  /**
   * Unirse a una comunidad
   * @param {string} communityId - ID de la comunidad
   * @returns {Promise} Confirmación de unión
   */
  joinCommunity: async (communityId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.JOIN_COMMUNITY, { id: communityId })
    const response = await apiClient.post(endpoint)
    return response.data
  },

  /**
   * Obtener conexiones del usuario
   * @param {Object} filters - Filtros (status, type, etc.)
   * @returns {Promise} Lista de conexiones
   */
  getConnections: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_CONNECTIONS, {
      params: filters,
    })
    return response.data
  },

  /**
   * Enviar solicitud de conexión
   * @param {Object} connectionData - Datos de la conexión (userId, message)
   * @returns {Promise} Confirmación de solicitud
   */
  sendConnectionRequest: async (connectionData) => {
    const response = await apiClient.post(
      NETWORK_ENDPOINTS.SEND_CONNECTION_REQUEST,
      connectionData
    )
    return response.data
  },

  /**
   * Aceptar solicitud de conexión
   * @param {string} connectionId - ID de la conexión
   * @returns {Promise} Confirmación de aceptación
   */
  acceptConnection: async (connectionId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.ACCEPT_CONNECTION, {
      id: connectionId,
    })
    const response = await apiClient.post(endpoint)
    return response.data
  },

  /**
   * Rechazar solicitud de conexión
   * @param {string} connectionId - ID de la conexión
   * @returns {Promise} Confirmación de rechazo
   */
  rejectConnection: async (connectionId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.REJECT_CONNECTION, {
      id: connectionId,
    })
    const response = await apiClient.post(endpoint)
    return response.data
  },

  /**
   * Obtener mensajes
   * @param {Object} filters - Filtros (userId, unread, etc.)
   * @returns {Promise} Lista de mensajes
   */
  getMessages: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_MESSAGES, {
      params: filters,
    })
    return response.data
  },

  /**
   * Enviar mensaje
   * @param {Object} messageData - Datos del mensaje (recipientId, content, etc.)
   * @returns {Promise} Mensaje enviado
   */
  sendMessage: async (messageData) => {
    const response = await apiClient.post(NETWORK_ENDPOINTS.SEND_MESSAGE, messageData)
    return response.data
  },
}
