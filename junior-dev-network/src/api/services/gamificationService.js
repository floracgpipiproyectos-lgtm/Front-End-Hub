// gamificationService.js
// noinspection GrazieInspection,JSCheckFunctionSignatures

import apiClient from '../apiClient'
import { GAMIFICATION_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

// =============================================
// CONSTANTES Y ENUMS
// =============================================

/**
 * Tipos de badges disponibles
 * @enum {string}
 */
export const BadgeType = {
  ACHIEVEMENT: 'achievement',    // Logros por completar metas
  MILESTONE: 'milestone',        // Hitos importantes
  SKILL: 'skill',                // Dominio de habilidades
  COMMUNITY: 'community',        // Participación en comunidad
  SPECIAL: 'special'             // Badges especiales/limitados
}

/**
 * Rareza de los badges
 * @enum {string}
 */
export const BadgeRarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
}

/**
 * Tipos de leaderboards disponibles
 * @enum {string}
 */
export const LeaderboardType = {
  OVERALL: 'overall',        // Ranking general
  WEEKLY: 'weekly',          // Semanal
  MONTHLY: 'monthly',        // Mensual
  BY_SKILL: 'by_skill',      // Por habilidad específica
  NEW_USERS: 'new_users'     // Usuarios nuevos
}

/**
 * Períodos de tiempo para leaderboards
 * @enum {string}
 */
export const LeaderboardPeriod = {
  ALL_TIME: 'all_time',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days'
}

// =============================================
// ESTRUCTURAS DE DATOS (TYPES)
// =============================================

/**
 * @typedef {Object} Badge
 * @property {string} id - ID único del badge
 * @property {string} name - Nombre del badge
 * @property {string} description - Descripción del badge
 * @property {string} iconUrl - URL del icono
 * @property {BadgeType} type - Tipo de badge
 * @property {BadgeRarity} rarity - Rareza del badge
 * @property {number} xpReward - XP otorgado al obtenerlo
 * @property {string[]} requirements - Requisitos para obtenerlo
 * @property {string} createdAt - Fecha de creación en ISO string
 */

/**
 * @typedef {Object} UserBadge
 * @property {Badge} badge - Datos del badge
 * @property {string} earnedAt - Fecha de obtención en ISO string
 * @property {boolean} isNew - Indica si es nuevo/no visto
 */

/**
 * @typedef {Object} UserProgress
 * @property {number} level - Nivel actual del usuario
 * @property {number} currentXP - XP actual
 * @property {number} nextLevelXP - XP requerido para siguiente nivel
 * @property {number} totalXP - XP total acumulado
 * @property {number} badgesEarned - Cantidad de badges obtenidos
 * @property {number} projectsCompleted - Proyectos completados
 * @property {number} connectionsMade - Conexiones establecidas
 * @property {number} mentoringSessions - Sesiones de mentoría
 * @property {string[]} currentGoals - Metas actuales
 * @property {number} progressPercentage - Porcentaje al siguiente nivel
 * @property {string} lastUpdated - Última actualización en ISO string
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} userId - ID del usuario
 * @property {string} alias - Alias del usuario
 * @property {string} avatarUrl - URL del avatar
 * @property {number} rank - Posición en el ranking
 * @property {number} score - Puntuación
 * @property {number} level - Nivel del usuario
 * @property {number} badgesCount - Cantidad de badges
 * @property {string} primarySkill - Skill principal
 */

/**
 * @typedef {Object} Leaderboard
 * @property {LeaderboardType} type - Tipo de leaderboard
 * @property {LeaderboardPeriod} period - Período de tiempo
 * @property {string} generatedAt - Fecha de generación en ISO string
 * @property {LeaderboardEntry[]} entries - Entradas del leaderboard
 * @property {number} userRank - Posición del usuario actual
 * @property {number} totalParticipants - Total de participantes
 */

