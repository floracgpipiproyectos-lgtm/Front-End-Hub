// networkService.js
import apiClient from '../apiClient'
import { NETWORK_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

// =============================================
// CONSTANTES Y ENUMS
// =============================================

/**
 * Estados posibles de una conexión
 * @enum {string}
 */
export const ConnectionStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
  REMOVED: 'removed'
}

/**
 * Estados de disponibilidad de un mentor
 * @enum {string}
 */
export const MentorAvailability = {
  AVAILABLE: 'available',
  LIMITED: 'limited',
  UNAVAILABLE: 'unavailable',
  ON_VACATION: 'on_vacation'
}

/**
 * Estados de un mensaje
 * @enum {string}
 */
export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
}

/**
 * Tipos de comunidades
 * @enum {string}
 */
export const CommunityType = {
  SKILL_BASED: 'skill_based',
  LOCATION_BASED: 'location_based',
  PROJECT_BASED: 'project_based',
  GENERAL: 'general',
  LANGUAGE: 'language'
}

// =============================================
// ESTRUCTURAS DE DATOS (TYPES)
// =============================================

/**
 * @typedef {Object} Mentor
 * @property {string} id - ID único del mentor
 * @property {string} name - Nombre completo del mentor
 * @property {string} alias - Alias/nombre de usuario
 * @property {string} avatarUrl - URL del avatar
 * @property {string} location - Ubicación del mentor
 * @property {string} bio - Biografía del mentor
 * @property {string[]} skills - Skills del mentor
 * @property {MentorAvailability} availability - Disponibilidad actual
 * @property {number} rating - Calificación promedio (0-5)
 * @property {number} menteesCount - Número de mentees
 * @property {number} yearsOfExperience - Años de experiencia
 * @property {string} currentRole - Rol actual
 * @property {string} company - Empresa actual
 * @property {string[]} expertiseAreas - Áreas de expertise
 * @property {string} availableUntil - Fecha hasta cuando está disponible
 */

/**
 * @typedef {Object} Community
 * @property {string} id - ID único de la comunidad
 * @property {string} name - Nombre de la comunidad
 * @property {string} description - Descripción
 * @property {string} iconUrl - URL del icono
 * @property {CommunityType} type - Tipo de comunidad
 * @property {string[]} topics - Temas de la comunidad
 * @property {string} platform - Plataforma (Slack, Discord, etc.)
 * @property {number} memberCount - Número de miembros
 * @property {boolean} isPublic - Si es pública o privada
 * @property {string} joinLink - Enlace para unirse
 * @property {string} createdAt - Fecha de creación
 */

/**
 * @typedef {Object} Connection
 * @property {string} id - ID único de la conexión
 * @property {string} userId - ID del usuario conectado
 * @property {string} userAlias - Alias del usuario
 * @property {string} userAvatarUrl - Avatar del usuario
 * @property {string[]} commonSkills - Skills en común
 * @property {ConnectionStatus} status - Estado de la conexión
 * @property {string} message - Mensaje de la solicitud
 * @property {string} requestedAt - Fecha de solicitud
 * @property {string} respondedAt - Fecha de respuesta
 * @property {number} interactionScore - Puntaje de interacción
 */

/**
 * @typedef {Object} Message
 * @property {string} id - ID único del mensaje
 * @property {string} conversationId - ID de la conversación
 * @property {string} senderId - ID del remitente
 * @property {string} recipientId - ID del destinatario
 * @property {string} content - Contenido del mensaje
 * @property {MessageStatus} status - Estado del mensaje
 * @property {string} sentAt - Fecha de envío
 * @property {string} deliveredAt - Fecha de entrega
 * @property {string} readAt - Fecha de lectura
 * @property {boolean} isEdited - Si fue editado
 * @property {string[]} attachments - Archivos adjuntos
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id - ID único de la conversación
 * @property {string[]} participantIds - IDs de participantes
 * @property {Message} lastMessage - Último mensaje
 * @property {number} unreadCount - Mensajes no leídos
 * @property {boolean} isGroupChat - Si es chat grupal
 * @property {string} groupName - Nombre del grupo
 * @property {string} groupAvatarUrl - Avatar del grupo
 * @property {string} lastActivityAt - Última actividad
 */

