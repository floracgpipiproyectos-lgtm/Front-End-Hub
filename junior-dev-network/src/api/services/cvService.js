// cvService.js
// noinspection GrazieInspection

import apiClient from '../apiClient'
import { CV_ENDPOINTS, buildEndpoint } from '@/constants/apiEndpoints'

// =============================================
// CONSTANTES Y ENUMS
// =============================================

/**
 * Niveles de habilidad para desarrolladores
 * @enum {string}
 */
export const SkillLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
}

/**
 * Estados posibles del análisis de CV
 * @enum {string}
 */
export const AnalysisStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

/**
 * Fuente de donde se obtuvo la skill
 * @enum {string}
 */
export const SkillSource = {
  CV: 'cv',
  MANUAL: 'manual'
}

// =============================================
// ESTRUCTURAS DE DATOS (TYPES)
// =============================================

/**
 * @typedef {Object} FileInfo
 * @property {string} fileName - Nombre del archivo
 * @property {number} fileSize - Tamaño en bytes
 * @property {string} mimeType - Tipo MIME del archivo
 */

/**
 * @typedef {Object} CVUploadResponse
 * @property {string} cvId - ID único del CV subido
 * @property {FileInfo} fileInfo - Información del archivo
 * @property {string} uploadedAt - Fecha de subida en ISO string
 */

/**
 * @typedef {Object} Skill
 * @property {string} id - ID único de la skill
 * @property {string} name - Nombre de la skill
 * @property {SkillLevel} level - Nivel de la skill
 * @property {SkillSource} source - Fuente de la skill
 * @property {number} [confidence] - Confianza en la detección (0-1)
 */

/**
 * @typedef {Object} Experience
 * @property {string} title - Título del puesto
 * @property {string} company - Nombre de la empresa
 * @property {string} duration - Duración del empleo
 * @property {string} [description] - Descripción de responsabilidades
 * @property {string[]} [technologies] - Tecnologías utilizadas
 */

/**
 * @typedef {Object} Education
 * @property {string} degree - Título académico
 * @property {string} institution - Institución educativa
 * @property {string} duration - Duración de los estudios
 * @property {string} [fieldOfStudy] - Campo de estudio
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} analysisId - ID único del análisis
 * @property {AnalysisStatus} status - Estado del análisis
 * @property {Skill[]} skills - Skills detectadas
 * @property {Experience[]} experience - Experiencia laboral
 * @property {Education[]} education - Educación
 * @property {string} estimatedLevel - Nivel estimado del desarrollador
 * @property {string} createdAt - Fecha de creación en ISO string
 * @property {string} [completedAt] - Fecha de completado en ISO string
 */

/**
 * @typedef {Object} SuggestionOptions
 * @property {string[]} [types] - Tipos de sugerencias a obtener
 * @property {number} [limit] - Límite de resultados por tipo
 * @property {string} [priority] - Prioridad de sugerencias
 */

/**
 * @typedef {Object} Suggestions
 * @property {Object[]} projects - Proyectos sugeridos
 * @property {Skill[]} skills - Skills sugeridas para aprender
 * @property {Object[]} mentors - Mentores sugeridos
 * @property {Object[]} communities - Comunidades sugeridas
 */

// =============================================
// HELPERS INTERNOS
// =============================================

/**
 * Helper para manejar upload con progress callback
 * @private
 * @param {File} file - Archivo a subir
 * @param {Function} [onUploadProgress] - Callback de progreso
 * @returns {Promise} Promise con la respuesta de la API
 */
const handleFileUpload = (file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('cv', file)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }

  // Agregar callback de progreso si existe
  if (onUploadProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total, 2)
        onUploadProgress(percentCompleted)
    }
  }

  return apiClient.post(CV_ENDPOINTS.UPLOAD, formData, config)
}



// =============================================
// SERVICIO PRINCIPAL DE CV
// =============================================

/**
 * Servicio de análisis de CV para JuniorDev Network
 * Maneja subida, análisis, extracción de skills y sugerencias personalizadas
 */
