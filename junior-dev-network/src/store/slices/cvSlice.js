// store/slices/cvSlice.js
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { cvService } from '@/api/services'
import {
    API_CONFIG,
    STORAGE_KEYS,
    LOADING_STATES
} from '@/constants/apiConfig'
import { VALIDATION_RULES, VALIDATION_HELPERS } from '@/constants/validationRules'
import { SkillLevel, AnalysisStatus, SkillSource } from '@/api/services/cvService'

// =============================================
// ADAPTERS Y NORMALIZACIÓN
// =============================================

// Entity adapter para skills (mejor rendimiento con muchas skills)
const skillsAdapter = createEntityAdapter({
    selectId: (skill) => skill.id,
    sortComparer: (a, b) => b.confidence - a.confidence // Ordenar por confianza
})

// Entity adapter para análisis
const analysesAdapter = createEntityAdapter({
    selectId: (analysis) => analysis.analysisId || analysis.id,
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Más reciente primero
})

// =============================================
// ASYNC THUNKS
// =============================================

/**
 * Sube un archivo CV
 */
export const uploadCV = createAsyncThunk(
    'cv/upload',
    async ({ file, onProgress }, { rejectWithValue }) => {
        try {
            // Validar archivo antes de subir
            const validation = validateCVFile(file)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Archivo inválido',
                    errors: validation.errors
                })
            }

            const result = await cvService.uploadCV(file, onProgress)
            return result
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status,
                data: error.response?.data
            })
        }
    }
)

/**
 * Inicia análisis de CV
 */
