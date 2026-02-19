// store/hooks/useNetwork.js
// noinspection UnnecessaryLocalVariableJS,GrazieInspection

import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
    // Thunks
    fetchMentors,
    fetchMentorById,
    requestMentorship,
    // Acciones síncronas
    setCurrentMentor,
    setMentorFilters,
    setCommunityFilters,
    setCurrentConversation,
    addRealtimeMessage,
    // Selectores
    selectNetworkState,
    selectAllMentors,
    selectCurrentMentor,
    selectMentorFilters,
    selectAllCommunities,
    selectUserCommunities,
    selectCommunityFilters,
    selectAllConnections,
    selectConnectionFilters,
    selectAllMessages,
    selectMessageFilters,
    selectCurrentConversationId,
    selectAllConversations,
    selectSentMentorRequests,
    selectReceivedMentorRequests,
    selectNetworkStats,
    selectNetworkingInsights,
    selectConnectionSuggestions,
    selectFeaturedUsers,
    selectNetworkStatus,
    selectNetworkError
} from '../slices/networkSlice'
import { ConnectionStatus, MentorAvailability } from '@/api/services/networkService'

// noinspection GrazieInspection
/**
 * Hook personalizado para networking
 */
export const useNetwork = () => {
    const dispatch = useDispatch()

    // Selectores básicos
    const networkState = useSelector(selectNetworkState)
    const allMentors = useSelector(selectAllMentors)
    const currentMentor = useSelector(selectCurrentMentor)
    const mentorFilters = useSelector(selectMentorFilters)
    const allCommunities = useSelector(selectAllCommunities)
    const userCommunities = useSelector(selectUserCommunities)
    const communityFilters = useSelector(selectCommunityFilters)
    const allConnections = useSelector(selectAllConnections)
    const connectionFilters = useSelector(selectConnectionFilters)
    const allMessages = useSelector(selectAllMessages)
    const messageFilters = useSelector(selectMessageFilters)
    const currentConversationId = useSelector(selectCurrentConversationId)
    const allConversations = useSelector(selectAllConversations)
    const sentMentorRequests = useSelector(selectSentMentorRequests)
    const receivedMentorRequests = useSelector(selectReceivedMentorRequests)
    const networkStats = useSelector(selectNetworkStats)
    const networkingInsights = useSelector(selectNetworkingInsights)
    const connectionSuggestions = useSelector(selectConnectionSuggestions)
    const featuredUsers = useSelector(selectFeaturedUsers)
    const status = useSelector(selectNetworkStatus)
    const error = useSelector(selectNetworkError)

    // Selectores derivados (usando useMemo para memoización)
    const pendingConnections = useMemo(() =>
        allConnections.filter(conn => conn.status === ConnectionStatus.PENDING),
        [allConnections]
    )

    const activeConnections = useMemo(() =>
        allConnections.filter(conn => conn.status === ConnectionStatus.ACCEPTED),
        [allConnections]
    )

    const availableMentors = useMemo(() =>
        allMentors.filter(mentor => mentor.availability === MentorAvailability.AVAILABLE),
        [allMentors]
    )

    const unreadConversations = useMemo(() =>
        allConversations.filter(conv => conv.unreadCount > 0),
        [allConversations]
    )

    // Acciones asíncronas
    const loadMentors = useCallback(async (filters = {}) => {
        try {
            const result = await dispatch(fetchMentors(filters)).unwrap()
            return result.mentors
        } catch (error) {
            console.error('Error cargando mentores:', error)
            throw error
        }
    }, [dispatch])

    const loadMentor = useCallback(async (mentorId) => {
        try {
            const mentor = await dispatch(fetchMentorById(mentorId)).unwrap()
            return mentor
        } catch (error) {
            console.error('Error cargando mentor:', error)
            throw error
        }
    }, [dispatch])

    const requestMentor = useCallback(async (mentorId, requestData) => {
        try {
            const request = await dispatch(requestMentorship({ mentorId, requestData })).unwrap()
            return request
        } catch (error) {
            console.error('Error solicitando mentoría:', error)
            throw error
        }
    }, [dispatch])

    // ... continuar con las demás acciones asíncronas

    // Acciones síncronas
    const selectMentor = useCallback((mentor) => {
        dispatch(setCurrentMentor(mentor))
    }, [dispatch])

    const applyMentorFilters = useCallback((filters) => {
        dispatch(setMentorFilters(filters))
    }, [dispatch])

    const applyCommunityFilters = useCallback((filters) => {
        dispatch(setCommunityFilters(filters))
    }, [dispatch])

    const selectConversation = useCallback((conversationId) => {
        dispatch(setCurrentConversation(conversationId))
    }, [dispatch])

    const addMessage = useCallback((message) => {
        dispatch(addRealtimeMessage(message))
    }, [dispatch])

    // Utilitarios
    const getMentorById = useCallback((mentorId) => {
        return allMentors.find(mentor => mentor.id === mentorId)
    }, [allMentors])

    const getCommunityById = useCallback((communityId) => {
        return allCommunities.find(community => community.id === communityId)
    }, [allCommunities])

    const getConnectionById = useCallback((connectionId) => {
        return allConnections.find(connection => connection.id === connectionId)
    }, [allConnections])

    const getMessagesByConversation = useCallback((conversationId) => {
        return allMessages.filter(message => message.conversationId === conversationId)
    }, [allMessages])

    const isUserInCommunity = useCallback((communityId) => {
        return userCommunities.some(community => community.id === communityId)
    }, [userCommunities])

    const hasPendingConnectionWith = useCallback((userId) => {
        return allConnections.some(conn =>
            conn.userId === userId && conn.status === ConnectionStatus.PENDING
        )
    }, [allConnections])

    // Estadísticas y métricas
    const networkMetrics = useMemo(() => {
        const stats = networkStats || {}

        return {
            totalConnections: stats.total || 0,
            activeConnections: stats.accepted || 0,
            pendingRequests: stats.pending || 0,
            totalMentors: allMentors.length,
            availableMentors: availableMentors.length,
            totalCommunities: allCommunities.length,
            joinedCommunities: userCommunities.length,
            unreadMessages: unreadConversations.reduce((total, conv) => total + conv.unreadCount, 0),
            activeChats: allConversations.filter(conv => {
                const lastActivity = new Date(conv.lastActivityAt)
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                return lastActivity > weekAgo
            }).length
        }
    }, [networkStats, allMentors, availableMentors, allCommunities, userCommunities, unreadConversations, allConversations])

    // Estados derivados
    const isLoading = useMemo(() => status === 'loading', [status])
    const hasError = useMemo(() => status === 'error', [status])
    const isSuccess = useMemo(() => status === 'success', [status])

    return {
        // Estado
        networkState,
        allMentors,
        currentMentor,
        mentorFilters,
        allCommunities,
        userCommunities,
        communityFilters,
        allConnections,
        connectionFilters,
        pendingConnections,
        activeConnections,
        allMessages,
        messageFilters,
        currentConversationId,
        allConversations,
        unreadConversations,
        sentMentorRequests,
        receivedMentorRequests,
        networkStats,
        networkingInsights,
        connectionSuggestions,
        featuredUsers,
        availableMentors,
        status,
        error,

        // Acciones asíncronas
        loadMentors,
        loadMentor,
        requestMentor,
        // ... demás acciones asíncronas

        // Acciones síncronas
        selectMentor,
        applyMentorFilters,
        applyCommunityFilters,
        selectConversation,
        addMessage,
        // ... demás acciones síncronas

        // Utilitarios
        getMentorById,
        getCommunityById,
        getConnectionById,
        getMessagesByConversation,
        isUserInCommunity,
        hasPendingConnectionWith,

        // Métricas
        networkMetrics,

        // Estados derivados
        isLoading,
        hasError,
        isSuccess,

        // Flags de conveniencia
        hasMentors: allMentors.length > 0,
        hasCommunities: allCommunities.length > 0,
        hasConnections: allConnections.length > 0,
        hasMessages: allMessages.length > 0,
        hasConversations: allConversations.length > 0,
        hasPendingRequests: pendingConnections.length > 0,
        hasUnreadMessages: unreadConversations.length > 0,
        hasNetworkStats: !!networkStats,
        hasFeaturedUsers: featuredUsers.length > 0
    }
}