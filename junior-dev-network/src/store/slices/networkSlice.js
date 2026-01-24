// store/slices/networkSlice.js
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { networkService } from '@/api/services'
import {
    API_CONFIG,
    STORAGE_KEYS,
    LOADING_STATES,
    CACHE_CONFIG
} from '@/constants/apiConfig'
import {
    ConnectionStatus,
    MentorAvailability,
    MessageStatus,
    CommunityType
} from '@/api/services/networkService'

// =============================================
// ADAPTERS Y NORMALIZACIÓN
// =============================================

// Entity adapter para mentores
const mentorsAdapter = createEntityAdapter({
    selectId: (mentor) => mentor.id,
    sortComparer: (a, b) => {
        // Ordenar por disponibilidad, rating y experiencia
        const availabilityOrder = {
            [MentorAvailability.AVAILABLE]: 3,
            [MentorAvailability.LIMITED]: 2,
            [MentorAvailability.UNAVAILABLE]: 1,
            [MentorAvailability.ON_VACATION]: 0
        }
        return (availabilityOrder[b.availability] || 0) - (availabilityOrder[a.availability] || 0) ||
            b.rating - a.rating ||
            b.yearsOfExperience - a.yearsOfExperience
    }
})

// Entity adapter para comunidades
const communitiesAdapter = createEntityAdapter({
    selectId: (community) => community.id,
    sortComparer: (a, b) => b.memberCount - a.memberCount
})

