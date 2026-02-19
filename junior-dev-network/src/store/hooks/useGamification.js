// store/hooks/useGamification.js
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
    // Thunks
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
    markBadgesAsSeen,

    // Acciones síncronas
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    addXPLogEntry,
    updateStreak,
    incrementDailyAchievements,
    resetDailyCounters,
    filterBadgesByType,
    setActiveLeaderboard,
    clearGamificationError,
    simulateEvent,

    // Selectores
    selectGamificationState,
    selectAllBadges,
    selectUserBadges,
    selectNewBadges,
    selectProgress,
    selectCurrentLeaderboard,
    selectGoals,
    selectActivityStats,
    selectInsights,
    selectNotifications,
    selectXPLog,
    selectRecentRewards,
    selectMeta,
    selectEarnedBadges,
    selectUnearnedBadges,
    selectRecentBadges,
    selectUserPositionInLeaderboard,
    selectActiveGoals,
    selectCompletedGoals,
    selectUnreadNotificationsCount,
    selectLevelProgress,
    selectStreakInfo,
    selectDailyAchievements,
    selectIsNearLevelUp,
    selectNextBadgeToEarn,
    selectGamificationStatus,
    selectGamificationError
} from '../slices/gamificationSlice'

/**
 * Hook personalizado para gamificación
 */
