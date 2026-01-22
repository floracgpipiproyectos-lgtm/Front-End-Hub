import apiClient from '../apiClient'
import { GAMIFICATION_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

/**
 * Servicio de gamificación
 * Maneja badges, logros, progreso y leaderboard
 */
export const gamificationService = {
  /**
   * Obtener todos los badges disponibles
   * @returns {Promise} Lista de badges
   */
  getBadges: async () => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_BADGES)
    return response.data
  },

  /**
   * Obtener badges del usuario actual
   * @returns {Promise} Lista de badges del usuario
   */
  getUserBadges: async () => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_USER_BADGES)
    return response.data
  },

  /**
   * Obtiene el progreso completo del usuario en el sistema de gamificación.
   * Incluye nivel actual, puntos de experiencia (XP), metas y estadísticas.
   * 
   * @returns {Promise<{level: number, currentXP: number, nextLevelXP: number, 
   *                    totalXP: number, badgesEarned: number, 
   *                    projectsCompleted: number, goals: Array, 
   *                    progressPercentage: number}>} 
   *          Objeto con todos los datos de progreso del usuario
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
   * Obtener leaderboard
   * @param {Object} options - Opciones (type, limit, period)
   * @returns {Promise} Lista de usuarios en el leaderboard
   */
  getLeaderboard: async (options = {}) => {
    const response = await apiClient.get(GAMIFICATION_ENDPOINTS.GET_LEADERBOARD, {
      params: options,
    })
    return response.data
  },

  /**
   * Reclamar un badge
   * @param {string} badgeId - ID del badge
   * @returns {Promise} Confirmación de badge reclamado
   */
  claimBadge: async (badgeId) => {
    const endpoint = buildEndpoint(GAMIFICATION_ENDPOINTS.CLAIM_BADGE, { id: badgeId })
    const response = await apiClient.post(endpoint)
    return response.data
  },
}
