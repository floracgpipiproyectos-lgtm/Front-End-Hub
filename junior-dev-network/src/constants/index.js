/**
 * @fileoverview Constants index - Central export point for all application constants
 * @description Consolidates and re-exports all constants from various modules for easy importing
 */

// Re-exportar todo desde los archivos de constantes
export * from './apiEndpoints';
export * from './apiConfig';
export * from './validationRules';
export * from './appConstants';
export * from './featureFlags';

// Alias comunes para importaciones más fáciles
export { API_BASE_URL } from './apiEndpoints';
export { buildEndpoint } from './apiEndpoints';
export { API_CONFIG, STORAGE_KEYS } from './apiConfig';
export { VALIDATION_RULES, VALIDATION_HELPERS } from './validationRules';
export { APP_CONSTANTS, APP_STATES } from './appConstants';
export { FEATURE_FLAGS } from './featureFlags';
export { CACHE_CONFIG } from './cacheConfig';

/**
 * Objeto consolidado con todas las constantes
 * Útil para imports de un solo objeto
 */
export const CONSTANTS = {
    // Endpoints
    ENDPOINTS: {
        ...require('./apiEndpoints'),
    },
    // Configuración
    CONFIG: {
        ...require('./apiConfig'),
    },
    // Validación
    VALIDATION: {
        ...require('./validationRules'),
    },
    // App
    APP: {
        ...require('./appConstants'),
    },
    // Features
    FEATURES: {
        ...require('./featureFlags'),
    }
};

// Exportación por defecto
export default CONSTANTS;