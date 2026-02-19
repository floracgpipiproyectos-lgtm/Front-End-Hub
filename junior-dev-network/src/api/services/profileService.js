// profileService.js - VERSIÓN ACTUALIZADA
// noinspection GrazieInspection

import apiClient from '../apiClient'
import { PROFILE_ENDPOINTS } from '@/constants/apiEndpoints'
import { API_CONFIG, STORAGE_KEYS, CACHE_CONFIG } from '@/constants/apiConfig'  // NUEVO
import { VALIDATION_RULES, VALIDATION_HELPERS } from '@/constants/validationRules'  // NUEVO
import { APP_CONSTANTS } from '@/constants/appConstants'  // NUEVO

// =============================================
// CLASE ACTUALIZADA CON CONSTANTES
// =============================================

export class ProfileService {
  constructor(config = {}) {
    this.apiClient = apiClient
    this.apiBaseUrl = config.apiBaseUrl || APP_CONSTANTS.API_URL || 'http://localhost:3000/api'
    
    // Usar configuraciones centralizadas
    this.cacheDuration = config.cacheDuration || CACHE_CONFIG.TTL.USER_DATA
    this.maxFileSize = config.maxFileSize || VALIDATION_RULES.FILE.AVATAR.MAX_SIZE
    this.allowedAvatarTypes = config.allowedAvatarTypes || VALIDATION_RULES.FILE.AVATAR.ALLOWED_TYPES
    
    // Cache con prefijos centralizados
    this.cache = {
      profile: null,
      preferences: null,
      lastProfileFetch: null,
      lastPreferencesFetch: null
    }
  }

  // =============================================
  // OPERACIONES DE AVATAR (ACTUALIZADAS)
  // =============================================
  