export const useGamification = () => {
    const dispatch = useDispatch()

    // Selectores
    const state = useSelector(selectGamificationState)
    const allBadges = useSelector(selectAllBadges)
    const userBadges = useSelector(selectUserBadges)
    const newBadges = useSelector(selectNewBadges)
    const progress = useSelector(selectProgress)
    const currentLeaderboard = useSelector(selectCurrentLeaderboard)
    const goals = useSelector(selectGoals)
    const activityStats = useSelector(selectActivityStats)
    const insights = useSelector(selectInsights)
    const notifications = useSelector(selectNotifications)
    const xpLog = useSelector(selectXPLog)
    const recentRewards = useSelector(selectRecentRewards)
    const meta = useSelector(selectMeta)
    const earnedBadges = useSelector(selectEarnedBadges)
    const unearnedBadges = useSelector(selectUnearnedBadges)
    const recentBadges = useSelector(selectRecentBadges)
    const userPosition = useSelector(selectUserPositionInLeaderboard)
    const activeGoals = useSelector(selectActiveGoals)
    const completedGoals = useSelector(selectCompletedGoals)
    const unreadNotificationsCount = useSelector(selectUnreadNotificationsCount)
    const levelProgress = useSelector(selectLevelProgress)
    const streakInfo = useSelector(selectStreakInfo)
    const dailyAchievements = useSelector(selectDailyAchievements)
    const isNearLevelUp = useSelector(selectIsNearLevelUp)
    const nextBadgeToEarn = useSelector(selectNextBadgeToEarn)
    const status = useSelector(selectGamificationStatus)
    const error = useSelector(selectGamificationError)

    // Acciones asíncronas
    const loadBadges = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const badges = await dispatch(fetchBadges()).unwrap()
            return badges
        } catch (err) {
            console.error('Error cargando badges:', err)
            throw err
        }
    }, [dispatch])

    const loadUserBadges = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const userBadges = await dispatch(fetchUserBadges()).unwrap()
            return userBadges
        } catch (err) {
            console.error('Error cargando badges del usuario:', err)
            throw err
        }
    }, [dispatch])

    const claimUserBadge = useCallback(async (badgeId) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const badge = await dispatch(claimBadge(badgeId)).unwrap()
            return badge
        } catch (err) {
            console.error('Error reclamando badge:', err)
            throw err
        }
    }, [dispatch])

    const loadProgress = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const progressData = await dispatch(fetchProgress()).unwrap()
            return progressData
        } catch (err) {
            console.error('Error cargando progreso:', err)
            throw err
        }
    }, [dispatch])

    const addUserXP = useCallback(async (xp, source = 'general') => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(addXP({ xp, source })).unwrap()
            return result
        } catch (err) {
            console.error('Error agregando XP:', err)
            throw err
        }
    }, [dispatch])

    const loadLeaderboard = useCallback(async (options = {}) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const leaderboard = await dispatch(fetchLeaderboard(options)).unwrap()
            return leaderboard
        } catch (err) {
            console.error('Error cargando leaderboard:', err)
            throw err
        }
    }, [dispatch])

    const loadOverallLeaderboard = useCallback(async (limit = 50) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const leaderboard = await dispatch(fetchOverallLeaderboard(limit)).unwrap()
            return leaderboard
        } catch (err) {
            console.error('Error cargando leaderboard general:', err)
            throw err
        }
    }, [dispatch])

    const loadWeeklyLeaderboard = useCallback(async (limit = 30) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const leaderboard = await dispatch(fetchWeeklyLeaderboard(limit)).unwrap()
            return leaderboard
        } catch (err) {
            console.error('Error cargando leaderboard semanal:', err)
            throw err
        }
    }, [dispatch])

    const loadUserRank = useCallback(async (type) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const rank = await dispatch(fetchUserRank(type)).unwrap()
            return rank
        } catch (err) {
            console.error('Error cargando ranking:', err)
            throw err
        }
    }, [dispatch])

    const loadGoals = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const goals = await dispatch(fetchCurrentGoals()).unwrap()
            return goals
        } catch (err) {
            console.error('Error cargando metas:', err)
            throw err
        }
    }, [dispatch])

    const updateGoal = useCallback(async (achievementId, increment = 1) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(updateGoalProgress({ achievementId, increment })).unwrap()
            return result
        } catch (err) {
            console.error('Error actualizando meta:', err)
            throw err
        }
    }, [dispatch])

    const loadActivityStats = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const stats = await dispatch(fetchActivityStats()).unwrap()
            return stats
        } catch (err) {
            console.error('Error cargando estadísticas:', err)
            throw err
        }
    }, [dispatch])

    const loadInsights = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const insightsData = await dispatch(fetchGamificationInsights()).unwrap()
            return insightsData
        } catch (err) {
            console.error('Error cargando insights:', err)
            throw err
        }
    }, [dispatch])

    const loadNewBadges = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const newBadgesData = await dispatch(fetchNewBadges()).unwrap()
            return newBadgesData
        } catch (err) {
            console.error('Error cargando badges nuevos:', err)
            throw err
        }
    }, [dispatch])

    const markBadgesSeen = useCallback(async (badgeIds) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(markBadgesAsSeen(badgeIds)).unwrap()
            return result
        } catch (err) {
            console.error('Error marcando badges como vistos:', err)
            throw err
        }
    }, [dispatch])

    // Acciones síncronas
    const sendNotification = useCallback((notification) => {
        dispatch(addNotification(notification))
    }, [dispatch])

    const markNotificationRead = useCallback((notificationId) => {
        dispatch(markNotificationAsRead(notificationId))
    }, [dispatch])

    const clearAllNotifications = useCallback(() => {
        dispatch(clearNotifications())
    }, [dispatch])

    const logXP = useCallback((entry) => {
        dispatch(addXPLogEntry(entry))
    }, [dispatch])

    const updateUserStreak = useCallback(() => {
        dispatch(updateStreak())
    }, [dispatch])

    const incrementAchievements = useCallback(() => {
        dispatch(incrementDailyAchievements())
    }, [dispatch])

    const resetDaily = useCallback(() => {
        dispatch(resetDailyCounters())
    }, [dispatch])

    const filterBadges = useCallback((type) => {
        dispatch(filterBadgesByType(type))
    }, [dispatch])

    const setLeaderboard = useCallback((type, period) => {
        dispatch(setActiveLeaderboard({ type, period }))
    }, [dispatch])

    const clearErrors = useCallback(() => {
        dispatch(clearGamificationError())
    }, [dispatch])

    const simulateGamificationEvent = useCallback((type, data) => {
        dispatch(simulateEvent({ type, data }))
    }, [dispatch])

    // Utilitarios
    const getBadgeById = useCallback((badgeId) => {
        return allBadges.find(badge => badge.id === badgeId)
    }, [allBadges])

    const getBadgeEarnedStatus = useCallback((badgeId) => {
        return userBadges.some(ub => ub.badge.id === badgeId)
    }, [userBadges])

    const getBadgesByType = useCallback((type) => {
        return allBadges.filter(badge => badge.type === type)
    }, [allBadges])

    const getBadgesByRarity = useCallback((rarity) => {
        return allBadges.filter(badge => badge.rarity === rarity)
    }, [allBadges])

    const getGoalProgress = useCallback((achievementId) => {
        const goal = goals.find(g => g.id === achievementId)
        return goal ? {
            current: goal.currentValue,
            target: goal.targetValue,
            percentage: (goal.currentValue / goal.targetValue) * 100,
            completed: goal.isCompleted
        } : null
    }, [goals])

    const getRecentXP = useCallback((limit = 10) => {
        return xpLog.slice(0, limit)
    }, [xpLog])

    const getUnreadNotifications = useCallback(() => {
        return notifications.filter(n => !n.read)
    }, [notifications])

    // Valores memoizados
    const badgeCounts = useMemo(() => {
        const counts = {
            total: allBadges.length,
            earned: earnedBadges.length,
            unearned: unearnedBadges.length,
            new: newBadges.length,
            byType: {},
            byRarity: {}
        }

        // Contar por tipo
        Object.values(BadgeType).forEach(type => {
            counts.byType[type] = allBadges.filter(b => b.type === type).length
        })

        // Contar por rareza
        Object.values(BadgeRarity).forEach(rarity => {
            counts.byRarity[rarity] = allBadges.filter(b => b.rarity === rarity).length
        })

        return counts
    }, [allBadges, earnedBadges, unearnedBadges, newBadges])

    const leaderboardInfo = useMemo(() => {
        if (!currentLeaderboard) return null

        return {
            type: currentLeaderboard.type,
            period: currentLeaderboard.period,
            userRank: currentLeaderboard.data?.userRank || 0,
            totalParticipants: currentLeaderboard.data?.totalParticipants || 0,
            topEntries: currentLeaderboard.data?.entries?.slice(0, 5) || [],
            userPosition: userPosition
        }
    }, [currentLeaderboard, userPosition])

    const progressInfo = useMemo(() => {
        return {
            level: progress.level,
            xp: progress.currentXP,
            totalXP: progress.totalXP,
            nextLevelXP: progress.nextLevelXP,
            progressPercentage: progress.progressPercentage,
            badgesEarned: progress.badgesEarned,
            projectsCompleted: progress.projectsCompleted,
            connectionsMade: progress.connectionsMade,
            mentoringSessions: progress.mentoringSessions
        }
    }, [progress])

    const isLoading = useMemo(() => status === 'loading', [status])
    const hasError = useMemo(() => status === 'error', [status])
    const isSuccess = useMemo(() => status === 'success', [status])

    return {
        // Estado
        state,
        allBadges,
        userBadges,
        newBadges,
        progress: progressInfo,
        currentLeaderboard: leaderboardInfo,
        goals,
        activeGoals,
        completedGoals,
        activityStats,
        insights,
        notifications,
        xpLog,
        recentRewards,
        meta,
        earnedBadges,
        unearnedBadges,
        recentBadges,
        userPosition,
        unreadNotificationsCount,
        levelProgress,
        streakInfo,
        dailyAchievements,
        isNearLevelUp,
        nextBadgeToEarn,
        status,
        error,

        // Acciones asíncronas
        loadBadges,
        loadUserBadges,
        claimUserBadge,
        loadProgress,
        addUserXP,
        loadLeaderboard,
        loadOverallLeaderboard,
        loadWeeklyLeaderboard,
        loadUserRank,
        loadGoals,
        updateGoal,
        loadActivityStats,
        loadInsights,
        loadNewBadges,
        markBadgesSeen,

        // Acciones síncronas
        sendNotification,
        markNotificationRead,
        clearAllNotifications,
        logXP,
        updateUserStreak,
        incrementAchievements,
        resetDaily,
        filterBadges,
        setLeaderboard,
        clearErrors,
        simulateGamificationEvent,

        // Utilitarios
        getBadgeById,
        getBadgeEarnedStatus,
        getBadgesByType,
        getBadgesByRarity,
        getGoalProgress,
        getRecentXP,
        getUnreadNotifications,

        // Valores derivados
        badgeCounts,
        isLoading,
        isSuccess,
        hasError,

        // Flags de conveniencia
        hasBadges: allBadges.length > 0,
        hasUserBadges: userBadges.length > 0,
        hasNewBadges: newBadges.length > 0,
        hasGoals: goals.length > 0,
        hasLeaderboard: !!currentLeaderboard,
        hasUnreadNotifications: unreadNotificationsCount > 0,
        isOnStreak: streakInfo.current > 1,
        canLevelUp: progress.currentXP >= progress.nextLevelXP
    }
}