export const analyzeCV = createAsyncThunk(
    'cv/analyze',
    async (cvId, { rejectWithValue }) => {
        try {
            const result = await cvService.analyzeCV(cvId)
            return result
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene resultados de análisis
 */
export const getAnalysis = createAsyncThunk(
    'cv/getAnalysis',
    async (analysisId, { rejectWithValue }) => {
        try {
            const result = await cvService.getAnalysis(analysisId)
            return result
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Espera y obtiene análisis completado
 */
export const waitForAnalysis = createAsyncThunk(
    'cv/waitForAnalysis',
    async ({ analysisId, timeoutMs, pollInterval }, { rejectWithValue, dispatch }) => {
        try {
            const result = await cvService.waitForAnalysis(analysisId, timeoutMs, pollInterval)

            // Cuando se completa, actualizar skills automáticamente
            if (result.status === AnalysisStatus.COMPLETED) {
                dispatch(fetchSkills())
            }

            return result
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: 'ANALYSIS_TIMEOUT'
            })
        }
    }
)

/**
 * Obtiene todas las skills del usuario
 */
export const fetchSkills = createAsyncThunk(
    'cv/fetchSkills',
    async (_, { rejectWithValue }) => {
        try {
            const skills = await cvService.getSkills()
            return skills
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Actualiza las skills del usuario
 */
export const updateSkills = createAsyncThunk(
    'cv/updateSkills',
    async (skills, { rejectWithValue }) => {
        try {
            // Validar skills antes de enviar
            const validation = validateSkills(skills)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Skills inválidas',
                    errors: validation.errors
                })
            }

            const result = await cvService.updateSkills(skills)
            return result
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Agrega una nueva skill
 */
export const addSkill = createAsyncThunk(
    'cv/addSkill',
    async ({ name, level = SkillLevel.BEGINNER }, { rejectWithValue }) => {
        try {
            // Validar skill
            const validation = validateSingleSkill({ name, level })
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Skill inválida',
                    errors: validation.errors
                })
            }

            const newSkill = await cvService.addSkill(name, level)
            return newSkill
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Actualiza nivel de una skill
 */
export const updateSkillLevel = createAsyncThunk(
    'cv/updateSkillLevel',
    async ({ skillName, newLevel }, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const skill = selectSkillByName(state, skillName)

            if (!skill) {
                return rejectWithValue({
                    message: `Skill "${skillName}" no encontrada`,
                    code: 'SKILL_NOT_FOUND'
                })
            }

            const updatedSkill = await cvService.updateSkillLevel(skillName, newLevel)
            return updatedSkill
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Elimina una skill
 */
export const removeSkill = createAsyncThunk(
    'cv/removeSkill',
    async (skillName, { rejectWithValue }) => {
        try {
            const removed = await cvService.removeSkill(skillName)
            return { skillName, removed }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene sugerencias basadas en CV
 */
export const fetchSuggestions = createAsyncThunk(
    'cv/fetchSuggestions',
    async (options = {}, { rejectWithValue }) => {
        try {
            const suggestions = await cvService.getSuggestions(options)
            return suggestions
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene estadísticas de skills
 */
export const fetchSkillStatistics = createAsyncThunk(
    'cv/fetchSkillStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await cvService.getSkillStatistics()
            return stats
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Calcula nivel del desarrollador
 */
export const calculateDeveloperLevel = createAsyncThunk(
    'cv/calculateDeveloperLevel',
    async (_, { rejectWithValue }) => {
        try {
            const level = await cvService.calculateDeveloperLevel()
            return level
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

// =============================================
// VALIDACIONES
// =============================================

/**
 * Valida archivo CV
 */
const validateCVFile = (file) => {
    const errors = []

    if (!file) {
        errors.push('No se proporcionó archivo')
        return { isValid: false, errors }
    }

    // Validar tipo
    if (!VALIDATION_HELPERS.validateFileType(file, VALIDATION_RULES.FILE.CV.ALLOWED_TYPES)) {
        errors.push(VALIDATION_RULES.FILE.CV.MESSAGE.TYPE)
    }

    // Validar tamaño
    if (!VALIDATION_HELPERS.validateFileSize(file, VALIDATION_RULES.FILE.CV.MAX_SIZE)) {
        const maxSizeReadable = VALIDATION_HELPERS.getFileSizeReadable(VALIDATION_RULES.FILE.CV.MAX_SIZE)
        errors.push(`${VALIDATION_RULES.FILE.CV.MESSAGE.SIZE} (Máximo: ${maxSizeReadable})`)
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida array de skills
 */
const validateSkills = (skills) => {
    const errors = []

    if (!Array.isArray(skills)) {
        errors.push('Skills debe ser un array')
        return { isValid: false, errors }
    }

    if (skills.length > 100) {
        errors.push('No puedes tener más de 100 skills')
    }

    skills.forEach((skill, index) => {
        const skillValidation = validateSingleSkill(skill)
        if (!skillValidation.isValid) {
            errors.push(`Skill ${index}: ${skillValidation.errors.join(', ')}`)
        }
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida una sola skill
 */
const validateSingleSkill = (skill) => {
    const errors = []

    if (!skill.name || skill.name.trim().length === 0) {
        errors.push('Nombre de skill requerido')
    }

    if (skill.name && skill.name.length > VALIDATION_RULES.SKILL.NAME.MAX_LENGTH) {
        errors.push(VALIDATION_RULES.SKILL.NAME.MESSAGE.LENGTH)
    }

    if (skill.level && (skill.level < 1 || skill.level > 5)) {
        errors.push(VALIDATION_RULES.SKILL.LEVEL.MESSAGE.RANGE)
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// =============================================
// ESTADO INICIAL
// =============================================

const initialState = {
    // Upload
    upload: {
        progress: 0,
        isUploading: false,
        fileInfo: null,
        error: null,
        lastUploaded: null
    },

    // Análisis
    analysis: {
        current: null,
        status: AnalysisStatus.IDLE,
        error: null,
        lastAnalyzed: null
    },

    // Skills (normalizadas con entity adapter)
    skills: skillsAdapter.getInitialState(),

    // Análisis históricos (normalizados)
    analyses: analysesAdapter.getInitialState(),

    // Sugerencias
    suggestions: {
        projects: [],
        skills: [],
        mentors: [],
        communities: [],
        status: LOADING_STATES.IDLE,
        lastFetched: null,
        error: null
    },

    // Estadísticas
    statistics: {
        skillStats: null,
        developerLevel: null,
        lastCalculated: null,
        status: LOADING_STATES.IDLE,
        error: null
    },

    // Estado general
    status: LOADING_STATES.IDLE,
    error: null,
    lastUpdated: null,

    // Metadata
    meta: {
        totalCVsUploaded: 0,
        totalAnalyses: 0,
        lastCVUploadDate: null,
        hasCompletedAnalysis: false
    }
}

// =============================================
// SLICE PRINCIPAL
// =============================================

const cvSlice = createSlice({
    name: 'cv',
    initialState,
    reducers: {
        // =============================================
        // REDUCERS SÍNCRONOS
        // =============================================

        /**
         * Actualiza progreso de upload
         */
        setUploadProgress: (state, action) => {
            state.upload.progress = action.payload
            state.upload.isUploading = action.payload < 100
        },

        /**
         * Cancela upload en progreso
         */
        cancelUpload: (state) => {
            state.upload.progress = 0
            state.upload.isUploading = false
            state.upload.error = null
            state.upload.fileInfo = null
            state.status = LOADING_STATES.IDLE
        },

        /**
         * Limpia errores de CV
         */
        clearCVError: (state) => {
            state.error = null
            state.upload.error = null
            state.analysis.error = null
            state.suggestions.error = null
            state.statistics.error = null
            state.status = LOADING_STATES.IDLE
        },

        /**
         * Resetea el estado de análisis
         */
        resetAnalysis: (state) => {
            state.analysis.current = null
            state.analysis.status = AnalysisStatus.IDLE
            state.analysis.error = null
        },

        /**
         * Selecciona skill por nombre
         */
        selectSkill: (state, action) => {
            const skillName = action.payload
            // Marcar skill como seleccionada
            if (state.skills.entities) {
                Object.values(state.skills.entities).forEach(skill => {
                    skill.isSelected = skill.name === skillName
                })
            }
        },

        /**
         * Agrega skill temporal (antes de guardar)
         */
        addTemporarySkill: (state, action) => {
            const newSkill = {
                id: `temp_${Date.now()}`,
                ...action.payload,
                source: SkillSource.MANUAL,
                isTemporary: true
            }

            skillsAdapter.addOne(state.skills, newSkill)
        },

        /**
         * Remueve skill temporal
         */
        removeTemporarySkill: (state, action) => {
            const skillId = action.payload
            const skill = state.skills.entities[skillId]

            if (skill && skill.isTemporary) {
                skillsAdapter.removeOne(state.skills, skillId)
            }
        },

        /**
         * Filtra skills por nivel
         */
        filterSkillsByLevel: (state, action) => {
            const level = action.payload
            state.skills.filter = level
        },

        /**
         * Ordena skills por criterio
         */
        sortSkillsBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.skills.sort = { field, direction }
        },

        /**
         * Actualiza metadata
         */
        updateMeta: (state, action) => {
            state.meta = { ...state.meta, ...action.payload }
        },

        /**
         * Limpia todo el estado de CV
         */
        clearCVState: () => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        // =============================================
        // UPLOAD CV
        // =============================================
        builder
            .addCase(uploadCV.pending, (state) => {
                state.upload.isUploading = true
                state.upload.progress = 0
                state.upload.error = null
                state.status = LOADING_STATES.LOADING
            })
            .addCase(uploadCV.fulfilled, (state, action) => {
                state.upload.isUploading = false
                state.upload.progress = 100
                state.upload.fileInfo = action.payload
                state.upload.lastUploaded = new Date().toISOString()
                state.meta.totalCVsUploaded += 1
                state.meta.lastCVUploadDate = new Date().toISOString()
                state.status = LOADING_STATES.SUCCESS

                // Cachear en localStorage
                cacheCVData(action.payload.cvId, action.payload)
            })
            .addCase(uploadCV.rejected, (state, action) => {
                state.upload.isUploading = false
                state.upload.error = action.payload?.message || 'Error subiendo CV'
                state.upload.progress = 0
                state.status = LOADING_STATES.ERROR
                state.error = action.payload?.message
            })

        // =============================================
        // ANALYZE CV
        // =============================================
        builder
            .addCase(analyzeCV.pending, (state) => {
                state.analysis.status = AnalysisStatus.PROCESSING
                state.analysis.error = null
                state.status = LOADING_STATES.LOADING
            })
            .addCase(analyzeCV.fulfilled, (state, action) => {
                state.analysis.current = action.payload
                state.analysis.status = action.payload.status
                state.analysis.lastAnalyzed = new Date().toISOString()
                state.meta.totalAnalyses += 1
                state.status = LOADING_STATES.SUCCESS

                // Agregar a análisis históricos
                analysesAdapter.addOne(state.analyses, action.payload)
            })
            .addCase(analyzeCV.rejected, (state, action) => {
                state.analysis.status = AnalysisStatus.FAILED
                state.analysis.error = action.payload?.message || 'Error analizando CV'
                state.status = LOADING_STATES.ERROR
            })

        // =============================================
        // GET ANALYSIS
        // =============================================
        builder
            .addCase(getAnalysis.pending, (state) => {
                state.analysis.status = AnalysisStatus.PROCESSING
                state.analysis.error = null
            })
            .addCase(getAnalysis.fulfilled, (state, action) => {
                const analysis = action.payload

                // Actualizar análisis actual
                if (state.analysis.current?.analysisId === analysis.analysisId) {
                    state.analysis.current = analysis
                    state.analysis.status = analysis.status
                }

                // Actualizar en análisis históricos
                analysesAdapter.upsertOne(state.analyses, analysis)

                // Marcar si hay análisis completado
                if (analysis.status === AnalysisStatus.COMPLETED) {
                    state.meta.hasCompletedAnalysis = true
                }
            })
            .addCase(getAnalysis.rejected, (state, action) => {
                state.analysis.error = action.payload?.message || 'Error obteniendo análisis'
            })

        // =============================================
        // WAIT FOR ANALYSIS
        // =============================================
        builder
            .addCase(waitForAnalysis.pending, (state) => {
                state.analysis.status = AnalysisStatus.PROCESSING
                state.status = LOADING_STATES.LOADING
            })
            .addCase(waitForAnalysis.fulfilled, (state, action) => {
                state.analysis.current = action.payload
                state.analysis.status = AnalysisStatus.COMPLETED
                state.analysis.lastAnalyzed = new Date().toISOString()
                state.meta.hasCompletedAnalysis = true
                state.status = LOADING_STATES.SUCCESS

                // Actualizar en análisis históricos
                analysesAdapter.upsertOne(state.analyses, action.payload)
            })
            .addCase(waitForAnalysis.rejected, (state, action) => {
                state.analysis.status = AnalysisStatus.FAILED
                state.analysis.error = action.payload?.message || 'Timeout esperando análisis'
                state.status = LOADING_STATES.ERROR
            })

        // =============================================
        // FETCH SKILLS
        // =============================================
        builder
            .addCase(fetchSkills.pending, (state) => {
                state.skills.status = LOADING_STATES.LOADING
                state.skills.error = null
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                // Usar entity adapter para normalizar skills
                skillsAdapter.setAll(state.skills, action.payload)
                state.skills.status = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Cachear skills
                cacheSkills(action.payload)
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.skills.status = LOADING_STATES.ERROR
                state.skills.error = action.payload?.message || 'Error obteniendo skills'

                // Intentar cargar desde cache
                const cachedSkills = loadCachedSkills()
                if (cachedSkills) {
                    skillsAdapter.setAll(state.skills, cachedSkills)
                    state.skills.status = LOADING_STATES.SUCCESS
                }
            })

        // =============================================
        // UPDATE SKILLS
        // =============================================
        builder
            .addCase(updateSkills.pending, (state) => {
                state.skills.status = LOADING_STATES.LOADING
            })
            .addCase(updateSkills.fulfilled, (state, action) => {
                // Actualizar skills con los datos del servidor
                skillsAdapter.setAll(state.skills, action.payload.skills || action.payload)
                state.skills.status = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Eliminar skills temporales
                Object.keys(state.skills.entities).forEach(id => {
                    if (state.skills.entities[id].isTemporary) {
                        skillsAdapter.removeOne(state.skills, id)
                    }
                })
            })
            .addCase(updateSkills.rejected, (state, action) => {
                state.skills.status = LOADING_STATES.ERROR
                state.skills.error = action.payload?.message || 'Error actualizando skills'
            })

        // =============================================
        // ADD SKILL
        // =============================================
        builder
            .addCase(addSkill.fulfilled, (state, action) => {
                skillsAdapter.addOne(state.skills, action.payload)
                state.lastUpdated = new Date().toISOString()
            })

        // =============================================
        // UPDATE SKILL LEVEL
        // =============================================
        builder
            .addCase(updateSkillLevel.fulfilled, (state, action) => {
                skillsAdapter.upsertOne(state.skills, action.payload)
                state.lastUpdated = new Date().toISOString()
            })

        // =============================================
        // REMOVE SKILL
        // =============================================
        builder
            .addCase(removeSkill.fulfilled, (state, action) => {
                const { skillName, removed } = action.payload
                if (removed) {
                    // Encontrar el ID por nombre
                    const skillId = Object.keys(state.skills.entities).find(
                        id => state.skills.entities[id].name === skillName
                    )
                    if (skillId) {
                        skillsAdapter.removeOne(state.skills, skillId)
                    }
                }
            })

        // =============================================
        // FETCH SUGGESTIONS
        // =============================================
        builder
            .addCase(fetchSuggestions.pending, (state) => {
                state.suggestions.status = LOADING_STATES.LOADING
                state.suggestions.error = null
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.suggestions = {
                    ...action.payload,
                    status: LOADING_STATES.SUCCESS,
                    lastFetched: new Date().toISOString(),
                    error: null
                }
            })
            .addCase(fetchSuggestions.rejected, (state, action) => {
                state.suggestions.status = LOADING_STATES.ERROR
                state.suggestions.error = action.payload?.message || 'Error obteniendo sugerencias'
            })

        // =============================================
        // FETCH SKILL STATISTICS
        // =============================================
        builder
            .addCase(fetchSkillStatistics.pending, (state) => {
                state.statistics.status = LOADING_STATES.LOADING
                state.statistics.error = null
            })
            .addCase(fetchSkillStatistics.fulfilled, (state, action) => {
                state.statistics.skillStats = action.payload
                state.statistics.status = LOADING_STATES.SUCCESS
                state.statistics.lastCalculated = new Date().toISOString()
            })
            .addCase(fetchSkillStatistics.rejected, (state, action) => {
                state.statistics.status = LOADING_STATES.ERROR
                state.statistics.error = action.payload?.message || 'Error obteniendo estadísticas'
            })

        // =============================================
        // CALCULATE DEVELOPER LEVEL
        // =============================================
        builder
            .addCase(calculateDeveloperLevel.fulfilled, (state, action) => {
                state.statistics.developerLevel = action.payload
                state.statistics.lastCalculated = new Date().toISOString()
            })
    }
})

// =============================================
// FUNCIONES DE CACHE
// =============================================

/**
 * Cachea datos de CV en localStorage
 */
const cacheCVData = (cvId, data) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHED_SKILLS}_${cvId}`
        const cacheData = {
            ...data,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + API_CONFIG.CACHE_CONFIG.DEFAULT_TTL
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando datos de CV:', error)
    }
}

/**
 * Cachea skills en localStorage
 */
const cacheSkills = (skills) => {
    try {
        const cacheData = {
            skills,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + API_CONFIG.CACHE_CONFIG.DEFAULT_TTL
        }
        localStorage.setItem(STORAGE_KEYS.CACHED_SKILLS, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando skills:', error)
    }
}

/**
 * Carga skills desde cache
 */
const loadCachedSkills = () => {
    try {
        const cached = localStorage.getItem(STORAGE_KEYS.CACHED_SKILLS)
        if (!cached) return null

        const cacheData = JSON.parse(cached)

        // Verificar expiración
        if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
            localStorage.removeItem(STORAGE_KEYS.CACHED_SKILLS)
            return null
        }

        return cacheData.skills
    } catch (error) {
        console.warn('Error cargando skills desde cache:', error)
        return null
    }
}

// =============================================
// SELECTORS
// =============================================

// Selectores básicos
export const selectCVState = (state) => state.cv
export const selectUpload = (state) => state.cv.upload
export const selectAnalysis = (state) => state.cv.analysis
export const selectSuggestions = (state) => state.cv.suggestions
export const selectStatistics = (state) => state.cv.statistics
export const selectCVStatus = (state) => state.cv.status
export const selectCVError = (state) => state.cv.error

// Selectores de entity adapters
export const {
    selectAll: selectAllSkills,
    selectById: selectSkillById,
    selectIds: selectSkillIds,
    selectTotal: selectTotalSkills
} = skillsAdapter.getSelectors((state) => state.cv.skills)

export const {
    selectAll: selectAllAnalyses,
    selectById: selectAnalysisById,
    selectIds: selectAnalysisIds
} = analysesAdapter.getSelectors((state) => state.cv.analyses)

// Selectores derivados
export const selectSkillsByLevel = (level) => (state) => {
    const allSkills = selectAllSkills(state)
    return allSkills.filter(skill => skill.level === level)
}

export const selectCVSkills = (state) => {
    const allSkills = selectAllSkills(state)
    return allSkills.filter(skill => skill.source === SkillSource.CV)
}

export const selectManualSkills = (state) => {
    const allSkills = selectAllSkills(state)
    return allSkills.filter(skill => skill.source === SkillSource.MANUAL)
}

export const selectSkillByName = (skillName) => (state) => {
    const allSkills = selectAllSkills(state)
    return allSkills.find(skill => skill.name === skillName)
}

export const selectTopSkills = (limit = 10) => (state) => {
    const allSkills = selectAllSkills(state)
    return allSkills
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
        .slice(0, limit)
}

export const selectSkillsByCategory = (category) => (state) => {
    const allSkills = selectAllSkills(state)
    return allSkills.filter(skill => skill.category === category)
}

export const selectRecentAnalyses = (limit = 5) => (state) => {
    const allAnalyses = selectAllAnalyses(state)
    return allAnalyses.slice(0, limit)
}

export const selectAnalysisStatus = (state) => state.cv.analysis.status

export const selectIsAnalyzing = (state) =>
    state.cv.analysis.status === AnalysisStatus.PROCESSING

export const selectHasCompletedAnalysis = (state) =>
    state.cv.meta.hasCompletedAnalysis

export const selectDeveloperLevel = (state) =>
    state.cv.statistics.developerLevel

export const selectSkillStatistics = (state) =>
    state.cv.statistics.skillStats

export const selectProjectSuggestions = (state) =>
    state.cv.suggestions.projects || []

export const selectSkillSuggestions = (state) =>
    state.cv.suggestions.skills || []

// =============================================
// EXPORTACIONES
// =============================================

// Exportar acciones
export const {
    setUploadProgress,
    cancelUpload,
    clearCVError,
    resetAnalysis,
    selectSkill,
    addTemporarySkill,
    removeTemporarySkill,
    filterSkillsByLevel,
    sortSkillsBy,
    updateMeta,
    clearCVState
} = cvSlice.actions

// Exportar thunks
export {
    uploadCV,
    analyzeCV,
    getAnalysis,
    waitForAnalysis,
    fetchSkills,
    updateSkills,
    addSkill,
    updateSkillLevel,
    removeSkill,
    fetchSuggestions,
    fetchSkillStatistics,
    calculateDeveloperLevel
}

// Exportar reducer
export default cvSlice.reducer

// Exportar tipos
/**
 * @typedef {Object} CVState
 * @property {Object} upload
 * @property {Object} analysis
 * @property {Object} skills
 * @property {Object} analyses
 * @property {Object} suggestions
 * @property {Object} statistics
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastUpdated
 * @property {Object} meta
 */