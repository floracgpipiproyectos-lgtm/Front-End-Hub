// services/index.js - VERSIÓN ACTUALIZADA

// Importar constantes para uso global
import { APP_CONSTANTS, FEATURE_FLAGS } from '@/constants'

// Exportar todos los servicios
export { authService } from './authService'
export { cvService } from './cvService'
export { projectService } from './projectService'
export { networkService } from './networkService'
export { gamificationService } from './gamificationService'
export { portfolioService } from './portfolioService'
export { profileService } from './profileService'

// Re-exportar enums y tipos comunes
export {
    SkillLevel,
    AnalysisStatus,
    SkillSource
} from './cvService'

export {
    BadgeType,
    BadgeRarity,
    LeaderboardType,
    LeaderboardPeriod
} from './gamificationService'

// Exportar factories
export {
    AuthServiceFactory,
    CVServiceFactory,
    GamificationServiceFactory
} from './authService'

// Exportar cliente de API
export { default as apiClient } from '../apiClient'

// =============================================
// OBJETO CONSOLIDADO ACTUALIZADO
// =============================================

const services = {
    authService,
    cvService,
    projectService,
    networkService,
    gamificationService,
    portfolioService,
    profileService,
    apiClient,
    // Añadir constantes para acceso fácil
    constants: {
        app: APP_CONSTANTS,
        features: FEATURE_FLAGS
    }
}

export default services

// =============================================
// INICIALIZACIÓN MEJORADA
// =============================================

/**
 * Inicializa servicios con configuración mejorada
 */
export const initializeServices = async (config = {}) => {
    const startTime = Date.now()

    console.log(`🚀 Inicializando servicios (${APP_CONSTANTS.APP_VERSION})...`)

    try {
        // Verificar feature flags
        if (FEATURE_FLAGS.DEV_MODE) {
            console.log('🔧 Modo desarrollo activado')
        }

        // Verificar conectividad
        const isConnected = await apiClient.checkConnectivity()

        if (!isConnected && FEATURE_FLAGS.ENABLE_OFFLINE_MODE) {
            console.log('📴 Modo offline activado')
        }

        // Cargar configuración desde localStorage si existe
        const cachedConfig = localStorage.getItem(STORAGE_KEYS.APP_STATE)
        if (cachedConfig) {
            console.log('📦 Configuración cargada desde cache')
        }

        const initTime = Date.now() - startTime
        console.log(`✅ Servicios inicializados en ${initTime}ms`)

        return {
            success: true,
            initTime,
            isConnected,
            features: FEATURE_FLAGS
        }
    } catch (error) {
        console.error('❌ Error inicializando servicios:', error)

        return {
            success: false,
            error: error.message,
            fallbackToOffline: FEATURE_FLAGS.ENABLE_OFFLINE_MODE
        }
    }
}