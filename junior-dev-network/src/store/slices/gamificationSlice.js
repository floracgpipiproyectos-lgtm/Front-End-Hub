// store/slices/gamificationSlice.js
// noinspection UnnecessaryLocalVariableJS,JSDeprecatedSymbols,JSCheckFunctionSignatures

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { gamificationService } from '@/api/services'
import {
    STORAGE_KEYS,
    LOADING_STATES,
    CACHE_CONFIG
} from '@/constants/apiConfig'
import {
    BadgeType,
    BadgeRarity,
    LeaderboardType
} from '@/api/services/gamificationService'

// =============================================
// ADAPTERS Y NORMALIZACIÓN
// =============================================

// Entity adapter para badges (mejor rendimiento)
const badgesAdapter = createEntityAdapter({
    selectId: (badge) => badge.id,
    sortComparer: (a, b) => {
        // Ordenar por rareza (legendary primero) y luego por XP
        const rarityOrder = {
            [BadgeRarity.LEGENDARY]: 5,
            [BadgeRarity.EPIC]: 4,
            [BadgeRarity.RARE]: 3,
            [BadgeRarity.UNCOMMON]: 2,
            [BadgeRarity.COMMON]: 1
        }
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0) ||
            b.xpReward - a.xpReward
    }
})

// Entity adapter para leaderboards
const leaderboardsAdapter = createEntityAdapter({
    selectId: (board) => `${board.type}_${board.period}_${board.generatedAt}`,
    sortComparer: (a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)
})

// =============================================
// ASYNC THUNKS
// =============================================

/**
 * Obtiene todos los badges disponibles
 */