/**
 * @typedef {Object} LeaderboardOptions
 * @property {LeaderboardType} [type] - Tipo de leaderboard
 * @property {LeaderboardPeriod} [period] - Período de tiempo
 * @property {number} [limit] - Límite de resultados
 * @property {string} [skillFilter] - Filtrar por skill específica
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id - ID del logro
 * @property {string} name - Nombre del logro
 * @property {string} description - Descripción
 * @property {number} targetValue - Valor objetivo
 * @property {number} currentValue - Valor actual
 * @property {string} badgeRewardId - ID del badge de recompensa
 * @property {boolean} isCompleted - Indica si está completado
 */

// =============================================
// HELPERS INTERNOS
// =============================================







// =============================================
// SERVICIO DE GAMIFICACIÓN
// =============================================

/**
 * Servicio de gamificación para JuniorDev Network
 * Maneja badges, progreso, leaderboards y sistema de recompensas
 */
export const gamificationService = {
  // =============================================
  // OPERACIONES DE BADGES
  // =============================================

  /**
   * Obtiene todos los badges disponibles en la plataforma
   * @returns {Promise<Badge[]>} Array de badges disponibles
   * @throws {Error} Si no se pueden obtener los badges
   * 
   * @example
   * const badges = await gamificationService.getBadges()
   * console.log('Total badges:', badges.length)
   */
  getBadges: async () => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_BADGES)
    return response.data
  },

  /**
   * Obtiene los badges obtenidos por el usuario actual
   * @returns {Promise<UserBadge[]>} Array de badges del usuario
   * @throws {Error} Si el usuario no está autenticado
   * 
   * @example
   * const userBadges = await gamificationService.getUserBadges()
   * console.log('Badges obtenidos:', userBadges.length)
   */
  getUserBadges: async () => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_USER_BADGES)
    return response.data
  },

  /**
   * Reclama un badge para el usuario actual
   * @param {string} badgeId - ID del badge a reclamar
   * @returns {Promise<UserBadge>} Badge reclamado
   * @throws {Error} Si el badge no existe o ya fue obtenido
   * 
   * @example
   * const claimedBadge = await gamificationService.claimBadge('first_project')
   * console.log('Badge reclamado:', claimedBadge.badge.name)
   */
  claimBadge: async (badgeId) => {
    const endpoint = buildEndpoint(GAMIFICATION_ENDPOINTS.CLAIM_BADGE, { id: badgeId })
    const response = await apiClient.post(endpoint)
    return response.data
  },

  /**
   * Obtiene badges filtrados por tipo
   * @param {BadgeType} type - Tipo de badge
   * @returns {Promise<Badge[]>} Badges del tipo especificado
   * 
   * @example
   * const skillBadges = await gamificationService.getBadgesByType(BadgeType.SKILL)
   */
  getBadgesByType: async (type) => {
    const badges = await gamificationService.getBadges()
    return badges.filter(badge => badge.type === type)
  },

  /**
   * Obtiene badges filtrados por rareza
   * @param {BadgeRarity} rarity - Rareza del badge
   * @returns {Promise<Badge[]>} Badges de la rareza especificada
   * 
   * @example
   * const rareBadges = await gamificationService.getBadgesByRarity(BadgeRarity.RARE)
   */
  getBadgesByRarity: async (rarity) => {
    const badges = await gamificationService.getBadges()
    return badges.filter(badge => badge.rarity === rarity)
  },

  /**
   * Obtiene badges que el usuario aún no ha obtenido
   * @returns {Promise<Badge[]>} Badges disponibles pero no obtenidos
   * 
   * @example
   * const unearnedBadges = await gamificationService.getUnearnedBadges()
   * console.log('Badges por obtener:', unearnedBadges.length)
   */
  getUnearnedBadges: async () => {
    const [allBadges, userBadges] = await Promise.all([
      gamificationService.getBadges(),
      gamificationService.getUserBadges()
    ])

    const earnedBadgeIds = new Set(userBadges.map(userBadge => userBadge.badge.id))
    return allBadges.filter(badge => !earnedBadgeIds.has(badge.id))
  },

  /**
   * Obtiene badges obtenidos recientemente por el usuario
   * @param {number} [limit=5] - Límite de resultados
   * @returns {Promise<UserBadge[]>} Badges recientes ordenados por fecha
   * 
   * @example
   * const recentBadges = await gamificationService.getRecentBadges(3)
   */
  getRecentBadges: async (limit = 5) => {
    const userBadges = await gamificationService.getUserBadges()

    // Ordenar por fecha de obtención (más reciente primero)
    const sortedBadges = [...userBadges].sort((a, b) =>
      new Date(b.earnedAt) - new Date(a.earnedAt)
    )

    return sortedBadges.slice(0, limit)
  },

  /**
   * Obtiene badges nuevos (no vistos por el usuario)
   * @returns {Promise<UserBadge[]>} Badges con flag isNew = true
   * 
   * @example
   * const newBadges = await gamificationService.getNewBadges()
   * if (newBadges.length > 0) {
   *   console.log('¡Tienes badges nuevos!')
   * }
   */
  getNewBadges: async () => {
    const userBadges = await gamificationService.getUserBadges()
    return userBadges.filter(userBadge => userBadge.isNew)
  },

  /**
   * Marca badges como vistos por el usuario
   * @returns {Promise<{message: string}>} Confirmación
   *
   * @example
   * await gamificationService.markBadgesAsSeen(['badge1', 'badge2'])
   */
  markBadgesAsSeen: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    // Por ahora, retornamos una promesa resuelta
    return Promise.resolve({ message: 'Badges marcados como vistos' })
  },

  // =============================================
  // OPERACIONES DE PROGRESO
  // =============================================

  /**
   * Obtiene el progreso completo del usuario
   * @returns {Promise<UserProgress>} Progreso del usuario
   * @throws {Error} Si el usuario no está autenticado
   * 
   * @example
   * const progress = await gamificationService.getProgress()
   * console.log(`Nivel ${progress.level} - ${progress.currentXP}/${progress.nextLevelXP} XP`)
   */
  getProgress: async () => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_PROGRESS)
    return response.data
  },

  /**
   * Obtiene el nivel actual del usuario
   * @returns {Promise<number>} Nivel del usuario
   * 
   * @example
   * const level = await gamificationService.getCurrentLevel()
   * console.log('Nivel actual:', level)
   */
  getCurrentLevel: async () => {
    const progress = await gamificationService.getProgress()
    return progress.level
  },

  /**
   * Obtiene el XP actual del usuario
   * @returns {Promise<number>} XP actual
   */
  getCurrentXP: async () => {
    const progress = await gamificationService.getProgress()
    return progress.currentXP
  },

  /**
   * Obtiene el XP requerido para el siguiente nivel
   * @returns {Promise<number>} XP requerido
   */
  getNextLevelXP: async () => {
    const progress = await gamificationService.getProgress()
    return progress.nextLevelXP
  },

  /**
   * Agrega XP al usuario por una actividad específica
   * @returns {Promise<boolean>} true si subió de nivel
   *
   * @example
   * const leveledUp = await gamificationService.addXP(50, 'project_completion')
   * if (leveledUp) console.log('¡Subiste de nivel!')
   */
  addXP: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    // Por ahora, retornamos una promesa resuelta
    return Promise.resolve(true)
  },

  /**
   * Agrega XP por completar un proyecto
   * @returns {Promise<boolean>} true si subió de nivel
   *
   * @example
   * await gamificationService.addXPForProject(2) // Proyecto de dificultad media
   */
  addXPForProject: async () => {
     // XP base × dificultad
    const leveledUp = await gamificationService.addXP(source)

    if (leveledUp) {
      // Recompensa adicional por subir de nivel
      await gamificationService.addXP(source)
    }

    return leveledUp
  },


  /**
   * Obtiene estadísticas de actividad del usuario
   * @returns {Promise<Object>} Estadísticas organizadas
   * 
   * @example
   * const stats = await gamificationService.getActivityStats()
   * console.log('Proyectos completados:', stats.projects_completed)
   */
  getActivityStats: async () => {
    const progress = await gamificationService.getProgress()

    return {
      projects_completed: progress.projectsCompleted,
      connections_made: progress.connectionsMade,
      mentoring_sessions: progress.mentoringSessions,
      total_badges: progress.badgesEarned,
      total_xp: progress.totalXP,
      level: progress.level
    }
  },

  /**
   * Obtiene las metas actuales del usuario
   * @returns {Promise<Achievement[]>} Array de metas activas
   * 
   * @example
   * const goals = await gamificationService.getCurrentGoals()
   * goals.forEach(goal => {
   *   console.log(`${goal.name}: ${goal.currentValue}/${goal.targetValue}`)
   * })
   */
  getCurrentGoals: async () => {
    const progress = await gamificationService.getProgress()
    // En una implementación real, esto vendría de un endpoint específico
    // Por ahora, retornamos metas de ejemplo basadas en el progreso
    return [
      {
        id: 'complete_3_projects',
        name: 'Completa 3 Proyectos',
        description: 'Completa 3 proyectos de cualquier tipo',
        targetValue: 3,
        currentValue: Math.min(progress.projectsCompleted, 3),
        badgeRewardId: 'project_streak',
        isCompleted: progress.projectsCompleted >= 3
      },
      {
        id: 'reach_level_5',
        name: 'Alcanza Nivel 5',
        description: 'Sube hasta el nivel 5',
        targetValue: 5,
        currentValue: Math.min(progress.level, 5),
        badgeRewardId: 'level_5',
        isCompleted: progress.level >= 5
      }
    ]
  },

  /**
   * Actualiza el progreso de una meta específica
   * @returns {Promise<boolean>} true si se completó la meta
   *
   * @example
   * const completed = await gamificationService.updateGoalProgress('complete_3_projects', 1)
   * if (completed) console.log('¡Meta completada!')
   */
  updateGoalProgress: async () => {
    // En una implementación real, esto llamaría a un endpoint específico
    const completed = false // Simulación

    if (completed) {
      await gamificationService.addXP(source)
    }

    return Promise.resolve(completed)
  },

  // =============================================
  // OPERACIONES DE LEADERBOARD
  // =============================================

  /**
   * Obtiene leaderboard con opciones personalizadas
   * @param {LeaderboardOptions} [options={}] - Opciones de filtrado
   * @returns {Promise<Leaderboard>} Leaderboard completo
   * 
   * @example
   * const leaderboard = await gamificationService.getLeaderboard({
   *   type: LeaderboardType.WEEKLY,
   *   period: LeaderboardPeriod.THIS_WEEK,
   *   limit: 20
   * })
   */
  getLeaderboard: async (options = {}) => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_LEADERBOARD, {
      params: options,
    })
    return response.data
  },

  /**
   * Obtiene el leaderboard general
   * @param {number} [limit=50] - Límite de resultados
   * @returns {Promise<Leaderboard>} Leaderboard general
   * 
   * @example
   * const overallLeaderboard = await gamificationService.getOverallLeaderboard(25)
   */
  getOverallLeaderboard: async (limit = 50) => {
    return gamificationService.getLeaderboard({
      type: LeaderboardType.OVERALL,
      limit
    })
  },

  /**
   * Obtiene el leaderboard semanal
   * @param {number} [limit=30] - Límite de resultados
   * @returns {Promise<Leaderboard>} Leaderboard semanal
   * 
   * @example
   * const weeklyLeaderboard = await gamificationService.getWeeklyLeaderboard()
   */
  getWeeklyLeaderboard: async (limit = 30) => {
    return gamificationService.getLeaderboard({
      type: LeaderboardType.WEEKLY,
      period: LeaderboardPeriod.THIS_WEEK,
      limit
    })
  },

  /**
   * Obtiene leaderboard filtrado por skill específica
   * @param {string} skill - Skill para filtrar
   * @param {number} [limit=20] - Límite de resultados
   * @returns {Promise<Leaderboard>} Leaderboard por skill
   * 
   * @example
   * const reactLeaderboard = await gamificationService.getSkillLeaderboard('React')
   */
  getSkillLeaderboard: async (skill, limit = 20) => {
    return gamificationService.getLeaderboard({
      type: LeaderboardType.BY_SKILL,
      skillFilter: skill,
      limit
    })
  },

  /**
   * Obtiene la posición del usuario en el leaderboard
   * @param {LeaderboardType} [type=LeaderboardType.OVERALL] - Tipo de leaderboard
   * @returns {Promise<number>} Posición del usuario
   * 
   * @example
   * const myRank = await gamificationService.getUserRank(LeaderboardType.WEEKLY)
   * console.log('Mi posición:', myRank)
   */
  getUserRank: async (type = LeaderboardType.OVERALL) => {
    const leaderboard = await gamificationService.getLeaderboard({ type, limit: 1 })
    return leaderboard.userRank || 0
  },

  /**
   * Obtiene leaderboard solo con amigos del usuario
   * @param {number} [limit=20] - Límite de resultados
   * @returns {Promise<Leaderboard>} Leaderboard de amigos
   * 
   * @example
   * const friendsBoard = await gamificationService.getFriendsLeaderboard()
   */
  getFriendsLeaderboard: async (limit = 20) => {
    return gamificationService.getLeaderboard({
      type: LeaderboardType.OVERALL,
      limit
      // En una implementación real, habría un filtro especial para amigos
    })
  },

  /**
   * Obtiene usuarios cercanos al usuario en el leaderboard
   * @param {number} [range=5] - Número de usuarios arriba y abajo
   * @returns {Promise<Leaderboard>} Segmento del leaderboard
   * 
   * @example
   * const nearby = await gamificationService.getNearbyLeaderboard(3)
   * // Muestra usuarios 3 posiciones arriba y abajo
   */
  getNearbyLeaderboard: async (range = 5) => {
    const userRank = await gamificationService.getUserRank()
    const limit = range * 2 + 1 // Usuarios arriba + abajo + usuario

    const leaderboard = await gamificationService.getLeaderboard({ limit })

    // Filtrar para obtener solo usuarios cercanos
    const nearbyEntries = leaderboard.entries.filter(entry =>
      Math.abs(entry.rank - userRank) <= range
    )

    return {
      ...leaderboard,
      entries: nearbyEntries
    }
  },

  /**
   * Obtiene ranking del usuario en diferentes categorías
   * @returns {Promise<Object>} Rankings en múltiples categorías
   * 
   * @example
   * const rankings = await gamificationService.getUserRankings()
   * console.log('Ranking general:', rankings.overall)
   * console.log('Ranking semanal:', rankings.weekly)
   */
  getUserRankings: async () => {
    const [overallRank, weeklyRank, monthlyRank] = await Promise.all([
      gamificationService.getUserRank(LeaderboardType.OVERALL),
      gamificationService.getUserRank(LeaderboardType.WEEKLY),
      gamificationService.getUserRank(LeaderboardType.MONTHLY)
    ])

    return {
      overall: overallRank,
      weekly: weeklyRank,
      monthly: monthlyRank
    }
  },

  // =============================================
  // UTILIDADES ADICIONALES
  // =============================================

  /**
   * Calcula estadísticas comparativas del usuario
   * @returns {Promise<Object>} Estadísticas comparativas
   * 
   * @example
   * const comparison = await gamificationService.getUserComparison()
   * console.log('Estás en el top', comparison.percentile, '%')
   */
  getUserComparison: async () => {
    const leaderboard = await gamificationService.getOverallLeaderboard(1)
    const userRank = leaderboard.userRank
    const totalParticipants = leaderboard.totalParticipants

    const percentile = totalParticipants > 0
      ? Math.round((userRank / totalParticipants) * 100, 2)
        : 0

    return {
      rank: userRank,
      totalParticipants,
      percentile,
      isTop10: userRank <= 10,
      isTop25: userRank <= 25,
      isTop50: userRank <= 50
    }
  },

  /**
   * Obtiene insights de gamificación para el usuario
   * @returns {Promise<Object>} Insights personalizados
   * 
   * @example
   * const insights = await gamificationService.getGamificationInsights()
   * console.log('Próxima meta:', insights.nextGoal)
   */
  getGamificationInsights: async () => {
    const [progress, unearnedBadges, goals, rankings] = await Promise.all([
      gamificationService.getProgress(),
      gamificationService.getUnearnedBadges(),
      gamificationService.getCurrentGoals(),
      gamificationService.getUserRankings()
    ])

    const nextLevelXPNeeded = progress.nextLevelXP - progress.currentXP
    const closestGoal = goals.find(goal => !goal.isCompleted)

    return {
      level: progress.level,
      nextLevelIn: `${nextLevelXPNeeded} XP`,
      progressPercentage: progress.progressPercentage,
      badgesMissing: unearnedBadges.length,
      nextGoal: closestGoal?.name || 'Todas las metas completadas',
      easiestBadge: unearnedBadges.find(b => b.xpReward <= 100)?.name || 'Ninguno disponible',
      rankingSummary: `#${rankings.overall} general, #${rankings.weekly} semanal`
    }
  },

  /**
   * Simula una notificación de gamificación
   * @param {string} type - Tipo de notificación
   * @returns {Promise<Object>} Datos de la notificación
   */
  simulateNotification: async (type = 'level_up') => {
    const notifications = {
      level_up: {
        title: '¡Subiste de nivel!',
        message: 'Felicidades, has alcanzado un nuevo nivel.',
        type: 'success',
        badge: 'level_up'
      },
      new_badge: {
        title: 'Nuevo badge obtenido',
        message: 'Has desbloqueado un nuevo logro.',
        type: 'info',
        badge: 'achievement_unlocked'
      },
      leaderboard_update: {
        title: 'Actualización de ranking',
        message: 'Tu posición en el leaderboard ha mejorado.',
        type: 'warning',
        badge: 'ranking_improved'
      }
    }

    return Promise.resolve(notifications[type] || notifications.level_up)
  }
}

