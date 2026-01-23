// =============================================
// SERVICES INDEX - Exportación centralizada
// =============================================

// Exportar todos los servicios de API
export { authService } from './authService'
export { cvService } from './cvService'
export { projectService } from './projectService'
export { networkService } from './networkService'
export { gamificationService } from './gamificationService'
export { portfolioService } from './portfolioService'
export { profileService } from './profileService'

// Re-exportar enums y tipos comunes si los servicios los exportan
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

// Exportar factories de servicios si existen
export {
    AuthServiceFactory,
    CVServiceFactory,
    GamificationServiceFactory
} from './authService'

// Exportar cliente de API
export { default as apiClient } from '../apiClient'

// =============================================
// OBJETO CONSOLIDADO PARA IMPORTS FÁCILES
// =============================================

/**
 * Objeto consolidado con todos los servicios
 * Útil para imports de un solo objeto
 */
const services = {
    authService,
    cvService,
    projectService,
    networkService,
    gamificationService,
    portfolioService,
    profileService,
    apiClient
}

/**
 * Exportación por defecto como objeto consolidado
 * @example
 * import services from '@/api/services'
 * services.authService.login(...)
 */
export default services

// =============================================
// UTILIDADES PARA DESARROLLO
// =============================================

/**
 * Función helper para loggear llamadas a servicios en desarrollo
 * @param {string} serviceName - Nombre del servicio
 * @param {string} methodName - Nombre del método
 * @param {...any} args - Argumentos del método
 */
export const logServiceCall = (serviceName, methodName, ...args) => {
    if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(`📡 API Service: ${serviceName}.${methodName}`)
        console.log('Arguments:', args)
        console.groupEnd()
    }
}

/**
 * Verifica si todos los servicios están disponibles
 * @returns {boolean} true si todos los servicios están cargados
 */
export const areServicesReady = () => {
    const requiredServices = [
        authService,
        cvService,
        projectService,
        networkService,
        gamificationService,
        portfolioService,
        profileService,
        apiClient
    ]

    return requiredServices.every(service => service !== undefined && service !== null)
}

/**
 * Inicializa servicios con configuración específica
 * @param {Object} config - Configuración de inicialización
 * @returns {Promise<void>}
 */
export const initializeServices = async (config = {}) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Initializing API services...', config)
    }

    // Aquí podrías agregar lógica de inicialización como:
    // - Configurar base URL dinámica
    // - Setear headers comunes
    // - Verificar conectividad

    return Promise.resolve()
}