export const fetchBadges = createAsyncThunk(
    'gamification/fetchBadges',
    async (_, { rejectWithValue }) => {
        try {
            const badges = await gamificationService.getBadges()
            return badges
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene badges del usuario
 */
export const fetchUserBadges = createAsyncThunk(
    'gamification/fetchUserBadges',
    async (_, { rejectWithValue }) => {
        try {
            const userBadges = await gamificationService.getUserBadges()
            return userBadges
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Reclama un badge
 */
export const claimBadge = createAsyncThunk(
    'gamification/claimBadge',
    async (badgeId, { rejectWithValue, dispatch }) => {
        try {
            const badge = await gamificationService.claimBadge(badgeId)

            // Refrescar badges del usuario después de reclamar
            dispatch(fetchUserBadges())

            // Notificación de éxito
            dispatch(addNotification({
                type: 'success',
                title: '¡Nuevo Badge!',
                message: `Has obtenido el badge: ${badge.badge.name}`,
                badge: badge.badge
            }))

            return badge
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene progreso del usuario
 */
export const fetchProgress = createAsyncThunk(
    'gamification/fetchProgress',
    async (_, { rejectWithValue }) => {
        try {
            const progress = await gamificationService.getProgress()
            return progress
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Agrega XP al usuario
 */
export const addXP = createAsyncThunk(
    'gamification/addXP',
    async ({ xp, source = 'general' }, { rejectWithValue, dispatch }) => {
        try {
            // En una implementación real, esto llamaría al servidor
            // Por ahora usamos el método del servicio
            const leveledUp = await gamificationService.addXP(source)

            // Si subió de nivel, actualizar progreso
            if (leveledUp) {
                dispatch(fetchProgress())

                // Notificación de nivel
                dispatch(addNotification({
                    type: 'success',
                    title: '¡Subiste de nivel!',
                    message: 'Felicidades, has alcanzado un nuevo nivel',
                    badge: 'level_up'
                }))
            }

            return { xp, source, leveledUp }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene leaderboard
 */
export const fetchLeaderboard = createAsyncThunk(
    'gamification/fetchLeaderboard',
    async (options = {}, { rejectWithValue }) => {
        try {
            const leaderboard = await gamificationService.getLeaderboard(options)
            return { ...leaderboard, options }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene leaderboard general
 */
export const fetchOverallLeaderboard = createAsyncThunk(
    'gamification/fetchOverallLeaderboard',
    async (limit = 50, { rejectWithValue }) => {
        try {
            const leaderboard = await gamificationService.getOverallLeaderboard(limit)
            return { ...leaderboard, type: LeaderboardType.OVERALL }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene leaderboard semanal
 */
export const fetchWeeklyLeaderboard = createAsyncThunk(
    'gamification/fetchWeeklyLeaderboard',
    async (limit = 30, { rejectWithValue }) => {
        try {
            const leaderboard = await gamificationService.getWeeklyLeaderboard(limit)
            return { ...leaderboard, type: LeaderboardType.WEEKLY }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene ranking del usuario
 */
export const fetchUserRank = createAsyncThunk(
    'gamification/fetchUserRank',
    async (type = LeaderboardType.OVERALL, { rejectWithValue }) => {
        try {
            const rank = await gamificationService.getUserRank(type)
            return { type, rank }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene metas actuales
 */
export const fetchCurrentGoals = createAsyncThunk(
    'gamification/fetchCurrentGoals',
    async (_, { rejectWithValue }) => {
        try {
            const goals = await gamificationService.getCurrentGoals()
            return goals
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Actualiza progreso de una meta
 */
export const updateGoalProgress = createAsyncThunk(
    'gamification/updateGoalProgress',
    async ({ achievementId, increment = 1 }, { rejectWithValue, dispatch }) => {
        try {
            const completed = await gamificationService.updateGoalProgress()

            if (completed) {
                // Refrescar metas si se completó
                dispatch(fetchCurrentGoals())

                // Notificación de meta completada
                dispatch(addNotification({
                    type: 'success',
                    title: '¡Meta completada!',
                    message: 'Has alcanzado un nuevo objetivo',
                    badge: 'goal_completed'
                }))
            }

            return { achievementId, completed }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene estadísticas de actividad
 */
export const fetchActivityStats = createAsyncThunk(
    'gamification/fetchActivityStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await gamificationService.getActivityStats()
            return stats
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene insights de gamificación
 */
export const fetchGamificationInsights = createAsyncThunk(
    'gamification/fetchGamificationInsights',
    async (_, { rejectWithValue }) => {
        try {
            const insights = await gamificationService.getGamificationInsights()
            return insights
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene badges nuevos (no vistos)
 */
export const fetchNewBadges = createAsyncThunk(
    'gamification/fetchNewBadges',
    async (_, { rejectWithValue }) => {
        try {
            const newBadges = await gamificationService.getNewBadges()
            return newBadges
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Marca badges como vistos
 */
export const markBadgesAsSeen = createAsyncThunk(
    'gamification/markBadgesAsSeen',
    async (badgeIds, { rejectWithValue }) => {
        try {
            const result = await gamificationService.markBadgesAsSeen()
            return { badgeIds, result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

// =============================================
// ESTADO INICIAL
// =============================================

const initialState = {
    // Badges
    badges: badgesAdapter.getInitialState(),
    userBadges: [],
    newBadges: [],
    badgesStatus: LOADING_STATES.IDLE,
    badgesError: null,

    // Progreso del usuario
    progress: {
        level: 1,
        currentXP: 0,
        nextLevelXP: 100,
        totalXP: 0,
        badgesEarned: 0,
        projectsCompleted: 0,
        connectionsMade: 0,
        mentoringSessions: 0,
        progressPercentage: 0,
        lastUpdated: null
    },
    progressStatus: LOADING_STATES.IDLE,
    progressError: null,

    // Leaderboards
    leaderboards: leaderboardsAdapter.getInitialState(),
    currentLeaderboard: null,
    leaderboardStatus: LOADING_STATES.IDLE,
    leaderboardError: null,

    // Metas/Goals
    goals: [],
    goalsStatus: LOADING_STATES.IDLE,
    goalsError: null,

    // Estadísticas
    activityStats: null,
    insights: null,
    statsStatus: LOADING_STATES.IDLE,
    statsError: null,

    // XP y recompensas
    xpLog: [],
    recentRewards: [],

    // Notificaciones
    notifications: [],

    // Estado general
    status: LOADING_STATES.IDLE,
    error: null,
    lastUpdated: null,

    // Metadata
    meta: {
        totalBadgesEarned: 0,
        totalXPAdded: 0,
        lastLevelUp: null,
        streak: {
            current: 0,
            max: 0,
            lastActivity: null
        },
        achievementsUnlockedToday: 0
    }
}

// =============================================
// SLICE PRINCIPAL
// =============================================

const gamificationSlice = createSlice({
    name: 'gamification',
    initialState,
    reducers: {
        // =============================================
        // REDUCERS SÍNCRONOS
        // =============================================

        /**
         * Agrega una notificación
         */
        addNotification: (state, action) => {
            const notification = {
                id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                read: false,
                ...action.payload
            }

            state.notifications.unshift(notification)

            // Mantener máximo 50 notificaciones
            if (state.notifications.length > 50) {
                state.notifications = state.notifications.slice(0, 50)
            }
        },

        /**
         * Marca notificación como leída
         */
        markNotificationAsRead: (state, action) => {
            const notificationId = action.payload
            const notification = state.notifications.find(n => n.id === notificationId)
            if (notification) {
                notification.read = true
            }
        },

        /**
         * Limpia notificaciones
         */
        clearNotifications: (state) => {
            state.notifications = []
        },

        /**
         * Agrega entrada al log de XP
         */
        addXPLogEntry: (state, action) => {
            const logEntry = {
                id: `xplog_${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...action.payload
            }

            state.xpLog.unshift(logEntry)
            state.meta.totalXPAdded += logEntry.xp

            // Mantener máximo 100 entradas
            if (state.xpLog.length > 100) {
                state.xpLog = state.xpLog.slice(0, 100)
            }

            // Actualizar streak
            updateStreak(state)
        },

        /**
         * Agrega recompensa reciente
         */
        addRecentReward: (state, action) => {
            const reward = {
                id: `reward_${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...action.payload
            }

            state.recentRewards.unshift(reward)

            // Mantener máximo 20 recompensas
            if (state.recentRewards.length > 20) {
                state.recentRewards = state.recentRewards.slice(0, 20)
            }
        },

        /**
         * Actualiza streak
         */
        updateStreak: (state) => {
            const today = new Date().toDateString()
            const lastActivity = state.meta.streak.lastActivity

            if (!lastActivity) {
                state.meta.streak.current = 1
                state.meta.streak.lastActivity = today
                return
            }

            const lastActivityDate = new Date(lastActivity)
            const todayDate = new Date()
            const diffTime = Math.abs(todayDate - lastActivityDate)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 1) {
                // Actividad consecutiva
                state.meta.streak.current += 1
            } else if (diffDays > 1) {
                // Rompió el streak
                state.meta.streak.current = 1
            }
            // Si diffDays === 0, mismo día, no hacer nada

            state.meta.streak.lastActivity = today

            // Actualizar máximo streak
            if (state.meta.streak.current > state.meta.streak.max) {
                state.meta.streak.max = state.meta.streak.current
            }
        },

        /**
         * Incrementa contador de logros del día
         */
        incrementDailyAchievements: (state) => {
            state.meta.achievementsUnlockedToday += 1
        },

        /**
         * Resetea contadores diarios (llamar al inicio del día)
         */
        resetDailyCounters: (state) => {
            state.meta.achievementsUnlockedToday = 0
        },

        /**
         * Filtra badges por tipo
         */
        filterBadgesByType: (state, action) => {
            const badgeType = action.payload
            state.badges.filter = { type: badgeType }
        },

        /**
         * Filtra badges por rareza
         */
        filterBadgesByRarity: (state, action) => {
            const rarity = action.payload
            state.badges.filter = { ...state.badges.filter, rarity }
        },

        /**
         * Ordena badges por criterio
         */
        sortBadgesBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.badges.sort = { field, direction }
        },

        /**
         * Establece leaderboard activo
         */
        setActiveLeaderboard: (state, action) => {
            const { type, period } = action.payload
            state.currentLeaderboard = { type, period }
        },

        /**
         * Limpia errores de gamificación
         */
        clearGamificationError: (state) => {
            state.error = null
            state.badgesError = null
            state.progressError = null
            state.leaderboardError = null
            state.goalsError = null
            state.statsError = null
            state.status = LOADING_STATES.IDLE
        },

        /**
         * Resetea estado de gamificación
         */
        resetGamificationState: () => {
            return initialState
        },

        /**
         * Simula evento de gamificación (para desarrollo)
         */
        simulateEvent: (state, action) => {
            const { type, data } = action.payload

            switch (type) {
                case 'level_up':
                    state.progress.level += 1
                    state.progress.currentXP = 0
                    state.progress.nextLevelXP = Math.floor(state.progress.nextLevelXP * 1.5)
                    state.meta.lastLevelUp = new Date().toISOString()

                    state.notifications.push({
                        id: `sim_${Date.now()}`,
                        type: 'success',
                        title: '¡Subiste de nivel!',
                        message: `Ahora eres nivel ${state.progress.level}`,
                        timestamp: new Date().toISOString(),
                        read: false
                    })
                    break

                case 'badge_earned':
                    const newBadge = {
                        id: `badge_sim_${Date.now()}`,
                        name: data.name || 'Badge de prueba',
                        description: data.description || 'Descripción del badge',
                        type: data.type || BadgeType.ACHIEVEMENT,
                        rarity: data.rarity || BadgeRarity.COMMON,
                        xpReward: data.xp || 50,
                        iconUrl: data.icon || '/badges/default.png'
                    }

                    badgesAdapter.addOne(state.badges, newBadge)
                    state.userBadges.push({
                        badge: newBadge,
                        earnedAt: new Date().toISOString(),
                        isNew: true
                    })
                    state.meta.totalBadgesEarned += 1
                    break

                case 'xp_added':
                    const xp = data.xp || 100
                    state.progress.currentXP += xp
                    state.progress.totalXP += xp
                    state.progress.progressPercentage =
                        (state.progress.currentXP / state.progress.nextLevelXP) * 100

                    // Verificar si subió de nivel
                    if (state.progress.currentXP >= state.progress.nextLevelXP) {
                        // El nivel up real se manejaría con el evento level_up
                        console.log('¡Listo para subir de nivel!')
                    }
                    break
            }
        }
    },
    extraReducers: (builder) => {
        // =============================================
        // FETCH BADGES
        // =============================================
        builder
            .addCase(fetchBadges.pending, (state) => {
                state.badgesStatus = LOADING_STATES.LOADING
                state.badgesError = null
            })
            .addCase(fetchBadges.fulfilled, (state, action) => {
                badgesAdapter.setAll(state.badges, action.payload)
                state.badgesStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Cachear badges
                cacheBadges(action.payload)
            })
            .addCase(fetchBadges.rejected, (state, action) => {
                state.badgesStatus = LOADING_STATES.ERROR
                state.badgesError = action.payload?.message || 'Error obteniendo badges'

                // Intentar cargar desde cache
                const cachedBadges = loadCachedBadges()
                if (cachedBadges) {
                    badgesAdapter.setAll(state.badges, cachedBadges)
                    state.badgesStatus = LOADING_STATES.SUCCESS
                }
            })

        // =============================================
        // FETCH USER BADGES
        // =============================================
        builder
            .addCase(fetchUserBadges.pending, (state) => {
                state.badgesStatus = LOADING_STATES.LOADING
            })
            .addCase(fetchUserBadges.fulfilled, (state, action) => {
                state.userBadges = action.payload
                state.badgesStatus = LOADING_STATES.SUCCESS
                state.meta.totalBadgesEarned = action.payload.length
                state.lastUpdated = new Date().toISOString()

                // Identificar badges nuevos
                const newBadges = action.payload.filter(b => b.isNew)
                state.newBadges = newBadges
            })
            .addCase(fetchUserBadges.rejected, (state, action) => {
                state.badgesStatus = LOADING_STATES.ERROR
                state.badgesError = action.payload?.message || 'Error obteniendo badges del usuario'
            })

        // =============================================
        // CLAIM BADGE
        // =============================================
        builder
            .addCase(claimBadge.pending, (state) => {
                state.badgesStatus = LOADING_STATES.LOADING
            })
            .addCase(claimBadge.fulfilled, (state, action) => {
                const claimedBadge = action.payload

                // Agregar a badges del usuario
                if (!state.userBadges.some(ub => ub.badge.id === claimedBadge.badge.id)) {
                    state.userBadges.push(claimedBadge)
                    state.meta.totalBadgesEarned += 1
                }

                state.badgesStatus = LOADING_STATES.SUCCESS

                // Agregar log de XP si el badge da XP
                if (claimedBadge.badge.xpReward) {
                    state.xpLog.unshift({
                        id: `xp_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        xp: claimedBadge.badge.xpReward,
                        source: 'badge_reward',
                        description: `Badge: ${claimedBadge.badge.name}`
                    })

                    state.progress.totalXP += claimedBadge.badge.xpReward
                    state.meta.totalXPAdded += claimedBadge.badge.xpReward
                }
            })
            .addCase(claimBadge.rejected, (state, action) => {
                state.badgesStatus = LOADING_STATES.ERROR
                state.badgesError = action.payload?.message || 'Error reclamando badge'
            })

        // =============================================
        // FETCH PROGRESS
        // =============================================
        builder
            .addCase(fetchProgress.pending, (state) => {
                state.progressStatus = LOADING_STATES.LOADING
                state.progressError = null
            })
            .addCase(fetchProgress.fulfilled, (state, action) => {
                state.progress = {
                    ...state.progress,
                    ...action.payload,
                    progressPercentage: (action.payload.currentXP / action.payload.nextLevelXP) * 100
                }
                state.progressStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Cachear progreso
                cacheProgress(action.payload)
            })
            .addCase(fetchProgress.rejected, (state, action) => {
                state.progressStatus = LOADING_STATES.ERROR
                state.progressError = action.payload?.message || 'Error obteniendo progreso'

                // Intentar cargar desde cache
                const cachedProgress = loadCachedProgress()
                if (cachedProgress) {
                    state.progress = cachedProgress
                    state.progressStatus = LOADING_STATES.SUCCESS
                }
            })

        // =============================================
        // ADD XP
        // =============================================
        builder
            .addCase(addXP.fulfilled, (state, action) => {
                const { xp, source, leveledUp } = action.payload

                // Agregar al log
                state.xpLog.unshift({
                    id: `xp_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    xp,
                    source,
                    description: `XP por ${source}`
                })

                // Actualizar progreso
                state.progress.currentXP += xp
                state.progress.totalXP += xp
                state.progress.progressPercentage =
                    (state.progress.currentXP / state.progress.nextLevelXP) * 100

                state.meta.totalXPAdded += xp

                // Si subió de nivel, actualizar streak
                if (leveledUp) {
                    state.meta.lastLevelUp = new Date().toISOString()
                    updateStreak(state)
                }

                // Mantener log limitado
                if (state.xpLog.length > 100) {
                    state.xpLog = state.xpLog.slice(0, 100)
                }
            })

        // =============================================
        // FETCH LEADERBOARD
        // =============================================
        builder
            .addCase(fetchLeaderboard.pending, (state) => {
                state.leaderboardStatus = LOADING_STATES.LOADING
                state.leaderboardError = null
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                const leaderboard = action.payload

                // Agregar a leaderboards históricos
                leaderboardsAdapter.upsertOne(state.leaderboards, leaderboard)

                // Establecer como leaderboard actual
                state.currentLeaderboard = {
                    type: leaderboard.type,
                    period: leaderboard.period,
                    data: leaderboard
                }

                state.leaderboardStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.leaderboardStatus = LOADING_STATES.ERROR
                state.leaderboardError = action.payload?.message || 'Error obteniendo leaderboard'
            })

        // =============================================
        // FETCH OVERALL LEADERBOARD
        // =============================================
        builder
            .addCase(fetchOverallLeaderboard.fulfilled, (state, action) => {
                const leaderboard = action.payload
                leaderboardsAdapter.upsertOne(state.leaderboards, leaderboard)
                state.currentLeaderboard = {
                    type: LeaderboardType.OVERALL,
                    data: leaderboard
                }
            })

        // =============================================
        // FETCH WEEKLY LEADERBOARD
        // =============================================
        builder
            .addCase(fetchWeeklyLeaderboard.fulfilled, (state, action) => {
                const leaderboard = action.payload
                leaderboardsAdapter.upsertOne(state.leaderboards, leaderboard)
                state.currentLeaderboard = {
                    type: LeaderboardType.WEEKLY,
                    data: leaderboard
                }
            })

        // =============================================
        // FETCH USER RANK
        // =============================================
        builder
            .addCase(fetchUserRank.fulfilled, (state, action) => {
                const { type, rank } = action.payload

                // Actualizar rank en el leaderboard actual si coincide el tipo
                if (state.currentLeaderboard && state.currentLeaderboard.type === type) {
                    state.currentLeaderboard.data.userRank = rank
                }
            })

        // =============================================
        // FETCH CURRENT GOALS
        // =============================================
        builder
            .addCase(fetchCurrentGoals.pending, (state) => {
                state.goalsStatus = LOADING_STATES.LOADING
                state.goalsError = null
            })
            .addCase(fetchCurrentGoals.fulfilled, (state, action) => {
                state.goals = action.payload
                state.goalsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchCurrentGoals.rejected, (state, action) => {
                state.goalsStatus = LOADING_STATES.ERROR
                state.goalsError = action.payload?.message || 'Error obteniendo metas'
            })

        // =============================================
        // UPDATE GOAL PROGRESS
        // =============================================
        builder
            .addCase(updateGoalProgress.fulfilled, (state, action) => {
                const { completed } = action.payload

                if (completed) {
                    // Incrementar contador diario
                    state.meta.achievementsUnlockedToday += 1
                }
            })

        // =============================================
        // FETCH ACTIVITY STATS
        // =============================================
        builder
            .addCase(fetchActivityStats.pending, (state) => {
                state.statsStatus = LOADING_STATES.LOADING
                state.statsError = null
            })
            .addCase(fetchActivityStats.fulfilled, (state, action) => {
                state.activityStats = action.payload
                state.statsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchActivityStats.rejected, (state, action) => {
                state.statsStatus = LOADING_STATES.ERROR
                state.statsError = action.payload?.message || 'Error obteniendo estadísticas'
            })

        // =============================================
        // FETCH GAMIFICATION INSIGHTS
        // =============================================
        builder
            .addCase(fetchGamificationInsights.fulfilled, (state, action) => {
                state.insights = action.payload
            })

        // =============================================
        // FETCH NEW BADGES
        // =============================================
        builder
            .addCase(fetchNewBadges.fulfilled, (state, action) => {
                state.newBadges = action.payload
            })

        // =============================================
        // MARK BADGES AS SEEN
        // =============================================
        builder
            .addCase(markBadgesAsSeen.fulfilled, (state, action) => {
                const { badgeIds } = action.payload

                // Marcar badges como vistos
                state.userBadges = state.userBadges.map(userBadge => {
                    if (badgeIds.includes(userBadge.badge.id)) {
                        return { ...userBadge, isNew: false }
                    }
                    return userBadge
                })

                // Actualizar lista de badges nuevos
                state.newBadges = state.newBadges.filter(
                    badge => !badgeIds.includes(badge.badge.id)
                )
            })
    }
})

// =============================================
// FUNCIONES DE CACHE
// =============================================

/**
 * Cachea badges en localStorage
 */
const cacheBadges = (badges) => {
    try {
        const cacheData = {
            badges,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + CACHE_CONFIG.TTL.MEDIUM
        }
        localStorage.setItem(`${STORAGE_KEYS.CACHED_BADGES}_all`, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando badges:', error)
    }
}

/**
 * Cachea progreso en localStorage
 */
const cacheProgress = (progress) => {
    try {
        const cacheData = {
            progress,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + CACHE_CONFIG.TTL.SHORT
        }
        localStorage.setItem(`${STORAGE_KEYS.CACHED_BADGES}_progress`, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando progreso:', error)
    }
}

/**
 * Carga badges desde cache
 */
const loadCachedBadges = () => {
    try {
        const cached = localStorage.getItem(`${STORAGE_KEYS.CACHED_BADGES}_all`)
        if (!cached) return null

        const cacheData = JSON.parse(cached)

        // Verificar expiración
        if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
            localStorage.removeItem(`${STORAGE_KEYS.CACHED_BADGES}_all`)
            return null
        }

        return cacheData.badges
    } catch (error) {
        console.warn('Error cargando badges desde cache:', error)
        return null
    }
}

/**
 * Carga progreso desde cache
 */
const loadCachedProgress = () => {
    try {
        const cached = localStorage.getItem(`${STORAGE_KEYS.CACHED_BADGES}_progress`)
        if (!cached) return null

        const cacheData = JSON.parse(cached)

        // Verificar expiración
        if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
            localStorage.removeItem(`${STORAGE_KEYS.CACHED_BADGES}_progress`)
            return null
        }

        return cacheData.progress
    } catch (error) {
        console.warn('Error cargando progreso desde cache:', error)
        return null
    }
}

// =============================================
// SELECTORS
// =============================================

// Selectores básicos
export const selectGamificationState = (state) => state.gamification
export const selectBadgesState = (state) => state.gamification.badges
export const selectUserBadges = (state) => state.gamification.userBadges
export const selectNewBadges = (state) => state.gamification.newBadges
export const selectProgress = (state) => state.gamification.progress
export const selectCurrentLeaderboard = (state) => state.gamification.currentLeaderboard
export const selectGoals = (state) => state.gamification.goals
export const selectActivityStats = (state) => state.gamification.activityStats
export const selectInsights = (state) => state.gamification.insights
export const selectNotifications = (state) => state.gamification.notifications
export const selectXPLog = (state) => state.gamification.xpLog
export const selectRecentRewards = (state) => state.gamification.recentRewards
export const selectMeta = (state) => state.gamification.meta
export const selectGamificationStatus = (state) => state.gamification.status
export const selectGamificationError = (state) => state.gamification.error

// Selectores de entity adapters
export const {
    selectAll: selectAllBadges,
    selectById: selectBadgeById,
    selectIds: selectBadgeIds,
    selectTotal: selectTotalBadges
} = badgesAdapter.getSelectors((state) => state.gamification.badges)

export const {
    selectAll: selectAllLeaderboards,
    selectById: selectLeaderboardById,
    selectIds: selectLeaderboardIds
} = leaderboardsAdapter.getSelectors((state) => state.gamification.leaderboards)

// Selectores derivados
export const selectBadgesByType = (type) => (state) => {
    const allBadges = selectAllBadges(state)
    return allBadges.filter(badge => badge.type === type)
}

export const selectBadgesByRarity = (rarity) => (state) => {
    const allBadges = selectAllBadges(state)
    return allBadges.filter(badge => badge.rarity === rarity)
}

export const selectEarnedBadges = (state) => {
    const userBadges = selectUserBadges(state)
    return userBadges.map(ub => ub.badge)
}

export const selectUnearnedBadges = (state) => {
    const allBadges = selectAllBadges(state)
    const earnedBadges = selectEarnedBadges(state)
    const earnedIds = new Set(earnedBadges.map(b => b.id))

    return allBadges.filter(badge => !earnedIds.has(badge.id))
}

export const selectBadgeEarnedStatus = (badgeId) => (state) => {
    const userBadges = selectUserBadges(state)
    return userBadges.some(ub => ub.badge.id === badgeId)
}

export const selectRecentBadges = (limit = 5) => (state) => {
    const userBadges = selectUserBadges(state)
    return [...userBadges]
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, limit)
}

export const selectLeaderboardByType = (type, period) => (state) => {
    const allLeaderboards = selectAllLeaderboards(state)
    return allLeaderboards.find(
        lb => lb.type === type && (!period || lb.period === period)
    )
}

export const selectUserRankInCurrentLeaderboard = (state) => {
    const currentLeaderboard = selectCurrentLeaderboard(state)
    return currentLeaderboard?.data?.userRank || 0
}

export const selectTopLeaderboardEntries = (limit = 10) => (state) => {
    const currentLeaderboard = selectCurrentLeaderboard(state)
    return currentLeaderboard?.data?.entries?.slice(0, limit) || []
}

export const selectUserPositionInLeaderboard = (state) => {
    const currentLeaderboard = selectCurrentLeaderboard(state)
    const userRank = currentLeaderboard?.data?.userRank
    const entries = currentLeaderboard?.data?.entries || []

    if (!userRank) return null

    return entries.find(entry => entry.rank === userRank)
}

export const selectActiveGoals = (state) => {
    const goals = selectGoals(state)
    return goals.filter(goal => !goal.isCompleted)
}

export const selectCompletedGoals = (state) => {
    const goals = selectGoals(state)
    return goals.filter(goal => goal.isCompleted)
}

export const selectGoalProgress = (achievementId) => (state) => {
    const goals = selectGoals(state)
    const goal = goals.find(g => g.id === achievementId)
    return goal ? {
        current: goal.currentValue,
        target: goal.targetValue,
        percentage: (goal.currentValue / goal.targetValue) * 100,
        completed: goal.isCompleted
    } : null
}

export const selectUnreadNotifications = (state) => {
    const notifications = selectNotifications(state)
    return notifications.filter(notification => !notification.read)
}

export const selectUnreadNotificationsCount = (state) => {
    const unreadNotifications = selectUnreadNotifications(state)
    return unreadNotifications.length
}

export const selectRecentXPEarnings = (limit = 10) => (state) => {
    const xpLog = selectXPLog(state)
    return xpLog.slice(0, limit)
}

export const selectTotalXPEarned = (state) => {
    const progress = selectProgress(state)
    return progress.totalXP
}

export const selectLevelProgress = (state) => {
    const progress = selectProgress(state)
    return {
        current: progress.currentXP,
        needed: progress.nextLevelXP - progress.currentXP,
        percentage: progress.progressPercentage,
        level: progress.level,
        nextLevel: progress.level + 1
    }
}

export const selectStreakInfo = (state) => {
    const meta = selectMeta(state)
    return {
        current: meta.streak.current,
        max: meta.streak.max,
        lastActivity: meta.streak.lastActivity
    }
}

export const selectDailyAchievements = (state) => {
    const meta = selectMeta(state)
    return meta.achievementsUnlockedToday
}

export const selectIsNearLevelUp = (state) => {
    const progress = selectProgress(state)
    return progress.progressPercentage >= 90
}

export const selectNextBadgeToEarn = (state) => {
    const unearnedBadges = selectUnearnedBadges(state)
    return unearnedBadges.sort((a, b) => a.xpReward - b.xpReward)[0]
}

// =============================================
// EXPORTACIONES
// =============================================

// Exportar acciones
export const {
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    addXPLogEntry,
    addRecentReward,
    updateStreak,
    incrementDailyAchievements,
    resetDailyCounters,
    filterBadgesByType,
    filterBadgesByRarity,
    sortBadgesBy,
    setActiveLeaderboard,
    clearGamificationError,
    resetGamificationState,
    simulateEvent
} = gamificationSlice.actions

// Exportar thunks
export {
    fetchBadges,
    fetchUserBadges,
    claimBadge,
    fetchProgress,
    addXP,
    fetchLeaderboard,
    fetchOverallLeaderboard,
    fetchWeeklyLeaderboard,
    fetchUserRank,
    fetchCurrentGoals,
    updateGoalProgress,
    fetchActivityStats,
    fetchGamificationInsights,
    fetchNewBadges,
    markBadgesAsSeen
}

// Exportar reducer
export default gamificationSlice.reducer

// Exportar tipos
/**
 * @typedef {Object} GamificationState
 * @property {Object} badges
 * @property {Array} userBadges
 * @property {Array} newBadges
 * @property {string} badgesStatus
 * @property {string|null} badgesError
 * @property {Object} progress
 * @property {string} progressStatus
 * @property {string|null} progressError
 * @property {Object} leaderboards
 * @property {Object|null} currentLeaderboard
 * @property {string} leaderboardStatus
 * @property {string|null} leaderboardError
 * @property {Array} goals
 * @property {string} goalsStatus
 * @property {string|null} goalsError
 * @property {Object|null} activityStats
 * @property {Object|null} insights
 * @property {string} statsStatus
 * @property {string|null} statsError
 * @property {Array} notifications
 * @property {Array} xpLog
 * @property {Array} recentRewards
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastUpdated
 * @property {Object} meta
 */