/**
 * @typedef {Object} MentorRequest
 * @property {string} id - ID único de la solicitud
 * @property {string} mentorId - ID del mentor
 * @property {string} menteeId - ID del mentee
 * @property {string} message - Mensaje de la solicitud
 * @property {string[]} goals - Objetivos de la mentoría
 * @property {string} preferredSchedule - Horario preferido
 * @property {number} estimatedDuration - Duración estimada en horas
 * @property {string} requestedAt - Fecha de solicitud
 * @property {string} respondedAt - Fecha de respuesta
 * @property {boolean} isAccepted - Si fue aceptada
 * @property {string} rejectionReason - Razón de rechazo
 */

/**
 * @typedef {Object} MentorFilters
 * @property {string[]} [skills] - Skills a filtrar
 * @property {string} [location] - Ubicación
 * @property {boolean} [availableOnly] - Solo disponibles
 * @property {number} [minRating] - Rating mínimo
 * @property {number} [minExperience] - Experiencia mínima en años
 * @property {number} [limit] - Límite de resultados
 */

/**
 * @typedef {Object} ConnectionFilters
 * @property {ConnectionStatus} [status] - Estado de conexión
 * @property {string} [searchTerm] - Término de búsqueda
 * @property {string[]} [skills] - Skills en común
 * @property {number} [limit] - Límite de resultados
 */

// =============================================
// HELPERS INTERNOS
// =============================================

/**
 * Filtra mentores por criterios
 * @private
 * @param {Mentor[]} mentors - Array de mentores
 * @param {Object} criteria - Criterios de filtrado
 * @returns {Mentor[]} Mentores filtrados
 */
const filterMentors = (mentors, criteria) => {
  return mentors.filter(mentor => {
    // Filtrar por skills si están especificadas
    if (criteria.skills && criteria.skills.length > 0) {
      const hasAnySkill = criteria.skills.some(skill => 
        mentor.skills.includes(skill)
      )
      if (!hasAnySkill) return false
    }
    
    // Filtrar por ubicación
    if (criteria.location && !mentor.location.includes(criteria.location)) {
      return false
    }
    
    // Filtrar por disponibilidad
    if (criteria.availableOnly && mentor.availability !== MentorAvailability.AVAILABLE) {
      return false
    }
    
    // Filtrar por rating mínimo
    if (criteria.minRating && mentor.rating < criteria.minRating) {
      return false
    }
    
    // Filtrar por experiencia mínima
    if (criteria.minExperience && mentor.yearsOfExperience < criteria.minExperience) {
      return false
    }
    
    return true
  })
}

/**
 * Ordena mentores por criterio
 * @private
 * @param {Mentor[]} mentors - Array de mentores
 * @param {string} [sortBy='rating'] - Campo para ordenar
 * @returns {Mentor[]} Mentores ordenados
 */
const sortMentors = (mentors, sortBy = 'rating') => {
  return [...mentors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return b.yearsOfExperience - a.yearsOfExperience
      case 'mentees':
        return b.menteesCount - a.menteesCount
      default:
        return b.rating - a.rating
    }
  })
}

// =============================================
// SERVICIO DE NETWORKING
// =============================================

/**
 * Servicio de networking para JuniorDev Network
 * Maneja mentores, comunidades, conexiones y mensajería
 */
