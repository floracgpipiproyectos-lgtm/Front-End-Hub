// constants/appConstants.js

/**
 * Constantes de la aplicación
 */
export const APP_CONSTANTS = {
    // Información de la app
    APP_NAME: 'JuniorDev Network',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'Red social para desarrolladores junior',

    // URLs importantes
    WEBSITE_URL: 'https://junior-dev.com',
    DOCUMENTATION_URL: 'https://docs.junior-dev.com',
    SUPPORT_EMAIL: 'support@junior-dev.com',
    PRIVACY_POLICY_URL: 'https://junior-dev.com/privacy',
    TERMS_URL: 'https://junior-dev.com/terms',

    // Rutas de la aplicación (para React Router)
    ROUTES: {
        // Públicas
        HOME: '/',
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password/:token',

        // Privadas
        DASHBOARD: '/dashboard',
        PROFILE: '/profile',
        PROFILE_EDIT: '/profile/edit',
        PORTFOLIO: '/portfolio',
        PORTFOLIO_CREATE: '/portfolio/create',
        PROJECTS: '/projects',
        PROJECT_DETAIL: '/projects/:id',
        NETWORK: '/network',
        MESSAGES: '/messages',
        NOTIFICATIONS: '/notifications',
        SETTINGS: '/settings',

        // Recursos
        HELP: '/help',
        FAQ: '/faq',
        CONTACT: '/contact',
        ABOUT: '/about'
    },

    // Redes sociales
    SOCIAL_MEDIA: {
        TWITTER: 'https://twitter.com/juniordevnetwork',
        GITHUB: 'https://github.com/juniordevnetwork',
        LINKEDIN: 'https://linkedin.com/company/juniordevnetwork',
        DISCORD: 'https://discord.gg/juniordev'
    },

    // Límites de la aplicación
    LIMITS: {
        MAX_PROJECTS_PER_USER: 50,
        MAX_SKILLS_PER_USER: 100,
        MAX_CONNECTIONS: 1000,
        MAX_MESSAGES_PER_DAY: 100,
        MAX_UPLOADS_PER_DAY: 20,
        MAX_CV_SIZE: 10 * 1024 * 1024, // 10MB
        MAX_PORTFOLIO_SIZE: 50 * 1024 * 1024 // 50MB
    },

    // Configuración de UI
    UI_CONFIG: {
        DEFAULT_THEME: 'light',
        THEMES: ['light', 'dark', 'auto'],
        DEFAULT_LANGUAGE: 'es',
        LANGUAGES: [
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'pt', name: 'Português', flag: '🇧🇷' }
        ],
        ANIMATION_DURATION: 300,
        NOTIFICATION_TIMEOUT: 5000,
        SNACKBAR_TIMEOUT: 3000
    },

    // Fechas y formatos
    DATE_FORMATS: {
        DISPLAY_DATE: 'DD/MM/YYYY',
        DISPLAY_TIME: 'HH:mm',
        DISPLAY_DATETIME: 'DD/MM/YYYY HH:mm',
        API_DATE: 'YYYY-MM-DD',
        API_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
        RELATIVE: 'relative' // 'hace 2 horas', 'ayer', etc.
    },

    // Monitoreo y analytics
    ANALYTICS: {
        ENABLED: process.env.NODE_ENV === 'production',
        TRACKING_ID: 'UA-XXXXXXXXX-X', // Reemplazar con tu ID real
        EVENTS: {
            PAGE_VIEW: 'page_view',
            SIGN_UP: 'sign_up',
            LOGIN: 'login',
            CV_UPLOAD: 'cv_upload',
            PROJECT_CREATE: 'project_create',
            CONNECTION_REQUEST: 'connection_request'
        }
    }
};

/**
 * Estados de la aplicación
 */
export const APP_STATES = {
    INITIALIZING: 'initializing',
    LOADING: 'loading',
    READY: 'ready',
    ERROR: 'error',
    OFFLINE: 'offline',
    MAINTENANCE: 'maintenance'
};



