// projectService.js
import apiClient from '../apiClient'
import { PROJECT_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

// Enums y constantes
/**
 * Niveles de dificultad de proyectos
 * @enum {string}
 */
export const ProjectLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
}

/**
 * Tipos de proyectos
 * @enum {string}
 */
export const ProjectType = {
  OPEN_SOURCE: 'open-source',
  FREELANCE: 'freelance',
  CHALLENGE: 'challenge',
  PERSONAL: 'personal',
  CORPORATE: 'corporate'
}

/**
 * Estados de proyectos
 * @enum {string}
 */
export const ProjectStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
  DRAFT: 'draft'
}

/**
 * @typedef {Object} Skill
 * @property {string} id - ID único de la skill
 * @property {string} name - Nombre de la skill
 * @property {string} category - Categoría (frontend, backend, etc.)
 * @property {number} level - Nivel 1-5
 * @property {number} confidence - Confianza 0-100
 */

/**
 * @typedef {Object} Project
 * @property {string} id - ID único del proyecto
 * @property {string} title - Título del proyecto
 * @property {string} description - Descripción detallada
 * @property {string} short_description - Descripción breve
 * @property {Skill[]} required_skills - Skills requeridas
 * @property {Skill[]} recommended_skills - Skills recomendadas
 * @property {ProjectLevel} level - Nivel de dificultad
 * @property {ProjectType} type - Tipo de proyecto
 * @property {ProjectStatus} status - Estado actual
 * @property {string} repository_url - URL del repositorio
 * @property {string} documentation_url - URL de documentación
 * @property {string} demo_url - URL del demo
 * @property {string} owner_id - ID del propietario
 * @property {string[]} collaborators - IDs de colaboradores
 * @property {string[]} applicants - IDs de solicitantes
 * @property {number} max_collaborators - Máximo de colaboradores
 * @property {number} current_collaborators - Colaboradores actuales
 * @property {number} difficulty_score - Puntuación de dificultad 1-10
 * @property {number} estimated_hours - Horas estimadas
 * @property {string} created_at - Fecha de creación
 * @property {string} updated_at - Fecha de última actualización
 * @property {string|null} started_at - Fecha de inicio
 * @property {string|null} completed_at - Fecha de completado
 * @property {Object} metadata - Metadatos adicionales
 * @property {number} view_count - Contador de vistas
 * @property {number} join_count - Contador de uniones
 * @property {number} completion_count - Contador de completados
 * @property {number} average_rating - Rating promedio
 */

/**
 * @typedef {Object} ProjectFilters
 * @property {number} page - Número de página
 * @property {number} limit - Resultados por página
 * @property {string[]} skills - Skills para filtrar
 * @property {ProjectLevel} level - Nivel de dificultad
 * @property {ProjectType} type - Tipo de proyecto
 * @property {ProjectStatus} status - Estado del proyecto
 * @property {string} search_query - Término de búsqueda
 * @property {string} sort_by - Campo para ordenar
 * @property {boolean} sort_descending - Orden descendente
 * @property {number} min_difficulty - Dificultad mínima
 * @property {number} max_difficulty - Dificultad máxima
 */

/**
 * @typedef {Object} ProjectRecommendationOptions
 * @property {number} limit - Límite de resultados
 * @property {boolean} include_joined - Incluir proyectos unidos
 * @property {boolean} prioritize_skills - Priorizar por skills
 * @property {boolean} include_beginner_friendly - Incluir proyectos para principiantes
 * @property {string[]} preferred_types - Tipos preferidos
 */

/**
 * @typedef {Object} ProjectCompletionData
 * @property {string} completion_notes - Notas de completación
 * @property {string|null} repository_url - URL del repositorio
 * @property {string|null} demo_url - URL del demo
 * @property {string|null} documentation_url - URL de documentación
 * @property {number} rating - Rating 1-5
 * @property {string[]} learned_skills - Skills aprendidas
 * @property {string[]} challenges_faced - Desafíos enfrentados
 * @property {number} actual_hours_spent - Horas reales invertidas
 * @property {boolean} would_recommend - Recomendaría el proyecto
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Project[]} projects - Lista de proyectos
 * @property {number} total - Total de resultados
 * @property {number} page - Página actual
 * @property {number} limit - Límite por página
 * @property {number} total_pages - Total de páginas
 * @property {boolean} has_next - Tiene siguiente página
 * @property {boolean} has_previous - Tiene página anterior
 */

