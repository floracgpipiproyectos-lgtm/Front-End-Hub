// portfolioService.js
// noinspection GrazieInspection

import apiClient from '../apiClient'
import { PORTFOLIO_ENDPOINTS } from '@/constants/apiEndpoints'
import { PortfolioValidator } from '@/validations/index'

// =============================================
// CONSTANTES Y ENUMS
// =============================================

/**
 * @enum {string}
 * Plantillas disponibles para portafolios
 */
export const PortfolioTemplate = {
  DEFAULT: 'default',
  MODERN: 'modern',
  MINIMAL: 'minimal',
  PROFESSIONAL: 'professional',
  CREATIVE: 'creative',
  DARK: 'dark',
  LIGHT: 'light',
  RETRO: 'retro'
}

/**
 * @enum {string}
 * Estados de despliegue del portafolio
 */
export const DeploymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DEPLOYED: 'deployed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

/**
 * @enum {string}
 * Tipos de contenido que se pueden incluir
 */
export const PortfolioContentType = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  BADGES: 'badges',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  CONTACT_INFO: 'contact_info'
}

/**
 * @enum {string}
 * Plataformas de despliegue soportadas
 */
export const DeploymentPlatform = {
  GITHUB_PAGES: 'github_pages',
  VERCEL: 'vercel',
  NETLIFY: 'netlify',
  CUSTOM: 'custom',
  AWS_S3: 'aws_s3',
  AZURE_STATIC: 'azure_static'
}

// =============================================
// TYPES Y INTERFACES (JSDoc)
// =============================================

/**
 * @typedef {Object} PortfolioOptions
 * @property {PortfolioTemplate} [templateId] - ID de la plantilla a usar
 * @property {boolean} [includeProjects] - Incluir proyectos completados
 * @property {boolean} [includeSkills] - Incluir skills detectadas
 * @property {boolean} [includeBadges] - Incluir badges obtenidos
 * @property {boolean} [includeExperience] - Incluir experiencia laboral
 * @property {boolean} [includeEducation] - Incluir educación
 * @property {boolean} [includeContactInfo] - Incluir información de contacto
 * @property {string} [primaryColor] - Color primario personalizado
 * @property {string} [secondaryColor] - Color secundario personalizado
 * @property {string} [fontFamily] - Familia de fuentes personalizada
 * @property {string} [metaTitle] - Título meta para SEO
 * @property {string} [metaDescription] - Descripción meta para SEO
 * @property {string[]} [metaKeywords] - Palabras clave para SEO
 * @property {string} [customDomain] - Dominio personalizado
 * @property {boolean} [enableAnalytics] - Habilitar analytics
 */

/**
 * @typedef {Object} PortfolioData
 * @property {string} portfolioId - ID único del portafolio
 * @property {string} title - Título del portafolio
 * @property {string} description - Descripción del portafolio
 * @property {string} ownerId - ID del propietario
 * @property {string} templateId - ID de la plantilla usada
 * @property {string[]} projectIds - IDs de proyectos incluidos
 * @property {string[]} skillIds - IDs de skills incluidas
 * @property {string[]} badgeIds - IDs de badges incluidos
 * @property {PortfolioOptions} options - Opciones de configuración
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de última actualización
 * @property {Date} lastGeneratedAt - Fecha de última generación
 * @property {string} [previewUrl] - URL de vista previa
 * @property {string} [deployedUrl] - URL del despliegue
 * @property {string} [sourceCodeUrl] - URL del código fuente
 * @property {number} viewCount - Contador de vistas
 * @property {number} downloadCount - Contador de descargas
 * @property {number} cloneCount - Contador de clones
 */