// =============================================
// FACTORY Y EXPORTACIONES
// =============================================

/**
 * Factory para crear servicios de gamificación personalizados
 */
export const GamificationServiceFactory = {
  /**
   * Crea una instancia estándar del servicio
   * @returns {Object} Instancia de gamificationService
   */
  createDefault: () => gamificationService,

  /**
   * Crea una instancia con configuración de desarrollo
   * @returns {Object} Instancia con datos mock
   */
  createForDevelopment: () => {
    // Podría retornar una versión con datos mock para desarrollo
    return {
      ...gamificationService,
      // Override métodos si es necesario
      getProgress: async () => ({
        level: 5,
        currentXP: 450,
        nextLevelXP: 500,
        totalXP: 2450,
        badgesEarned: 8,
        projectsCompleted: 12,
        connectionsMade: 25,
        mentoringSessions: 3,
        currentGoals: ['reach_level_10', 'complete_5_projects'],
        progressPercentage: 90,
        lastUpdated: new Date().toISOString()
      })
    }
  },

  /**
   * Crea una instancia con callbacks personalizados
   * @param {Object} callbacks - Callbacks para eventos
   * @returns {Object} Instancia personalizada
   */
  createWithCallbacks: (callbacks) => {
    const service = { ...gamificationService }

    // Decorar métodos con callbacks
    if (callbacks.onLevelUp) {
      const originalAddXP = service.addXP
      service.addXP = async (xp, source) => {
        const leveledUp = await originalAddXP(xp, source)
        if (leveledUp) {
          callbacks.onLevelUp({ xp, source })
        }
        return leveledUp
      }
    }

    if (callbacks.onBadgeEarned) {
      const originalClaimBadge = service.claimBadge
      service.claimBadge = async (badgeId) => {
        const badge = await originalClaimBadge(badgeId)
        callbacks.onBadgeEarned(badge)
        return badge
      }
    }

    return service
  }
}

export default gamificationService