/**
 * @typedef {Object} RecommendedProject
 * @property {Project} project - Proyecto recomendado
 * @property {number} match_score - Puntuación de match 0-100
 * @property {string[]} matching_skills - Skills que coinciden
 * @property {string} recommendation_reason - Razón de la recomendación
 * @property {number} estimated_completion_time - Tiempo estimado en horas
 */

/**
 * Servicio de gestión de proyectos
 * Maneja la obtención, búsqueda y gestión de proyectos
 */
class ProjectService {
  /**
   * Constructor del servicio
   * @param {Object} config - Configuración del servicio
   * @param {string} config.baseUrl - URL base de la API
   * @param {string} config.authToken - Token de autenticación
   * @param {number} config.timeout - Timeout en milisegundos
   * @param {boolean} config.enableCache - Habilitar cache
   */
  constructor(config = {}) {
    this.apiClient = apiClient
    this.baseUrl = config.baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    this.authToken = config.authToken || ''
    this.timeout = config.timeout || 30000
    this.enableCache = config.enableCache !== false
    
    // Cache interno
    this.projectCache = new Map()
    this.paginatedCache = new Map()
    this.cacheDuration = 5 * 60 * 1000 // 5 minutos
    
    // Callbacks
    this.onErrorCallbacks = []
    this.onProjectJoinedCallbacks = []
    this.onProjectCompletedCallbacks = []
  }

  // =============================================
  // MÉTODOS DE CONFIGURACIÓN
  // =============================================

  /**
   * Establece el token de autenticación
   * @param {string} token - Token de autenticación
   */
  setAuthToken(token) {
    this.authToken = token
  }

  /**
   * Establece el timeout de las peticiones
   * @param {number} milliseconds - Timeout en milisegundos
   */
  setTimeout(milliseconds) {
    this.timeout = milliseconds
  }

  /**
   * Habilita o deshabilita el cache
   * @param {boolean} enable - true para habilitar, false para deshabilitar
   */
  enableCaching(enable) {
    this.enableCache = enable
  }

  /**
   * Establece la duración del cache
   * @param {number} minutes - Duración en minutos
   */
  setCacheDuration(minutes) {
    this.cacheDuration = minutes * 60 * 1000
  }

  // =============================================
  // MÉTODOS DE CALLBACKS
  // =============================================