export const networkService = {
  // =============================================
  // OPERACIONES DE MENTORES
  // =============================================
  
  /**
   * Obtiene mentores disponibles con filtros opcionales
   * @param {MentorFilters} [filters={}] - Filtros de búsqueda
   * @returns {Promise<Mentor[]>} Array de mentores
   * @throws {Error} Si la búsqueda falla
   * 
   * @example
   * const mentors = await networkService.getMentors({
   *   skills: ['React', 'TypeScript'],
   *   location: 'Buenos Aires',
   *   availableOnly: true,
   *   minRating: 4.0
   * })
   */
  getMentors: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_MENTORS, {
      params: filters,
    })
    return response.data
  },
  
  /**
   * Obtiene un mentor específico por ID
   * @param {string} mentorId - ID del mentor
   * @returns {Promise<Mentor>} Datos del mentor
   * @throws {Error} Si el mentor no existe
   * 
   * @example
   * const mentor = await networkService.getMentorById('mentor_123')
   * console.log('Mentor:', mentor.name)
   */
  getMentorById: async (mentorId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.GET_MENTOR_BY_ID, { id: mentorId })
    const response = await apiClient.get(endpoint)
    return response.data
  },
  
  /**
   * Solicita mentoría a un mentor
   * @param {string} mentorId - ID del mentor
   * @param {Object} requestData - Datos de la solicitud
   * @returns {Promise<MentorRequest>} Solicitud creada
   * @throws {Error} Si la solicitud falla
   * 
   * @example
   * const request = await networkService.requestMentor('mentor_123', {
   *   message: 'Me gustaría aprender React avanzado',
   *   goals: ['Aprender hooks avanzados', 'Mejorar en testing'],
   *   preferredSchedule: 'Lunes y Miércoles 18-20hs'
   * })
   */
  requestMentor: async (mentorId, requestData = {}) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.REQUEST_MENTOR, { id: mentorId })
    const response = await apiClient.post(endpoint, requestData)
    return response.data
  },
  
  /**
   * Obtiene mentores recomendados basados en el perfil del usuario
   * @param {number} [limit=10] - Límite de resultados
   * @returns {Promise<Mentor[]>} Mentores recomendados
   * 
   * @example
   * const recommended = await networkService.getRecommendedMentors(5)
   */
  getRecommendedMentors: async (limit = 10) => {
    // En una implementación real, esto llamaría a un endpoint específico
    const mentors = await networkService.getMentors()
    return mentors
      .filter(mentor => mentor.availability === MentorAvailability.AVAILABLE)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  },
  
  /**
   * Busca mentores por skill específica
   * @param {string} skill - Skill a buscar
   * @param {MentorFilters} [baseFilters={}] - Filtros adicionales
   * @returns {Promise<Mentor[]>} Mentores con la skill
   * 
   * @example
   * const reactMentors = await networkService.searchMentorsBySkill('React')
   */
  searchMentorsBySkill: async (skill, baseFilters = {}) => {
    const filters = {
      ...baseFilters,
      skills: [skill]
    }
    return networkService.getMentors(filters)
  },
  
  /**
   * Obtiene mentores disponibles en este momento
   * @param {MentorFilters} [baseFilters={}] - Filtros adicionales
   * @returns {Promise<Mentor[]>} Mentores disponibles ahora
   */
  getAvailableMentorsNow: async (baseFilters = {}) => {
    const filters = {
      ...baseFilters,
      availableOnly: true
    }
    return networkService.getMentors(filters)
  },
  
  /**
   * Obtiene solicitudes de mentoría enviadas
   * @returns {Promise<MentorRequest[]>} Solicitudes enviadas
   */
  getSentMentorRequests: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    return Promise.resolve([])
  },
  
  /**
   * Obtiene solicitudes de mentoría recibidas
   * @returns {Promise<MentorRequest[]>} Solicitudes recibidas
   */
  getReceivedMentorRequests: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    return Promise.resolve([])
  },
  
  // =============================================
  // OPERACIONES DE COMUNIDADES
  // =============================================
  
  /**
   * Obtiene comunidades disponibles
   * @param {Object} [filters={}] - Filtros de búsqueda
   * @returns {Promise<Community[]>} Array de comunidades
   * @throws {Error} Si la búsqueda falla
   * 
   * @example
   * const communities = await networkService.getCommunities({
   *   type: 'skill_based',
   *   platform: 'Discord'
   * })
   */
  getCommunities: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_COMMUNITIES, {
      params: filters,
    })
    return response.data
  },
  
  /**
   * Se une a una comunidad
   * @param {string} communityId - ID de la comunidad
   * @returns {Promise<{success: boolean, message: string}>} Confirmación
   * @throws {Error} Si no se puede unir
   * 
   * @example
   * await networkService.joinCommunity('comm_123')
   */
  joinCommunity: async (communityId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.JOIN_COMMUNITY, { id: communityId })
    const response = await apiClient.post(endpoint)
    return response.data
  },
  
  /**
   * Obtiene comunidades del usuario actual
   * @returns {Promise<Community[]>} Comunidades del usuario
   * 
   * @example
   * const myCommunities = await networkService.getUserCommunities()
   */
  getUserCommunities: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    // Por ahora, filtramos de todas las comunidades
    const allCommunities = await networkService.getCommunities()
    return allCommunities.slice(0, 3) // Simulación
  },
  
  /**
   * Busca comunidades por tema específico
   * @param {string} topic - Tema a buscar
   * @returns {Promise<Community[]>} Comunidades con el tema
   * 
   * @example
   * const reactCommunities = await networkService.searchCommunitiesByTopic('React')
   */
  searchCommunitiesByTopic: async (topic) => {
    const communities = await networkService.getCommunities()
    return communities.filter(community => 
      community.topics.includes(topic)
    )
  },
  
  /**
   * Obtiene comunidades recomendadas para el usuario
   * @param {number} [limit=5] - Límite de resultados
   * @returns {Promise<Community[]>} Comunidades recomendadas
   */
  getRecommendedCommunities: async (limit = 5) => {
    const [allCommunities, userCommunities] = await Promise.all([
      networkService.getCommunities(),
      networkService.getUserCommunities()
    ])
    
    // Filtrar comunidades a las que no pertenece
    const userCommunityIds = new Set(userCommunities.map(c => c.id))
    const availableCommunities = allCommunities.filter(
      community => !userCommunityIds.has(community.id)
    )
    
    // Ordenar por popularidad
    const sorted = availableCommunities.sort((a, b) => 
      b.memberCount - a.memberCount
    )
    
    return sorted.slice(0, limit)
  },
  
  /**
   * Crea una nueva comunidad
   * @param {Community} communityData - Datos de la comunidad
   * @returns {Promise<Community>} Comunidad creada
   * @throws {Error} Si la creación falla
   * 
   * @example
   * const newCommunity = await networkService.createCommunity({
   *   name: 'Python Argentina',
   *   description: 'Comunidad de Python en Argentina',
   *   type: CommunityType.LANGUAGE,
   *   platform: 'Discord'
   * })
   */
  createCommunity: async (communityData) => {
    // En una implementación real, esto llamaría a un endpoint específico
    return Promise.resolve({
      ...communityData,
      id: `comm_${Date.now()}`,
      memberCount: 1,
      createdAt: new Date().toISOString()
    })
  },
  
  // =============================================
  // OPERACIONES DE CONEXIONES
  // =============================================
  
  /**
   * Obtiene conexiones del usuario
   * @param {ConnectionFilters} [filters={}] - Filtros de búsqueda
   * @returns {Promise<Connection[]>} Array de conexiones
   * @throws {Error} Si no se pueden obtener las conexiones
   * 
   * @example
   * const connections = await networkService.getConnections({
   *   status: ConnectionStatus.ACCEPTED,
   *   limit: 50
   * })
   */
  getConnections: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_CONNECTIONS, {
      params: filters,
    })
    return response.data
  },
  
  /**
   * Envía solicitud de conexión a un usuario
   * @param {Object} connectionData - Datos de la conexión
   * @returns {Promise<Connection>} Conexión creada
   * @throws {Error} Si la solicitud falla
   * 
   * @example
   * const connection = await networkService.sendConnectionRequest({
   *   userId: 'user_123',
   *   message: 'Hola, veo que trabajamos con tecnologías similares'
   * })
   */
  sendConnectionRequest: async (connectionData) => {
    const response = await apiClient.post(
      NETWORK_ENDPOINTS.SEND_CONNECTION_REQUEST,
      connectionData
    )
    return response.data
  },
  
  /**
   * Acepta una solicitud de conexión
   * @param {string} connectionId - ID de la conexión
   * @returns {Promise<{success: boolean, message: string}>} Confirmación
   * @throws {Error} Si no se puede aceptar
   * 
   * @example
   * await networkService.acceptConnection('conn_123')
   */
  acceptConnection: async (connectionId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.ACCEPT_CONNECTION, {
      id: connectionId,
    })
    const response = await apiClient.post(endpoint)
    return response.data
  },
  
  /**
   * Rechaza una solicitud de conexión
   * @param {string} connectionId - ID de la conexión
   * @returns {Promise<{success: boolean, message: string}>} Confirmación
   * @throws {Error} Si no se puede rechazar
   * 
   * @example
   * await networkService.rejectConnection('conn_123')
   */
  rejectConnection: async (connectionId) => {
    const endpoint = buildEndpoint(NETWORK_ENDPOINTS.REJECT_CONNECTION, {
      id: connectionId,
    })
    const response = await apiClient.post(endpoint)
    return response.data
  },
  
  /**
   * Obtiene conexiones pendientes (solicitudes recibidas)
   * @returns {Promise<Connection[]>} Conexiones pendientes
   */
  getPendingConnections: async () => {
    return networkService.getConnections({
      status: ConnectionStatus.PENDING
    })
  },
  
  /**
   * Obtiene conexiones activas (aceptadas)
   * @returns {Promise<Connection[]>} Conexiones activas
   */
  getActiveConnections: async () => {
    return networkService.getConnections({
      status: ConnectionStatus.ACCEPTED
    })
  },
  
  /**
   * Busca conexiones por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Connection[]>} Conexiones que coinciden
   */
  searchConnections: async (searchTerm) => {
    return networkService.getConnections({
      searchTerm
    })
  },
  
  /**
   * Obtiene sugerencias de conexión
   * @param {number} [limit=10] - Límite de sugerencias
   * @returns {Promise<string[]>} IDs de usuarios sugeridos
   */
  getConnectionSuggestions: async (limit = 10) => {
    // En una implementación real, esto llamaría a un endpoint específico
    return Promise.resolve([])
  },
  
  /**
   * Obtiene estadísticas de conexiones
   * @returns {Promise<Object>} Estadísticas detalladas
   * 
   * @example
   * const stats = await networkService.getConnectionStats()
   * console.log('Total conexiones:', stats.total)
   */
  getConnectionStats: async () => {
    const connections = await networkService.getConnections()
    
    const stats = {
      total: connections.length,
      pending: 0,
      accepted: 0,
      rejected: 0,
      blocked: 0
    }
    
    connections.forEach(connection => {
      switch (connection.status) {
        case ConnectionStatus.PENDING:
          stats.pending++
          break
        case ConnectionStatus.ACCEPTED:
          stats.accepted++
          break
        case ConnectionStatus.REJECTED:
          stats.rejected++
          break
        case ConnectionStatus.BLOCKED:
          stats.blocked++
          break
      }
    })
    
    return stats
  },
  
  /**
   * Verifica si hay conexión con un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<boolean>} true si hay conexión
   */
  isConnectedWithUser: async (userId) => {
    const connections = await networkService.getActiveConnections()
    return connections.some(connection => connection.userId === userId)
  },
  
  // =============================================
  // OPERACIONES DE MENSAJERÍA
  // =============================================
  
  /**
   * Obtiene mensajes de una conversación
   * @param {Object} [filters={}] - Filtros de búsqueda
   * @returns {Promise<Message[]>} Array de mensajes
   * @throws {Error} Si no se pueden obtener los mensajes
   * 
   * @example
   * const messages = await networkService.getMessages({
   *   conversationId: 'conv_123',
   *   limit: 50
   * })
   */
  getMessages: async (filters = {}) => {
    const response = await apiClient.get(NETWORK_ENDPOINTS.GET_MESSAGES, {
      params: filters,
    })
    return response.data
  },
  
  /**
   * Envía un mensaje
   * @param {Object} messageData - Datos del mensaje
   * @returns {Promise<Message>} Mensaje enviado
   * @throws {Error} Si no se puede enviar el mensaje
   * 
   * @example
   * const message = await networkService.sendMessage({
   *   recipientId: 'user_123',
   *   content: 'Hola, ¿cómo estás?',
   *   attachments: ['file1.pdf']
   * })
   */
  sendMessage: async (messageData) => {
    const response = await apiClient.post(NETWORK_ENDPOINTS.SEND_MESSAGE, messageData)
    return response.data
  },
  
  /**
   * Obtiene conversaciones del usuario
   * @returns {Promise<Conversation[]>} Array de conversaciones
   */
  getConversations: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    // Por ahora, usamos los mensajes para inferir conversaciones
    const messages = await networkService.getMessages({ limit: 100 })
    
    // Agrupar mensajes por conversación (simplificado)
    const conversationsMap = new Map()
    
    messages.forEach(message => {
      if (!conversationsMap.has(message.conversationId)) {
        conversationsMap.set(message.conversationId, {
          id: message.conversationId,
          participantIds: [message.senderId, message.recipientId],
          lastMessage: message,
          unreadCount: message.status === MessageStatus.DELIVERED ? 1 : 0,
          isGroupChat: false,
          lastActivityAt: message.sentAt
        })
      }
    })
    
    return Array.from(conversationsMap.values())
  },
  
  /**
   * Obtiene conversación con un usuario específico
   * @param {string} userId - ID del usuario
   * @param {number} [limit=50] - Límite de mensajes
   * @returns {Promise<Message[]>} Mensajes de la conversación
   */
  getConversationWithUser: async (userId, limit = 50) => {
    return networkService.getMessages({
      userId,
      limit
    })
  },
  
  /**
   * Marca mensajes como leídos
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise<{success: boolean}>} Confirmación
   */
  markMessagesAsRead: async (conversationId) => {
    // En una implementación real, esto llamaría a un endpoint específico
    return Promise.resolve({ success: true })
  },
  
  /**
   * Obtiene conversaciones con mensajes no leídos
   * @returns {Promise<Conversation[]>} Conversaciones con mensajes no leídos
   */
  getUnreadConversations: async () => {
    const conversations = await networkService.getConversations()
    return conversations.filter(conv => conv.unreadCount > 0)
  },
  
  /**
   * Obtiene el total de mensajes no leídos
   * @returns {Promise<number>} Total de mensajes no leídos
   */
  getTotalUnreadMessages: async () => {
    const conversations = await networkService.getConversations()
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  },
  
  // =============================================
  // OPERACIONES AVANZADAS DE NETWORKING
  // =============================================
  
  /**
   * Obtiene red de contactos expandida
   * @param {number} [depth=2] - Profundidad de búsqueda
   * @returns {Promise<string[]>} IDs de usuarios en la red expandida
   */
  getExpandedNetwork: async (depth = 2) => {
    // En una implementación real, esto llamaría al backend
    const connections = await networkService.getActiveConnections()
    return connections.map(conn => conn.userId)
  },
  
  /**
   * Encuentra usuarios con skills similares
   * @param {string[]} userSkills - Skills del usuario
   * @param {number} [limit=10] - Límite de resultados
   * @returns {Promise<string[]>} IDs de usuarios con skills similares
   */
  findUsersWithSimilarSkills: async (userSkills, limit = 10) => {
    // En una implementación real, esto usaría un algoritmo de matching
    return networkService.getConnectionSuggestions(limit)
  },
  
  /**
   * Obtiene insights de networking para el usuario
   * @returns {Promise<Object>} Insights personalizados
   */
  getNetworkingInsights: async () => {
    const [
      connectionStats,
      conversations,
      communities,
      mentorRequests
    ] = await Promise.all([
      networkService.getConnectionStats(),
      networkService.getConversations(),
      networkService.getUserCommunities(),
      networkService.getSentMentorRequests()
    ])
    
    return {
      networkSize: connectionStats.total,
      activeConnections: connectionStats.accepted,
      pendingRequests: connectionStats.pending,
      activeConversations: conversations.length,
      communitiesCount: communities.length,
      mentorRequestsSent: mentorRequests.length,
      networkGrowth: '25% este mes', // Simulación
      mostActiveTime: '18:00-22:00' // Simulación
    }
  },
  
  /**
   * Obtiene usuarios destacados en la red
   * @param {number} [limit=5] - Límite de resultados
   * @returns {Promise<Object[]>} Usuarios destacados
   */
  getFeaturedUsers: async (limit = 5) => {
    // En una implementación real, esto llamaría al backend
    const connections = await networkService.getActiveConnections()
    return connections
      .sort((a, b) => b.interactionScore - a.interactionScore)
      .slice(0, limit)
      .map(conn => ({
        id: conn.userId,
        alias: conn.userAlias,
        avatarUrl: conn.userAvatarUrl,
        commonSkills: conn.commonSkills,
        interactionScore: conn.interactionScore
      }))
  }
}