  /**
   * Sube avatar con validación mejorada
   */
  async uploadAvatar(file, onProgress) {
    // Validación usando constantes centralizadas
    const validation = this.validateAvatarFile(file)
    if (!validation.isValid) {
      throw new Error(`Archivo de avatar inválido: ${validation.errors.join(', ')}`)
    }
    
    const formData = new FormData()
    formData.append('avatar', file)
    
    const config = {
      headers: API_CONFIG.HEADERS.MULTIPART,
      timeout: API_CONFIG.TIMEOUTS.UPLOAD,
      maxRetryAttempts: API_CONFIG.RETRY_CONFIG.UPLOAD.MAX_ATTEMPTS,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total, 2)

          if (onProgress) {
          onProgress(percent)
        }
        
        // Cachear progreso para recuperación
        if (percent < 100) {
          sessionStorage.setItem('avatar_upload_progress', percent.toString())
        }
      }
    }
    
    try {
      const response = await this.apiClient.post(
        PROFILE_ENDPOINTS.UPLOAD_AVATAR, 
        formData, 
        config
      )
      
      const result = {
        ...response.data,
        uploadedAt: new Date(),
        fileSize: file.size,
        fileType: file.type
      }
      
      // Actualizar cache de perfil
      this.updateAvatarInCache(result.avatarUrl)
      
      // Limpiar progreso
      sessionStorage.removeItem('avatar_upload_progress')
      
      return result
    } catch (error) {
      sessionStorage.removeItem('avatar_upload_progress')
      throw this.handleApiError(error, 'Error subiendo avatar')
    }
  }
  
  /**
   * Validar archivo de avatar usando reglas centralizadas
   * @private
   */
  validateAvatarFile(file) {
    const errors = []
    
    if (!file) {
      errors.push('No se proporcionó archivo')
      return { valid: false, errors }
    }
    
    // Validar tipo usando constantes
    if (!VALIDATION_HELPERS.validateFileType(file, this.allowedAvatarTypes)) {
      errors.push(VALIDATION_RULES.FILE.AVATAR.MESSAGE.TYPE)
    }
    
    // Validar tamaño usando constantes
    if (!VALIDATION_HELPERS.validateFileSize(file, this.maxFileSize)) {
      const maxSizeReadable = VALIDATION_HELPERS.getFileSizeReadable(this.maxFileSize)
      errors.push(`${VALIDATION_RULES.FILE.AVATAR.MESSAGE.SIZE} (Máximo: ${maxSizeReadable})`)
    }
    
    // Validar dimensiones si es imagen
    if (file.type.startsWith('image/')) {
      this.validateImageDimensions(file).then(dimensions => {
        if (dimensions.width > VALIDATION_RULES.FILE.AVATAR.MAX_DIMENSIONS.width ||
            dimensions.height > VALIDATION_RULES.FILE.AVATAR.MAX_DIMENSIONS.height) {
          errors.push(VALIDATION_RULES.FILE.AVATAR.MESSAGE.DIMENSIONS)
        }
      }).catch(() => {
        // Si falla la validación de dimensiones, continuar sin ella
        console.warn('No se pudieron validar las dimensiones de la imagen')
      })
    }
    
    return { valid: errors.length === 0, errors }
  }
  
  // =============================================
  // OPERACIONES DE PERFIL (ACTUALIZADAS)
  // =============================================
  
  /**
   * Actualiza perfil con validación
   */
  async updateProfile(updateData, validate = true) {
    if (validate) {
      const validation = this.validateProfileData(updateData)
      if (!validation.isValid) {
        throw new Error(`Datos de perfil inválidos: ${validation.errors.join(', ')}`)
      }
    }
    
    const response = await this.apiClient.put(
      PROFILE_ENDPOINTS.UPDATE_PROFILE,
      updateData,
      { timeout: API_CONFIG.TIMEOUTS.DEFAULT }
    )
    
    const updatedProfile = this.transformDates(response.data)
    this.updateProfileCache(updatedProfile)
    
    return updatedProfile
  }
  
  /**
   * Validar datos del perfil
   * @private
   */
  validateProfileData(data) {
    const errors = []
    
    if (data.bio && data.bio.length > VALIDATION_RULES.USER.BIO.MAX_LENGTH) {
      errors.push(VALIDATION_RULES.USER.BIO.MESSAGE.LENGTH)
    }
    
    if (data.fullName) {
      if (data.fullName.length < VALIDATION_RULES.USER.FULL_NAME.MIN_LENGTH) {
        errors.push(VALIDATION_RULES.USER.FULL_NAME.MESSAGE.LENGTH)
      }
      if (data.fullName.length > VALIDATION_RULES.USER.FULL_NAME.MAX_LENGTH) {
        errors.push(VALIDATION_RULES.USER.FULL_NAME.MESSAGE.LENGTH)
      }
    }
    
    if (data.website && !VALIDATION_RULES.URL.PATTERN.test(data.website)) {
      errors.push(VALIDATION_RULES.URL.MESSAGE.INVALID)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  // =============================================
  // CACHING MEJORADO
  // =============================================
  
  /**
   * Actualizar cache de perfil con expiración
   * @private
   */
  updateProfileCache(profile) {
    const cacheData = {
      profile,
      _cachedAt: Date.now(),
      _expiresAt: Date.now() + this.cacheDuration
    }
    
    localStorage.setItem(STORAGE_KEYS.CACHED_PROFILE, JSON.stringify(cacheData))
    this.cache.profile = profile
    this.cache.lastProfileFetch = new Date()
  }
  
  /**
   * Obtener perfil desde cache con validación de expiración
   */
  async getCachedProfile() {
    const cached = localStorage.getItem(STORAGE_KEYS.CACHED_PROFILE)
    
    if (!cached) return null
    
    try {
      const cacheData = JSON.parse(cached)
      
      // Verificar expiración
      if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.CACHED_PROFILE)
        return null
      }
      
      // Verificar si es muy viejo (> 1 día)
      if (cacheData._cachedAt && (Date.now() - cacheData._cachedAt) > CACHE_CONFIG.TTL.LONG) {
        console.log('⚠️ Cache de perfil muy antiguo, actualizando...')
        return null
      }
      
      return cacheData.profile
    } catch (error) {
      console.error('Error parseando cache de perfil:', error)
      localStorage.removeItem(STORAGE_KEYS.CACHED_PROFILE)
      return null
    }
  }
}