  /**
   * Registra callback para errores
   * @param {Function} callback - Función callback (method, error)
   */
  onError(callback) {
    this.onErrorCallbacks.push(callback)
    return () => {
      const index = this.onErrorCallbacks.indexOf(callback)
      if (index > -1) {
        this.onErrorCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Registra callback cuando se une a un proyecto
   * @param {Function} callback - Función callback (projectId, project)
   */
  onProjectJoined(callback) {
    this.onProjectJoinedCallbacks.push(callback)
    return () => {
      const index = this.onProjectJoinedCallbacks.indexOf(callback)
      if (index > -1) {
        this.onProjectJoinedCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Registra callback cuando se completa un proyecto
   * @param {Function} callback - Función callback (projectId, project)
   */
  onProjectCompleted(callback) {
    this.onProjectCompletedCallbacks.push(callback)
    return () => {
      const index = this.onProjectCompletedCallbacks.indexOf(callback)
      if (index > -1) {
        this.onProjectCompletedCallbacks.splice(index, 1)
      }
    }
  }

  // =============================================
  // MÉTODOS PRINCIPALES
  // =============================================

  /**
   * Obtiene todos los proyectos disponibles con filtros opcionales
   * @param {ProjectFilters} filters - Filtros y opciones de paginación
   * @returns {Promise<PaginatedResponse>} Proyectos paginados
   * 
   * @example
   * const filters = {
   *   skills: ['React', 'JavaScript'],
   *   level: ProjectLevel.INTERMEDIATE,
   *   page: 1,
   *   limit: 20
   * }
   * const { projects } = await projectService.getAllProjects(filters)
   */
  async getAllProjects(filters = {}) {
    const cacheKey = this._generateCacheKey('getAllProjects', filters)
    
    if (this.enableCache) {
      const cached = this._getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const response = await this.apiClient.get(PROJECT_ENDPOINTS.GET_ALL, {
        params: filters,
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      const paginatedResponse = {
        projects: response.data.projects || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total_pages: response.data.total_pages || 0,
        has_next: response.data.has_next || false,
        has_previous: response.data.has_previous || false
      }

      if (this.enableCache) {
        this._addToCache(cacheKey, paginatedResponse)
      }

      return paginatedResponse
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'getAllProjects', error)
      throw error
    }
  }

  /**
   * Obtiene un proyecto específico por su ID
   * @param {string} projectId - ID único del proyecto
   * @returns {Promise<Project>} Datos del proyecto
   * 
   * @example
   * const project = await projectService.getProjectById('project-123')
   * console.log('Proyecto:', project.title)
   */
  async getProjectById(projectId) {
    const cacheKey = this._generateCacheKey('getProjectById', { id: projectId })
    
    if (this.enableCache) {
      const cached = this._getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.GET_BY_ID, { id: projectId })
      const response = await this.apiClient.get(endpoint, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      const project = response.data

      if (this.enableCache) {
        this._addToCache(cacheKey, project)
      }

      return project
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'getProjectById', error)
      throw error
    }
  }

  /**
   * Obtiene proyectos recomendados personalizados para el usuario actual
   * @param {ProjectRecommendationOptions} options - Opciones de recomendación
   * @returns {Promise<RecommendedProject[]>} Proyectos recomendados
   * 
   * @example
   * const recommended = await projectService.getRecommendedProjects({ limit: 5 })
   * recommended.forEach(rec => {
   *   console.log(`${rec.project.title} - Match: ${rec.match_score}%`)
   * })
   */
  async getRecommendedProjects(options = {}) {
    try {
      const response = await this.apiClient.get(PROJECT_ENDPOINTS.GET_RECOMMENDED, {
        params: options,
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      return response.data || []
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'getRecommendedProjects', error)
      throw error
    }
  }

  /**
   * Obtiene proyectos open-source con filtros opcionales
   * @param {ProjectFilters} filters - Filtros adicionales
   * @returns {Promise<PaginatedResponse>} Proyectos open-source
   */
  async getOpenSourceProjects(filters = {}) {
    filters.type = ProjectType.OPEN_SOURCE
    return this.getAllProjects(filters)
  }

  /**
   * Obtiene oportunidades freelance
   * @param {ProjectFilters} filters - Filtros adicionales
   * @returns {Promise<PaginatedResponse>} Proyectos freelance
   */
  async getFreelanceProjects(filters = {}) {
    filters.type = ProjectType.FREELANCE
    return this.getAllProjects(filters)
  }

  /**
   * Obtiene challenges educativos
   * @param {ProjectFilters} filters - Filtros adicionales
   * @returns {Promise<PaginatedResponse>} Challenges
   */
  async getChallenges(filters = {}) {
    filters.type = ProjectType.CHALLENGE
    return this.getAllProjects(filters)
  }

  /**
   * Permite al usuario unirse a un proyecto
   * @param {string} projectId - ID único del proyecto
   * @returns {Promise<Project>} Proyecto actualizado
   * 
   * @example
   * await projectService.joinProject('project-123')
   * // Proyecto agregado a la lista de proyectos activos
   */
  async joinProject(projectId) {
    try {
      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.JOIN_PROJECT, { id: projectId })
      const response = await this.apiClient.post(endpoint, {}, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      const project = response.data

      // Limpiar cache de este proyecto
      const cacheKey = this._generateCacheKey('getProjectById', { id: projectId })
      this.projectCache.delete(cacheKey)

      // Ejecutar callbacks
      this._executeCallbacks(this.onProjectJoinedCallbacks, projectId, project)

      return project
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'joinProject', error)
      throw error
    }
  }

  /**
   * Abandona un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<boolean>} true si se abandonó correctamente
   */
  async leaveProject(projectId) {
    try {
      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.LEAVE_PROJECT, { id: projectId })
      const response = await this.apiClient.post(endpoint, {}, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      // Limpiar cache
      const cacheKey = this._generateCacheKey('getProjectById', { id: projectId })
      this.projectCache.delete(cacheKey)

      return response.data.success === true
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'leaveProject', error)
      throw error
    }
  }

  /**
   * Marca un proyecto como completado
   * @param {string} projectId - ID del proyecto
   * @param {ProjectCompletionData} completionData - Datos de completación
   * @returns {Promise<Project>} Proyecto completado
   */
  async completeProject(projectId, completionData = {}) {
    try {
      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.COMPLETE_PROJECT, { id: projectId })
      const response = await this.apiClient.post(endpoint, completionData, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      const project = response.data

      // Ejecutar callbacks
      this._executeCallbacks(this.onProjectCompletedCallbacks, projectId, project)

      return project
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'completeProject', error)
      throw error
    }
  }

  /**
   * Obtiene proyectos del usuario actual
   * @param {ProjectFilters} filters - Filtros (status, type, etc.)
   * @returns {Promise<PaginatedResponse>} Proyectos del usuario
   */
  async getUserProjects(filters = {}) {
    try {
      const response = await this.apiClient.get(PROJECT_ENDPOINTS.GET_USER_PROJECTS, {
        params: filters,
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      return {
        projects: response.data.projects || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total_pages: response.data.total_pages || 0,
        has_next: response.data.has_next || false,
        has_previous: response.data.has_previous || false
      }
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'getUserProjects', error)
      throw error
    }
  }

  /**
   * Busca proyectos por término de búsqueda
   * @param {string} query - Término de búsqueda
   * @param {ProjectFilters} filters - Filtros adicionales
   * @returns {Promise<PaginatedResponse>} Resultados de búsqueda
   * 
   * @example
   * const results = await projectService.searchProjects('react', { limit: 20 })
   */
  async searchProjects(query, filters = {}) {
    const searchFilters = { ...filters, q: query }
    return this.getAllProjects(searchFilters)
  }

  /**
   * Crea un nuevo proyecto
   * @param {Project} projectData - Datos del proyecto a crear
   * @returns {Promise<Project>} Proyecto creado
   */
  async createProject(projectData) {
    try {
      const response = await this.apiClient.post(PROJECT_ENDPOINTS.CREATE_PROJECT || '/projects', projectData, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      return response.data
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'createProject', error)
      throw error
    }
  }

  /**
   * Actualiza un proyecto existente
   * @param {string} projectId - ID del proyecto
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Project>} Proyecto actualizado
   */
  async updateProject(projectId, updates) {
    try {
      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.UPDATE_PROJECT || '/projects/{id}', { id: projectId })
      const response = await this.apiClient.put(endpoint, updates, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      // Limpiar cache
      const cacheKey = this._generateCacheKey('getProjectById', { id: projectId })
      this.projectCache.delete(cacheKey)

      return response.data
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'updateProject', error)
      throw error
    }
  }

  /**
   * Elimina un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async deleteProject(projectId) {
    try {
      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.DELETE_PROJECT || '/projects/{id}', { id: projectId })
      const response = await this.apiClient.delete(endpoint, {
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      // Limpiar cache
      const cacheKey = this._generateCacheKey('getProjectById', { id: projectId })
      this.projectCache.delete(cacheKey)

      return response.data.success === true
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'deleteProject', error)
      throw error
    }
  }

  /**
   * Sube un archivo relacionado a un proyecto
   * @param {string} projectId - ID del proyecto
   * @param {File} file - Archivo a subir
   * @param {string} description - Descripción del archivo
   * @returns {Promise<string>} URL del archivo subido
   */
  async uploadProjectFile(projectId, file, description = '') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('description', description)

      const endpoint = buildEndpoint(PROJECT_ENDPOINTS.UPLOAD_FILE || '/projects/{id}/files', { id: projectId })
      const response = await this.apiClient.post(endpoint, formData, {
        headers: {
          ...this._getHeaders(),
          'Content-Type': 'multipart/form-data'
        },
        timeout: this.timeout
      })

      return response.data.url
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'uploadProjectFile', error)
      throw error
    }
  }

  /**
   * Obtiene estadísticas de proyectos
   * @param {string} timeframe - Período de tiempo
   * @returns {Promise<Object>} Estadísticas
   */
  async getProjectStats(timeframe = 'all_time') {
    try {
      const response = await this.apiClient.get(PROJECT_ENDPOINTS.GET_STATS || '/projects/stats', {
        params: { timeframe },
        headers: this._getHeaders(),
        timeout: this.timeout
      })

      return response.data
    } catch (error) {
      this._executeCallbacks(this.onErrorCallbacks, 'getProjectStats', error)
      throw error
    }
  }

  /**
   * Limpia el cache del servicio
   */
  clearCache() {
    this.projectCache.clear()
    this.paginatedCache.clear()
  }

  /**
   * Verifica la conectividad con el servidor
   * @returns {Promise<boolean>} true si el servidor está disponible
   */
  async checkConnectivity() {
    try {
      const response = await this.apiClient.get('/health', {
        headers: this._getHeaders(),
        timeout: 3000
      })
      return response.status === 200
    } catch {
      return false
    }
  }

  // =============================================
  // MÉTODOS PRIVADOS
  // =============================================

  /**
   * Genera headers HTTP
   * @private
   * @returns {Object} Headers
   */
  _getHeaders() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  /**
   * Genera clave de cache
   * @private
   * @param {string} method - Nombre del método
   * @param {Object} params - Parámetros
   * @returns {string} Clave de cache
   */
  _generateCacheKey(method, params) {
    return `${method}:${JSON.stringify(params)}`
  }

  /**
   * Obtiene datos del cache
   * @private
   * @param {string} key - Clave de cache
   * @returns {any|null} Datos cacheados o null
   */
  _getFromCache(key) {
    const cacheItem = this.projectCache.get(key) || this.paginatedCache.get(key)
    
    if (cacheItem) {
      const { data, timestamp } = cacheItem
      const now = Date.now()
      
      if (now - timestamp < this.cacheDuration) {
        return data
      } else {
        // Eliminar cache expirado
        this.projectCache.delete(key)
        this.paginatedCache.delete(key)
      }
    }
    
    return null
  }

  /**
   * Agrega datos al cache
   * @private
   * @param {string} key - Clave de cache
   * @param {any} data - Datos a cachear
   */
  _addToCache(key, data) {
    const cacheItem = {
      data,
      timestamp: Date.now()
    }

    // Determinar en qué cache guardar
    if (Array.isArray(data) || (data.projects && Array.isArray(data.projects))) {
      this.paginatedCache.set(key, cacheItem)
    } else {
      this.projectCache.set(key, cacheItem)
    }

    // Limpiar cache si es muy grande
    if (this.projectCache.size > 100 || this.paginatedCache.size > 50) {
      this._cleanExpiredCache()
    }
  }

  /**
   * Limpia cache expirado
   * @private
   */
  _cleanExpiredCache() {
    const now = Date.now()
    
    // Limpiar projectCache
    for (const [key, value] of this.projectCache.entries()) {
      if (now - value.timestamp >= this.cacheDuration) {
        this.projectCache.delete(key)
      }
    }
    
    // Limpiar paginatedCache
    for (const [key, value] of this.paginatedCache.entries()) {
      if (now - value.timestamp >= this.cacheDuration) {
        this.paginatedCache.delete(key)
      }
    }
  }

  /**
   * Ejecuta callbacks
   * @private
   * @param {Function[]} callbacks - Array de callbacks
   * @param {...any} args - Argumentos para los callbacks
   */
  _executeCallbacks(callbacks, ...args) {
    callbacks.forEach(callback => {
      try {
        callback(...args)
      } catch (error) {
        console.error('Error en callback:', error)
      }
    })
  }
}

// =============================================
// EXPORTS Y FACTORY
// =============================================

/**
 * Factory para crear instancias de ProjectService
 */
export class ProjectServiceFactory {
  /**
   * Crea una instancia estándar
   * @param {Object} config - Configuración
   * @returns {ProjectService} Instancia del servicio
   */
  static createDefault(config = {}) {
    return new ProjectService(config)
  }