/**
 * Hook para manejar recompensas por actividades
 */
export const useRewards = () => {
    const { addUserXP, logXP, sendNotification } = useGamification()

    const rewardProjectCompletion = useCallback(async (projectDifficulty = 1) => {
        const xp = 100 * projectDifficulty
        const result = await addUserXP(xp, 'project_completion')

        logXP({
            xp,
            source: 'project_completion',
            description: `Proyecto completado (dificultad: ${projectDifficulty})`
        })

        if (result.leveledUp) {
            sendNotification({
                type: 'success',
                title: '¡Nivel subido!',
                message: `Completaste un proyecto y subiste de nivel`,
                badge: 'level_up'
            })
        }

        return result
    }, [addUserXP, logXP, sendNotification])

    const rewardConnection = useCallback(async () => {
        const xp = 25
        const result = await addUserXP(xp, 'new_connection')

        logXP({
            xp,
            source: 'new_connection',
            description: 'Nueva conexión establecida'
        })

        return result
    }, [addUserXP, logXP])

    const rewardMentoringSession = useCallback(async () => {
        const xp = 50
        const result = await addUserXP(xp, 'mentoring_session')

        logXP({
            xp,
            source: 'mentoring_session',
            description: 'Sesión de mentoría completada'
        })

        return result
    }, [addUserXP, logXP])

    const rewardCVUpload = useCallback(async () => {
        const xp = 30
        const result = await addUserXP(xp, 'cv_upload')

        logXP({
            xp,
            source: 'cv_upload',
            description: 'CV subido y analizado'
        })

        return result
    }, [addUserXP, logXP])

    const rewardDailyLogin = useCallback(async () => {
        const xp = 10
        const result = await addUserXP(xp, 'daily_login')

        logXP({
            xp,
            source: 'daily_login',
            description: 'Inicio de sesión diario'
        })

        // Posible badge por streak
        return result
    }, [addUserXP, logXP])

    return {
        rewardProjectCompletion,
        rewardConnection,
        rewardMentoringSession,
        rewardCVUpload,
        rewardDailyLogin
    }
}