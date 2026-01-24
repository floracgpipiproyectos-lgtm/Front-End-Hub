/**
 * @fileoverview Configuración de cache para la aplicación
 */

export const CACHE_CONFIG = {
  // Duración del cache en minutos
  TTL: {
    USER_DATA: 30, // 30 minutos
    AUTH_TOKEN: 60, // 1 hora
    PROJECT_DATA: 15, // 15 minutos
    API_RESPONSES: 10, // 10 minutos
    SEARCH_RESULTS: 5, // 5 minutos
  },

  // Configuración de limpieza automática
  CLEANUP: {
    INTERVAL: 10 * 60 * 1000, // 10 minutos
    MAX_ENTRIES: {
      USER_DATA: 10,
      PROJECT_DATA: 50,
      API_RESPONSES: 100,
      SEARCH_RESULTS: 20,
    }
  },

  // Configuración de compresión
  COMPRESSION: {
    ENABLED: true,
    THRESHOLD: 1024, // Comprimir si > 1KB
    ALGORITHM: 'gzip'
  },

  // Configuración de persistencia
  PERSISTENCE: {
    ENABLED: true,
    STORAGE_KEY: 'junior_dev_cache',
    VERSION: '1.0.0'
  }
};