  /**
   * Crea una instancia con cache extendido
   * @returns {ProjectService} Instancia con cache extendido
   */
  static createWithExtendedCache() {
    return new ProjectService({
      enableCache: true,
      ...this._getConfigFromEnv()
    })
  }

  /**
   * Crea una instancia sin cache
   * @returns {ProjectService} Instancia sin cache
   */
  static createWithoutCache() {
    return new ProjectService({
      enableCache: false,
      ...this._getConfigFromEnv()
    })
  }

  /**
   * Obtiene configuración desde variables de entorno
   * @private
   * @returns {Object} Configuración
   */
  static _getConfigFromEnv() {
    return {
      baseUrl: import.meta.env.VITE_API_BASE_URL,
      authToken: localStorage.getItem('auth_token'),
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000
    }
  }
}

/**
 * Instancia por defecto para backward compatibility
 * @type {ProjectService}
 */
export const projectService = ProjectServiceFactory.createDefault()

// Re-exportar funciones originales como métodos del objeto por defecto
export default {
  projectService,
  ProjectService,
  ProjectServiceFactory,
  ProjectLevel,
  ProjectType,
  ProjectStatus,

  // Métodos originales para mantener compatibilidad
  getAllProjects: projectService.getAllProjects.bind(projectService),
  getProjectById: projectService.getProjectById.bind(projectService),
  getRecommendedProjects: projectService.getRecommendedProjects.bind(projectService),
  getOpenSourceProjects: projectService.getOpenSourceProjects.bind(projectService),
  getFreelanceProjects: projectService.getFreelanceProjects.bind(projectService),
  getChallenges: projectService.getChallenges.bind(projectService),
  joinProject: projectService.joinProject.bind(projectService),
  leaveProject: projectService.leaveProject.bind(projectService),
  completeProject: projectService.completeProject.bind(projectService),
  getUserProjects: projectService.getUserProjects.bind(projectService),
  searchProjects: projectService.searchProjects.bind(projectService)
}