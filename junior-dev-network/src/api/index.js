// =============================================
// API INDEX - Punto de entrada principal
// =============================================
// noinspection UnnecessaryLocalVariableJS,GrazieInspection

// Re-exportar todo desde la carpeta services
export * from './services'

// Reexportar apiClient por separado
export { default as apiClient } from './apiClient'

// =============================================
// UTILIDADES GLOBALES DE API
// =============================================

/**
 * @enum {string}
 * Estados comunes de respuestas de API
 */
export const APIStatus = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
}

/**
 * @enum {string}
 * Métodos HTTP soportados
 */
export const HTTPMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

/**
 * @enum {number}
 * Códigos de error comunes de API
 */
export const ErrorCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
    NETWORK_ERROR: 0
}

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {T} data - Datos de la respuesta
 * @property {string} status - Estado de la respuesta
 * @property {number} [statusCode] - Código HTTP
 * @property {string} [message] - Mensaje descriptivo
 * @property {Object} [metadata] - Metadatos adicionales
 */

/**
 * @typedef {Object} PaginatedResponse
 * @template T
 * @property {T[]} items - Array de items
 * @property {number} total - Total de items
 * @property {number} page - Página actual
 * @property {number} limit - Límite por página
 * @property {number} totalPages - Total de páginas
 */

/**
 * @typedef {Object} QueryParams
 * @property {number} [page] - Número de página
 * @property {number} [limit] - Límite de resultados
 * @property {string} [sort] - Campo para ordenar
 * @property {'asc'|'desc'} [order] - Dirección del orden
 * @property {string} [search] - Término de búsqueda
 */

// =============================================
// HELPERS PARA MANEJO DE API
// =============================================

/**
 * Helper para construir queries de API
 * @param {Object} params - Parámetros de query
 * @returns {string} Query string formateada
 * @example
 * const query = buildQuery({ page: 1, limit: 10, skills: ['react', 'js'] })
 * // Resultado: '?page=1&limit=10&skills=react&skills=js'
 */
export const buildQuery = (params = {}) => {
    if (!params || Object.keys(params).length === 0) {
        return ''
    }

    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, item))
        } else {
            queryParams.append(key, value.toString())
        }
    })

    return `?${queryParams.toString()}`
}

/**
 * Helper para parsear respuestas de error de API
 * @param {Error} error - Error de axios
 * @returns {Object} Error parseado
 * @example
 * try {
 *   await apiClient.get('/endpoint')
 * } catch (error) {
 *   const parsed = parseApiError(error)
 *   console.log(parsed.message)
 * }
 */
export const parseApiError = (error) => {
    if (!error) return { message: 'Error desconocido' }

    if (error.response) {
        // Error de servidor (4xx, 5xx)
        const { status, data } = error.response
        return {
            status,
            data,
            message: data?.message || `Error ${status}`,
            isServerError: true,
            isValidationError: status === 422,
            isAuthError: status === 401 || status === 403
        }
    } else if (error.request) {
        // Error de red (no hubo respuesta)
        return {
            status: ErrorCodes.NETWORK_ERROR,
            message: 'Error de conexión. Verifica tu red.',
            isNetworkError: true
        }
    } else {
        // Error en la configuración de la request
        return {
            message: error.message || 'Error en la solicitud',
            isClientError: true
        }
    }
}

/**
 * Helper para crear timeout para requests
 * @param {number} ms - Milisegundos de timeout
 * @param {string} message - Mensaje de error
 * @returns {Promise<never>} Promise que rechaza después del timeout
 */
export const createTimeout = (ms = 30000, message = 'Timeout excedido') => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error(message)), ms)
    })
}

/**
 * Helper para retry de requests con backoff exponencial
 * @param {Function} requestFn - Función que realiza la request
 * @param {Object} options - Opciones de retry
 * @param {number} options.maxRetries - Máximo de reintentos
 * @param {number} options.baseDelay - Delay base en ms
 * @param {number[]} options.retryOnStatus - Códigos de status para reintentar
 * @returns {Promise<any>} Resultado de la request
 * @example
 * const fetchData = () => apiClient.get('/data')
 * const data = await retryWithBackoff(fetchData, { maxRetries: 3 })
 */
