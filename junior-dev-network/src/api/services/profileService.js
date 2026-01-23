// profileService.js - junior-dev-network\src\api\services
import apiClient from '../apiClient'
import { PROFILE_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'
import { ProfileValidator } from '@/validations/index'

// =============================================
// ENUMS Y CONSTANTES (DEFINIDAS UNA SOLA VEZ)
// =============================================

/**
 * Plataformas sociales soportadas
 * @enum {string}
 */
export const SocialPlatform = {
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
  TWITTER: 'twitter',
  GITLAB: 'gitlab',
  STACKOVERFLOW: 'stackoverflow',
  PERSONAL_WEBSITE: 'personal_website',
  OTHER: 'other'
}

/**
 * Niveles de privacidad
 * @enum {string}
 */
export const PrivacyLevel = {
  PUBLIC: 'public',
  CONNECTIONS_ONLY: 'connections_only',
  PRIVATE: 'private'
}

/**
 * Preferencias de notificación
 * @enum {string}
 */
export const NotificationPreference = {
  ALL: 'all',
  IMPORTANT_ONLY: 'important_only',
  NONE: 'none',
  DAILY_DIGEST: 'daily_digest',
  WEEKLY_SUMMARY: 'weekly_summary'
}

/**
 * Tipos de proyecto
 * @enum {string}
 */
export const ProjectType = {
  OPEN_SOURCE: 'open_source',
  FREELANCE: 'freelance',
  PERSONAL: 'personal',
  CORPORATE: 'corporate',
  ACADEMIC: 'academic'
}

// =============================================
// TIPOS JSDoc (UTILIZANDO LOS ENUMS YA DEFINIDOS)
// =============================================

/**
 * @typedef {Object} SocialLink
 * @property {SocialPlatform} platform - Plataforma social
 * @property {string} url - URL del perfil
 * @property {string} [username] - Nombre de usuario
 * @property {boolean} [isPublic=true] - Si el enlace es público
 * @property {Date} addedAt - Fecha de agregado
 */

/**
 * @typedef {Object} UserSkill
 * @property {string} id - ID único de la skill
 * @property {string} name - Nombre de la skill
 * @property {string} category - Categoría (frontend, backend, devops, etc.)
 * @property {number} [level=1] - Nivel 1-5
 * @property {number} [confidence=100] - Confianza 0-100
 * @property {Date} addedAt - Fecha de agregado
 * @property {Date} [lastUsedAt] - Última vez usada
 * @property {number} [experienceMonths=0] - Meses de experiencia
 */

/**
 * @typedef {Object} UserBadge
 * @property {string} id - ID del badge
 * @property {string} name - Nombre del badge
 * @property {string} description - Descripción
 * @property {string} iconUrl - URL del icono
 * @property {string} category - Categoría del badge
 * @property {Date} earnedAt - Fecha de obtención
 * @property {number} [xpValue=0] - Valor en XP
 * @property {boolean} [isFeatured=false] - Si es badge destacado
 * @property {boolean} [isNew=true] - Si es nuevo/no visto
 */

/**
 * @typedef {Object} UserProject
 * @property {string} id - ID del proyecto
 * @property {string} title - Título del proyecto
 * @property {string} description - Descripción
 * @property {string[]} skillsUsed - Skills utilizadas
 * @property {ProjectType} projectType - Tipo de proyecto
 * @property {Date} startedAt - Fecha de inicio
 * @property {Date} [completedAt] - Fecha de completado
 * @property {string} [repositoryUrl] - URL del repositorio
 * @property {string} [liveUrl] - URL en vivo
 * @property {boolean} [isPublic=true] - Si el proyecto es público
 * @property {number} [contributionPercentage=100] - Porcentaje de contribución 0-100
 */

/**
 * @typedef {Object} UserPreferences
 * @property {PrivacyLevel} [profileVisibility=PrivacyLevel.PUBLIC] - Visibilidad del perfil
 * @property {boolean} [showEmail=false] - Mostrar email
 * @property {boolean} [showLocation=true] - Mostrar ubicación
 * @property {boolean} [showSkills=true] - Mostrar skills
 * @property {boolean} [showProjects=true] - Mostrar proyectos
 * @property {boolean} [showBadges=true] - Mostrar badges
 * @property {NotificationPreference} [emailNotifications=NotificationPreference.IMPORTANT_ONLY] - Notificaciones email
 * @property {NotificationPreference} [pushNotifications=NotificationPreference.ALL] - Notificaciones push
 * @property {boolean} [notifyNewConnections=true] - Notificar nuevas conexiones
 * @property {boolean} [notifyProjectInvites=true] - Notificar invitaciones a proyectos
 * @property {boolean} [notifyMentorRequests=true] - Notificar solicitudes de mentoría
 * @property {boolean} [notifySystemUpdates=true] - Notificar actualizaciones del sistema
 * @property {string} [theme='light'] - Tema (light, dark, auto)
 * @property {string} [language='en'] - Idioma
 * @property {boolean} [compactMode=false] - Modo compacto
 * @property {boolean} [animationsEnabled=true] - Animaciones habilitadas
 * @property {boolean} [autoSave=true] - Autoguardado
 * @property {boolean} [dataCollectionConsent=true] - Consentimiento de recolección de datos
 * @property {boolean} [marketingEmails=false] - Emails de marketing
 * @property {boolean} [twoFactorAuth=false] - Autenticación de dos factores
 * @property {boolean} [loginNotifications=true] - Notificaciones de login
 * @property {boolean} [sessionTimeout=true] - Timeout de sesión
 * @property {number} [sessionTimeoutMinutes=30] - Minutos para timeout
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - ID único del usuario
 * @property {string} email - Email del usuario
 * @property {string} alias - Alias/nombre de usuario
 * @property {string} [fullName] - Nombre completo
 * @property {string} [avatarUrl] - URL del avatar
 * @property {string} [bio] - Biografía
 * @property {string} [location] - Ubicación
 * @property {string} [currentTitle] - Título actual
 * @property {string} [company] - Empresa actual
 * @property {string} [website] - Sitio web personal
 * @property {SocialLink[]} socialLinks - Enlaces sociales
 * @property {UserSkill[]} skills - Skills del usuario
 * @property {UserProject[]} projects - Proyectos del usuario
 * @property {UserBadge[]} badges - Badges obtenidos
 * @property {string[]} interests - Intereses
 * @property {number} [totalConnections=0] - Total de conexiones
 * @property {number} [completedProjects=0] - Proyectos completados
 * @property {number} [mentoringSessions=0] - Sesiones de mentoría
 * @property {number} [codeContributions=0] - Contribuciones de código
 * @property {number} [profileCompletionPercentage=0] - Porcentaje de completitud
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de última actualización
 * @property {Date} [lastLoginAt] - Último login
 * @property {Date} [lastActivityAt] - Última actividad
 * @property {UserPreferences} preferences - Preferencias del usuario
 * @property {PrivacyLevel} [privacyLevel=PrivacyLevel.PUBLIC] - Nivel de privacidad
 */

/**
 * @typedef {Object} ProfileUpdateData
 * @property {string} [fullName] - Nombre completo
 * @property {string} [bio] - Biografía
 * @property {string} [location] - Ubicación
 * @property {string} [currentTitle] - Título actual
 * @property {string} [company] - Empresa
 * @property {string} [website] - Sitio web
 * @property {SocialLink[]} [socialLinks] - Enlaces sociales
 * @property {string[]} [interests] - Intereses
 */

/**
 * @typedef {Object} AvatarUploadResult
 * @property {string} avatarUrl - URL del avatar
 * @property {string} thumbnailUrl - URL del thumbnail
 * @property {number} fileSize - Tamaño del archivo en bytes
 * @property {string} mimeType - Tipo MIME
 * @property {number} [width] - Ancho en píxeles
 * @property {number} [height] - Alto en píxeles
 * @property {Date} uploadedAt - Fecha de subida
 */

/**
 * @typedef {Object} AccountDeletionRequest
 * @property {string} confirmationText - Texto de confirmación
 * @property {string} reason - Razón de eliminación
 * @property {boolean} [exportData=true] - Exportar datos antes de eliminar
 * @property {string} [feedback] - Feedback opcional
 */

/**
 * @typedef {Object} PublicProfile
 * @property {string} id - ID del usuario
 * @property {string} alias - Alias
 * @property {string} [avatarUrl] - URL del avatar
 * @property {string} [bio] - Biografía
 * @property {string} [location] - Ubicación
 * @property {string} [currentTitle] - Título actual
 * @property {string} [company] - Empresa
 * @property {UserSkill[]} skills - Skills públicas
 * @property {UserProject[]} publicProjects - Proyectos públicos
 * @property {UserBadge[]} badges - Badges
 * @property {SocialLink[]} publicSocialLinks - Enlaces sociales públicos
 * @property {number} [totalConnections=0] - Total de conexiones
 * @property {number} [completedProjects=0] - Proyectos completados
 * @property {Date} memberSince - Miembro desde
 * @property {Date} [lastActiveAt] - Última actividad
 * @property {boolean} [isAvailableForMentoring=false] - Disponible para mentoría
 * @property {boolean} [isOpenToWork=false] - Abierto a trabajo
 * @property {boolean} [isOpenToCollaboration=true] - Abierto a colaboración
 */

/**
 * @typedef {Function} ProfileUpdateCallback
 * @param {UserProfile} profile - Perfil actualizado
 * @returns {void}
 */

/**
 * @typedef {Function} AvatarChangeCallback
 * @param {string} avatarUrl - Nueva URL del avatar
 * @returns {void}
 */

/**
 * @typedef {Function} PreferencesUpdateCallback
 * @param {UserPreferences} preferences - Nuevas preferencias
 * @returns {void}
 */

// =============================================
// CLASE PRINCIPAL DEL SERVICIO - OPTIMIZADA
// =============================================

/**
 * Servicio de gestión de perfiles de usuario
 * Maneja operaciones CRUD completas con validación, caching y sincronización
 */
export class ProfileService {
  /**
   * Constructor del servicio de perfil
   * @param {Object} [config={}] - Configuración del servicio
   */
  constructor(config = {}) {
    this.apiClient = apiClient
    this.validator = ProfileValidator
    this.apiBaseUrl = config.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    this.cacheDuration = config.cacheDuration || 300000 // 5 minutos
    this.autoSync = config.autoSync !== false
    
    // Cache interno con nombres más claros
    this.cache = {
      profile: null,
      preferences: null,
      lastProfileFetch: null,
      lastPreferencesFetch: null
    }
    
    // Callbacks organizados por tipo
    this.callbacks = {
      profileUpdated: [],
      avatarChanged: [],
      preferencesUpdated: []
    }
  }

  // =============================================
  // MÉTODOS DE INICIALIZACIÓN
  // =============================================

  /**
   * Inicializa el servicio
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      console.log('👤 Inicializando Profile Service...')
      
      await this.loadLocalCache()
      
      // Verificar API con timeout
      const isHealthy = await Promise.race([
        this.checkApiHealth(),
        new Promise(resolve => setTimeout(() => resolve(false), 3000))
      ])
      
      if (isHealthy && this.autoSync) {
        await this.syncProfile()
      }
      
      console.log('✅ Profile Service inicializado correctamente')
    } catch (error) {
      console.error('❌ Error al inicializar Profile Service:', error)
      // No lanzamos error para evitar que la app falle completamente
    }
  }

  // =============================================
  // OPERACIONES PRINCIPALES OPTIMIZADAS
  // =============================================

  /**
   * Obtiene el perfil del usuario
   * @param {boolean} [forceRefresh=false] - Forzar actualización
   * @param {boolean} [includePrivate=true] - Incluir datos privados
   * @returns {Promise<UserProfile>}
   */
  async getProfile(forceRefresh = false, includePrivate = true) {
    // Verificar cache primero
    if (!forceRefresh && this.cache.profile && this.isCacheValid(this.cache.lastProfileFetch)) {
      console.log('📦 Retornando perfil desde cache')
      return this.cache.profile
    }
    
    try {
      const endpoint = includePrivate 
        ? PROFILE_ENDPOINTS.GET_PROFILE
        : PROFILE_ENDPOINTS.GET_PUBLIC_PROFILE
      
      const response = await this.apiClient.get(endpoint)
      const profile = this.transformDates(response.data)
      
      this.updateProfileCache(profile)
      this.executeCallbacks('profileUpdated', profile)
      
      return profile
    } catch (error) {
      return this.handleProfileError(error)
    }
  }

  /**
   * Actualiza el perfil del usuario
   * @param {ProfileUpdateData} updateData - Datos a actualizar
   * @param {boolean} [validate=true] - Validar datos
   * @returns {Promise<UserProfile>}
   */
  async updateProfile(updateData, validate = true) {
    this.validateUpdateData(updateData, validate)
    
    try {
      const response = await this.apiClient.put(
        PROFILE_ENDPOINTS.UPDATE_PROFILE,
        updateData
      )
      
      const updatedProfile = this.transformDates(response.data)
      this.updateProfileCache(updatedProfile)
      this.executeCallbacks('profileUpdated', updatedProfile)
      
      return updatedProfile
    } catch (error) {
      throw this.handleApiError(error, 'Error actualizando perfil')
    }
  }

  /**
   * Obtiene perfil público de otro usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<PublicProfile>}
   */
  async getPublicProfile(userId) {
    this.validateUserId(userId)
    
    try {
      const endpoint = buildEndpoint(PROFILE_ENDPOINTS.GET_PUBLIC_PROFILE, { id: userId })
      const response = await this.apiClient.get(endpoint)
      return this.transformDates(response.data)
    } catch (error) {
      throw this.handleApiError(error, 'Error obteniendo perfil público')
    }
  }

  // =============================================
  // OPERACIONES DE AVATAR OPTIMIZADAS
  // =============================================

  /**
   * Sube un nuevo avatar
   * @param {File} file - Archivo de imagen
   * @param {Function} [onProgress] - Callback de progreso
   * @returns {Promise<AvatarUploadResult>}
   */
  async uploadAvatar(file, onProgress) {
    const validation = this.validateAvatarFile(file)
    if (!validation.valid) {
      throw new Error(`Archivo inválido: ${validation.errors.join(', ')}`)
    }
    
    const formData = new FormData()
    formData.append('avatar', file)
    
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: this.createProgressHandler(onProgress)
      }
      
      const response = await this.apiClient.post(
        PROFILE_ENDPOINTS.UPLOAD_AVATAR, 
        formData, 
        config
      )
      
      const result = {
        ...response.data,
        uploadedAt: new Date()
      }
      
      this.updateAvatarInCache(result.avatarUrl)
      this.executeCallbacks('avatarChanged', result.avatarUrl)
      
      return result
    } catch (error) {
      throw this.handleApiError(error, 'Error subiendo avatar')
    }
  }

  /**
   * Elimina el avatar actual
   * @returns {Promise<boolean>}
   */
  async deleteAvatar() {
    try {
      const response = await this.apiClient.delete(PROFILE_ENDPOINTS.DELETE_AVATAR)
      
      this.updateAvatarInCache(null)
      this.executeCallbacks('avatarChanged', null)
      
      return response.data.success === true
    } catch (error) {
      throw this.handleApiError(error, 'Error eliminando avatar')
    }
  }

  // =============================================
  // OPERACIONES DE PREFERENCIAS OPTIMIZADAS
  // =============================================

  /**
   * Obtiene preferencias del usuario
   * @param {boolean} [forceRefresh=false]
   * @returns {Promise<UserPreferences>}
   */
  async getPreferences(forceRefresh = false) {
    if (!forceRefresh && this.cache.preferences && this.isCacheValid(this.cache.lastPreferencesFetch)) {
      return this.cache.preferences
    }
    
    try {
      const response = await this.apiClient.get(PROFILE_ENDPOINTS.GET_PREFERENCES)
      const preferences = this.ensurePreferencesStructure(response.data)
      
      this.updatePreferencesCache(preferences)
      return preferences
    } catch (error) {
      return this.cache.preferences || this.getDefaultPreferences()
    }
  }

  /**
   * Actualiza preferencias
   * @param {UserPreferences} preferences - Nuevas preferencias
   * @param {boolean} [partial=true] - Actualización parcial
   * @returns {Promise<UserPreferences>}
   */
  async updatePreferences(preferences, partial = true) {
    this.validatePreferences(preferences)
    
    try {
      const endpoint = partial 
        ? `${PROFILE_ENDPOINTS.UPDATE_PREFERENCES}?partial=true`
        : PROFILE_ENDPOINTS.UPDATE_PREFERENCES
      
      const response = await this.apiClient.put(endpoint, preferences)
      const updatedPreferences = this.ensurePreferencesStructure(response.data)
      
      this.updatePreferencesCache(updatedPreferences)
      this.executeCallbacks('preferencesUpdated', updatedPreferences)
      
      return updatedPreferences
    } catch (error) {
      throw this.handleApiError(error, 'Error actualizando preferencias')
    }
  }

  // =============================================
  // OPERACIONES DE SKILLS OPTIMIZADAS
  // =============================================

  /**
   * Agrega una skill
   * @param {UserSkill} skill - Skill a agregar
   * @returns {Promise<UserSkill>}
   */
  async addSkill(skill) {
    this.validateUserSkill(skill)
    
    try {
      const response = await this.apiClient.post(PROFILE_ENDPOINTS.ADD_SKILL, {
        ...skill,
        addedAt: new Date().toISOString()
      })
      
      const addedSkill = this.transformDates(response.data)
      
      if (this.cache.profile) {
        this.cache.profile.skills.push(addedSkill)
        this.saveLocalCache()
      }
      
      return addedSkill
    } catch (error) {
      throw this.handleApiError(error, 'Error agregando skill')
    }
  }

  /**
   * Actualiza una skill
   * @param {string} skillId - ID de la skill
   * @param {Partial<UserSkill>} updates - Datos actualizados
   * @returns {Promise<UserSkill>}
   */
  async updateSkill(skillId, updates) {
    this.validateSkillId(skillId)
    
    try {
      const endpoint = buildEndpoint(PROFILE_ENDPOINTS.UPDATE_SKILL, { id: skillId })
      const response = await this.apiClient.put(endpoint, updates)
      const updatedSkill = this.transformDates(response.data)
      
      this.updateSkillInCache(updatedSkill)
      return updatedSkill
    } catch (error) {
      throw this.handleApiError(error, 'Error actualizando skill')
    }
  }

  /**
   * Elimina una skill
   * @param {string} skillId - ID de la skill
   * @returns {Promise<boolean>}
   */
  async removeSkill(skillId) {
    this.validateSkillId(skillId)
    
    try {
      const endpoint = buildEndpoint(PROFILE_ENDPOINTS.REMOVE_SKILL, { id: skillId })
      const response = await this.apiClient.delete(endpoint)
      
      if (this.cache.profile) {
        this.cache.profile.skills = this.cache.profile.skills.filter(s => s.id !== skillId)
        this.saveLocalCache()
      }
      
      return response.data.success === true
    } catch (error) {
      throw this.handleApiError(error, 'Error eliminando skill')
    }
  }

  // =============================================
  // REGISTRO DE CALLBACKS
  // =============================================

  /**
   * Registra callback para actualización de perfil
   * @param {ProfileUpdateCallback} callback
   * @returns {Function} Función para remover callback
   */
  onProfileUpdated(callback) {
    return this.registerCallback('profileUpdated', callback)
  }

  /**
   * Registra callback para cambio de avatar
   * @param {AvatarChangeCallback} callback
   * @returns {Function} Función para remover callback
   */
  onAvatarChanged(callback) {
    return this.registerCallback('avatarChanged', callback)
  }

  /**
   * Registra callback para actualización de preferencias
   * @param {PreferencesUpdateCallback} callback
   * @returns {Function} Función para remover callback
   */
  onPreferencesUpdated(callback) {
    return this.registerCallback('preferencesUpdated', callback)
  }

  // =============================================
  // MÉTODOS DE UTILIDAD PÚBLICOS
  // =============================================

  /**
   * Sincroniza perfil local con remoto
   * @param {boolean} [force=false]
   * @returns {Promise<boolean>}
   */
  async syncProfile(force = false) {
    try {
      if (force || !this.cache.profile) {
        await this.getProfile(true)
        await this.getPreferences(true)
        return true
      }
      
      if (!this.isCacheValid(this.cache.lastProfileFetch)) {
        await this.getProfile(false)
      }
      
      if (!this.isCacheValid(this.cache.lastPreferencesFetch)) {
        await this.getPreferences(false)
      }
      
      return true
    } catch (error) {
      console.warn('Sincronización falló:', error.message)
      return false
    }
  }

  /**
   * Calcula completitud del perfil
   * @returns {Promise<number>}
   */
  async calculateProfileCompleteness() {
    try {
      const profile = await this.getProfile(false, true)
      const scoringRules = this.getCompletenessScoringRules()
      let score = 0
      
      Object.entries(scoringRules).forEach(([field, rule]) => {
        score += this.calculateFieldScore(profile[field], rule)
      })
      
      return Math.min(score, 100)
    } catch {
      return 0
    }
  }

  /**
   * Obtiene sugerencias para mejorar el perfil
   * @param {number} [limit=5]
   * @returns {Promise<string[]>}
   */
  async getProfileImprovementSuggestions(limit = 5) {
    try {
      const profile = await this.getProfile(false, true)
      const suggestions = []
      
      if (!profile.avatarUrl) {
        suggestions.push('Agrega una foto de perfil para personalizar tu cuenta')
      }
      
      if (!profile.bio || profile.bio.trim().length < 20) {
        suggestions.push('Escribe una biografía de al menos 20 caracteres')
      }
      
      if (profile.skills.length < 3) {
        suggestions.push('Agrega al menos 3 skills para mostrar tu experiencia')
      }
      
      if (profile.projects.length === 0) {
        suggestions.push('Agrega proyectos para demostrar tu trabajo')
      }
      
      return suggestions.slice(0, limit)
    } catch {
      return ['Completa la información básica de tu perfil para empezar']
    }
  }

  /**
   * Limpia el cache
   * @returns {boolean}
   */
  clearCache() {
    this.cache = {
      profile: null,
      preferences: null,
      lastProfileFetch: null,
      lastPreferencesFetch: null
    }
    
    try {
      localStorage.removeItem('profile_cache')
      localStorage.removeItem('preferences_cache')
      return true
    } catch {
      return false
    }
  }

  // =============================================
  // MÉTODOS PRIVADOS
  // =============================================

  /**
   * Carga cache desde localStorage
   * @private
   */
  async loadLocalCache() {
    try {
      const profileCache = localStorage.getItem('profile_cache')
      const preferencesCache = localStorage.getItem('preferences_cache')
      
      if (profileCache) {
        this.cache.profile = JSON.parse(profileCache)
        this.cache.lastProfileFetch = new Date(
          localStorage.getItem('profile_cache_timestamp') || Date.now()
        )
      }
      
      if (preferencesCache) {
        this.cache.preferences = JSON.parse(preferencesCache)
        this.cache.lastPreferencesFetch = new Date(
          localStorage.getItem('preferences_cache_timestamp') || Date.now()
        )
      }
    } catch (error) {
      console.warn('Error cargando cache local:', error)
    }
  }

  /**
   * Guarda cache en localStorage
   * @private
   */
  saveLocalCache() {
    try {
      if (this.cache.profile) {
        localStorage.setItem('profile_cache', JSON.stringify(this.cache.profile))
        localStorage.setItem('profile_cache_timestamp', this.cache.lastProfileFetch.toISOString())
      }
      
      if (this.cache.preferences) {
        localStorage.setItem('preferences_cache', JSON.stringify(this.cache.preferences))
        localStorage.setItem('preferences_cache_timestamp', this.cache.lastPreferencesFetch.toISOString())
      }
    } catch (error) {
      console.warn('Error guardando cache local:', error)
    }
  }

  /**
   * Verifica validez del cache
   * @private
   * @param {Date} timestamp
   * @returns {boolean}
   */
  isCacheValid(timestamp) {
    if (!timestamp) return false
    return (Date.now() - timestamp.getTime()) < this.cacheDuration
  }

  /**
   * Actualiza cache de perfil
   * @private
   * @param {UserProfile} profile
   */
  updateProfileCache(profile) {
    this.cache.profile = profile
    this.cache.lastProfileFetch = new Date()
    this.saveLocalCache()
  }

  /**
   * Actualiza cache de preferencias
   * @private
   * @param {UserPreferences} preferences
   */
  updatePreferencesCache(preferences) {
    this.cache.preferences = preferences
    this.cache.lastPreferencesFetch = new Date()
    this.saveLocalCache()
  }

  /**
   * Actualiza avatar en cache
   * @private
   * @param {string|null} avatarUrl
   */
  updateAvatarInCache(avatarUrl) {
    if (this.cache.profile) {
      this.cache.profile.avatarUrl = avatarUrl
      this.saveLocalCache()
    }
  }

  /**
   * Actualiza skill en cache
   * @private
   * @param {UserSkill} updatedSkill
   */
  updateSkillInCache(updatedSkill) {
    if (this.cache.profile) {
      const index = this.cache.profile.skills.findIndex(s => s.id === updatedSkill.id)
      if (index !== -1) {
        this.cache.profile.skills[index] = updatedSkill
        this.saveLocalCache()
      }
    }
  }

  /**
   * Transforma fechas string a objetos Date
   * @private
   * @param {Object} data
   * @returns {Object}
   */
  transformDates(data) {
    if (!data || typeof data !== 'object') return data
    
    const dateFields = [
      'createdAt', 'updatedAt', 'lastLoginAt', 'lastActivityAt',
      'addedAt', 'earnedAt', 'startedAt', 'completedAt', 'lastUsedAt',
      'uploadedAt', 'memberSince', 'lastActiveAt'
    ]
    
    const transform = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item))
      }
      
      if (obj && typeof obj === 'object') {
        const result = { ...obj }
        
        dateFields.forEach(field => {
          if (result[field] && typeof result[field] === 'string') {
            result[field] = new Date(result[field])
          }
        })
        
        Object.keys(result).forEach(key => {
          if (result[key] && typeof result[key] === 'object') {
            result[key] = transform(result[key])
          }
        })
        
        return result
      }
      
      return obj
    }
    
    return transform(data)
  }

  /**
   * Asegura estructura completa de preferencias
   * @private
   * @param {Object} preferences
   * @returns {UserPreferences}
   */
  ensurePreferencesStructure(preferences) {
    const defaults = this.getDefaultPreferences()
    return { ...defaults, ...preferences }
  }

  /**
   * Obtiene preferencias por defecto
   * @private
   * @returns {UserPreferences}
   */
  getDefaultPreferences() {
    return {
      profileVisibility: PrivacyLevel.PUBLIC,
      showEmail: false,
      showLocation: true,
      showSkills: true,
      showProjects: true,
      showBadges: true,
      emailNotifications: NotificationPreference.IMPORTANT_ONLY,
      pushNotifications: NotificationPreference.ALL,
      notifyNewConnections: true,
      notifyProjectInvites: true,
      notifyMentorRequests: true,
      notifySystemUpdates: true,
      theme: 'light',
      language: 'en',
      compactMode: false,
      animationsEnabled: true,
      autoSave: true,
      dataCollectionConsent: true,
      marketingEmails: false,
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: true,
      sessionTimeoutMinutes: 30
    }
  }

  /**
   * Valida datos de actualización
   * @private
   * @param {ProfileUpdateData} updateData
   * @param {boolean} validate
   */
  validateUpdateData(updateData, validate) {
    if (Object.keys(updateData).length === 0) {
      throw new Error('No se proporcionaron datos para actualizar')
    }
    
    if (validate) {
      const validationResult = this.validator.validateUpdateData(updateData)
      if (!validationResult.success) {
        throw new Error(`Datos inválidos: ${validationResult.errors.join(', ')}`)
      }
    }
  }

  /**
   * Valida skill del usuario
   * @private
   * @param {UserSkill} skill
   */
  validateUserSkill(skill) {
    const validationResult = this.validator.validateUserSkill(skill)
    if (!validationResult.success) {
      throw new Error(`Skill inválida: ${validationResult.errors.join(', ')}`)
    }
  }

  /**
   * Valida preferencias
   * @private
   * @param {UserPreferences} preferences
   */
  validatePreferences(preferences) {
    const validationResult = this.validator.validatePreferences(preferences)
    if (!validationResult.success) {
      throw new Error(`Preferencias inválidas: ${validationResult.errors.join(', ')}`)
    }
  }

  /**
   * Valida ID de usuario
   * @private
   * @param {string} userId
   */
  validateUserId(userId) {
    if (!userId?.trim()) {
      throw new Error('ID de usuario requerido')
    }
  }

  /**
   * Valida ID de skill
   * @private
   * @param {string} skillId
   */
  validateSkillId(skillId) {
    if (!skillId?.trim()) {
      throw new Error('ID de skill requerido')
    }
  }

  /**
   * Valida archivo de avatar
   * @private
   * @param {File} file
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateAvatarFile(file) {
    const errors = []
    
    if (!file) {
      errors.push('No se proporcionó archivo')
      return { valid: false, errors }
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Tipo de archivo ${file.type} no permitido`)
    }
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      errors.push(`Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    }
    
    return { valid: errors.length === 0, errors }
  }

  /**
   * Crea handler de progreso para upload
   * @private
   * @param {Function} callback
   * @returns {Function}
   */
  createProgressHandler(callback) {
    return callback ? (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      callback(percent)
    } : undefined
  }

  /**
   * Registra callback
   * @private
   * @param {string} type
   * @param {Function} callback
   * @returns {Function}
   */
  registerCallback(type, callback) {
    this.callbacks[type].push(callback)
    
    return () => {
      const index = this.callbacks[type].indexOf(callback)
      if (index > -1) {
        this.callbacks[type].splice(index, 1)
      }
    }
  }

  /**
   * Ejecuta callbacks
   * @private
   * @param {string} type
   * @param {any} data
   */
  executeCallbacks(type, data) {
    this.callbacks[type].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error en callback ${type}:`, error)
      }
    })
  }

  /**
   * Maneja errores de perfil
   * @private
   * @param {Error} error
   * @returns {UserProfile}
   */
  handleProfileError(error) {
    if (this.cache.profile) {
      console.warn('⚠️ Error de API, retornando cache')
      return this.cache.profile
    }
    throw this.handleApiError(error, 'Error obteniendo perfil')
  }

  /**
   * Maneja errores de API
   * @private
   * @param {Error} error
   * @param {string} message
   * @returns {Error}
   */
  handleApiError(error, message) {
    console.error(`${message}:`, error)
    // Aquí puedes agregar lógica adicional como logging, notificaciones, etc.
    return error
  }

  /**
   * Verifica salud de la API
   * @private
   * @returns {Promise<boolean>}
   */
  async checkApiHealth() {
    try {
      const response = await this.apiClient.get('/health', { timeout: 3000 })
      return response.status === 200
    } catch {
      return false
    }
  }

  /**
   * Obtiene reglas de puntuación para completitud
   * @private
   * @returns {Object}
   */
  getCompletenessScoringRules() {
    return {
      avatarUrl: { maxScore: 10, hasValue: true },
      bio: { maxScore: 15, minLength: 1 },
      skills: { maxScore: 20, perItem: 2 },
      projects: { maxScore: 20, perItem: 4 },
      location: { maxScore: 5, hasValue: true },
      socialLinks: { maxScore: 5, perItem: 1 },
      website: { maxScore: 5, hasValue: true },
      currentTitle: { maxScore: 5, hasValue: true },
      company: { maxScore: 5, hasValue: true },
      interests: { maxScore: 10, perItem: 2 }
    }
  }

  /**
   * Calcula puntuación de un campo
   * @private
   * @param {any} value
   * @param {Object} rule
   * @returns {number}
   */
  calculateFieldScore(value, rule) {
    if (rule.hasValue) {
      return value ? rule.maxScore : 0
    }
    
    if (rule.minLength && typeof value === 'string') {
      return value.length >= rule.minLength ? Math.min(rule.maxScore, Math.floor(value.length / 10)) : 0
    }
    
    if (rule.perItem && Array.isArray(value)) {
      return Math.min(rule.maxScore, value.length * rule.perItem)
    }
    
    return 0
  }
}

// =============================================
// FACTORY SIMPLIFICADA
// =============================================

export class ProfileServiceFactory {
  /**
   * Crea instancia estándar
   * @param {Object} [config={}]
   * @returns {ProfileService}
   */
  static createDefault(config = {}) {
    const instance = new ProfileService(config)
    instance.initialize()
    return instance
  }

  /**
   * Crea instancia con cache extendido
   * @returns {ProfileService}
   */
  static createWithExtendedCache() {
    return this.createDefault({
      cacheDuration: 15 * 60 * 1000 // 15 minutos
    })
  }

  /**
   * Crea instancia sin auto-sync
   * @returns {ProfileService}
   */
  static createWithoutAutoSync() {
    return this.createDefault({
      autoSync: false
    })
  }
}

// =============================================
// INSTANCIA POR DEFECTO Y EXPORTS
// =============================================

/**
 * Instancia por defecto del servicio
 * @type {ProfileService}
 */
export const profileService = ProfileServiceFactory.createDefault()

// Exportar todo lo necesario
export default {
  profileService,
  ProfileService,
  ProfileServiceFactory,
  SocialPlatform,
  PrivacyLevel,
  NotificationPreference,
  ProjectType
}