export const cvService = {
  // =============================================
  // OPERACIONES DE SUBIDA DE CV
  // =============================================

  /**
   * Sube un archivo de CV al servidor para procesamiento
   * @param {File} file - Archivo de CV (PDF, DOC, DOCX)
   * @param {Function} [onUploadProgress] - Callback con porcentaje de progreso
   * @returns {Promise<CVUploadResponse>} Respuesta con ID y metadatos del CV
   * @throws {Error} Si la subida falla
   * 
   * @example
   * const response = await cvService.uploadCV(file, (percent) => {
   *   console.log(`Progreso: ${percent}%`)
   * })
   * console.log('CV ID:', response.cvId)
   */
  uploadCV: async (file, onUploadProgress) => {
    const response = await handleFileUpload(file, onUploadProgress)
    return response.data
  },

  /**
   * Valida si un archivo es un formato de CV soportado
   * @param {File} file - Archivo a validar
   * @returns {boolean} true si el formato es soportado
   * 
   * @example
   * if (cvService.isValidCVFile(file)) {
   *   await cvService.uploadCV(file)
   * }
   */
  isValidCVFile: (file) => {
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    const supportedExtensions = ['.pdf', '.doc', '.docx', '.txt']
    const fileName = file.name.toLowerCase()

    return supportedTypes.includes(file.type) ||
      supportedExtensions.some(ext => fileName.endsWith(ext))
  },

  // =============================================
  // OPERACIONES DE ANÁLISIS
  // =============================================

  /**
   * Inicia análisis automático de un CV subido
   * @param {string} cvId - ID del CV obtenido de uploadCV
   * @returns {Promise<AnalysisResult>} Resultado inicial del análisis
   * @throws {Error} Si el CV no existe o el análisis falla
   * 
   * @example
   * const analysis = await cvService.analyzeCV('cv-123')
   * console.log('Análisis ID:', analysis.analysisId)
   */
  analyzeCV: async (cvId) => {
    const response = await apiClient.post(CV_ENDPOINTS.ANALYZE, { cvId })
    return response.data
  },

  /**
   * Obtiene resultados completos de un análisis
   * @param {string} analysisId - ID del análisis obtenido de analyzeCV
   * @returns {Promise<AnalysisResult>} Resultado completo del análisis
   * @throws {Error} Si el análisis no existe
   * 
   * @example
   * const results = await cvService.getAnalysis('analysis-456')
   * if (results.status === AnalysisStatus.COMPLETED) {
   *   console.log('Skills detectadas:', results.skills)
   * }
   */
  getAnalysis: async (analysisId) => {
    const endpoint = buildEndpoint(CV_ENDPOINTS.GET_ANALYSIS, { id: analysisId })
    const response = await apiClient.get(endpoint)
    return response.data
  },

  /**
   * Obtiene el estado actual de un análisis
   * @param {string} analysisId - ID del análisis
   * @returns {Promise<AnalysisStatus>} Estado actual del análisis
   * 
   * @example
   * const status = await cvService.getAnalysisStatus('analysis-456')
   * console.log('Estado:', status)
   */
  getAnalysisStatus: async (analysisId) => {
    const result = await cvService.getAnalysis(analysisId)
    return result.status
  },

  /**
   * Espera y obtiene un análisis completado
   * @param {string} analysisId - ID del análisis
   * @param {number} [timeoutMs=30000] - Tiempo máximo de espera en ms
   * @param {number} [pollInterval=1000] - Intervalo de polling en ms
   * @returns {Promise<AnalysisResult>} Análisis completado
   * @throws {Error} Si timeout o el análisis falla
   * 
   * @example
   * const results = await cvService.waitForAnalysis('analysis-456', 60000)
   */
  waitForAnalysis: async (analysisId, timeoutMs = 30000, pollInterval = 1000) => {
    const startTime = Date.now()

    while (true) {
      const result = await cvService.getAnalysis(analysisId)

      if (result.status === AnalysisStatus.COMPLETED) {
        return result
      }

      if (result.status === AnalysisStatus.FAILED) {
        throw new Error('El análisis ha fallado')
      }

      // Verificar timeout
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('Timeout esperando análisis')
      }

      // Esperar antes de verificar nuevamente
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }
  },

  // =============================================
  // OPERACIONES DE SKILLS
  // =============================================

  /**
   * Obtiene todas las skills del usuario actual
   * @returns {Promise<Skill[]>} Array de skills del usuario
   * @throws {Error} Si el usuario no está autenticado
   * 
   * @example
   * const skills = await cvService.getSkills()
   * console.log('Total skills:', skills.length)
   */
  getSkills: async () => {
    const response = await apiClient.get(CV_ENDPOINTS.GET_SKILLS)
    return response.data
  },

  /**
   * Obtiene skills filtradas por nivel
   * @param {SkillLevel} level - Nivel a filtrar
   * @returns {Promise<Skill[]>} Skills del nivel especificado
   * 
   * @example
   * const advancedSkills = await cvService.getSkillsByLevel(SkillLevel.ADVANCED)
   */
  getSkillsByLevel: async (level) => {
    const skills = await cvService.getSkills()
    return skills.filter(skill => skill.level === level)
  },

  /**
   * Obtiene skills detectadas automáticamente del CV
   * @returns {Promise<Skill[]>} Skills con source 'cv'
   * 
   * @example
   * const cvSkills = await cvService.getCVSkills()
   */
  getCVSkills: async () => {
    const skills = await cvService.getSkills()
    return skills.filter(skill => skill.source === SkillSource.CV)
  },

  /**
   * Obtiene skills agregadas manualmente por el usuario
   * @returns {Promise<Skill[]>} Skills con source 'manual'
   */
  getManualSkills: async () => {
    const skills = await cvService.getSkills()
    return skills.filter(skill => skill.source === SkillSource.MANUAL)
  },

  /**
   * Actualiza las skills del usuario
   * @param {Skill[]|string[]} skills - Array de skills u array de nombres
   * @returns {Promise<{skills: Skill[], updatedAt: string}>} Skills actualizadas
   * @throws {Error} Si la validación de skills falla
   * 
   * @example
   * // Con objetos Skill
   * await cvService.updateSkills([
   *   { name: 'React', level: SkillLevel.ADVANCED },
   *   { name: 'TypeScript', level: SkillLevel.INTERMEDIATE }
   * ])
   * 
   * // Con array de strings
   * await cvService.updateSkills(['JavaScript', 'HTML', 'CSS'])
   */
  updateSkills: async (skills) => {
    const response = await apiClient.put(CV_ENDPOINTS.UPDATE_SKILLS, { skills })
    return response.data
  },

  /**
   * Agrega una nueva skill al perfil del usuario
   * @param {string} name - Nombre de la skill
   * @param {SkillLevel} [level=SkillLevel.BEGINNER] - Nivel de la skill
   * @returns {Promise<Skill>} Skill agregada
   * 
   * @example
   * const newSkill = await cvService.addSkill('Docker', SkillLevel.BEGINNER)
   */
  addSkill: async (name, level = SkillLevel.BEGINNER) => {
    const currentSkills = await cvService.getSkills()

    // Crear nueva skill
    const newSkill = {
      name,
      level,
      source: SkillSource.MANUAL,
      id: `skill_${Date.now()}`
    }

    // Agregar a las skills existentes
    const updatedSkills = [...currentSkills, newSkill]
    await cvService.updateSkills(updatedSkills)

    return newSkill
  },

  /**
   * Elimina una skill por nombre
   * @param {string} skillName - Nombre de la skill a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   * 
   * @example
   * const removed = await cvService.removeSkill('jQuery')
   */
  removeSkill: async (skillName) => {
    const currentSkills = await cvService.getSkills()
    const filteredSkills = currentSkills.filter(skill => skill.name !== skillName)

    if (filteredSkills.length < currentSkills.length) {
      await cvService.updateSkills(filteredSkills)
      return true
    }

    return false
  },

  /**
   * Actualiza el nivel de una skill existente
   * @param {string} skillName - Nombre de la skill
   * @param {SkillLevel} newLevel - Nuevo nivel
   * @returns {Promise<Skill>} Skill actualizada
   * @throws {Error} Si la skill no existe
   * 
   * @example
   * const updatedSkill = await cvService.updateSkillLevel('React', SkillLevel.ADVANCED)
   */
  updateSkillLevel: async (skillName, newLevel) => {
    const currentSkills = await cvService.getSkills()
    const skillIndex = currentSkills.findIndex(skill => skill.name === skillName)

    if (skillIndex === -1) {
      throw new Error(`Skill "${skillName}" no encontrada`)
    }

    currentSkills[skillIndex].level = newLevel
    await cvService.updateSkills(currentSkills)

    return currentSkills[skillIndex]
  },

  // =============================================
  // OPERACIONES DE SUGERENCIAS
  // =============================================

  /**
   * Obtiene sugerencias personalizadas basadas en el CV del usuario
   * @param {SuggestionOptions} [options={}] - Opciones de filtrado
   * @returns {Promise<Suggestions>} Sugerencias organizadas por tipo
   * @throws {Error} Si no hay CV analizado o usuario no autenticado
   * 
   * @example
   * const suggestions = await cvService.getSuggestions({
   *   types: ['projects', 'skills'],
   *   limit: 5,
   *   priority: 'skills'
   * })
   */
  getSuggestions: async (options = {}) => {
    const response = await apiClient.get(CV_ENDPOINTS.GET_SUGGESTIONS, {
      params: options,
    })
    return response.data
  },

  /**
   * Obtiene sugerencias de proyectos para el usuario
   * @param {number} [limit=10] - Límite de resultados
   * @returns {Promise<Object[]>} Proyectos sugeridos
   * 
   * @example
   * const projects = await cvService.getProjectSuggestions(5)
   */
  getProjectSuggestions: async (limit = 10) => {
    const suggestions = await cvService.getSuggestions({
      types: ['projects'],
      limit
    })
    return suggestions.projects || []
  },

  /**
   * Obtiene sugerencias de skills para aprender
   * @param {number} [limit=10] - Límite de resultados
   * @returns {Promise<Skill[]>} Skills sugeridas
   * 
   * @example
   * const skillsToLearn = await cvService.getSkillSuggestions(3)
   */
  getSkillSuggestions: async (limit = 10) => {
    const suggestions = await cvService.getSuggestions({
      types: ['skills'],
      limit
    })
    return suggestions.skills || []
  },

  /**
   * Obtiene sugerencias de mentores basadas en skills del usuario
   * @param {number} [limit=5] - Límite de resultados
   * @returns {Promise<Object[]>} Mentores sugeridos
   */
  getMentorSuggestions: async (limit = 5) => {
    const suggestions = await cvService.getSuggestions({
      types: ['mentors'],
      limit
    })
    return suggestions.mentors || []
  },

  /**
   * Obtiene sugerencias de comunidades relevantes
   * @param {number} [limit=5] - Límite de resultados
   * @returns {Promise<Object[]>} Comunidades sugeridas
   */
  getCommunitySuggestions: async (limit = 5) => {
    const suggestions = await cvService.getSuggestions({
      types: ['communities'],
      limit
    })
    return suggestions.communities || []
  },

  // =============================================
  // UTILIDADES ADICIONALES
  // =============================================

  /**
   * Calcula el nivel general del desarrollador basado en sus skills
   * @returns {Promise<SkillLevel>} Nivel estimado
   * 
   * @example
   * const level = await cvService.calculateDeveloperLevel()
   * console.log('Nivel estimado:', level)
   */
  calculateDeveloperLevel: async () => {
    const skills = await cvService.getSkills()

    if (skills.length === 0) {
      return SkillLevel.BEGINNER
    }

    // Ponderar niveles de skills
    const levelScores = {
      [SkillLevel.BEGINNER]: 1,
      [SkillLevel.INTERMEDIATE]: 2,
      [SkillLevel.ADVANCED]: 3
    }

    const totalScore = skills.reduce((sum, skill) => {
      return sum + (levelScores[skill.level] || 0)
    }, 0)

    const averageScore = totalScore / skills.length

    if (averageScore >= 2.5) return SkillLevel.ADVANCED
    if (averageScore >= 1.5) return SkillLevel.INTERMEDIATE
    return SkillLevel.BEGINNER
  },

  /**
   * Obtiene estadísticas de las skills del usuario
   * @returns {Promise<Object>} Estadísticas detalladas
   * 
   * @example
   * const stats = await cvService.getSkillStatistics()
   * console.log('Total skills:', stats.total)
   * console.log('Skills avanzadas:', stats.byLevel.advanced)
   */
  getSkillStatistics: async () => {
    const skills = await cvService.getSkills()

    const stats = {
      total: skills.length,
      byLevel: {
        [SkillLevel.BEGINNER]: 0,
        [SkillLevel.INTERMEDIATE]: 0,
        [SkillLevel.ADVANCED]: 0
      },
      bySource: {
        [SkillSource.CV]: 0,
        [SkillSource.MANUAL]: 0
      },
      topSkills: skills
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
        .slice(0, 5)
    }

    skills.forEach(skill => {
      stats.byLevel[skill.level]++
      stats.bySource[skill.source]++
    })

    return stats
  }
}

// =============================================
// EXPORTACIONES
// =============================================

export default cvService

/**
 * Factory para crear servicios de CV personalizados
 */
export const CVServiceFactory = {
  /**
   * Crea una instancia del servicio con configuración estándar
   * @returns {Object} Instancia de cvService
   */
  createDefault: () => cvService,

  /**
   * Crea una instancia con configuración personalizada
   * @param {Object} config - Configuración personalizada
   * @returns {Object} Instancia personalizada
   */
  createWithConfig: (config) => {
    // En una implementación real, aquí se podría configurar
    // diferentes clients o endpoints
    return {
      ...cvService,
      config
    }
  }
}