export const retryWithBackoff = async (requestFn, options = {}) => {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        retryOnStatus = [408, 429, 500, 502, 503, 504]
    } = options

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn()
        } catch (error) {
            const shouldRetry = error.response && retryOnStatus.includes(error.response.status)

            if (attempt === maxRetries || !shouldRetry) {
                throw error
            }

            // Esperar con backoff exponencial
            const delay = baseDelay * Math.pow(2, attempt)
            console.log(`🔄 Reintentando en ${delay}ms (intento ${attempt + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }
}

/**
 * Helper para crear headers comunes
 * @param {Object} customHeaders - Headers adicionales
 * @returns {Object} Headers completos
 */
export const createHeaders = (customHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }

    return {
        ...headers,
        ...customHeaders
    }
}

/**
 * Helper para serializar datos de formulario
 * @param {FormData|Object} data - Datos a serializar
 * @returns {Object} Datos serializados
 */
export const serializeData = (data) => {
    if (data instanceof FormData) {
        return data
    }

    if (data && typeof data === 'object') {
        return JSON.stringify(data)
    }

    return data
}

/**
 * Helper para formatear fechas de API
 * @param {string} dateString - Fecha en string ISO
 * @returns {Date} Objeto Date
 */
export const parseApiDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString)
}

// =============================================
// WRAPPERS PARA API CALLS
// =============================================

/**
 * Wrapper para llamadas GET con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} params - Parámetros de query
 * @param {Object} config - Configuración adicional
 * @returns {Promise<any>} Datos de la respuesta
 */
export const safeGet = async (endpoint, params = {}, config = {}) => {
    try {
        const query = buildQuery(params)
        const response = await apiClient.get(`${endpoint}${query}`, config)
        return response.data
    } catch (error) {
        const parsedError = parseApiError(error)
        throw parsedError
    }
}

/**
 * Wrapper para llamadas POST con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 * @returns {Promise<any>} Datos de la respuesta
 */
export const safePost = async (endpoint, data = {}, config = {}) => {
    try {
        const response = await apiClient.post(endpoint, data, config)
        return response.data
    } catch (error) {
        const parsedError = parseApiError(error)
        throw parsedError
    }
}

/**
 * Wrapper para llamadas PUT con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 * @returns {Promise<any>} Datos de la respuesta
 */
export const safePut = async (endpoint, data = {}, config = {}) => {
    try {
        const response = await apiClient.put(endpoint, data, config)
        return response.data
    } catch (error) {
        const parsedError = parseApiError(error)
        throw parsedError
    }
}

/**
 * Wrapper para llamadas DELETE con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} config - Configuración adicional
 * @returns {Promise<any>} Datos de la respuesta
 */
export const safeDelete = async (endpoint, config = {}) => {
    try {
        const response = await apiClient.delete(endpoint, config)
        return response.data
    } catch (error) {
        const parsedError = parseApiError(error)
        throw parsedError
    }
}

// =============================================
// MIDDLEWARE Y INTERCEPTORES
// =============================================

/**
 * Middleware para logging de requests (solo desarrollo)
 * @param {Object} config - Configuración de la request
 * @returns {Object} Configuración modificada
 */
export const requestLogger = (config) => {
    if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
        console.log('Config:', config)
        if (config.data) console.log('Data:', config.data)
        console.groupEnd()
    }
    return config
}

/**
 * Middleware para logging de responses (solo desarrollo)
 * @param {Object} response - Respuesta de la API
 * @returns {Object} Respuesta modificada
 */
export const responseLogger = (response) => {
    if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(`✅ API Response: ${response.status} ${response.config.url}`)
        console.log('Response:', response)
        console.log('Data:', response.data)
        console.groupEnd()
    }
    return response
}

/**
 * Middleware para manejo de errores global
 * @param {Error} error - Error de la API
 * @returns {Promise<never>} Promise rechazada
 */
export const errorHandler = (error) => {
    const parsedError = parseApiError(error)

    if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
        console.log('Error:', parsedError)
        console.log('Original Error:', error)
        console.groupEnd()
    }

    return Promise.reject(parsedError)
}

// =============================================
// OBJETO CONSOLIDADO DE API
// =============================================

/**
 * Objeto consolidado con toda la funcionalidad de API
 */
const API = {
    // Cliente principal
    client: apiClient,

    // Servicios (ya exportados desde services/)
    services: {}, // Se llenará dinámicamente

    // Constantes
    APIStatus,
    HTTPMethods,
    ErrorCodes,

    // Helpers
    buildQuery,
    parseApiError,
    createTimeout,
    retryWithBackoff,
    createHeaders,
    serializeData,
    parseApiDate,

    // Wrappers seguros
    get: safeGet,
    post: safePost,
    put: safePut,
    delete: safeDelete,

    // Middleware
    requestLogger,
    responseLogger,
    errorHandler
}

// =============================================
// INICIALIZACIÓN Y CONFIGURACIÓN
// =============================================

/**
 * Inicializa la API con configuración personalizada
 * @param {Object} config - Configuración de inicialización
 * @returns {Object} API configurada
 */
export const initializeAPI = async (config = {}) => {
    console.log('🚀 Initializing JuniorDev Network API...')

    // Configuración por defecto
    const defaultConfig = {
        baseURL: process.env.VITE_API_BASE_URL,
        enableLogging: process.env.NODE_ENV === 'development',
        timeout: 30000,
        retryAttempts: 3
    }

    const mergedConfig = { ...defaultConfig, ...config }

    // Configurar el apiClient si se proporciona nueva configuración
    if (mergedConfig.baseURL && mergedConfig.baseURL !== apiClient.defaults.baseURL) {
        apiClient.defaults.baseURL = mergedConfig.baseURL
    }

    if (mergedConfig.timeout) {
        apiClient.defaults.timeout = mergedConfig.timeout
    }

    // Agregar interceptores de logging si está habilitado
    if (mergedConfig.enableLogging) {
        // Guardar interceptores originales



        // Agregar logging
        apiClient.interceptors.request.use(requestLogger)
        apiClient.interceptors.response.use(responseLogger, errorHandler)
    }

    // Cargar servicios dinámicamente si es necesario
    if (config.services) {
        API.services = config.services
    }

    console.log('✅ API initialized successfully')
    return API
}

/**
 * Verifica la conexión con la API
 * @returns {Promise<boolean>} true si la API está disponible
 */
export const checkAPIHealth = async () => {
    try {
        const response = await apiClient.get('/health', { timeout: 5000 })
        return response.status === 200
    } catch (error) {
        console.warn('⚠️ API health check failed:', error.message)
        return false
    }
}

/**
 * Limpia caché y tokens de la API
 * @returns {Promise<void>}
 */
export const clearAPICache = async () => {
    // Limpiar headers de autorización
    delete apiClient.defaults.headers.common['Authorization']

    // Limpiar interceptores
    apiClient.interceptors.request.clear()
    apiClient.interceptors.response.clear()

    console.log('🧹 API cache cleared')
}

// =============================================
// EXPORTACIÓN POR DEFECTO
// =============================================

// Exportación por defecto del objeto API consolidado
export default API

// =============================================
// EXPORTACIONES ADICIONALES UTILES
// =============================================

/**
 * Exportaciones agrupadas para imports específicos
 */
export const API_UTILS = {
    buildQuery,
    parseApiError,
    createTimeout,
    retryWithBackoff,
    createHeaders,
    serializeData,
    parseApiDate
}

export const API_WRAPPERS = {
    get: safeGet,
    post: safePost,
    put: safePut,
    delete: safeDelete
}

export const API_MIDDLEWARE = {
    requestLogger,
    responseLogger,
    errorHandler
}

export const API_INIT = {
    initializeAPI,
    checkAPIHealth,
    clearAPICache
}