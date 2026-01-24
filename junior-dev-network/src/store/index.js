// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {
    API_CONFIG,
    STORAGE_KEYS,
    CACHE_CONFIG
} from '@/constants/apiConfig'
import { FEATURE_FLAGS } from '@/constants/featureFlags'

// Importar slices (te mostraré cómo crearlos después)
import authReducer from './slices/authSlice'
import profileReducer from './slices/profileSlice'
import cvReducer from './slices/cvSlice'
import projectsReducer from './slices/projectsSlice'
import networkReducer from './slices/networkSlice'
import gamificationReducer from './slices/gamificationSlice'
import portfolioReducer from './slices/portfolioSlice'
import uiReducer from './slices/uiSlice'

// Importar middleware
import { apiMiddleware, cacheMiddleware, offlineMiddleware } from './middleware'

// Combinar reducers
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cv: cvReducer,
    projects: projectsReducer,
    network: networkReducer,
    gamification: gamificationReducer,
    portfolio: portfolioReducer,
    ui: uiReducer
})

// Persistir estado en localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEYS.APP_STATE)
        if (serializedState === null) {
            return undefined
        }

        const state = JSON.parse(serializedState)

        // Validar timestamp de caché
        if (state._timestamp && Date.now() - state._timestamp > CACHE_CONFIG.TTL.MEDIUM) {
            console.log('⚠️ Estado cacheado expirado, limpiando...')
            localStorage.removeItem(STORAGE_KEYS.APP_STATE)
            return undefined
        }

        // Eliminar metadatos antes de retornar
        delete state._timestamp
        return state
    } catch (err) {
        console.warn('Error cargando estado desde localStorage:', err)
        return undefined
    }
}

const saveState = (state) => {
    try {
        // Solo guardar ciertas partes del estado
        const stateToPersist = {
            auth: {
                token: state.auth.token,
                refreshToken: state.auth.refreshToken,
                user: state.auth.user,
                isAuthenticated: state.auth.isAuthenticated
            },
            profile: {
                data: state.profile.data,
                preferences: state.profile.preferences
            },
            ui: {
                theme: state.ui.theme,
                language: state.ui.language
            },
            _timestamp: Date.now(),
            _version: '1.0.0'
        }

        const serializedState = JSON.stringify(stateToPersist)
        localStorage.setItem(STORAGE_KEYS.APP_STATE, serializedState)
    } catch (err) {
        console.warn('Error guardando estado en localStorage:', err)
    }
}

// Configurar store
export const createStore = () => {
    const preloadedState = loadState()

    const store = configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    // Ignorar acciones que contengan funciones o fechas
                    ignoredActions: [
                        'api/callBegan',
                        'api/callSuccess',
                        'api/callFailed',
                        'cv/uploadProgress'
                    ],
                    ignoredPaths: [
                        'api.requests',
                        'cv.uploadProgress',
                        'meta.timestamp'
                    ]
                },
                thunk: {
                    extraArgument: {
                        // Inyectar servicios y configuraciones
                        apiConfig: API_CONFIG,
                        featureFlags: FEATURE_FLAGS
                    }
                }
            }).concat(
                apiMiddleware,
                cacheMiddleware,
                offlineMiddleware
            ),
        devTools: process.env.NODE_ENV === 'development'
    })

    // Suscribirse a cambios para persistir
    store.subscribe(() => {
        const state = store.getState()
        saveState(state)
    })

    return store
}

// Store por defecto
const store = createStore()

// Exportaciones
export default store
export * from './slices'
export * from './selectors'
export * from './hooks'

// Tipo de estado global
/**
 * @typedef {Object} RootState
 * @property {import('./slices/authSlice').AuthState} auth
 * @property {import('./slices/profileSlice').ProfileState} profile
 * @property {import('./slices/cvSlice').CVState} cv
 * @property {import('./slices/projectsSlice').ProjectsState} projects
 * @property {import('./slices/networkSlice').NetworkState} network
 * @property {import('./slices/gamificationSlice').GamificationState} gamification
 * @property {import('./slices/portfolioSlice').PortfolioState} portfolio
 * @property {import('./slices/uiSlice').UIState} ui
 */

/**
 * @typedef {Object} AppDispatch
 */

// Hooks tipados
export const useAppDispatch = () => store.dispatch
export const useAppSelector = (selector) => selector(store.getState())