/**
 * @typedef {Object} PortfolioGenerationResult
 * @property {string} portfolioId - ID del portafolio generado
 * @property {string} portfolioUrl - URL del portafolio
 * @property {string} previewUrl - URL de vista previa
 * @property {Date} generatedAt - Fecha de generación
 * @property {string} templateUsed - Plantilla utilizada
 * @property {string} generationId - ID único de la generación
 * @property {number} includedProjects - Número de proyectos incluidos
 * @property {number} includedSkills - Número de skills incluidas
 * @property {number} includedBadges - Número de badges incluidos
 * @property {number} generationTimeMs - Tiempo de generación en ms
 * @property {string[]} generatedFiles - Archivos generados
 * @property {Object.<string, number>} fileSizes - Tamaños de archivos
 * @property {boolean} success - Indica si fue exitosa
 * @property {string} [errorMessage] - Mensaje de error si falló
 */

/**
 * @typedef {Object} DeploymentOptions
 * @property {DeploymentPlatform} [platform] - Plataforma de despliegue
 * @property {string} [customDomain] - Dominio personalizado
 * @property {boolean} [enableSSL] - Habilitar SSL
 * @property {boolean} [forceHTTPS] - Forzar HTTPS
 * @property {Object.<string, string>} [platformConfig] - Configuración específica
 * @property {string} [buildCommand] - Comando de build
 * @property {string} [outputDirectory] - Directorio de salida
 * @property {string[]} [environmentVariables] - Variables de entorno
 * @property {boolean} [notifyOnCompletion] - Notificar al completar
 * @property {string} [notificationEmail] - Email para notificaciones
 */

/**
 * @typedef {Object} DeploymentResult
 * @property {string} deploymentId - ID único del despliegue
 * @property {string} portfolioId - ID del portafolio desplegado
 * @property {string} deployedUrl - URL del despliegue
 * @property {DeploymentStatus} status - Estado del despliegue
 * @property {Date} startedAt - Fecha de inicio
 * @property {Date} [completedAt] - Fecha de completado
 * @property {string} [errorMessage] - Mensaje de error si falló
 * @property {string} [logsUrl] - URL de los logs
 * @property {number} totalFiles - Total de archivos desplegados
 * @property {number} totalSizeBytes - Tamaño total en bytes
 * @property {number} deploymentTimeMs - Tiempo de despliegue en ms
 */

/**
 * @typedef {Object} PortfolioTemplateInfo
 * @property {string} id - ID de la plantilla
 * @property {string} name - Nombre de la plantilla
 * @property {string} description - Descripción
 * @property {string} category - Categoría
 * @property {string} previewImageUrl - URL de imagen de preview
 * @property {string[]} features - Características
 * @property {string[]} requiredSkills - Skills requeridas
 * @property {string} framework - Framework utilizado
 * @property {string[]} dependencies - Dependencias
 * @property {number} estimatedBuildTimeMs - Tiempo estimado de build
 * @property {boolean} responsive - Si es responsive
 * @property {boolean} darkMode - Soporta modo oscuro
 * @property {boolean} seoOptimized - Optimizado para SEO
 * @property {number} usageCount - Veces usada
 * @property {number} averageRating - Rating promedio
 */

/**
 * @typedef {Function} GenerationCallback
 * @param {PortfolioGenerationResult} result - Resultado de la generación
 * @param {string} userId - ID del usuario
 * @returns {void}
 */

/**
 * @typedef {Function} DeploymentCallback
 * @param {DeploymentResult} result - Resultado del despliegue
 * @param {string} portfolioId - ID del portafolio
 * @returns {void}
 */

// =============================================
// CLASE PORTFOLIO SERVICE
// =============================================

// noinspection UnnecessaryLocalVariableJS,ExceptionCaughtLocallyJS,GrazieInspection,BadExpressionStatementJS,JSIgnoredPromiseFromCall
/**
 * Servicio de portafolio mejorado para JuniorDev Network
 * Implementa arquitectura modular con separación de responsabilidades
 * y patrones modernos de diseño
 */
