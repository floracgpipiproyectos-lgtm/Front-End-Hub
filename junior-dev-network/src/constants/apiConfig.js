// constants/apiConfig.js

/**
 * Configuración base de la API
 */
export const API_CONFIG = {
    // URLs por entorno
    BASE_URLS: {
        DEVELOPMENT: 'http://localhost:3000/api',
        STAGING: 'https://staging-api.junior-dev.com/api',
        PRODUCTION: 'https://api.junior-dev.com/api',
        TESTING: 'https://test-api.junior-dev.com/api'
    },

    // Timeouts específicos
    TIMEOUTS: {
        DEFAULT: 30000,      // 30 segundos
        UPLOAD: 120000,      // 2 minutos para uploads
        DOWNLOAD: 60000,     // 1 minuto para descargas
        HEALTH_CHECK: 5000,  // 5 segundos para health checks
        AUTH: 15000,         // 15 segundos para autenticación
        ANALYZE_CV: 90000    // 90 segundos para análisis de CV
    },

    // Configuración de reintentos
    RETRY_CONFIG: {
        DEFAULT: {
            MAX_ATTEMPTS: 3,
            BASE_DELAY: 1000,
            MAX_DELAY: 10000
        },
        UPLOAD: {
            MAX_ATTEMPTS: 2,
            BASE_DELAY: 2000,
            MAX_DELAY: 15000
        },
        AUTH: {
            MAX_ATTEMPTS: 1, // No reintentar autenticación
            BASE_DELAY: 0
        }
    },

    // Estados de conexión
    CONNECTION_STATUS: {
        CONNECTED: 'connected',
        DISCONNECTED: 'disconnected',
        RECONNECTING: 'reconnecting',
        OFFLINE: 'offline'
    },

    // Headers específicos
    HEADERS: {
        COMMON: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-App-Version': '1.0.0'
        },
        JSON: {
            'Content-Type': 'application/json'
        },
        MULTIPART: {
            'Content-Type': 'multipart/form-data'
        },
        AUTH: (token) => ({
            'Authorization': `Bearer ${token}`
        })
    }
};

/**
 * Claves para almacenamiento local
 */
export const STORAGE_KEYS = {
    // Autenticación
    AUTH_TOKEN: 'jdn_auth_token',
    REFRESH_TOKEN: 'jdn_refresh_token',
    USER_DATA: 'jdn_user_data',
    SESSION_EXPIRES_AT: 'jdn_session_expires_at',

    // Cache de datos
    CACHED_PROFILE: 'jdn_cached_profile',
    CACHED_SKILLS: 'jdn_cached_skills',
    CACHED_PROJECTS: 'jdn_cached_projects',
    CACHED_BADGES: 'jdn_cached_badges',

    // Preferencias
    USER_PREFERENCES: 'jdn_user_preferences',
    THEME_PREFERENCE: 'jdn_theme',
    LANGUAGE_PREFERENCE: 'jdn_language',

    // Estado de la app
    LAST_SYNC_TIMESTAMP: 'jdn_last_sync',
    OFFLINE_QUEUE: 'jdn_offline_queue',
    APP_STATE: 'jdn_app_state'
};

/**
 * Configuración de caché
 */
export const CACHE_CONFIG = {
    TTL: {
        SHORT: 5 * 60 * 1000,    // 5 minutos
        MEDIUM: 30 * 60 * 1000,  // 30 minutos
        LONG: 24 * 60 * 60 * 1000, // 24 horas
        USER_DATA: 60 * 60 * 1000 // 1 hora
    },
    KEYS: {
        PREFIX: 'jdn_cache_',
        VERSION: 'v1'
    }
};

/**
 * Estados de carga
 */
export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    REFRESHING: 'refreshing',
    UPLOADING: 'uploading'
};

/**
 * Configuración de paginación
 */
export const PAGINATION_CONFIG = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
    INFINITE_SCROLL_THRESHOLD: 100 // px antes del final para cargar más
};