// Entity adapter para conexiones
const connectionsAdapter = createEntityAdapter({
    selectId: (connection) => connection.id,
    sortComparer: (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
})

// Entity adapter para mensajes
const messagesAdapter = createEntityAdapter({
    selectId: (message) => message.id,
    sortComparer: (a, b) => new Date(a.sentAt) - new Date(b.sentAt) // Cronológico
})

// Entity adapter para conversaciones
const conversationsAdapter = createEntityAdapter({
    selectId: (conversation) => conversation.id,
    sortComparer: (a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
})

// =============================================
// ASYNC THUNKS
// =============================================

/**
 * Obtiene mentores disponibles
 */
export const fetchMentors = createAsyncThunk(
    'network/fetchMentors',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const mentors = await networkService.getMentors(filters)
            return { mentors, filters }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene un mentor por ID
 */
export const fetchMentorById = createAsyncThunk(
    'network/fetchMentorById',
    async (mentorId, { rejectWithValue }) => {
        try {
            const mentor = await networkService.getMentorById(mentorId)
            return mentor
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Solicita mentoría a un mentor
 */
export const requestMentorship = createAsyncThunk(
    'network/requestMentorship',
    async ({ mentorId, requestData }, { rejectWithValue, dispatch }) => {
        try {
            const request = await networkService.requestMentor(mentorId, requestData)

            // Actualizar solicitudes enviadas
            dispatch(fetchSentMentorRequests())

            return request
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene mentores recomendados
 */
export const fetchRecommendedMentors = createAsyncThunk(
    'network/fetchRecommendedMentors',
    async (limit = 10, { rejectWithValue }) => {
        try {
            const mentors = await networkService.getRecommendedMentors(limit)
            return mentors
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene comunidades disponibles
 */
export const fetchCommunities = createAsyncThunk(
    'network/fetchCommunities',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const communities = await networkService.getCommunities(filters)
            return { communities, filters }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Se une a una comunidad
 */
export const joinCommunity = createAsyncThunk(
    'network/joinCommunity',
    async (communityId, { rejectWithValue, dispatch }) => {
        try {
            const result = await networkService.joinCommunity(communityId)

            // Refrescar comunidades del usuario
            dispatch(fetchUserCommunities())

            return { communityId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene comunidades del usuario
 */
export const fetchUserCommunities = createAsyncThunk(
    'network/fetchUserCommunities',
    async (_, { rejectWithValue }) => {
        try {
            const communities = await networkService.getUserCommunities()
            return communities
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene conexiones del usuario
 */
export const fetchConnections = createAsyncThunk(
    'network/fetchConnections',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const connections = await networkService.getConnections(filters)
            return { connections, filters }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Envía solicitud de conexión
 */
export const sendConnectionRequest = createAsyncThunk(
    'network/sendConnectionRequest',
    async (connectionData, { rejectWithValue, dispatch }) => {
        try {
            const connection = await networkService.sendConnectionRequest(connectionData)

            // Refrescar conexiones
            dispatch(fetchConnections())

            return connection
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Acepta solicitud de conexión
 */
export const acceptConnection = createAsyncThunk(
    'network/acceptConnection',
    async (connectionId, { rejectWithValue, dispatch }) => {
        try {
            const result = await networkService.acceptConnection(connectionId)

            // Refrescar conexiones
            dispatch(fetchConnections())

            return { connectionId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Rechaza solicitud de conexión
 */
export const rejectConnection = createAsyncThunk(
    'network/rejectConnection',
    async (connectionId, { rejectWithValue, dispatch }) => {
        try {
            const result = await networkService.rejectConnection(connectionId)

            // Refrescar conexiones
            dispatch(fetchConnections())

            return { connectionId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene mensajes
 */
export const fetchMessages = createAsyncThunk(
    'network/fetchMessages',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const messages = await networkService.getMessages(filters)
            return { messages, filters }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Envía mensaje
 */
export const sendMessage = createAsyncThunk(
    'network/sendMessage',
    async (messageData, { rejectWithValue, dispatch }) => {
        try {
            const message = await networkService.sendMessage(messageData)

            // Refrescar mensajes de la conversación
            if (message.conversationId) {
                dispatch(fetchMessages({ conversationId: message.conversationId }))
            }

            // Refrescar conversaciones
            dispatch(fetchConversations())

            return message
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene conversaciones
 */
export const fetchConversations = createAsyncThunk(
    'network/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            const conversations = await networkService.getConversations()
            return conversations
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Marca mensajes como leídos
 */
export const markMessagesAsRead = createAsyncThunk(
    'network/markMessagesAsRead',
    async (conversationId, { rejectWithValue, dispatch }) => {
        try {
            const result = await networkService.markMessagesAsRead(conversationId)

            // Refrescar conversaciones para actualizar conteo de no leídos
            dispatch(fetchConversations())

            return { conversationId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene estadísticas de networking
 */
export const fetchNetworkStats = createAsyncThunk(
    'network/fetchNetworkStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await networkService.getConnectionStats()
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
 * Obtiene insights de networking
 */
export const fetchNetworkingInsights = createAsyncThunk(
    'network/fetchNetworkingInsights',
    async (_, { rejectWithValue }) => {
        try {
            const insights = await networkService.getNetworkingInsights()
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
 * Obtiene solicitudes de mentoría enviadas
 */
export const fetchSentMentorRequests = createAsyncThunk(
    'network/fetchSentMentorRequests',
    async (_, { rejectWithValue }) => {
        try {
            const requests = await networkService.getSentMentorRequests()
            return requests
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene solicitudes de mentoría recibidas
 */
export const fetchReceivedMentorRequests = createAsyncThunk(
    'network/fetchReceivedMentorRequests',
    async (_, { rejectWithValue }) => {
        try {
            const requests = await networkService.getReceivedMentorRequests()
            return requests
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene sugerencias de conexión
 */
export const fetchConnectionSuggestions = createAsyncThunk(
    'network/fetchConnectionSuggestions',
    async (limit = 10, { rejectWithValue }) => {
        try {
            const suggestions = await networkService.getConnectionSuggestions(limit)
            return suggestions
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene usuarios destacados
 */
export const fetchFeaturedUsers = createAsyncThunk(
    'network/fetchFeaturedUsers',
    async (limit = 5, { rejectWithValue }) => {
        try {
            const featuredUsers = await networkService.getFeaturedUsers(limit)
            return featuredUsers
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
    // Mentores
    mentors: mentorsAdapter.getInitialState(),
    currentMentor: null,
    mentorFilters: {},
    mentorsStatus: LOADING_STATES.IDLE,
    mentorsError: null,

    // Comunidades
    communities: communitiesAdapter.getInitialState(),
    userCommunities: [],
    communityFilters: {},
    communitiesStatus: LOADING_STATES.IDLE,
    communitiesError: null,

    // Conexiones
    connections: connectionsAdapter.getInitialState(),
    connectionFilters: {},
    connectionsStatus: LOADING_STATES.IDLE,
    connectionsError: null,

    // Mensajería
    messages: messagesAdapter.getInitialState(),
    currentConversationId: null,
    messageFilters: {},
    messagesStatus: LOADING_STATES.IDLE,
    messagesError: null,

    // Conversaciones
    conversations: conversationsAdapter.getInitialState(),
    conversationsStatus: LOADING_STATES.IDLE,
    conversationsError: null,

    // Solicitudes de mentoría
    sentMentorRequests: [],
    receivedMentorRequests: [],
    mentorRequestsStatus: LOADING_STATES.IDLE,
    mentorRequestsError: null,

    // Estadísticas e insights
    networkStats: null,
    networkingInsights: null,
    connectionSuggestions: [],
    featuredUsers: [],
    statsStatus: LOADING_STATES.IDLE,
    statsError: null,

    // Estado general
    status: LOADING_STATES.IDLE,
    error: null,
    lastUpdated: null,

    // Metadata
    meta: {
        totalConnections: 0,
        totalMentorsContacted: 0,
        totalMessagesSent: 0,
        totalCommunitiesJoined: 0,
        lastConnectionActivity: null,
        networkGrowth: 0,
        activeChats: 0
    }
}

// =============================================
// SLICE PRINCIPAL
// =============================================

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        // =============================================
        // REDUCERS SÍNCRONOS
        // =============================================

        /**
         * Establece mentor actual
         */
        setCurrentMentor: (state, action) => {
            state.currentMentor = action.payload
        },

        /**
         * Establece filtros de mentores
         */
        setMentorFilters: (state, action) => {
            state.mentorFilters = action.payload
        },

        /**
         * Establece filtros de comunidades
         */
        setCommunityFilters: (state, action) => {
            state.communityFilters = action.payload
        },

        /**
         * Establece filtros de conexiones
         */
        setConnectionFilters: (state, action) => {
            state.connectionFilters = action.payload
        },

        /**
         * Establece filtros de mensajes
         */
        setMessageFilters: (state, action) => {
            state.messageFilters = action.payload
        },

        /**
         * Establece conversación actual
         */
        setCurrentConversation: (state, action) => {
            const conversationId = action.payload
            state.currentConversationId = conversationId

            // Marcar mensajes como leídos cuando se abre la conversación
            if (conversationId) {
                const conversation = state.conversations.entities[conversationId]
                if (conversation && conversation.unreadCount > 0) {
                    conversation.unreadCount = 0
                }
            }
        },

        /**
         * Agrega mensaje en tiempo real (para WebSockets)
         */
        addRealtimeMessage: (state, action) => {
            const message = action.payload
            messagesAdapter.addOne(state.messages, message)

            // Actualizar conversación relacionada
            if (message.conversationId) {
                const conversation = state.conversations.entities[message.conversationId]
                if (conversation) {
                    conversation.lastMessage = message
                    conversation.lastActivityAt = message.sentAt
                    
                    // Incrementar no leídos si no es el usuario actual
                    if (message.senderId !== state.meta.currentUserId) {
                        conversation.unreadCount = (conversation.unreadCount || 0) + 1
                    }
                }
            }
        },

        /**
         * Marca mensaje como leído localmente
         */
        markMessageAsRead: (state, action) => {
            const messageId = action.payload
            const message = state.messages.entities[messageId]
            
            if (message && message.status !== MessageStatus.READ) {
                message.status = MessageStatus.READ
                message.readAt = new Date().toISOString()
            }
        },

        /**
         * Agrega conexión pendiente localmente
         */
        addPendingConnection: (state, action) => {
            const connection = {
                ...action.payload,
                id: `temp_${Date.now()}`,
                status: ConnectionStatus.PENDING,
                requestedAt: new Date().toISOString(),
                isTemporary: true
            }
            connectionsAdapter.addOne(state.connections, connection)
        },

        /**
         * Elimina conexión temporal
         */
        removeTemporaryConnection: (state, action) => {
            const connectionId = action.payload
            const connection = state.connections.entities[connectionId]
            
            if (connection && connection.isTemporary) {
                connectionsAdapter.removeOne(state.connections, connectionId)
            }
        },

        /**
         * Actualiza estado de conexión
         */
        updateConnectionStatus: (state, action) => {
            const { connectionId, status } = action.payload
            const connection = state.connections.entities[connectionId]
            
            if (connection) {
                connection.status = status
                connection.respondedAt = new Date().toISOString()
                
                // Si es aceptada, actualizar estadísticas
                if (status === ConnectionStatus.ACCEPTED) {
                    state.meta.totalConnections += 1
                }
            }
        },

        /**
         * Filtra mentores por skill
         */
        filterMentorsBySkill: (state, action) => {
            const skill = action.payload
            state.mentorFilters.skills = state.mentorFilters.skills || []
            
            if (!state.mentorFilters.skills.includes(skill)) {
                state.mentorFilters.skills.push(skill)
            }
        },

        /**
         * Limpia filtros de mentores
         */
        clearMentorFilters: (state) => {
            state.mentorFilters = {}
        },

        /**
         * Ordena mentores por criterio
         */
        sortMentorsBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.mentors.sort = { field, direction }
        },

        /**
         * Ordena comunidades por criterio
         */
        sortCommunitiesBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.communities.sort = { field, direction }
        },

        /**
         * Ordena conexiones por criterio
         */
        sortConnectionsBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.connections.sort = { field, direction }
        },

        /**
         * Limpia errores de networking
         */
        clearNetworkError: (state) => {
            state.error = null
            state.mentorsError = null
            state.communitiesError = null
            state.connectionsError = null
            state.messagesError = null
            state.conversationsError = null
            state.mentorRequestsError = null
            state.statsError = null
            state.status = LOADING_STATES.IDLE
        },

        /**
         * Limpia mensajes de conversación actual
         */
        clearCurrentConversation: (state) => {
            state.currentConversationId = null
            state.messageFilters = {}
        },

        /**
         * Resetea estado de networking
         */
        resetNetworkState: () => {
            return initialState
        },

        /**
         * Simula evento de networking (para desarrollo)
         */
        simulateNetworkEvent: (state, action) => {
            const { type, data } = action.payload

            switch (type) {
                case 'new_connection':
                    const newConnection = {
                        id: `conn_sim_${Date.now()}`,
                        userId: data.userId || 'user_sim',
                        userAlias: data.userAlias || 'Usuario Simulado',
                        userAvatarUrl: data.avatarUrl || '/avatars/default.png',
                        commonSkills: data.skills || [],
                        status: ConnectionStatus.PENDING,
                        message: data.message || 'Me gustaría conectarme',
                        requestedAt: new Date().toISOString(),
                        interactionScore: 0
                    }
                    connectionsAdapter.addOne(state.connections, newConnection)
                    break

                case 'new_message':
                    const newMessage = {
                        id: `msg_sim_${Date.now()}`,
                        conversationId: data.conversationId || 'conv_sim',
                        senderId: data.senderId || 'user_sim',
                        recipientId: data.recipientId || state.meta.currentUserId,
                        content: data.content || 'Hola, ¿cómo estás?',
                        status: MessageStatus.SENT,
                        sentAt: new Date().toISOString(),
                        isEdited: false,
                        attachments: []
                    }
                    messagesAdapter.addOne(state.messages, newMessage)
                    break

                case 'mentor_available':
                    const mentor = state.mentors.entities[data.mentorId]
                    if (mentor) {
                        mentor.availability = MentorAvailability.AVAILABLE
                    }
                    break
            }
        }
    },
    extraReducers: (builder) => {
        // =============================================
        // FETCH MENTORS
        // =============================================
        builder
            .addCase(fetchMentors.pending, (state) => {
                state.mentorsStatus = LOADING_STATES.LOADING
                state.mentorsError = null
            })
            .addCase(fetchMentors.fulfilled, (state, action) => {
                const { mentors, filters } = action.payload
                mentorsAdapter.setAll(state.mentors, mentors)
                state.mentorFilters = filters
                state.mentorsStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Cachear mentores
                cacheMentors(mentors, filters)
            })
            .addCase(fetchMentors.rejected, (state, action) => {
                state.mentorsStatus = LOADING_STATES.ERROR
                state.mentorsError = action.payload?.message || 'Error obteniendo mentores'

                // Intentar cargar desde cache
                const cachedMentors = loadCachedMentors(state.mentorFilters)
                if (cachedMentors) {
                    mentorsAdapter.setAll(state.mentors, cachedMentors)
                    state.mentorsStatus = LOADING_STATES.SUCCESS
                }
            })

        // =============================================
        // FETCH MENTOR BY ID
        // =============================================
        builder
            .addCase(fetchMentorById.pending, (state) => {
                state.mentorsStatus = LOADING_STATES.LOADING
            })
            .addCase(fetchMentorById.fulfilled, (state, action) => {
                const mentor = action.payload
                mentorsAdapter.upsertOne(state.mentors, mentor)
                state.currentMentor = mentor
                state.mentorsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchMentorById.rejected, (state, action) => {
                state.mentorsStatus = LOADING_STATES.ERROR
                state.mentorsError = action.payload?.message || 'Error obteniendo mentor'
            })

        // =============================================
        // REQUEST MENTORSHIP
        // =============================================
        builder
            .addCase(requestMentorship.pending, (state) => {
                state.mentorRequestsStatus = LOADING_STATES.LOADING
            })
            .addCase(requestMentorship.fulfilled, (state, action) => {
                const request = action.payload
                state.sentMentorRequests.push(request)
                state.mentorRequestsStatus = LOADING_STATES.SUCCESS
                state.meta.totalMentorsContacted += 1
            })
            .addCase(requestMentorship.rejected, (state, action) => {
                state.mentorRequestsStatus = LOADING_STATES.ERROR
                state.mentorRequestsError = action.payload?.message || 'Error solicitando mentoría'
            })

        // =============================================
        // FETCH RECOMMENDED MENTORS
        // =============================================
        builder
            .addCase(fetchRecommendedMentors.fulfilled, (state, action) => {
                const mentors = action.payload
                mentorsAdapter.upsertMany(state.mentors, mentors)
            })

        // =============================================
        // FETCH COMMUNITIES
        // =============================================
        builder
            .addCase(fetchCommunities.pending, (state) => {
                state.communitiesStatus = LOADING_STATES.LOADING
                state.communitiesError = null
            })
            .addCase(fetchCommunities.fulfilled, (state, action) => {
                const { communities, filters } = action.payload
                communitiesAdapter.setAll(state.communities, communities)
                state.communityFilters = filters
                state.communitiesStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()
            })
            .addCase(fetchCommunities.rejected, (state, action) => {
                state.communitiesStatus = LOADING_STATES.ERROR
                state.communitiesError = action.payload?.message || 'Error obteniendo comunidades'
            })

        // =============================================
        // JOIN COMMUNITY
        // =============================================
        builder
            .addCase(joinCommunity.fulfilled, (state, action) => {
                const { communityId } = action.payload
                
                // Marcar como unida en la lista de comunidades
                const community = state.communities.entities[communityId]
                if (community) {
                    community.isMember = true
                    community.memberCount += 1
                }

                state.meta.totalCommunitiesJoined += 1
            })

        // =============================================
        // FETCH USER COMMUNITIES
        // =============================================
        builder
            .addCase(fetchUserCommunities.fulfilled, (state, action) => {
                state.userCommunities = action.payload
                state.meta.totalCommunitiesJoined = action.payload.length
            })

        // =============================================
        // FETCH CONNECTIONS
        // =============================================
        builder
            .addCase(fetchConnections.pending, (state) => {
                state.connectionsStatus = LOADING_STATES.LOADING
                state.connectionsError = null
            })
            .addCase(fetchConnections.fulfilled, (state, action) => {
                const { connections, filters } = action.payload
                connectionsAdapter.setAll(state.connections, connections)
                state.connectionFilters = filters
                state.connectionsStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Actualizar estadísticas
                const stats = calculateConnectionStats(connections)
                state.networkStats = stats
                state.meta.totalConnections = stats.accepted
            })
            .addCase(fetchConnections.rejected, (state, action) => {
                state.connectionsStatus = LOADING_STATES.ERROR
                state.connectionsError = action.payload?.message || 'Error obteniendo conexiones'
            })

        // =============================================
        // SEND CONNECTION REQUEST
        // =============================================
        builder
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                const connection = action.payload
                connectionsAdapter.upsertOne(state.connections, connection)
            })

        // =============================================
        // ACCEPT CONNECTION
        // =============================================
        builder
            .addCase(acceptConnection.fulfilled, (state, action) => {
                const { connectionId } = action.payload
                updateConnectionStatus(state, { connectionId, status: ConnectionStatus.ACCEPTED })
            })

        // =============================================
        // REJECT CONNECTION
        // =============================================
        builder
            .addCase(rejectConnection.fulfilled, (state, action) => {
                const { connectionId } = action.payload
                updateConnectionStatus(state, { connectionId, status: ConnectionStatus.REJECTED })
            })

        // =============================================
        // FETCH MESSAGES
        // =============================================
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.messagesStatus = LOADING_STATES.LOADING
                state.messagesError = null
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { messages, filters } = action.payload
                messagesAdapter.setAll(state.messages, messages)
                state.messageFilters = filters
                state.messagesStatus = LOADING_STATES.SUCCESS
                state.meta.totalMessagesSent = messages.length
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messagesStatus = LOADING_STATES.ERROR
                state.messagesError = action.payload?.message || 'Error obteniendo mensajes'
            })

        // =============================================
        // SEND MESSAGE
        // =============================================
        builder
            .addCase(sendMessage.fulfilled, (state, action) => {
                const message = action.payload
                messagesAdapter.addOne(state.messages, message)
                state.meta.totalMessagesSent += 1
            })

        // =============================================
        // FETCH CONVERSATIONS
        // =============================================
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.conversationsStatus = LOADING_STATES.LOADING
                state.conversationsError = null
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                conversationsAdapter.setAll(state.conversations, action.payload)
                state.conversationsStatus = LOADING_STATES.SUCCESS

                // Calcular chats activos (conversaciones con actividad reciente)
                const activeChats = action.payload.filter(conv => {
                    const lastActivity = new Date(conv.lastActivityAt)
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    return lastActivity > weekAgo
                }).length

                state.meta.activeChats = activeChats
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.conversationsStatus = LOADING_STATES.ERROR
                state.conversationsError = action.payload?.message || 'Error obteniendo conversaciones'
            })

        // =============================================
        // MARK MESSAGES AS READ
        // =============================================
        builder
            .addCase(markMessagesAsRead.fulfilled, (state, action) => {
                const { conversationId } = action.payload
                const conversation = state.conversations.entities[conversationId]
                
                if (conversation) {
                    conversation.unreadCount = 0
                }
            })

        // =============================================
        // FETCH NETWORK STATS
        // =============================================
        builder
            .addCase(fetchNetworkStats.pending, (state) => {
                state.statsStatus = LOADING_STATES.LOADING
                state.statsError = null
            })
            .addCase(fetchNetworkStats.fulfilled, (state, action) => {
                state.networkStats = action.payload
                state.statsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchNetworkStats.rejected, (state, action) => {
                state.statsStatus = LOADING_STATES.ERROR
                state.statsError = action.payload?.message || 'Error obteniendo estadísticas'
            })

        // =============================================
        // FETCH NETWORKING INSIGHTS
        // =============================================
        builder
            .addCase(fetchNetworkingInsights.fulfilled, (state, action) => {
                state.networkingInsights = action.payload
            })

        // =============================================
        // FETCH SENT MENTOR REQUESTS
        // =============================================
        builder
            .addCase(fetchSentMentorRequests.fulfilled, (state, action) => {
                state.sentMentorRequests = action.payload
                state.meta.totalMentorsContacted = action.payload.length
            })

        // =============================================
        // FETCH RECEIVED MENTOR REQUESTS
        // =============================================
        builder
            .addCase(fetchReceivedMentorRequests.fulfilled, (state, action) => {
                state.receivedMentorRequests = action.payload
            })

        // =============================================
        // FETCH CONNECTION SUGGESTIONS
        // =============================================
        builder
            .addCase(fetchConnectionSuggestions.fulfilled, (state, action) => {
                state.connectionSuggestions = action.payload
            })

        // =============================================
        // FETCH FEATURED USERS
        // =============================================
        builder
            .addCase(fetchFeaturedUsers.fulfilled, (state, action) => {
                state.featuredUsers = action.payload
            })
    }
})

// =============================================
// FUNCIONES DE CACHE
// =============================================

/**
 * Cachea mentores en localStorage
 */
const cacheMentors = (mentors, filters) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHED_MENTORS}_${JSON.stringify(filters)}`
        const cacheData = {
            mentors,
            filters,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + CACHE_CONFIG.TTL.MEDIUM
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando mentores:', error)
    }
}

/**
 * Carga mentores desde cache
 */
const loadCachedMentors = (filters) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHED_MENTORS}_${JSON.stringify(filters)}`
        const cached = localStorage.getItem(cacheKey)
        if (!cached) return null

        const cacheData = JSON.parse(cached)

        // Verificar expiración
        if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
            localStorage.removeItem(cacheKey)
            return null
        }

        return cacheData.mentors
    } catch (error) {
        console.warn('Error cargando mentores desde cache:', error)
        return null
    }
}

/**
 * Calcula estadísticas de conexiones
 */
const calculateConnectionStats = (connections) => {
    const stats = {
        total: connections.length,
        pending: 0,
        accepted: 0,
        rejected: 0,
        blocked: 0,
        removed: 0
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
            case ConnectionStatus.REMOVED:
                stats.removed++
                break
        }
    })

    return stats
}

// =============================================
// SELECTORS
// =============================================

// Selectores básicos
export const selectNetworkState = (state) => state.network
export const selectMentorsState = (state) => state.network.mentors
export const selectCurrentMentor = (state) => state.network.currentMentor
export const selectMentorFilters = (state) => state.network.mentorFilters
export const selectCommunitiesState = (state) => state.network.communities
export const selectUserCommunities = (state) => state.network.userCommunities
export const selectCommunityFilters = (state) => state.network.communityFilters
export const selectConnectionsState = (state) => state.network.connections
export const selectConnectionFilters = (state) => state.network.connectionFilters
export const selectMessagesState = (state) => state.network.messages
export const selectMessageFilters = (state) => state.network.messageFilters
export const selectCurrentConversationId = (state) => state.network.currentConversationId
export const selectConversationsState = (state) => state.network.conversations
export const selectSentMentorRequests = (state) => state.network.sentMentorRequests
export const selectReceivedMentorRequests = (state) => state.network.receivedMentorRequests
export const selectNetworkStats = (state) => state.network.networkStats
export const selectNetworkingInsights = (state) => state.network.networkingInsights
export const selectConnectionSuggestions = (state) => state.network.connectionSuggestions
export const selectFeaturedUsers = (state) => state.network.featuredUsers
export const selectNetworkStatus = (state) => state.network.status
export const selectNetworkError = (state) => state.network.error

// Selectores de entity adapters
export const {
    selectAll: selectAllMentors,
    selectById: selectMentorById,
    selectIds: selectMentorIds,
    selectTotal: selectTotalMentors
} = mentorsAdapter.getSelectors((state) => state.network.mentors)

export const {
    selectAll: selectAllCommunities,
    selectById: selectCommunityById,
    selectIds: selectCommunityIds,
    selectTotal: selectTotalCommunities
} = communitiesAdapter.getSelectors((state) => state.network.communities)

export const {
    selectAll: selectAllConnections,
    selectById: selectConnectionById,
    selectIds: selectConnectionIds,
    selectTotal: selectTotalConnections
} = connectionsAdapter.getSelectors((state) => state.network.connections)

export const {
    selectAll: selectAllMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds,
    selectTotal: selectTotalMessages
} = messagesAdapter.getSelectors((state) => state.network.messages)

export const {
    selectAll: selectAllConversations,
    selectById: selectConversationById,
    selectIds: selectConversationIds,
    selectTotal: selectTotalConversations
} = conversationsAdapter.getSelectors((state) => state.network.conversations)

// Selectores derivados
export const selectMentorsByAvailability = (availability) => (state) => {
    const allMentors = selectAllMentors(state)
    return allMentors.filter(mentor => mentor.availability === availability)
}

export const selectMentorsBySkill = (skill) => (state) => {
    const allMentors = selectAllMentors(state)
    return allMentors.filter(mentor => mentor.skills.includes(skill))
}

export const selectAvailableMentorsNow = (state) => {
    const allMentors = selectAllMentors(state)
    return allMentors.filter(mentor => 
        mentor.availability === MentorAvailability.AVAILABLE
    )
}

export const selectCommunitiesByType = (type) => (state) => {
    const allCommunities = selectAllCommunities(state)
    return allCommunities.filter(community => community.type === type)
}

export const selectCommunitiesByTopic = (topic) => (state) => {
    const allCommunities = selectAllCommunities(state)
    return allCommunities.filter(community => 
        community.topics.includes(topic)
    )
}

export const selectUserCommunityIds = (state) => {
    const userCommunities = selectUserCommunities(state)
    return userCommunities.map(community => community.id)
}

export const selectNonUserCommunities = (state) => {
    const allCommunities = selectAllCommunities(state)
    const userCommunityIds = new Set(selectUserCommunityIds(state))
    
    return allCommunities.filter(community => 
        !userCommunityIds.has(community.id)
    )
}

export const selectConnectionsByStatus = (status) => (state) => {
    const allConnections = selectAllConnections(state)
    return allConnections.filter(connection => connection.status === status)
}

export const selectPendingConnections = (state) => {
    return selectConnectionsByStatus(ConnectionStatus.PENDING)(state)
}

export const selectActiveConnections = (state) => {
    return selectConnectionsByStatus(ConnectionStatus.ACCEPTED)(state)
}

export const selectConnectionWithUser = (userId) => (state) => {
    const allConnections = selectAllConnections(state)
    return allConnections.find(connection => connection.userId === userId)
}

export const selectIsConnectedWithUser = (userId) => (state) => {
    const connection = selectConnectionWithUser(userId)(state)
    return connection && connection.status === ConnectionStatus.ACCEPTED
}

export const selectMessagesByConversation = (conversationId) => (state) => {
    const allMessages = selectAllMessages(state)
    return allMessages.filter(message => message.conversationId === conversationId)
}

export const selectCurrentConversation = (state) => {
    const conversationId = selectCurrentConversationId(state)
    return conversationId ? selectConversationById(state, conversationId) : null
}

export const selectCurrentConversationMessages = (state) => {
    const conversationId = selectCurrentConversationId(state)
    return conversationId ? selectMessagesByConversation(conversationId)(state) : []
}

export const selectUnreadConversations = (state) => {
    const allConversations = selectAllConversations(state)
    return allConversations.filter(conversation => conversation.unreadCount > 0)
}

export const selectTotalUnreadMessages = (state) => {
    const unreadConversations = selectUnreadConversations(state)
    return unreadConversations.reduce((total, conv) => total + conv.unreadCount, 0)
}

export const selectConversationWithUser = (userId) => (state) => {
    const allConversations = selectAllConversations(state)
    return allConversations.find(conversation => 
        conversation.participantIds.includes(userId) && !conversation.isGroupChat
    )
}

export const selectMentorRequestsByStatus = (isAccepted) => (state) => {
    const sentRequests = selectSentMentorRequests(state)
    return sentRequests.filter(request => request.isAccepted === isAccepted)
}

export const selectPendingMentorRequests = (state) => {
    const sentRequests = selectSentMentorRequests(state)
    return sentRequests.filter(request => !request.respondedAt)
}

export const selectAcceptedMentorRequests = (state) => {
    return selectMentorRequestsByStatus(true)(state)
}

export const selectRejectedMentorRequests = (state) => {
    return selectMentorRequestsByStatus(false)(state)
}

export const selectNetworkStatsSummary = (state) => {
    const stats = selectNetworkStats(state)
    if (!stats) return null

    return {
        totalConnections: stats.total,
        activeConnections: stats.accepted,
        pendingRequests: stats.pending,
        connectionSuccessRate: stats.total > 0 ? 
            ((stats.accepted + stats.rejected) / stats.total * 100).toFixed(1) : 0
    }
}

export const selectMentorsWithHighRating = (minRating = 4.5) => (state) => {
    const allMentors = selectAllMentors(state)
    return allMentors.filter(mentor => mentor.rating >= minRating)
}

export const selectMentorsWithExperience = (minYears = 5) => (state) => {
    const allMentors = selectAllMentors(state)
    return allMentors.filter(mentor => mentor.yearsOfExperience >= minYears)
}

export const selectRecentConnections = (limit = 10) => (state) => {
    const allConnections = selectAllConnections(state)
    return [...allConnections]
        .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
        .slice(0, limit)
}

export const selectRecentMessages = (limit = 20) => (state) => {
    const allMessages = selectAllMessages(state)
    return [...allMessages]
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
        .slice(0, limit)
}

export const selectMentorSuggestions = (userSkills = [], limit = 5) => (state) => {
    const allMentors = selectAllMentors(state)
    
    return allMentors
        .map(mentor => {
            // Calcular compatibilidad basada en skills en común
            const commonSkills = mentor.skills.filter(skill => 
                userSkills.includes(skill)
            )
            const compatibilityScore = userSkills.length > 0 ? 
                (commonSkills.length / userSkills.length) * 100 : 0
            
            return { ...mentor, compatibilityScore }
        })
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, limit)
}

// =============================================
// EXPORTACIONES
// =============================================

// Exportar acciones
export const {
    setCurrentMentor,
    setMentorFilters,
    setCommunityFilters,
    setConnectionFilters,
    setMessageFilters,
    setCurrentConversation,
    addRealtimeMessage,
    markMessageAsRead,
    addPendingConnection,
    removeTemporaryConnection,
    updateConnectionStatus,
    filterMentorsBySkill,
    clearMentorFilters,
    sortMentorsBy,
    sortCommunitiesBy,
    sortConnectionsBy,
    clearNetworkError,
    clearCurrentConversation,
    resetNetworkState,
    simulateNetworkEvent
} = networkSlice.actions

// Exportar thunks
export {
    fetchMentors,
    fetchMentorById,
    requestMentorship,
    fetchRecommendedMentors,
    fetchCommunities,
    joinCommunity,
    fetchUserCommunities,
    fetchConnections,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    fetchMessages,
    sendMessage,
    fetchConversations,
    markMessagesAsRead,
    fetchNetworkStats,
    fetchNetworkingInsights,
    fetchSentMentorRequests,
    fetchReceivedMentorRequests,
    fetchConnectionSuggestions,
    fetchFeaturedUsers
}

// Exportar reducer
export default networkSlice.reducer

// Exportar tipos
/**
 * @typedef {Object} NetworkState
 * @property {Object} mentors
 * @property {Mentor|null} currentMentor
 * @property {Object} mentorFilters
 * @property {string} mentorsStatus
 * @property {string|null} mentorsError
 * @property {Object} communities
 * @property {Community[]} userCommunities
 * @property {Object} communityFilters
 * @property {string} communitiesStatus
 * @property {string|null} communitiesError
 * @property {Object} connections
 * @property {Object} connectionFilters
 * @property {string} connectionsStatus
 * @property {string|null} connectionsError
 * @property {Object} messages
 * @property {string|null} currentConversationId
 * @property {Object} messageFilters
 * @property {string} messagesStatus
 * @property {string|null} messagesError
 * @property {Object} conversations
 * @property {string} conversationsStatus
 * @property {string|null} conversationsError
 * @property {MentorRequest[]} sentMentorRequests
 * @property {MentorRequest[]} receivedMentorRequests
 * @property {string} mentorRequestsStatus
 * @property {string|null} mentorRequestsError
 * @property {Object|null} networkStats
 * @property {Object|null} networkingInsights
 * @property {string[]} connectionSuggestions
 * @property {Object[]} featuredUsers
 * @property {string} statsStatus
 * @property {string|null} statsError
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastUpdated
 * @property {Object} meta
 */