export class PortfolioService {
  /**
   * Constructor del servicio de portafolio
   * @param {Object} config - Configuración del servicio
   * @param {string} [config.apiBaseUrl] - URL base de la API
   * @param {PortfolioOptions} [config.defaultOptions] - Opciones por defecto
   */
  constructor(config = {}) {
    this.apiClient = apiClient
    this.validator = PortfolioValidator
    this.apiBaseUrl = config.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    this.defaultOptions = {
      templateId: PortfolioTemplate.DEFAULT,
      includeProjects: true,
      includeSkills: true,
      includeBadges: true,
      includeExperience: false,
      includeEducation: false,
      includeContactInfo: true,
      enableAnalytics: false,
      ...config.defaultOptions
    }
    
    this.generationCallbacks = []
    this.deploymentCallbacks = []
    
    // Inicializar servicio
    this.initialize()
  }

  /**
   * Inicializa el servicio y verifica conectividad
   * @private
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Portfolio Service...')
      
      // Verificar conectividad con la API
      const isHealthy = await this.checkApiHealth()
      if (!isHealthy) {
        console.warn('⚠️ Portfolio Service API not responding')
      }
      
      // Cargar configuraciones iniciales
      await this.loadInitialConfig()
      
      console.log('✅ Portfolio Service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Portfolio Service:', error)
      throw error
    }
  }

  // =============================================
  // OPERACIONES PRINCIPALES
  // =============================================

  /**
   * Obtiene el portafolio actual del usuario
   * @param {null} [userId] - ID del usuario (opcional, usa usuario actual si no se proporciona)
   * @returns {Promise<{}>} Datos del portafolio
   * @throws {Error} Si el usuario no está autenticado o el portafolio no existe
   * 
   * @example
   * const portfolio = await portfolioService.getPortfolio()
   * console.log('Portfolio title:', portfolio.title)
   */
  async getPortfolio(userId = null) {
    try {
      const endpoint = userId 
        ? `${PORTFOLIO_ENDPOINTS.GET_USER_PORTFOLIO}/${userId}`
        : PORTFOLIO_ENDPOINTS.GET_PORTFOLIO

      const response = await this.apiClient.get(endpoint)
      
      // Transformar fechas string a objetos Date
      const portfolio = this.transformDates(response.data)
      
      return portfolio
    } catch (error) {
      console.error('Error getting portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Genera un nuevo portafolio automáticamente basado en el perfil del usuario
   * @param {PortfolioOptions} [options={}] - Opciones de generación
   * @param {null} [userId] - ID del usuario (opcional, usa usuario actual)
   * @returns {Promise<PortfolioGenerationResult>} Resultado de la generación
   * @throws {Error} Si no hay suficiente información del usuario
   * 
   * @example
   * const result = await portfolioService.generatePortfolio({
   *   templateId: PortfolioTemplate.MODERN,
   *   includeProjects: true,
   *   includeBadges: true
   * })
   */
  async generatePortfolio(options = {}, userId = null) {
    const startTime = performance.now()
    
    try {
      // Combinar opciones por defecto con las proporcionadas
      const mergedOptions = {
        ...this.defaultOptions,
        ...options
      }

      // Validar opciones
      const validationErrors = this.validator.validateOptions(mergedOptions)
      if (validationErrors.length > 0) {
        throw new Error(`Invalid portfolio options: ${validationErrors.join(', ')}`)
      }

      // Preparar datos de generación
      const generationData = {
        ...mergedOptions,
        userId: userId || 'current'
      }

      // Llamar API de generación
      const response = await this.apiClient.post(
        PORTFOLIO_ENDPOINTS.GENERATE_PORTFOLIO,
        generationData
      )

      const result = {
        portfolioId: response.data.portfolioId,
        portfolioUrl: response.data.url,
        previewUrl: response.data.previewUrl,
        generatedAt: new Date(),
        templateUsed: mergedOptions.templateId,
        generationId: response.data.generationId || `gen_${Date.now()}`,
        includedProjects: response.data.includedProjects || 0,
        includedSkills: response.data.includedSkills || 0,
        includedBadges: response.data.includedBadges || 0,
        generationTimeMs: performance.now() - startTime,
        generatedFiles: response.data.generatedFiles || [],
        fileSizes: response.data.fileSizes || {},
        success: true
      }

      // Ejecutar callbacks de generación
      this.executeGenerationCallbacks(result, userId || 'current')

      return result
    } catch (error) {
      performance.now() - startTime;

      console.error('Error generating portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Actualiza un portafolio existente
   * @param {string} portfolioId - ID del portafolio a actualizar
   * @param {Partial<PortfolioData>} updatedData - Datos actualizados
   * @param {null} [userId] - ID del usuario para verificación de propiedad
   * @returns {Promise<{}>} Portafolio actualizado
   * @throws {Error} Si el usuario no tiene permisos o el portafolio no existe
   * 
   * @example
   * const updated = await portfolioService.updatePortfolio('portfolio_123', {
   *   title: 'Mi Nuevo Portafolio',
   *   description: 'Descripción actualizada'
   * })
   */
  async updatePortfolio(portfolioId, updatedData, userId = null) {
    try {
      // Verificar permisos si se proporciona userId
      if (userId) {
        const hasPermission = await this.verifyPortfolioOwnership(portfolioId, userId)
        if (!hasPermission) {
          throw new Error('User does not have permission to update this portfolio')
        }
      }

      // Validar datos de actualización
      const validationErrors = this.validator.validateUpdateData(updatedData)
      if (validationErrors.length > 0) {
        throw new Error(`Invalid update data: ${validationErrors.join(', ')}`)
      }

      const endpoint = `${PORTFOLIO_ENDPOINTS.UPDATE_PORTFOLIO}/${portfolioId}`
      const response = await this.apiClient.put(endpoint, updatedData)

      const updatedPortfolio = this.transformDates(response.data)
      
      return updatedPortfolio
    } catch (error) {
      console.error('Error updating portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Despliega un portafolio a una plataforma específica
   * @param {string} portfolioId - ID del portafolio a desplegar
   * @param {DeploymentOptions} [options={}] - Opciones de despliegue
   * @returns {Promise<DeploymentResult>} Resultado del despliegue
   * @throws {Error} Si el despliegue falla o el portafolio no existe
   * 
   * @example
   * const result = await portfolioService.deployPortfolio('portfolio_123', {
   *   platform: DeploymentPlatform.GITHUB_PAGES,
   *   customDomain: 'mi-portfolio.dev'
   * })
   */
  async deployPortfolio(portfolioId, options = {}) {
    const startTime = performance.now()
    
    try {
      const deploymentOptions = {
        platform: DeploymentPlatform.GITHUB_PAGES,
        enableSSL: true,
        forceHTTPS: true,
        notifyOnCompletion: true,
        ...options
      }

      const deploymentData = {
        portfolioId,
        ...deploymentOptions
      }

      const response = await this.apiClient.post(
        PORTFOLIO_ENDPOINTS.DEPLOY_PORTFOLIO,
        deploymentData
      )

      const result = {
        deploymentId: response.data.deploymentId,
        portfolioId,
        deployedUrl: response.data.url,
        status: DeploymentStatus.PROCESSING,
        startedAt: new Date(),
        totalFiles: response.data.totalFiles || 0,
        totalSizeBytes: response.data.totalSizeBytes || 0,
        deploymentTimeMs: performance.now() - startTime
      }

      // Ejecutar callbacks de despliegue
      this.executeDeploymentCallbacks(result, portfolioId)

      return result
    } catch (error) {
      `dep_${Date.now()}`;
      new Date();
      new Date();
      performance.now() - startTime;

      console.error('Error deploying portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Obtiene plantillas disponibles para portafolios
   * @param {Object} filters - Filtros opcionales para las plantillas
   * @param {string} [filters.category] - Filtrar por categoría
   * @param {string} [filters.framework] - Filtrar por framework
   * @param {boolean} [filters.responsive] - Solo plantillas responsive
   * @returns {Promise<PortfolioTemplateInfo[]>} Array de plantillas disponibles
   * 
   * @example
   * const templates = await portfolioService.getTemplates({
   *   category: 'professional',
   *   responsive: true
   * })
   */
  async getTemplates(filters = {}) {
    try {
      const response = await this.apiClient.get(PORTFOLIO_ENDPOINTS.GET_TEMPLATES, {
        params: filters
      })

      return response.data.map(template => ({
        ...template,
        // Asegurar que los arrays estén definidos
        features: template.features || [],
        requiredSkills: template.requiredSkills || [],
        dependencies: template.dependencies || []
      }))
    } catch (error) {
      console.error('Error getting templates:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Genera una vista previa del portafolio sin guardarlo
   * @param {PortfolioData} portfolioData - Datos del portafolio para preview
   * @param {PortfolioOptions} [options={}] - Opciones de visualización
   * @returns {Promise<string>} URL de la vista previa
   * @throws {Error} Si no se puede generar el preview
   * 
   * @example
   * const previewUrl = await portfolioService.previewPortfolio(portfolioData, {
   *   templateId: PortfolioTemplate.MODERN
   * })
   */
  async previewPortfolio(portfolioData, options = {}) {
    try {
      const previewData = {
        portfolio: portfolioData,
        options: {
          ...this.defaultOptions,
          ...options
        }
      }

      const response = await this.apiClient.post(
        PORTFOLIO_ENDPOINTS.PREVIEW_PORTFOLIO,
        previewData
      )

      return response.data.previewUrl
    } catch (error) {
      console.error('Error generating preview:', error)
      throw this.handleError(error)
    }
  }

  // =============================================
  // OPERACIONES AVANZADAS
  // =============================================

  /**
   * Clona un portafolio existente creando una nueva copia
   * @param {string} sourcePortfolioId - ID del portafolio a clonar
   * @param {null} [newOwnerId] - ID del nuevo propietario
   * @param {Object} customizations - Personalizaciones opcionales
   * @returns {Promise<{}>} Portafolio clonado
   * @throws {Error} Si el portafolio source no existe o no se puede clonar
   * 
   * @example
   * const cloned = await portfolioService.clonePortfolio('portfolio_123', 'user_456', {
   *   title: 'Mi Copia del Portafolio',
   *   primaryColor: '#FF5733'
   * })
   */
  async clonePortfolio(sourcePortfolioId, newOwnerId = null, customizations = {}) {
    try {
      const sourcePortfolio = await this.getPortfolio(sourcePortfolioId)
      
      const clonedData = {
        ...sourcePortfolio,
        portfolioId: `clone_${Date.now()}_${sourcePortfolioId}`,
        ownerId: newOwnerId || sourcePortfolio.ownerId,
        title: customizations.title || `${sourcePortfolio.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        downloadCount: 0,
        cloneCount: 0,
        // Aplicar otras personalizaciones
        ...customizations
      }

      // Remover IDs específicos que no deben copiarse
      delete clonedData._id
      delete clonedData.deployedUrl
      delete clonedData.sourceCodeUrl

      // Guardar portafolio clonado
      const response = await this.apiClient.post(
        PORTFOLIO_ENDPOINTS.CREATE_PORTFOLIO,
        clonedData
      )

      // Incrementar contador de clones en el original
      await this.incrementCloneCount(sourcePortfolioId)

      return this.transformDates(response.data)
    } catch (error) {
      console.error('Error cloning portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Exporta el portafolio a diferentes formatos
   * @param {string} portfolioId - ID del portafolio
   * @param {string} [format='pdf'] - Formato de exportación (pdf, zip, html, markdown)
   * @param {Object} [options={}] - Opciones de exportación
   * @returns {Promise<string>} URL de descarga del archivo exportado
   * @throws {Error} Si no se puede exportar en el formato solicitado
   * 
   * @example
   * const downloadUrl = await portfolioService.exportPortfolio('portfolio_123', 'pdf', {
   *   includeSourceCode: true,
   *   quality: 'high'
   * })
   */
  async exportPortfolio(portfolioId, format = 'pdf', options = {}) {
    try {
      const exportData = {
        portfolioId,
        format,
        options
      }

      const response = await this.apiClient.post(
        PORTFOLIO_ENDPOINTS.EXPORT_PORTFOLIO,
        exportData
      )

      // Incrementar contador de descargas
      await this.incrementDownloadCount(portfolioId)

      return response.data.downloadUrl
    } catch (error) {
      console.error('Error exporting portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Analiza y proporciona recomendaciones para optimizar un portafolio
   * @param {string} portfolioId - ID del portafolio a analizar
   * @returns {Promise<Object>} Objeto con recomendaciones de optimización
   * @throws {Error} Si no se puede analizar el portafolio
   * 
   * @example
   * const analysis = await portfolioService.analyzePortfolio('portfolio_123')
   * console.log('Recomendaciones:', analysis.recommendations)
   */
  async analyzePortfolio(portfolioId) {
    try {
      const response = await this.apiClient.get(
        `${PORTFOLIO_ENDPOINTS.ANALYZE_PORTFOLIO}/${portfolioId}`
      )

      return {
        portfolioId,
        score: response.data.score || 0,
        recommendations: response.data.recommendations || [],
        warnings: response.data.warnings || [],
        suggestions: response.data.suggestions || [],
        analyzedAt: new Date()
      }
    } catch (error) {
      console.error('Error analyzing portfolio:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Obtiene estadísticas detalladas del portafolio
   * @param {string} [timeframe='30d'] - Período de tiempo (7d, 30d, 90d, all_time)
   * @returns {Promise<Object>} Estadísticas del portafolio
   * @throws {Error} Si no se pueden obtener las estadísticas
   *
   * @example
   * const stats = await portfolioService.getPortfolioStats('portfolio_123', '7d')
   * console.log('Vistas esta semana:', stats.views)
   */
  async getPortfolioStats(timeframe = '30d') {
    try {
      const response = await this.apiClient.get(
        `${PORTFOLIO_ENDPOINTS.GET_STATS}/${portfolioId}`,
        {
          params: { timeframe }
        }
      )

      return {
        portfolioId,
        timeframe,
        views: response.data.views || 0,
        uniqueVisitors: response.data.uniqueVisitors || 0,
        averageTimeOnSite: response.data.averageTimeOnSite || 0,
        bounceRate: response.data.bounceRate || 0,
        referralSources: response.data.referralSources || {},
        deviceBreakdown: response.data.deviceBreakdown || {},
        geographicData: response.data.geographicData || {},
        updatedAt: new Date(response.data.updatedAt || Date.now())
      }
    } catch (error) {
      console.error('Error getting portfolio stats:', error)
      throw this.handleError(error)
    }
  }

  // =============================================
  // MANEJO DE EVENTOS Y CALLBACKS
  // =============================================

  /**
   * Registra un callback para eventos de generación de portafolio
   * @param {GenerationCallback} callback - Función callback a ejecutar
   * @returns {Function} Función para remover el callback
   * 
   * @example
   * const removeCallback = portfolioService.onGeneration((result, userId) => {
   *   console.log(`Portfolio generated for user ${userId}:`, result.portfolioId)
   * })
   */
  onGeneration(callback) {
    this.generationCallbacks.push(callback)
    
    // Retorna función para remover el callback
    return () => {
      const index = this.generationCallbacks.indexOf(callback)
      if (index > -1) {
        this.generationCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Registra un callback para eventos de despliegue
   * @param {DeploymentCallback} callback - Función callback a ejecutar
   * @returns {Function} Función para remover el callback
   * 
   * @example
   * const removeCallback = portfolioService.onDeployment((result, portfolioId) => {
   *   console.log(`Portfolio ${portfolioId} deployed to:`, result.deployedUrl)
   * })
   */
  onDeployment(callback) {
    this.deploymentCallbacks.push(callback)
    
    // Retorna función para remover el callback
    return () => {
      const index = this.deploymentCallbacks.indexOf(callback)
      if (index > -1) {
        this.deploymentCallbacks.splice(index, 1)
      }
    }
  }

  // =============================================
  // MÉTODOS DE CONFIGURACIÓN Y UTILIDADES
  // =============================================

  /**
   * Configura las opciones por defecto del servicio
   * @param {PortfolioOptions} options - Nuevas opciones por defecto
   * @returns {void}
   */
  setDefaultOptions(options) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options
    }
  }

  /**
   * Obtiene las opciones por defecto actuales
   * @returns {PortfolioOptions} Opciones por defecto
   */
  getDefaultOptions() {
    return { ...this.defaultOptions }
  }

  /**
   * Verifica la conectividad con el servicio de portafolio
   * @returns {Promise<boolean>} true si el servicio está disponible
   */
  async checkHealth() {
    try {
      const response = await this.apiClient.get(PORTFOLIO_ENDPOINTS.HEALTH, {
        timeout: 5000
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  // =============================================
  // MÉTODOS PRIVADOS
  // =============================================

  /**
   * Verifica la salud de la API
   * @private
   * @returns {Promise<boolean>}
   */
  async checkApiHealth() {
    try {
      const response = await this.apiClient.get('/health', { timeout: 3000 })
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  /**
   * Carga la configuración inicial del servicio
   * @private
   * @returns {Promise<void>}
   */
  async loadInitialConfig() {
    try {
      // Cargar plantillas populares en caché
      this.popularTemplates = await this.getTemplates({ category: 'popular', limit: 5 })
      
      // Cargar configuración de despliegue
      const configResponse = await this.apiClient.get(PORTFOLIO_ENDPOINTS.GET_CONFIG)
      this.deploymentConfig = configResponse.data
    } catch (error) {
      console.warn('Could not load initial config:', error.message)
    }
  }

  /**
   * Transforma fechas string en objetos Date
   * @private
   * @param {Object} data - Datos con fechas como string
   * @returns {Object} Datos con fechas como objetos Date
   */
  transformDates(data) {
    const dateFields = ['createdAt', 'updatedAt', 'lastGeneratedAt', 'deployedAt']
    
    const transformed = { ...data }
    
    dateFields.forEach(field => {
      if (transformed[field] && typeof transformed[field] === 'string') {
        transformed[field] = new Date(transformed[field])
      }
    })
    
    return transformed
  }

  /**
   * Ejecuta todos los callbacks de generación registrados
   * @private
   * @param {PortfolioGenerationResult} result - Resultado de la generación
   * @param {string} userId - ID del usuario
   */
  executeGenerationCallbacks(result, userId) {
    this.generationCallbacks.forEach(callback => {
      try {
        callback(result, userId)
      } catch (error) {
        console.error('Error in generation callback:', error)
      }
    })
  }

  /**
   * Ejecuta todos los callbacks de despliegue registrados
   * @private
   * @param {DeploymentResult} result - Resultado del despliegue
   * @param {string} portfolioId - ID del portafolio
   */
  executeDeploymentCallbacks(result, portfolioId) {
    this.deploymentCallbacks.forEach(callback => {
      try {
        callback(result, portfolioId)
      } catch (error) {
        console.error('Error in deployment callback:', error)
      }
    })
  }

  /**
   * Verifica si un usuario es propietario de un portafolio
   * @private
   * @param {string} portfolioId - ID del portafolio
   * @param {string} userId - ID del usuario
   * @returns {Promise<boolean>} true si el usuario es propietario
   */
  async verifyPortfolioOwnership(portfolioId, userId) {
    try {
      const portfolio = await this.getPortfolio(portfolioId)
      return portfolio.ownerId === userId
    } catch (error) {
      return false
    }
  }

  /**
   * Incrementa el contador de clones de un portafolio
   * @private
   * @param {string} portfolioId - ID del portafolio
   * @returns {Promise<void>}
   */
  async incrementCloneCount(portfolioId) {
    try {
      await this.apiClient.post(
        `${PORTFOLIO_ENDPOINTS.INCREMENT_CLONE_COUNT}/${portfolioId}`
      )
    } catch (error) {
      console.warn('Could not increment clone count:', error.message)
    }
  }

  /**
   * Incrementa el contador de descargas de un portafolio
   * @private
   * @param {string} portfolioId - ID del portafolio
   * @returns {Promise<void>}
   */
  async incrementDownloadCount(portfolioId) {
    try {
      await this.apiClient.post(
        `${PORTFOLIO_ENDPOINTS.INCREMENT_DOWNLOAD_COUNT}/${portfolioId}`
      )
    } catch (error) {
      console.warn('Could not increment download count:', error.message)
    }
  }

  /**
   * Maneja errores de manera consistente
   * @private
   * @param {Error} error - Error original
   * @returns {Error} Error procesado
   */
  handleError(error) {
    // Aquí podrías agregar lógica de logging, notificaciones, etc.
    return error
  }
}

// =============================================
// FACTORY PARA CREAR INSTANCIAS DEL SERVICIO
// =============================================

/**
 * Factory para crear instancias de PortfolioService con diferentes configuraciones
 */
export class PortfolioServiceFactory {
  /**
   * Crea una instancia estándar del servicio
   * @returns {PortfolioService} Instancia del servicio
   */
  static createDefault() {
    return new PortfolioService()
  }

  /**
   * Crea una instancia con configuración personalizada
   * @param {Object} config - Configuración personalizada
   * @returns {PortfolioService} Instancia personalizada
   */
  static createWithConfig(config) {
    return new PortfolioService(config)
  }

  /**
   * Crea una instancia para desarrollo con datos mock
   * @returns {PortfolioService} Instancia con datos de prueba
   */
  static createForDevelopment() {
    const mockApiClient = {
      get: async () => ({ data: {} }),
      post: async () => ({ data: {} }),
      put: async () => ({ data: {} }),
      delete: async () => ({ data: {} })
    }

    return new PortfolioService({
      apiClient: mockApiClient,
      defaultOptions: {
        templateId: PortfolioTemplate.MODERN,
        includeProjects: true,
        includeSkills: true
      }
    })
  }

  /**
   * Crea una instancia con callbacks preconfigurados
   * @param {Object} callbacks - Callbacks para eventos
   * @returns {PortfolioService} Instancia con callbacks
   */
  static createWithCallbacks(callbacks) {
    const service = new PortfolioService()
    
    if (callbacks.onGeneration) {
      service.onGeneration(callbacks.onGeneration)
    }
    
    if (callbacks.onDeployment) {
      service.onDeployment(callbacks.onDeployment)
    }
    
    return service
  }
}

// =============================================
// INSTANCIA POR DEFECTO PARA BACKWARD COMPATIBILITY
// =============================================

/**
 * Instancia por defecto del servicio de portafolio
 * Mantiene compatibilidad con el código existente
 * @type {PortfolioService}
 */
export const portfolioService = PortfolioServiceFactory.createDefault()

// Re-exportar las funciones originales como métodos del objeto por defecto
// para mantener compatibilidad con imports existentes
export default {
  ...portfolioService,
  PortfolioTemplate,
  DeploymentStatus,
  DeploymentPlatform,
  PortfolioServiceFactory
}