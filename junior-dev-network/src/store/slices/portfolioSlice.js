// store/slices/portfolioSlice.js
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { portfolioService } from '@/api/services'
import {
    API_CONFIG,
    STORAGE_KEYS,
    LOADING_STATES,
    CACHE_CONFIG
} from '@/constants/apiConfig'
import { VALIDATION_RULES, VALIDATION_HELPERS } from '@/constants/validationRules'
import { 
    ProjectStatus,
    ProjectVisibility,
    ContentType,
    LinkType 
} from '@/api/services/portfolioService'

// =============================================
// ADAPTERS Y NORMALIZACIÓN
// =============================================

// Entity adapter para proyectos
const projectsAdapter = createEntityAdapter({
    selectId: (project) => project.id,
    sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) // Más reciente primero
})

// Entity adapter para experiencias
const experiencesAdapter = createEntityAdapter({
    selectId: (experience) => experience.id,
    sortComparer: (a, b) => {
        // Ordenar por fecha de inicio (las más recientes primero)
        if (b.current && !a.current) return 1
        if (a.current && !b.current) return -1
        return new Date(b.startDate) - new Date(a.startDate)
    }
})

// Entity adapter para educación
const educationAdapter = createEntityAdapter({
    selectId: (education) => education.id,
    sortComparer: (a, b) => new Date(b.endDate || b.startDate) - new Date(a.endDate || a.startDate)
})

