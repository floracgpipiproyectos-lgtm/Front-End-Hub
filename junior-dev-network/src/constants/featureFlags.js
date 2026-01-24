// constants/featureFlags.js

/**
 * Feature flags para habilitar/deshabilitar funcionalidades
 * Útil para desarrollo, testing y rollouts progresivos
 */
export const FEATURE_FLAGS = {
    // Desarrollo
    DEV_MODE: process.env.NODE_ENV === 'development',

    // Features en desarrollo
    ENABLE_EXPERIMENTAL_API: false,
    ENABLE_BETA_FEATURES: process.env.NODE_ENV === 'development',
    ENABLE_PERFORMANCE_MONITORING: true,

    // Features específicas
    ENABLE_CV_ANALYSIS: true,
    ENABLE_PORTFOLIO_GENERATOR: true,
    ENABLE_GAMIFICATION: true,
    ENABLE_REAL_TIME_MESSAGING: true,
    ENABLE_VIDEO_CALLS: false,
    ENABLE_AI_SUGGESTIONS: true,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_PUSH_NOTIFICATIONS: false, // En desarrollo

    // UI/UX
    ENABLE_DARK_MODE: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_PROGRESSIVE_LOADING: true,
    ENABLE_SPLASH_SCREEN: true,

    // Integraciones
    ENABLE_GITHUB_INTEGRATION: true,
    ENABLE_LINKEDIN_INTEGRATION: true,
    ENABLE_GOOGLE_ANALYTICS: process.env.NODE_ENV === 'production',
    ENABLE_SENTRY_LOGGING: process.env.NODE_ENV === 'production',

    // Testing
    ENABLE_MOCK_API: process.env.NODE_ENV === 'development',
    ENABLE_STRICT_VALIDATION: true,
    ENABLE_PERFORMANCE_LOGGING: process.env.NODE_ENV === 'development'
};

/**
 * Configuraciones A/B testing
 */
export const AB_TESTING = {
    ENABLED: process.env.NODE_ENV === 'production',
    VARIANTS: {
        LANDING_PAGE: ['A', 'B', 'C'],
        ONBOARDING_FLOW: ['classic', 'quick', 'guided'],
        PROJECT_UI: ['grid', 'list', 'card']
    }
};

/**
 * Configuración de experimentos
 */
export const EXPERIMENTS = {
    NEW_NAVIGATION: {
        ENABLED: false,
        PERCENTAGE: 10 // 10% de usuarios
    },
    AI_CHATBOT: {
        ENABLED: false,
        PERCENTAGE: 5
    },
    ADVANCED_ANALYTICS: {
        ENABLED: true,
        PERCENTAGE: 100
    }
};