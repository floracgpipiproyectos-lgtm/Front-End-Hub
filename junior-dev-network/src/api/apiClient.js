// apiClient.js - VERSIÓN ACTUALIZADA
import axios from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '@/constants/apiConfig'
import { FEATURE_FLAGS } from '@/constants/featureFlags'

class ApiClient {
  constructor(config = {}) {
    // Usar configuraciones centralizadas
    const defaultConfig = {
      baseURL: config.baseURL || process.env.VITE_API_BASE_URL || API_CONFIG.BASE_URLS.DEVELOPMENT,
      timeout: config.timeout || API_CONFIG.TIMEOUTS.DEFAULT,
      headers: {
        ...API_CONFIG.HEADERS.COMMON,
        ...config.headers
      },
      maxRetryAttempts: config.maxRetryAttempts || API_CONFIG.RETRY_CONFIG.DEFAULT.MAX_ATTEMPTS,
      retryDelay: config.retryDelay || API_CONFIG.RETRY_CONFIG.DEFAULT.BASE_DELAY
    }

    this.instance = axios.create(defaultConfig)
    this.setupInterceptors()
    this.requestQueue = []
    this.isOnline = navigator.onLine
    
    // Monitorear conexión
    this.setupConnectionMonitoring()
  }

  // =============================================
  // INTERCEPTORES MEJORADOS
  // =============================================
  
  setupInterceptors() {
    // Request interceptor con feature flags
    this.instance.interceptors.request.use(
      (config) => {
        // Añadir timestamp para debugging
        config.metadata = { startTime: Date.now() }
        
        // Añadir headers de autenticación si existen
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Añadir header de versión de app
        config.headers['X-App-Version'] = APP_CONSTANTS.APP_VERSION
        
        // Logging solo en desarrollo
        if (FEATURE_FLAGS.DEV_MODE) {
          console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params
          })
        }
        
        return config
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      }
    )
    
    // Response interceptor con manejo mejorado
    this.instance.interceptors.response.use(
      (response) => {
        const duration = Date.now() - response.config.metadata.startTime
        
        // Log de performance si es lento
        if (duration > 1000 && FEATURE_FLAGS.ENABLE_PERFORMANCE_MONITORING) {
          console.warn(`🐢 Response lento (${duration}ms): ${response.config.url}`)
        }
        
        // Cachear respuesta si es apropiado
        if (this.shouldCacheResponse(response)) {
          this.cacheResponse(response)
        }
        
        return response
      },
      async (error) => {
        // Manejo centralizado de errores
        const errorResponse = this.handleError(error)
        
        // Reintentos automáticos configurados
        if (this.shouldRetry(error) && error.config) {
          return this.retryRequest(error.config)
        }
        
        // Manejo offline
        if (!this.isOnline && error.message === 'Network Error') {
          return this.handleOfflineRequest(error.config)
        }
        
        return Promise.reject(errorResponse)
      }
    )
  }
  
  // =============================================
  // MÉTODOS MEJORADOS
  // =============================================
  
  /**
   * Verifica conectividad con timeout configurable
   */
  async checkConnectivity() {
    try {
      const response = await this.instance.get('/health', {
        timeout: API_CONFIG.TIMEOUTS.HEALTH_CHECK
      })
      return response.status === 200
    } catch (error) {
      console.warn('⚠️ Health check failed:', error.message)
      return false
    }
  }
  
  /**
   * Realiza una petición con reintentos inteligentes
   */
  async requestWithRetry(config, retryAttempt = 0) {
    const maxAttempts = config.maxRetryAttempts || API_CONFIG.RETRY_CONFIG.DEFAULT.MAX_ATTEMPTS
    const baseDelay = config.retryDelay || API_CONFIG.RETRY_CONFIG.DEFAULT.BASE_DELAY
    
    try {
      return await this.instance(config)
    } catch (error) {
      if (retryAttempt >= maxAttempts) {
        throw error
      }
      
      // Solo reintentar en ciertos errores
      if (!API_CONFIG.RETRY_CONFIG.DEFAULT.RETRY_ON_STATUS.includes(error.response?.status)) {
        throw error
      }
      
      // Backoff exponencial con jitter
      const delay = baseDelay * Math.pow(2, retryAttempt) + Math.random() * 1000
      
      console.log(`🔄 Reintentando en ${delay}ms (intento ${retryAttempt + 1}/${maxAttempts})`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
      
      return this.requestWithRetry(config, retryAttempt + 1)
    }
  }
  
  // =============================================
  // MANEJO OFFLINE
  // =============================================
  
  setupConnectionMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processOfflineQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }
  
  handleOfflineRequest(config) {
    if (FEATURE_FLAGS.ENABLE_OFFLINE_MODE) {
      // Guardar en cola para cuando vuelva la conexión
      this.requestQueue.push({
        config,
        timestamp: Date.now(),
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
      
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(this.requestQueue))
      
      return Promise.reject({
        message: 'Request guardado para procesar cuando se recupere la conexión',
        isOffline: true,
        queuedAt: new Date().toISOString()
      })
    }
    
    return Promise.reject({
      message: 'No hay conexión a internet',
      isOffline: true
    })
  }
  
  async processOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]')
    
    for (const request of queue) {
      try {
        await this.instance(request.config)
        console.log(`✅ Request offline procesado: ${request.config.url}`)
      } catch (error) {
        console.error(`❌ Error procesando request offline: ${error.message}`)
      }
    }
    
    // Limpiar cola
    this.requestQueue = []
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE)
  }
}