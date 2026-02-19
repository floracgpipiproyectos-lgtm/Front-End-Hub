// store/slices/authSlice.js
// noinspection DuplicatedCode,UnnecessaryLocalVariableJS,ExceptionCaughtLocallyJS

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/api/services'
import { STORAGE_KEYS } from '@/constants/apiConfig'
import { LOADING_STATES } from '@/constants/apiConfig'

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} alias
 * @property {string} [fullName]
 * @property {string} [avatarUrl]
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {string|null} token
 * @property {string|null} refreshToken
 * @property {boolean} isAuthenticated
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastLogin
 * @property {Object} meta
 */

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials)
            return response
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status || 'NETWORK_ERROR'
            })
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.registerUser(userData)
            return response
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status || 'NETWORK_ERROR'
            })
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout()
        } catch (error) {
            // Aún limpiamos el estado local aunque falle en el servidor
            console.warn('Logout remoto falló, limpiando localmente:', error.message)
            return rejectWithValue(error.message)
        }
    }
)

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState()
            const currentRefreshToken = state.auth.refreshToken

            if (!currentRefreshToken) {
                throw new Error('No hay refresh token disponible')
            }

            const response = await authService.refreshToken(currentRefreshToken)
            return response
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Estado inicial
const initialState = {
    user: null,
    token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null,
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
    status: LOADING_STATES.IDLE,
    error: null,
    lastLogin: localStorage.getItem('last_login') || null,
    meta: {
        loginAttempts: 0,
        lastTokenRefresh: null,
        sessionStart: null
    }
}

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Actions síncronas
        setCredentials: (state, action) => {
            const { user, token, refreshToken } = action.payload
            state.user = user
            state.token = token
            state.refreshToken = refreshToken
            state.isAuthenticated = true
            state.lastLogin = new Date().toISOString()
            state.meta.sessionStart = new Date().toISOString()

            // Guardar en localStorage
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
            localStorage.setItem('last_login', state.lastLogin)
        },

        clearCredentials: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.status = LOADING_STATES.IDLE
            state.error = null
            state.meta.sessionStart = null

            // Limpiar localStorage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            localStorage.removeItem('last_login')
        },

        setAuthError: (state, action) => {
            state.error = action.payload
            state.status = LOADING_STATES.ERROR
        },

        resetAuthStatus: (state) => {
            state.status = LOADING_STATES.IDLE
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = LOADING_STATES.LOADING
                state.error = null
                state.meta.loginAttempts += 1
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user, token, refreshToken } = action.payload
                state.user = user
                state.token = token
                state.refreshToken = refreshToken
                state.isAuthenticated = true
                state.status = LOADING_STATES.SUCCESS
                state.lastLogin = new Date().toISOString()
                state.meta.sessionStart = new Date().toISOString()
                state.meta.loginAttempts = 0

                // Persistir
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
                localStorage.setItem('last_login', state.lastLogin)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = LOADING_STATES.ERROR
                state.error = action.payload?.message || 'Error en login'
                state.isAuthenticated = false
            })

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = LOADING_STATES.LOADING
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const { user, token, refreshToken } = action.payload
                state.user = user
                state.token = token
                state.refreshToken = refreshToken
                state.isAuthenticated = true
                state.status = LOADING_STATES.SUCCESS
                state.lastLogin = new Date().toISOString()

                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
                localStorage.setItem('last_login', state.lastLogin)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = LOADING_STATES.ERROR
                state.error = action.payload?.message || 'Error en registro'
            })

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.status = LOADING_STATES.IDLE
                state.meta.sessionStart = null

                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            })
            .addCase(logoutUser.rejected, (state) => {
                // Aún limpiamos el estado local
                state.user = null
                state.token = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.status = LOADING_STATES.IDLE

                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            })

        // Refresh Token
        builder
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token
                state.meta.lastTokenRefresh = new Date().toISOString()

                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token)
            })
            .addCase(refreshToken.rejected, (state) => {
                // Si falla el refresh, forzar logout
                state.user = null
                state.token = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.status = LOADING_STATES.ERROR
                state.error = 'Sesión expirada'

                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            })
    }
})

// Exportar acciones y reducer
export const {
    setCredentials,
    clearCredentials,
    setAuthError,
    resetAuthStatus
} = authSlice.actions

export default authSlice.reducer