// Entity adapter para certificaciones
const certificationsAdapter = createEntityAdapter({
    selectId: (certification) => certification.id,
    sortComparer: (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
})

// Entity adapter para habilidades destacadas
const featuredSkillsAdapter = createEntityAdapter({
    selectId: (skill) => skill.id,
    sortComparer: (a, b) => b.proficiency - a.proficiency // Mayor competencia primero
})

// =============================================
// ASYNC THUNKS
// =============================================

/**
 * Obtiene todo el portfolio del usuario
 */
export const fetchPortfolio = createAsyncThunk(
    'portfolio/fetchPortfolio',
    async (_, { rejectWithValue }) => {
        try {
            const portfolio = await portfolioService.getPortfolio()
            return portfolio
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene proyectos del portfolio
 */
export const fetchProjects = createAsyncThunk(
    'portfolio/fetchProjects',
    async (options = {}, { rejectWithValue }) => {
        try {
            const projects = await portfolioService.getProjects(options)
            return projects
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Crea un nuevo proyecto
 */
export const createProject = createAsyncThunk(
    'portfolio/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            // Validar proyecto antes de crear
            const validation = validateProject(projectData)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Proyecto inválido',
                    errors: validation.errors
                })
            }

            const project = await portfolioService.createProject(projectData)
            return project
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Actualiza un proyecto existente
 */
export const updateProject = createAsyncThunk(
    'portfolio/updateProject',
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            // Validar actualización
            const validation = validateProject(updateData, true)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Datos de actualización inválidos',
                    errors: validation.errors
                })
            }

            const updatedProject = await portfolioService.updateProject(id, updateData)
            return updatedProject
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Elimina un proyecto
 */
export const deleteProject = createAsyncThunk(
    'portfolio/deleteProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const result = await portfolioService.deleteProject(projectId)
            return { projectId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene experiencias laborales
 */
export const fetchExperiences = createAsyncThunk(
    'portfolio/fetchExperiences',
    async (_, { rejectWithValue }) => {
        try {
            const experiences = await portfolioService.getExperiences()
            return experiences
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Agrega experiencia laboral
 */
export const addExperience = createAsyncThunk(
    'portfolio/addExperience',
    async (experienceData, { rejectWithValue }) => {
        try {
            const validation = validateExperience(experienceData)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Experiencia inválida',
                    errors: validation.errors
                })
            }

            const experience = await portfolioService.addExperience(experienceData)
            return experience
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene educación
 */
export const fetchEducation = createAsyncThunk(
    'portfolio/fetchEducation',
    async (_, { rejectWithValue }) => {
        try {
            const education = await portfolioService.getEducation()
            return education
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Agrega educación
 */
export const addEducation = createAsyncThunk(
    'portfolio/addEducation',
    async (educationData, { rejectWithValue }) => {
        try {
            const validation = validateEducation(educationData)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Educación inválida',
                    errors: validation.errors
                })
            }

            const education = await portfolioService.addEducation(educationData)
            return education
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene certificaciones
 */
export const fetchCertifications = createAsyncThunk(
    'portfolio/fetchCertifications',
    async (_, { rejectWithValue }) => {
        try {
            const certifications = await portfolioService.getCertifications()
            return certifications
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Agrega certificación
 */
export const addCertification = createAsyncThunk(
    'portfolio/addCertification',
    async (certificationData, { rejectWithValue }) => {
        try {
            const validation = validateCertification(certificationData)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Certificación inválida',
                    errors: validation.errors
                })
            }

            const certification = await portfolioService.addCertification(certificationData)
            return certification
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene skills destacadas
 */
export const fetchFeaturedSkills = createAsyncThunk(
    'portfolio/fetchFeaturedSkills',
    async (_, { rejectWithValue }) => {
        try {
            const skills = await portfolioService.getFeaturedSkills()
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
 * Actualiza skills destacadas
 */
export const updateFeaturedSkills = createAsyncThunk(
    'portfolio/updateFeaturedSkills',
    async (skills, { rejectWithValue }) => {
        try {
            const validation = validateSkills(skills)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Skills inválidas',
                    errors: validation.errors
                })
            }

            const updatedSkills = await portfolioService.updateFeaturedSkills(skills)
            return updatedSkills
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Actualiza configuración del portfolio
 */
export const updatePortfolioSettings = createAsyncThunk(
    'portfolio/updatePortfolioSettings',
    async (settings, { rejectWithValue }) => {
        try {
            const validation = validatePortfolioSettings(settings)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Configuración inválida',
                    errors: validation.errors
                })
            }

            const updatedSettings = await portfolioService.updateSettings(settings)
            return updatedSettings
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Sube imagen para portfolio
 */
export const uploadPortfolioImage = createAsyncThunk(
    'portfolio/uploadPortfolioImage',
    async ({ file, type, onProgress }, { rejectWithValue }) => {
        try {
            const result = await portfolioService.uploadImage(file, type, onProgress)
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
 * Publica/actualiza portfolio en línea
 */
export const publishPortfolio = createAsyncThunk(
    'portfolio/publishPortfolio',
    async (options = {}, { rejectWithValue }) => {
        try {
            const result = await portfolioService.publishPortfolio(options)
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
 * Obtiene estadísticas del portfolio
 */
export const fetchPortfolioStats = createAsyncThunk(
    'portfolio/fetchPortfolioStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await portfolioService.getPortfolioStats()
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
 * Obtiene vista previa del portfolio
 */
export const fetchPortfolioPreview = createAsyncThunk(
    'portfolio/fetchPortfolioPreview',
    async (options = {}, { rejectWithValue }) => {
        try {
            const preview = await portfolioService.getPortfolioPreview(options)
            return preview
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Genera enlace personalizado del portfolio
 */
export const generateCustomLink = createAsyncThunk(
    'portfolio/generateCustomLink',
    async (username, { rejectWithValue }) => {
        try {
            const result = await portfolioService.generateCustomLink(username)
            return result
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
 * Valida datos de proyecto
 */
const validateProject = (projectData, isUpdate = false) => {
    const errors = []

    if (!isUpdate) {
        if (!projectData.title || projectData.title.trim().length === 0) {
            errors.push('Título del proyecto requerido')
        }

        if (projectData.title && projectData.title.length > VALIDATION_RULES.PROJECT.TITLE.MAX_LENGTH) {
            errors.push(VALIDATION_RULES.PROJECT.TITLE.MESSAGE.LENGTH)
        }
    }

    if (projectData.description && projectData.description.length > VALIDATION_RULES.PROJECT.DESCRIPTION.MAX_LENGTH) {
        errors.push(VALIDATION_RULES.PROJECT.DESCRIPTION.MESSAGE.LENGTH)
    }

    if (projectData.technologies && projectData.technologies.length > 20) {
        errors.push('Máximo 20 tecnologías por proyecto')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida datos de experiencia
 */
const validateExperience = (experienceData) => {
    const errors = []

    if (!experienceData.title || experienceData.title.trim().length === 0) {
        errors.push('Título del puesto requerido')
    }

    if (!experienceData.company || experienceData.company.trim().length === 0) {
        errors.push('Nombre de la empresa requerido')
    }

    if (!experienceData.startDate) {
        errors.push('Fecha de inicio requerida')
    }

    if (experienceData.startDate && experienceData.endDate) {
        const start = new Date(experienceData.startDate)
        const end = new Date(experienceData.endDate)
        
        if (end < start) {
            errors.push('La fecha de fin no puede ser anterior a la fecha de inicio')
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida datos de educación
 */
const validateEducation = (educationData) => {
    const errors = []

    if (!educationData.institution || educationData.institution.trim().length === 0) {
        errors.push('Nombre de la institución requerido')
    }

    if (!educationData.degree || educationData.degree.trim().length === 0) {
        errors.push('Título obtenido requerido')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida datos de certificación
 */
const validateCertification = (certificationData) => {
    const errors = []

    if (!certificationData.name || certificationData.name.trim().length === 0) {
        errors.push('Nombre de la certificación requerido')
    }

    if (!certificationData.issuer || certificationData.issuer.trim().length === 0) {
        errors.push('Emisor de la certificación requerido')
    }

    if (!certificationData.issueDate) {
        errors.push('Fecha de emisión requerida')
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

    if (skills.length > 15) {
        errors.push('Máximo 15 skills destacadas')
    }

    skills.forEach((skill, index) => {
        if (!skill.name || skill.name.trim().length === 0) {
            errors.push(`Skill ${index + 1}: nombre requerido`)
        }

        if (skill.name && skill.name.length > 50) {
            errors.push(`Skill ${index + 1}: nombre demasiado largo`)
        }

        if (skill.proficiency && (skill.proficiency < 0 || skill.proficiency > 100)) {
            errors.push(`Skill ${index + 1}: proficiency debe estar entre 0 y 100`)
        }
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida configuración del portfolio
 */
const validatePortfolioSettings = (settings) => {
    const errors = []

    if (settings.customUrl) {
        const urlRegex = /^[a-z0-9-]+$/
        if (!urlRegex.test(settings.customUrl)) {
            errors.push('URL personalizada solo puede contener letras minúsculas, números y guiones')
        }

        if (settings.customUrl.length < 3 || settings.customUrl.length > 30) {
            errors.push('URL personalizada debe tener entre 3 y 30 caracteres')
        }
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
    // Proyectos
    projects: projectsAdapter.getInitialState(),
    projectFilters: {},
    currentProject: null,
    projectsStatus: LOADING_STATES.IDLE,
    projectsError: null,

    // Experiencias laborales
    experiences: experiencesAdapter.getInitialState(),
    experiencesStatus: LOADING_STATES.IDLE,
    experiencesError: null,

    // Educación
    education: educationAdapter.getInitialState(),
    educationStatus: LOADING_STATES.IDLE,
    educationError: null,

    // Certificaciones
    certifications: certificationsAdapter.getInitialState(),
    certificationsStatus: LOADING_STATES.IDLE,
    certificationsError: null,

    // Skills destacadas
    featuredSkills: featuredSkillsAdapter.getInitialState(),
    featuredSkillsStatus: LOADING_STATES.IDLE,
    featuredSkillsError: null,

    // Configuración del portfolio
    settings: {
        theme: 'light',
        layout: 'standard',
        customUrl: null,
        isPublished: false,
        publishedAt: null,
        lastPublished: null,
        showContactForm: true,
        allowComments: true,
        analyticsEnabled: false,
        seo: {
            title: null,
            description: null,
            keywords: []
        }
    },
    settingsStatus: LOADING_STATES.IDLE,
    settingsError: null,

    // Subida de imágenes
    upload: {
        progress: 0,
        isUploading: false,
        currentType: null,
        error: null
    },

    // Vista previa
    preview: null,
    previewStatus: LOADING_STATES.IDLE,
    previewError: null,

    // Estadísticas
    stats: null,
    statsStatus: LOADING_STATES.IDLE,
    statsError: null,

    // Estado general
    status: LOADING_STATES.IDLE,
    error: null,
    lastUpdated: null,

    // Metadata
    meta: {
        totalProjects: 0,
        totalExperiences: 0,
        totalCertifications: 0,
        portfolioCompleteness: 0,
        lastProjectAdded: null,
        viewsCount: 0,
        contactRequests: 0
    }
}

// =============================================
// SLICE PRINCIPAL
// =============================================

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        // =============================================
        // REDUCERS SÍNCRONOS
        // =============================================

        /**
         * Establece proyecto actual
         */
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload
        },

        /**
         * Establece filtros de proyectos
         */
        setProjectFilters: (state, action) => {
            state.projectFilters = action.payload
        },

        /**
         * Agrega proyecto temporal (antes de guardar)
         */
        addTemporaryProject: (state, action) => {
            const project = {
                id: `temp_${Date.now()}`,
                ...action.payload,
                status: ProjectStatus.DRAFT,
                isTemporary: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            projectsAdapter.addOne(state.projects, project)
        },

        /**
         * Elimina proyecto temporal
         */
        removeTemporaryProject: (state, action) => {
            const projectId = action.payload
            const project = state.projects.entities[projectId]
            
            if (project && project.isTemporary) {
                projectsAdapter.removeOne(state.projects, projectId)
            }
        },

        /**
         * Actualiza proyecto temporal
         */
        updateTemporaryProject: (state, action) => {
            const { id, updates } = action.payload
            const project = state.projects.entities[id]
            
            if (project && project.isTemporary) {
                projectsAdapter.updateOne(state.projects, {
                    id,
                    changes: {
                        ...updates,
                        updatedAt: new Date().toISOString()
                    }
                })
            }
        },

        /**
         * Agrega experiencia temporal
         */
        addTemporaryExperience: (state, action) => {
            const experience = {
                id: `temp_exp_${Date.now()}`,
                ...action.payload,
                isTemporary: true
            }
            experiencesAdapter.addOne(state.experiences, experience)
        },

        /**
         * Agrega educación temporal
         */
        addTemporaryEducation: (state, action) => {
            const education = {
                id: `temp_edu_${Date.now()}`,
                ...action.payload,
                isTemporary: true
            }
            educationAdapter.addOne(state.education, education)
        },

        /**
         * Agrega certificación temporal
         */
        addTemporaryCertification: (state, action) => {
            const certification = {
                id: `temp_cert_${Date.now()}`,
                ...action.payload,
                isTemporary: true
            }
            certificationsAdapter.addOne(state.certifications, certification)
        },

        /**
         * Agrega skill temporal
         */
        addTemporarySkill: (state, action) => {
            const skill = {
                id: `temp_skill_${Date.now()}`,
                ...action.payload,
                isTemporary: true
            }
            featuredSkillsAdapter.addOne(state.featuredSkills, skill)
        },

        /**
         * Actualiza progreso de subida
         */
        setUploadProgress: (state, action) => {
            state.upload.progress = action.payload
            state.upload.isUploading = action.payload < 100
        },

        /**
         * Cancela subida
         */
        cancelUpload: (state) => {
            state.upload.progress = 0
            state.upload.isUploading = false
            state.upload.error = null
            state.upload.currentType = null
        },

        /**
         * Filtra proyectos por status
         */
        filterProjectsByStatus: (state, action) => {
            const status = action.payload
            state.projectFilters.status = status
        },

        /**
         * Filtra proyectos por visibilidad
         */
        filterProjectsByVisibility: (state, action) => {
            const visibility = action.payload
            state.projectFilters.visibility = visibility
        },

        /**
         * Ordena proyectos por criterio
         */
        sortProjectsBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.projects.sort = { field, direction }
        },

        /**
         * Ordena experiencias por criterio
         */
        sortExperiencesBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.experiences.sort = { field, direction }
        },

        /**
         * Actualiza configuración localmente
         */
        updateSettingsLocally: (state, action) => {
            state.settings = { ...state.settings, ...action.payload }
        },

        /**
         * Incrementa contador de visitas
         */
        incrementViews: (state) => {
            state.meta.viewsCount += 1
        },

        /**
         * Incrementa contador de solicitudes de contacto
         */
        incrementContactRequests: (state) => {
            state.meta.contactRequests += 1
        },

        /**
         * Actualiza completitud del portfolio
         */
        updatePortfolioCompleteness: (state) => {
            let score = 0
            
            // Proyectos (25%)
            if (state.meta.totalProjects > 0) score += 25
            
            // Experiencias (20%)
            if (state.meta.totalExperiences > 0) score += 20
            
            // Educación (15%)
            if (state.education.ids.length > 0) score += 15
            
            // Certificaciones (10%)
            if (state.certifications.ids.length > 0) score += 10
            
            // Skills destacadas (15%)
            if (state.featuredSkills.ids.length > 0) score += 15
            
            // Biografía/CV (15%)
            // Asumimos que si hay datos en meta, hay biografía
            if (state.meta.totalProjects > 0 || state.meta.totalExperiences > 0) {
                score += 15
            }
            
            state.meta.portfolioCompleteness = Math.min(score, 100)
        },

        /**
         * Limpia errores del portfolio
         */
        clearPortfolioError: (state) => {
            state.error = null
            state.projectsError = null
            state.experiencesError = null
            state.educationError = null
            state.certificationsError = null
            state.featuredSkillsError = null
            state.settingsError = null
            state.previewError = null
            state.statsError = null
            state.upload.error = null
            state.status = LOADING_STATES.IDLE
        },

        /**
         * Limpia datos temporales
         */
        clearTemporaryData: (state) => {
            // Eliminar proyectos temporales
            Object.keys(state.projects.entities).forEach(id => {
                if (state.projects.entities[id].isTemporary) {
                    projectsAdapter.removeOne(state.projects, id)
                }
            })

            // Eliminar experiencias temporales
            Object.keys(state.experiences.entities).forEach(id => {
                if (state.experiences.entities[id].isTemporary) {
                    experiencesAdapter.removeOne(state.experiences, id)
                }
            })

            // Eliminar educación temporal
            Object.keys(state.education.entities).forEach(id => {
                if (state.education.entities[id].isTemporary) {
                    educationAdapter.removeOne(state.education, id)
                }
            })

            // Eliminar certificaciones temporales
            Object.keys(state.certifications.entities).forEach(id => {
                if (state.certifications.entities[id].isTemporary) {
                    certificationsAdapter.removeOne(state.certifications, id)
                }
            })

            // Eliminar skills temporales
            Object.keys(state.featuredSkills.entities).forEach(id => {
                if (state.featuredSkills.entities[id].isTemporary) {
                    featuredSkillsAdapter.removeOne(state.featuredSkills, id)
                }
            })
        },

        /**
         * Resetea estado del portfolio
         */
        resetPortfolioState: () => {
            return initialState
        },

        /**
         * Simula evento de portfolio (para desarrollo)
         */
        simulatePortfolioEvent: (state, action) => {
            const { type, data } = action.payload

            switch (type) {
                case 'project_view':
                    state.meta.viewsCount += 1
                    break

                case 'project_added':
                    const newProject = {
                        id: `proj_sim_${Date.now()}`,
                        title: data.title || 'Proyecto de prueba',
                        description: data.description || 'Descripción del proyecto',
                        status: ProjectStatus.COMPLETED,
                        visibility: ProjectVisibility.PUBLIC,
                        technologies: data.technologies || ['React', 'TypeScript'],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                    projectsAdapter.addOne(state.projects, newProject)
                    state.meta.totalProjects += 1
                    break

                case 'portfolio_published':
                    state.settings.isPublished = true
                    state.settings.publishedAt = new Date().toISOString()
                    break
            }
        }
    },
    extraReducers: (builder) => {
        // =============================================
        // FETCH PORTFOLIO (completo)
        // =============================================
        builder
            .addCase(fetchPortfolio.pending, (state) => {
                state.status = LOADING_STATES.LOADING
                state.error = null
            })
            .addCase(fetchPortfolio.fulfilled, (state, action) => {
                const portfolio = action.payload
                
                // Actualizar todas las secciones
                if (portfolio.projects) {
                    projectsAdapter.setAll(state.projects, portfolio.projects)
                    state.meta.totalProjects = portfolio.projects.length
                }
                
                if (portfolio.experiences) {
                    experiencesAdapter.setAll(state.experiences, portfolio.experiences)
                    state.meta.totalExperiences = portfolio.experiences.length
                }
                
                if (portfolio.education) {
                    educationAdapter.setAll(state.education, portfolio.education)
                }
                
                if (portfolio.certifications) {
                    certificationsAdapter.setAll(state.certifications, portfolio.certifications)
                    state.meta.totalCertifications = portfolio.certifications.length
                }
                
                if (portfolio.featuredSkills) {
                    featuredSkillsAdapter.setAll(state.featuredSkills, portfolio.featuredSkills)
                }
                
                if (portfolio.settings) {
                    state.settings = portfolio.settings
                }
                
                if (portfolio.stats) {
                    state.stats = portfolio.stats
                    state.meta.viewsCount = portfolio.stats.views || 0
                    state.meta.contactRequests = portfolio.stats.contactRequests || 0
                }
                
                state.status = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()
                
                // Actualizar completitud
                updatePortfolioCompleteness(state)
                
                // Cachear portfolio
                cachePortfolioData(portfolio)
            })
            .addCase(fetchPortfolio.rejected, (state, action) => {
                state.status = LOADING_STATES.ERROR
                state.error = action.payload?.message || 'Error obteniendo portfolio'
                
                // Intentar cargar desde cache
                const cachedPortfolio = loadCachedPortfolioData()
                if (cachedPortfolio) {
                    // Similar a la lógica de éxito, pero con datos cacheados
                    if (cachedPortfolio.projects) {
                        projectsAdapter.setAll(state.projects, cachedPortfolio.projects)
                    }
                    // ... cargar otras secciones desde cache
                    
                    state.status = LOADING_STATES.SUCCESS
                }
            })

        // =============================================
        // FETCH PROJECTS
        // =============================================
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.projectsStatus = LOADING_STATES.LOADING
                state.projectsError = null
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                projectsAdapter.setAll(state.projects, action.payload)
                state.meta.totalProjects = action.payload.length
                state.projectsStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()
                
                updatePortfolioCompleteness(state)
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.projectsStatus = LOADING_STATES.ERROR
                state.projectsError = action.payload?.message || 'Error obteniendo proyectos'
            })

        // =============================================
        // CREATE PROJECT
        // =============================================
        builder
            .addCase(createProject.pending, (state) => {
                state.projectsStatus = LOADING_STATES.LOADING
            })
            .addCase(createProject.fulfilled, (state, action) => {
                projectsAdapter.addOne(state.projects, action.payload)
                state.meta.totalProjects += 1
                state.meta.lastProjectAdded = new Date().toISOString()
                state.projectsStatus = LOADING_STATES.SUCCESS
                
                updatePortfolioCompleteness(state)
            })
            .addCase(createProject.rejected, (state, action) => {
                state.projectsStatus = LOADING_STATES.ERROR
                state.projectsError = action.payload?.message || 'Error creando proyecto'
            })

        // =============================================
        // UPDATE PROJECT
        // =============================================
        builder
            .addCase(updateProject.fulfilled, (state, action) => {
                projectsAdapter.upsertOne(state.projects, action.payload)
                state.lastUpdated = new Date().toISOString()
            })

        // =============================================
        // DELETE PROJECT
        // =============================================
        builder
            .addCase(deleteProject.fulfilled, (state, action) => {
                const { projectId } = action.payload
                projectsAdapter.removeOne(state.projects, projectId)
                state.meta.totalProjects = Math.max(0, state.meta.totalProjects - 1)
                
                updatePortfolioCompleteness(state)
            })

        // =============================================
        // FETCH EXPERIENCES
        // =============================================
        builder
            .addCase(fetchExperiences.pending, (state) => {
                state.experiencesStatus = LOADING_STATES.LOADING
                state.experiencesError = null
            })
            .addCase(fetchExperiences.fulfilled, (state, action) => {
                experiencesAdapter.setAll(state.experiences, action.payload)
                state.meta.totalExperiences = action.payload.length
                state.experiencesStatus = LOADING_STATES.SUCCESS
                
                updatePortfolioCompleteness(state)
            })
            .addCase(fetchExperiences.rejected, (state, action) => {
                state.experiencesStatus = LOADING_STATES.ERROR
                state.experiencesError = action.payload?.message || 'Error obteniendo experiencias'
            })

        // =============================================
        // ADD EXPERIENCE
        // =============================================
        builder
            .addCase(addExperience.fulfilled, (state, action) => {
                experiencesAdapter.addOne(state.experiences, action.payload)
                state.meta.totalExperiences += 1
                
                updatePortfolioCompleteness(state)
            })

        // =============================================
        // FETCH EDUCATION
        // =============================================
        builder
            .addCase(fetchEducation.pending, (state) => {
                state.educationStatus = LOADING_STATES.LOADING
                state.educationError = null
            })
            .addCase(fetchEducation.fulfilled, (state, action) => {
                educationAdapter.setAll(state.education, action.payload)
                state.educationStatus = LOADING_STATES.SUCCESS
                
                updatePortfolioCompleteness(state)
            })
            .addCase(fetchEducation.rejected, (state, action) => {
                state.educationStatus = LOADING_STATES.ERROR
                state.educationError = action.payload?.message || 'Error obteniendo educación'
            })

        // =============================================
        // ADD EDUCATION
        // =============================================
        builder
            .addCase(addEducation.fulfilled, (state, action) => {
                educationAdapter.addOne(state.education, action.payload)
                updatePortfolioCompleteness(state)
            })

        // =============================================
        // FETCH CERTIFICATIONS
        // =============================================
        builder
            .addCase(fetchCertifications.pending, (state) => {
                state.certificationsStatus = LOADING_STATES.LOADING
                state.certificationsError = null
            })
            .addCase(fetchCertifications.fulfilled, (state, action) => {
                certificationsAdapter.setAll(state.certifications, action.payload)
                state.meta.totalCertifications = action.payload.length
                state.certificationsStatus = LOADING_STATES.SUCCESS
                
                updatePortfolioCompleteness(state)
            })
            .addCase(fetchCertifications.rejected, (state, action) => {
                state.certificationsStatus = LOADING_STATES.ERROR
                state.certificationsError = action.payload?.message || 'Error obteniendo certificaciones'
            })

        // =============================================
        // ADD CERTIFICATION
        // =============================================
        builder
            .addCase(addCertification.fulfilled, (state, action) => {
                certificationsAdapter.addOne(state.certifications, action.payload)
                state.meta.totalCertifications += 1
                
                updatePortfolioCompleteness(state)
            })

        // =============================================
        // FETCH FEATURED SKILLS
        // =============================================
        builder
            .addCase(fetchFeaturedSkills.pending, (state) => {
                state.featuredSkillsStatus = LOADING_STATES.LOADING
                state.featuredSkillsError = null
            })
            .addCase(fetchFeaturedSkills.fulfilled, (state, action) => {
                featuredSkillsAdapter.setAll(state.featuredSkills, action.payload)
                state.featuredSkillsStatus = LOADING_STATES.SUCCESS
                
                updatePortfolioCompleteness(state)
            })
            .addCase(fetchFeaturedSkills.rejected, (state, action) => {
                state.featuredSkillsStatus = LOADING_STATES.ERROR
                state.featuredSkillsError = action.payload?.message || 'Error obteniendo skills destacadas'
            })

        // =============================================
        // UPDATE FEATURED SKILLS
        // =============================================
        builder
            .addCase(updateFeaturedSkills.pending, (state) => {
                state.featuredSkillsStatus = LOADING_STATES.LOADING
            })
            .addCase(updateFeaturedSkills.fulfilled, (state, action) => {
                featuredSkillsAdapter.setAll(state.featuredSkills, action.payload)
                state.featuredSkillsStatus = LOADING_STATES.SUCCESS
            })

        // =============================================
        // UPDATE PORTFOLIO SETTINGS
        // =============================================
        builder
            .addCase(updatePortfolioSettings.pending, (state) => {
                state.settingsStatus = LOADING_STATES.LOADING
                state.settingsError = null
            })
            .addCase(updatePortfolioSettings.fulfilled, (state, action) => {
                state.settings = action.payload
                state.settingsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(updatePortfolioSettings.rejected, (state, action) => {
                state.settingsStatus = LOADING_STATES.ERROR
                state.settingsError = action.payload?.message || 'Error actualizando configuración'
            })

        // =============================================
        // UPLOAD PORTFOLIO IMAGE
        // =============================================
        builder
            .addCase(uploadPortfolioImage.pending, (state, action) => {
                const { type } = action.meta.arg
                state.upload.isUploading = true
                state.upload.progress = 0
                state.upload.currentType = type
                state.upload.error = null
            })
            .addCase(uploadPortfolioImage.fulfilled, (state, action) => {
                state.upload.isUploading = false
                state.upload.progress = 100
                state.upload.currentType = null
            })
            .addCase(uploadPortfolioImage.rejected, (state, action) => {
                state.upload.isUploading = false
                state.upload.error = action.payload?.message || 'Error subiendo imagen'
            })

        // =============================================
        // PUBLISH PORTFOLIO
        // =============================================
        builder
            .addCase(publishPortfolio.pending, (state) => {
                state.settingsStatus = LOADING_STATES.LOADING
            })
            .addCase(publishPortfolio.fulfilled, (state, action) => {
                state.settings.isPublished = true
                state.settings.publishedAt = new Date().toISOString()
                state.settings.lastPublished = new Date().toISOString()
                state.settingsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(publishPortfolio.rejected, (state, action) => {
                state.settingsStatus = LOADING_STATES.ERROR
                state.settingsError = action.payload?.message || 'Error publicando portfolio'
            })

        // =============================================
        // FETCH PORTFOLIO STATS
        // =============================================
        builder
            .addCase(fetchPortfolioStats.pending, (state) => {
                state.statsStatus = LOADING_STATES.LOADING
                state.statsError = null
            })
            .addCase(fetchPortfolioStats.fulfilled, (state, action) => {
                state.stats = action.payload
                state.statsStatus = LOADING_STATES.SUCCESS
                
                // Actualizar metadata con estadísticas
                if (action.payload.views) {
                    state.meta.viewsCount = action.payload.views
                }
                
                if (action.payload.contactRequests) {
                    state.meta.contactRequests = action.payload.contactRequests
                }
            })
            .addCase(fetchPortfolioStats.rejected, (state, action) => {
                state.statsStatus = LOADING_STATES.ERROR
                state.statsError = action.payload?.message || 'Error obteniendo estadísticas'
            })

        // =============================================
        // FETCH PORTFOLIO PREVIEW
        // =============================================
        builder
            .addCase(fetchPortfolioPreview.pending, (state) => {
                state.previewStatus = LOADING_STATES.LOADING
                state.previewError = null
            })
            .addCase(fetchPortfolioPreview.fulfilled, (state, action) => {
                state.preview = action.payload
                state.previewStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchPortfolioPreview.rejected, (state, action) => {
                state.previewStatus = LOADING_STATES.ERROR
                state.previewError = action.payload?.message || 'Error obteniendo vista previa'
            })

        // =============================================
        // GENERATE CUSTOM LINK
        // =============================================
        builder
            .addCase(generateCustomLink.fulfilled, (state, action) => {
                state.settings.customUrl = action.payload.customUrl
            })
    }
})

// =============================================
// FUNCIONES DE CACHE
// =============================================

/**
 * Cachea datos del portfolio en localStorage
 */
const cachePortfolioData = (portfolio) => {
    try {
        const cacheData = {
            ...portfolio,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + CACHE_CONFIG.TTL.MEDIUM
        }
        localStorage.setItem(STORAGE_KEYS.CACHED_PORTFOLIO, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando datos del portfolio:', error)
    }
}

/**
 * Carga datos del portfolio desde cache
 */
const loadCachedPortfolioData = () => {
    try {
        const cached = localStorage.getItem(STORAGE_KEYS.CACHED_PORTFOLIO)
        if (!cached) return null

        const cacheData = JSON.parse(cached)

        // Verificar expiración
        if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
            localStorage.removeItem(STORAGE_KEYS.CACHED_PORTFOLIO)
            return null
        }

        // Eliminar metadatos de cache
        delete cacheData._cachedAt
        delete cacheData._expiresAt

        return cacheData
    } catch (error) {
        console.warn('Error cargando portfolio desde cache:', error)
        return null
    }
}

// =============================================
// SELECTORS
// =============================================

// Selectores básicos
export const selectPortfolioState = (state) => state.portfolio
export const selectProjectsState = (state) => state.portfolio.projects
export const selectCurrentProject = (state) => state.portfolio.currentProject
export const selectProjectFilters = (state) => state.portfolio.projectFilters
export const selectExperiencesState = (state) => state.portfolio.experiences
export const selectEducationState = (state) => state.portfolio.education
export const selectCertificationsState = (state) => state.portfolio.certifications
export const selectFeaturedSkillsState = (state) => state.portfolio.featuredSkills
export const selectPortfolioSettings = (state) => state.portfolio.settings
export const selectPortfolioUpload = (state) => state.portfolio.upload
export const selectPortfolioPreview = (state) => state.portfolio.preview
export const selectPortfolioStats = (state) => state.portfolio.stats
export const selectPortfolioMeta = (state) => state.portfolio.meta
export const selectPortfolioStatus = (state) => state.portfolio.status
export const selectPortfolioError = (state) => state.portfolio.error

// Selectores de entity adapters
export const {
    selectAll: selectAllProjects,
    selectById: selectProjectById,
    selectIds: selectProjectIds,
    selectTotal: selectTotalProjects
} = projectsAdapter.getSelectors((state) => state.portfolio.projects)

export const {
    selectAll: selectAllExperiences,
    selectById: selectExperienceById,
    selectIds: selectExperienceIds,
    selectTotal: selectTotalExperiences
} = experiencesAdapter.getSelectors((state) => state.portfolio.experiences)

export const {
    selectAll: selectAllEducation,
    selectById: selectEducationById,
    selectIds: selectEducationIds,
    selectTotal: selectTotalEducation
} = educationAdapter.getSelectors((state) => state.portfolio.education)

export const {
    selectAll: selectAllCertifications,
    selectById: selectCertificationById,
    selectIds: selectCertificationIds,
    selectTotal: selectTotalCertifications
} = certificationsAdapter.getSelectors((state) => state.portfolio.certifications)

export const {
    selectAll: selectAllFeaturedSkills,
    selectById: selectFeaturedSkillById,
    selectIds: selectFeaturedSkillIds,
    selectTotal: selectTotalFeaturedSkills
} = featuredSkillsAdapter.getSelectors((state) => state.portfolio.featuredSkills)

// Selectores derivados
export const selectProjectsByStatus = (status) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => project.status === status)
}

export const selectProjectsByVisibility = (visibility) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => project.visibility === visibility)
}

export const selectPublicProjects = (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => 
        project.visibility === ProjectVisibility.PUBLIC && 
        project.status === ProjectStatus.COMPLETED
    )
}

export const selectDraftProjects = (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => 
        project.status === ProjectStatus.DRAFT
    )
}

export const selectCompletedProjects = (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => 
        project.status === ProjectStatus.COMPLETED
    )
}

export const selectInProgressProjects = (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => 
        project.status === ProjectStatus.IN_PROGRESS
    )
}

export const selectProjectsByTechnology = (technology) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => 
        project.technologies && project.technologies.includes(technology)
    )
}

export const selectRecentProjects = (limit = 5) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.slice(0, limit)
}

export const selectExperiencesByCompany = (company) => (state) => {
    const allExperiences = selectAllExperiences(state)
    return allExperiences.filter(exp => exp.company === company)
}

export const selectCurrentExperiences = (state) => {
    const allExperiences = selectAllExperiences(state)
    return allExperiences.filter(exp => exp.current)
}

export const selectExperiencesByDuration = (minMonths = 0) => (state) => {
    const allExperiences = selectAllExperiences(state)
    return allExperiences.filter(exp => {
        const start = new Date(exp.startDate)
        const end = exp.endDate ? new Date(exp.endDate) : new Date()
        const months = (end - start) / (1000 * 60 * 60 * 24 * 30)
        return months >= minMonths
    })
}

export const selectCertificationsByIssuer = (issuer) => (state) => {
    const allCertifications = selectAllCertifications(state)
    return allCertifications.filter(cert => cert.issuer === issuer)
}

export const selectRecentCertifications = (limit = 3) => (state) => {
    const allCertifications = selectAllCertifications(state)
    return [...allCertifications]
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
        .slice(0, limit)
}

export const selectTopFeaturedSkills = (limit = 6) => (state) => {
    const allFeaturedSkills = selectAllFeaturedSkills(state)
    return [...allFeaturedSkills]
        .sort((a, b) => b.proficiency - a.proficiency)
        .slice(0, limit)
}

export const selectPortfolioCompleteness = (state) => {
    return state.portfolio.meta.portfolioCompleteness
}

export const selectIsPortfolioPublished = (state) => {
    return state.portfolio.settings.isPublished
}

export const selectPortfolioCustomUrl = (state) => {
    return state.portfolio.settings.customUrl
}

export const selectPortfolioAnalytics = (state) => {
    const stats = selectPortfolioStats(state)
    const meta = selectPortfolioMeta(state)
    
    return {
        views: stats?.views || meta.viewsCount || 0,
        contactRequests: stats?.contactRequests || meta.contactRequests || 0,
        projects: meta.totalProjects || 0,
        experiences: meta.totalExperiences || 0,
        certifications: meta.totalCertifications || 0
    }
}

export const selectPortfolioSEO = (state) => {
    return state.portfolio.settings.seo || {}
}

export const selectPortfolioTheme = (state) => {
    return state.portfolio.settings.theme || 'light'
}

export const selectPortfolioLayout = (state) => {
    return state.portfolio.settings.layout || 'standard'
}

// =============================================
// EXPORTACIONES
// =============================================

// Exportar acciones
export const {
    setCurrentProject,
    setProjectFilters,
    addTemporaryProject,
    removeTemporaryProject,
    updateTemporaryProject,
    addTemporaryExperience,
    addTemporaryEducation,
    addTemporaryCertification,
    addTemporarySkill,
    setUploadProgress,
    cancelUpload,
    filterProjectsByStatus,
    filterProjectsByVisibility,
    sortProjectsBy,
    sortExperiencesBy,
    updateSettingsLocally,
    incrementViews,
    incrementContactRequests,
    updatePortfolioCompleteness,
    clearPortfolioError,
    clearTemporaryData,
    resetPortfolioState,
    simulatePortfolioEvent
} = portfolioSlice.actions

// Exportar thunks
export {
    fetchPortfolio,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchExperiences,
    addExperience,
    fetchEducation,
    addEducation,
    fetchCertifications,
    addCertification,
    fetchFeaturedSkills,
    updateFeaturedSkills,
    updatePortfolioSettings,
    uploadPortfolioImage,
    publishPortfolio,
    fetchPortfolioStats,
    fetchPortfolioPreview,
    generateCustomLink
}

// Exportar reducer
export default portfolioSlice.reducer

// Exportar tipos
/**
 * @typedef {Object} PortfolioState
 * @property {Object} projects
 * @property {Object} projectFilters
 * @property {Object|null} currentProject
 * @property {string} projectsStatus
 * @property {string|null} projectsError
 * @property {Object} experiences
 * @property {string} experiencesStatus
 * @property {string|null} experiencesError
 * @property {Object} education
 * @property {string} educationStatus
 * @property {string|null} educationError
 * @property {Object} certifications
 * @property {string} certificationsStatus
 * @property {string|null} certificationsError
 * @property {Object} featuredSkills
 * @property {string} featuredSkillsStatus
 * @property {string|null} featuredSkillsError
 * @property {Object} settings
 * @property {string} settingsStatus
 * @property {string|null} settingsError
 * @property {Object} upload
 * @property {Object|null} preview
 * @property {string} previewStatus
 * @property {string|null} previewError
 * @property {Object|null} stats
 * @property {string} statsStatus
 * @property {string|null} statsError
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastUpdated
 * @property {Object} meta
 */