// =============================================
// EXPORTACIONES Y FACTORY
// =============================================

export default networkService

/**
 * Factory para crear servicios de networking personalizados
 */
export const NetworkServiceFactory = {
  /**
   * Crea una instancia estándar del servicio
   * @returns {Object} Instancia de networkService
   */
  createDefault: () => networkService,
  
  /**
   * Crea una instancia con callbacks para eventos
   * @param {Object} callbacks - Callbacks para eventos
   * @returns {Object} Instancia personalizada
   */
  createWithCallbacks: (callbacks) => {
    const service = { ...networkService }
    
    // Decorar métodos con callbacks
    if (callbacks.onConnectionRequestSent) {
      const originalSendConnectionRequest = service.sendConnectionRequest
      service.sendConnectionRequest = async (connectionData) => {
        const result = await originalSendConnectionRequest(connectionData)
        callbacks.onConnectionRequestSent(result, connectionData)
        return result
      }
    }
    
    if (callbacks.onMessageSent) {
      const originalSendMessage = service.sendMessage
      service.sendMessage = async (messageData) => {
        const result = await originalSendMessage(messageData)
        callbacks.onMessageSent(result, messageData)
        return result
      }
    }
    
    if (callbacks.onMentorRequested) {
      const originalRequestMentor = service.requestMentor
      service.requestMentor = async (mentorId, requestData) => {
        const result = await originalRequestMentor(mentorId, requestData)
        callbacks.onMentorRequested(result, mentorId, requestData)
        return result
      }
    }
    
    return service
  },
  
  /**
   * Crea una instancia con datos mock para desarrollo
   * @returns {Object} Instancia con datos de prueba
   */
  createForDevelopment: () => {
    const mockService = {
      ...networkService,
      getMentors: async () => [
        {
          id: 'mentor_001',
          name: 'Ana López',
          alias: 'ana_dev',
          location: 'Buenos Aires, Argentina',
          skills: ['React', 'TypeScript', 'JavaScript'],
          availability: MentorAvailability.AVAILABLE,
          rating: 4.8,
          menteesCount: 42,
          yearsOfExperience: 8
        }
      ]
    }
    
    return mockService
  }
}