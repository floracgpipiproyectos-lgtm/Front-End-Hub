// store/slices/projectsSlice.js
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { projectsService } from '@/api/services'
import {
    API_CONFIG,
    STORAGE_KEYS,
    LOADING_STATES,
    CACHE_CONFIG
} from '@/constants/apiConfig'
import { VALIDATION_RULES, VALIDATION_HELPERS } from '@/constants/validationRules'
import {
    ProjectStatus,
    ProjectDifficulty,
    ProjectVisibility,
    ProjectType,
    TaskStatus,
    TaskPriority,
    CollaborationRole
} from '@/api/services/projectsService'

// =============================================
// ADAPTERS Y NORMALIZACIÓN
// =============================================

// Entity adapter para proyectos
const projectsAdapter = createEntityAdapter({
    selectId: (project) => project.id,
    sortComparer: (a, b) => {
        // Ordenar por prioridad: activos primero, luego por fecha de creación
        const priorityOrder = {
            [ProjectStatus.ACTIVE]: 5,
            [ProjectStatus.IN_PROGRESS]: 4,
            [ProjectStatus.PLANNING]: 3,
            [ProjectStatus.ON_HOLD]: 2,
            [ProjectStatus.COMPLETED]: 1,
            [ProjectStatus.ARCHIVED]: 0
        }
        return (priorityOrder[b.status] || 0) - (priorityOrder[a.status] || 0) ||
            new Date(b.createdAt) - new Date(a.createdAt)
    }
})

// Entity adapter para tareas
const tasksAdapter = createEntityAdapter({
    selectId: (task) => task.id,
    sortComparer: (a, b) => {
        // Ordenar por prioridad, estado y fecha de vencimiento
        const priorityOrder = {
            [TaskPriority.URGENT]: 4,
            [TaskPriority.HIGH]: 3,
            [TaskPriority.MEDIUM]: 2,
            [TaskPriority.LOW]: 1
        }
        const statusOrder = {
            [TaskStatus.TODO]: 4,
            [TaskStatus.IN_PROGRESS]: 3,
            [TaskStatus.REVIEW]: 2,
            [TaskStatus.COMPLETED]: 1,
            [TaskStatus.BLOCKED]: 0
        }
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0) ||
            (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0) ||
            new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31')
    }
})

// Entity adapter para miembros del proyecto
const membersAdapter = createEntityAdapter({
    selectId: (member) => member.userId,
    sortComparer: (a, b) => {
        // Ordenar por rol (owner primero) y luego por fecha de unión
        const roleOrder = {
            [CollaborationRole.OWNER]: 4,
            [CollaborationRole.ADMIN]: 3,
            [CollaborationRole.CONTRIBUTOR]: 2,
            [CollaborationRole.VIEWER]: 1
        }
        return (roleOrder[b.role] || 0) - (roleOrder[a.role] || 0) ||
            new Date(a.joinedAt) - new Date(b.joinedAt)
    }
})

// Entity adapter para discusiones/comentarios
const discussionsAdapter = createEntityAdapter({
    selectId: (discussion) => discussion.id,
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Más reciente primero
})

// Entity adapter para archivos adjuntos
const attachmentsAdapter = createEntityAdapter({
    selectId: (attachment) => attachment.id,
    sortComparer: (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
})

// =============================================
// ASYNC THUNKS
// =============================================

/**
 * Obtiene todos los proyectos del usuario
 */
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (options = {}, { rejectWithValue }) => {
        try {
            const projects = await projectsService.getProjects(options)
            return { projects, options }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene un proyecto específico por ID
 */
export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (projectId, { rejectWithValue }) => {
        try {
            const project = await projectsService.getProjectById(projectId)
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
 * Crea un nuevo proyecto
 */
export const createProject = createAsyncThunk(
    'projects/createProject',
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

            const project = await projectsService.createProject(projectData)
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
    'projects/updateProject',
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

            const updatedProject = await projectsService.updateProject(id, updateData)
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
    'projects/deleteProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const result = await projectsService.deleteProject(projectId)
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
 * Obtiene tareas de un proyecto
 */
export const fetchProjectTasks = createAsyncThunk(
    'projects/fetchProjectTasks',
    async ({ projectId, options = {} }, { rejectWithValue }) => {
        try {
            const tasks = await projectsService.getProjectTasks(projectId, options)
            return { projectId, tasks, options }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Crea una nueva tarea
 */
export const createTask = createAsyncThunk(
    'projects/createTask',
    async ({ projectId, taskData }, { rejectWithValue }) => {
        try {
            // Validar tarea
            const validation = validateTask(taskData)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Tarea inválida',
                    errors: validation.errors
                })
            }

            const task = await projectsService.createTask(projectId, taskData)
            return { projectId, task }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Actualiza una tarea existente
 */
export const updateTask = createAsyncThunk(
    'projects/updateTask',
    async ({ projectId, taskId, updateData }, { rejectWithValue }) => {
        try {
            const updatedTask = await projectsService.updateTask(projectId, taskId, updateData)
            return { projectId, taskId, task: updatedTask }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Elimina una tarea
 */
export const deleteTask = createAsyncThunk(
    'projects/deleteTask',
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            const result = await projectsService.deleteTask(projectId, taskId)
            return { projectId, taskId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene miembros de un proyecto
 */
export const fetchProjectMembers = createAsyncThunk(
    'projects/fetchProjectMembers',
    async (projectId, { rejectWithValue }) => {
        try {
            const members = await projectsService.getProjectMembers(projectId)
            return { projectId, members }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Invita a un usuario a un proyecto
 */
export const inviteToProject = createAsyncThunk(
    'projects/inviteToProject',
    async ({ projectId, userId, role = CollaborationRole.CONTRIBUTOR }, { rejectWithValue }) => {
        try {
            const invitation = await projectsService.inviteToProject(projectId, userId, role)
            return { projectId, invitation }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Acepta invitación a un proyecto
 */
export const acceptProjectInvitation = createAsyncThunk(
    'projects/acceptProjectInvitation',
    async (invitationId, { rejectWithValue }) => {
        try {
            const result = await projectsService.acceptInvitation(invitationId)
            return { invitationId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Cambia rol de un miembro
 */
export const updateMemberRole = createAsyncThunk(
    'projects/updateMemberRole',
    async ({ projectId, userId, newRole }, { rejectWithValue }) => {
        try {
            const member = await projectsService.updateMemberRole(projectId, userId, newRole)
            return { projectId, userId, member }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Elimina miembro de un proyecto
 */
export const removeProjectMember = createAsyncThunk(
    'projects/removeProjectMember',
    async ({ projectId, userId }, { rejectWithValue }) => {
        try {
            const result = await projectsService.removeMember(projectId, userId)
            return { projectId, userId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene discusiones de un proyecto
 */
export const fetchProjectDiscussions = createAsyncThunk(
    'projects/fetchProjectDiscussions',
    async ({ projectId, options = {} }, { rejectWithValue }) => {
        try {
            const discussions = await projectsService.getDiscussions(projectId, options)
            return { projectId, discussions, options }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Crea nueva discusión/comentario
 */
export const createDiscussion = createAsyncThunk(
    'projects/createDiscussion',
    async ({ projectId, discussionData }, { rejectWithValue }) => {
        try {
            const discussion = await projectsService.createDiscussion(projectId, discussionData)
            return { projectId, discussion }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene archivos adjuntos de un proyecto
 */
export const fetchProjectAttachments = createAsyncThunk(
    'projects/fetchProjectAttachments',
    async (projectId, { rejectWithValue }) => {
        try {
            const attachments = await projectsService.getAttachments(projectId)
            return { projectId, attachments }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Sube archivo adjunto
 */
export const uploadAttachment = createAsyncThunk(
    'projects/uploadAttachment',
    async ({ projectId, file, metadata, onProgress }, { rejectWithValue }) => {
        try {
            // Validar archivo
            const validation = validateAttachment(file)
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Archivo inválido',
                    errors: validation.errors
                })
            }

            const attachment = await projectsService.uploadAttachment(
                projectId,
                file,
                metadata,
                onProgress
            )
            return { projectId, attachment }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Elimina archivo adjunto
 */
export const deleteAttachment = createAsyncThunk(
    'projects/deleteAttachment',
    async ({ projectId, attachmentId }, { rejectWithValue }) => {
        try {
            const result = await projectsService.deleteAttachment(projectId, attachmentId)
            return { projectId, attachmentId, ...result }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene estadísticas de proyecto
 */
export const fetchProjectStats = createAsyncThunk(
    'projects/fetchProjectStats',
    async (projectId, { rejectWithValue }) => {
        try {
            const stats = await projectsService.getProjectStats(projectId)
            return { projectId, stats }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Busca proyectos
 */
export const searchProjects = createAsyncThunk(
    'projects/searchProjects',
    async (searchParams, { rejectWithValue }) => {
        try {
            const results = await projectsService.searchProjects(searchParams)
            return { results, searchParams }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Obtiene proyectos recomendados
 */
export const fetchRecommendedProjects = createAsyncThunk(
    'projects/fetchRecommendedProjects',
    async (options = {}, { rejectWithValue }) => {
        try {
            const projects = await projectsService.getRecommendedProjects(options)
            return { projects, options }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Clona un proyecto existente
 */
export const cloneProject = createAsyncThunk(
    'projects/cloneProject',
    async ({ projectId, cloneOptions }, { rejectWithValue }) => {
        try {
            const clonedProject = await projectsService.cloneProject(projectId, cloneOptions)
            return { originalId: projectId, clonedProject }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Exporta proyecto a formato específico
 */
export const exportProject = createAsyncThunk(
    'projects/exportProject',
    async ({ projectId, format = 'json' }, { rejectWithValue }) => {
        try {
            const exportData = await projectsService.exportProject(projectId, format)
            return { projectId, format, exportData }
        } catch (error) {
            return rejectWithValue({
                message: error.message,
                code: error.response?.status
            })
        }
    }
)

/**
 * Importa proyecto desde archivo
 */
export const importProject = createAsyncThunk(
    'projects/importProject',
    async ({ file, importOptions }, { rejectWithValue }) => {
        try {
            const project = await projectsService.importProject(file, importOptions)
            return { project, importOptions }
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

    if (projectData.description && projectData.description.length > 2000) {
        errors.push('Descripción no puede exceder 2000 caracteres')
    }

    if (projectData.tags && projectData.tags.length > 15) {
        errors.push('Máximo 15 tags por proyecto')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida datos de tarea
 */
const validateTask = (taskData) => {
    const errors = []

    if (!taskData.title || taskData.title.trim().length === 0) {
        errors.push('Título de la tarea requerido')
    }

    if (taskData.title && taskData.title.length > 200) {
        errors.push('Título de tarea no puede exceder 200 caracteres')
    }

    if (taskData.dueDate) {
        const dueDate = new Date(taskData.dueDate)
        const today = new Date()
        if (dueDate < today.setHours(0, 0, 0, 0)) {
            errors.push('Fecha de vencimiento no puede ser en el pasado')
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida archivo adjunto
 */
const validateAttachment = (file) => {
    const errors = []

    if (!file) {
        errors.push('No se proporcionó archivo')
        return { isValid: false, errors }
    }

    // Validar tamaño máximo (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
        errors.push(`Archivo demasiado grande. Máximo: ${VALIDATION_HELPERS.getFileSizeReadable(maxSize)}`)
    }

    // Validar tipos permitidos
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf',
        'text/plain', 'text/markdown',
        'application/zip', 'application/x-rar-compressed',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
        errors.push('Tipo de archivo no permitido')
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
    // Proyectos principales
    projects: projectsAdapter.getInitialState(),
    currentProject: null,
    projectFilters: {},
    projectsStatus: LOADING_STATES.IDLE,
    projectsError: null,

    // Tareas del proyecto actual
    tasks: tasksAdapter.getInitialState(),
    taskFilters: {},
    currentTask: null,
    tasksStatus: LOADING_STATES.IDLE,
    tasksError: null,

    // Miembros del proyecto actual
    members: membersAdapter.getInitialState(),
    invitations: [],
    membersStatus: LOADING_STATES.IDLE,
    membersError: null,

    // Discusiones del proyecto actual
    discussions: discussionsAdapter.getInitialState(),
    currentDiscussion: null,
    discussionsStatus: LOADING_STATES.IDLE,
    discussionsError: null,

    // Archivos adjuntos del proyecto actual
    attachments: attachmentsAdapter.getInitialState(),
    uploadProgress: 0,
    isUploading: false,
    attachmentsStatus: LOADING_STATES.IDLE,
    attachmentsError: null,

    // Estadísticas y búsqueda
    projectStats: null,
    searchResults: [],
    searchParams: {},
    recommendedProjects: [],
    statsStatus: LOADING_STATES.IDLE,
    searchStatus: LOADING_STATES.IDLE,
    statsError: null,
    searchError: null,

    // Estado general
    status: LOADING_STATES.IDLE,
    error: null,
    lastUpdated: null,

    // Metadata
    meta: {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalCollaborators: 0,
        totalAttachments: 0,
        lastActivity: null,
        productivityScore: 0,
        collaborationScore: 0
    }
}

// =============================================
// SLICE PRINCIPAL
// =============================================

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        // =============================================
        // REDUCERS SÍNCRONOS
        // =============================================

        /**
         * Establece proyecto actual
         */
        setCurrentProject: (state, action) => {
            const projectId = action.payload
            state.currentProject = projectId

            // Limpiar datos del proyecto anterior
            tasksAdapter.removeAll(state.tasks)
            membersAdapter.removeAll(state.members)
            discussionsAdapter.removeAll(state.discussions)
            attachmentsAdapter.removeAll(state.attachments)
            state.currentTask = null
            state.currentDiscussion = null
            state.projectStats = null
        },

        /**
         * Establece filtros de proyectos
         */
        setProjectFilters: (state, action) => {
            state.projectFilters = action.payload
        },

        /**
         * Establece filtros de tareas
         */
        setTaskFilters: (state, action) => {
            state.taskFilters = action.payload
        },

        /**
         * Establece tarea actual
         */
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload
        },

        /**
         * Establece discusión actual
         */
        setCurrentDiscussion: (state, action) => {
            state.currentDiscussion = action.payload
        },

        /**
         * Agrega proyecto temporal (antes de guardar)
         */
        addTemporaryProject: (state, action) => {
            const project = {
                id: `temp_${Date.now()}`,
                ...action.payload,
                status: ProjectStatus.PLANNING,
                isTemporary: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            projectsAdapter.addOne(state.projects, project)
        },

        /**
         * Agrega tarea temporal
         */
        addTemporaryTask: (state, action) => {
            const task = {
                id: `temp_task_${Date.now()}`,
                ...action.payload,
                status: TaskStatus.TODO,
                isTemporary: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            tasksAdapter.addOne(state.tasks, task)
        },

        /**
         * Actualiza tarea localmente (para UI inmediata)
         */
        updateTaskLocally: (state, action) => {
            const { taskId, updates } = action.payload
            const task = state.tasks.entities[taskId]

            if (task) {
                const updatedTask = {
                    ...task,
                    ...updates,
                    updatedAt: new Date().toISOString()
                }

                tasksAdapter.upsertOne(state.tasks, updatedTask)

                // Actualizar estadísticas si cambia el estado
                if (updates.status && task.status !== updates.status) {
                    updateTaskCounters(state, task.status, updates.status)
                }
            }
        },

        /**
         * Elimina temporal
         */
        removeTemporaryItem: (state, action) => {
            const { type, id } = action.payload

            switch (type) {
                case 'project':
                    const project = state.projects.entities[id]
                    if (project && project.isTemporary) {
                        projectsAdapter.removeOne(state.projects, id)
                    }
                    break

                case 'task':
                    const task = state.tasks.entities[id]
                    if (task && task.isTemporary) {
                        tasksAdapter.removeOne(state.tasks, id)
                    }
                    break

                case 'attachment':
                    const attachment = state.attachments.entities[id]
                    if (attachment && attachment.isTemporary) {
                        attachmentsAdapter.removeOne(state.attachments, id)
                    }
                    break
            }
        },

        /**
         * Actualiza progreso de subida
         */
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload
            state.isUploading = action.payload < 100
        },

        /**
         * Cancela subida actual
         */
        cancelUpload: (state) => {
            state.uploadProgress = 0
            state.isUploading = false
        },

        /**
         * Agrega miembro localmente (para UI inmediata)
         */
        addMemberLocally: (state, action) => {
            const member = action.payload
            membersAdapter.upsertOne(state.members, member)
        },

        /**
         * Agrega discusión localmente (para UI inmediata)
         */
        addDiscussionLocally: (state, action) => {
            const discussion = action.payload
            discussionsAdapter.addOne(state.discussions, discussion)
        },

        /**
         * Filtra proyectos por estado
         */
        filterProjectsByStatus: (state, action) => {
            const status = action.payload
            state.projectFilters.status = status
        },

        /**
         * Filtra proyectos por dificultad
         */
        filterProjectsByDifficulty: (state, action) => {
            const difficulty = action.payload
            state.projectFilters.difficulty = difficulty
        },

        /**
         * Filtra proyectos por tipo
         */
        filterProjectsByType: (state, action) => {
            const type = action.payload
            state.projectFilters.type = type
        },

        /**
         * Filtra tareas por estado
         */
        filterTasksByStatus: (state, action) => {
            const status = action.payload
            state.taskFilters.status = status
        },

        /**
         * Filtra tareas por prioridad
         */
        filterTasksByPriority: (state, action) => {
            const priority = action.payload
            state.taskFilters.priority = priority
        },

        /**
         * Ordena proyectos por criterio
         */
        sortProjectsBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.projects.sort = { field, direction }
        },

        /**
         * Ordena tareas por criterio
         */
        sortTasksBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.tasks.sort = { field, direction }
        },

        /**
         * Ordena discusiones por criterio
         */
        sortDiscussionsBy: (state, action) => {
            const { field, direction = 'desc' } = action.payload
            state.discussions.sort = { field, direction }
        },

        /**
         * Marca tarea como completada
         */
        markTaskAsCompleted: (state, action) => {
            const taskId = action.payload
            const task = state.tasks.entities[taskId]

            if (task && task.status !== TaskStatus.COMPLETED) {
                task.status = TaskStatus.COMPLETED
                task.completedAt = new Date().toISOString()
                task.updatedAt = new Date().toISOString()

                // Actualizar contadores
                updateTaskCounters(state, task.status, TaskStatus.COMPLETED)

                // Si todas las tareas están completadas, marcar proyecto como completado
                const allTasks = Object.values(state.tasks.entities)
                const projectTasks = allTasks.filter(t => t.projectId === task.projectId)
                const allCompleted = projectTasks.every(t => t.status === TaskStatus.COMPLETED)

                if (allCompleted && task.projectId) {
                    const project = state.projects.entities[task.projectId]
                    if (project) {
                        project.status = ProjectStatus.COMPLETED
                        project.completedAt = new Date().toISOString()
                    }
                }
            }
        },

        /**
         * Marca discusión como resuelta
         */
        markDiscussionAsResolved: (state, action) => {
            const discussionId = action.payload
            const discussion = state.discussions.entities[discussionId]

            if (discussion) {
                discussion.isResolved = true
                discussion.resolvedAt = new Date().toISOString()
            }
        },

        /**
         * Actualiza contadores de tareas
         */
        updateTaskCounters: (state, oldStatus, newStatus) => {
            if (oldStatus === newStatus) return

            // Disminuir contador del estado anterior
            switch (oldStatus) {
                case TaskStatus.COMPLETED:
                    state.meta.completedTasks = Math.max(0, state.meta.completedTasks - 1)
                    break
                case TaskStatus.TODO:
                    state.meta.pendingTasks = Math.max(0, state.meta.pendingTasks - 1)
                    break
            }

            // Aumentar contador del nuevo estado
            switch (newStatus) {
                case TaskStatus.COMPLETED:
                    state.meta.completedTasks += 1
                    break
                case TaskStatus.TODO:
                    state.meta.pendingTasks += 1
                    break
            }

            // Recalcular productividad
            updateProductivityScore(state)
        },

        /**
         * Actualiza puntaje de productividad
         */
        updateProductivityScore: (state) => {
            if (state.meta.totalTasks === 0) {
                state.meta.productivityScore = 0
                return
            }

            const completionRate = (state.meta.completedTasks / state.meta.totalTasks) * 100
            const activeProjectsRate = state.meta.activeProjects > 0 ?
                (state.meta.activeProjects / state.meta.totalProjects) * 100 : 0

            state.meta.productivityScore = Math.round((completionRate + activeProjectsRate) / 2)
        },

        /**
         * Actualiza puntaje de colaboración
         */
        updateCollaborationScore: (state) => {
            const avgMembersPerProject = state.meta.totalProjects > 0 ?
                state.meta.totalCollaborators / state.meta.totalProjects : 0

            // Puntaje basado en miembros por proyecto y actividad reciente
            const hasRecentActivity = state.meta.lastActivity ?
                (Date.now() - new Date(state.meta.lastActivity).getTime()) < 7 * 24 * 60 * 60 * 1000 : false

            let score = avgMembersPerProject * 10
            if (hasRecentActivity) score += 30
            if (state.meta.totalCollaborators > 0) score += 20

            state.meta.collaborationScore = Math.min(score, 100)
        },

        /**
         * Limpia errores de proyectos
         */
        clearProjectsError: (state) => {
            state.error = null
            state.projectsError = null
            state.tasksError = null
            state.membersError = null
            state.discussionsError = null
            state.attachmentsError = null
            state.statsError = null
            state.searchError = null
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

            // Eliminar tareas temporales
            Object.keys(state.tasks.entities).forEach(id => {
                if (state.tasks.entities[id].isTemporary) {
                    tasksAdapter.removeOne(state.tasks, id)
                }
            })

            // Eliminar archivos temporales
            Object.keys(state.attachments.entities).forEach(id => {
                if (state.attachments.entities[id].isTemporary) {
                    attachmentsAdapter.removeOne(state.attachments, id)
                }
            })
        },

        /**
         * Resetea estado de proyectos
         */
        resetProjectsState: () => {
            return initialState
        },

        /**
         * Simula evento de proyecto (para desarrollo)
         */
        simulateProjectEvent: (state, action) => {
            const { type, data } = action.payload

            switch (type) {
                case 'task_created':
                    const newTask = {
                        id: `task_sim_${Date.now()}`,
                        title: data.title || 'Tarea de prueba',
                        description: data.description || 'Descripción de la tarea',
                        status: TaskStatus.TODO,
                        priority: data.priority || TaskPriority.MEDIUM,
                        projectId: data.projectId || state.currentProject,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                    tasksAdapter.addOne(state.tasks, newTask)
                    state.meta.totalTasks += 1
                    state.meta.pendingTasks += 1
                    break

                case 'project_collaborator_added':
                    const newMember = {
                        userId: data.userId || `user_${Date.now()}`,
                        userAlias: data.userAlias || 'Colaborador Simulado',
                        userAvatarUrl: data.avatarUrl || '/avatars/default.png',
                        role: data.role || CollaborationRole.CONTRIBUTOR,
                        joinedAt: new Date().toISOString()
                    }
                    membersAdapter.addOne(state.members, newMember)
                    state.meta.totalCollaborators += 1
                    break

                case 'discussion_created':
                    const newDiscussion = {
                        id: `disc_${Date.now()}`,
                        title: data.title || 'Discusión de prueba',
                        content: data.content || 'Contenido de la discusión',
                        authorId: data.authorId || 'current_user',
                        projectId: data.projectId || state.currentProject,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isResolved: false
                    }
                    discussionsAdapter.addOne(state.discussions, newDiscussion)
                    break
            }
        }
    },
    extraReducers: (builder) => {
        // =============================================
        // FETCH PROJECTS
        // =============================================
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.projectsStatus = LOADING_STATES.LOADING
                state.projectsError = null
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                const { projects, options } = action.payload
                projectsAdapter.setAll(state.projects, projects)
                state.projectFilters = options
                state.projectsStatus = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()

                // Actualizar metadata
                state.meta.totalProjects = projects.length
                state.meta.activeProjects = projects.filter(p =>
                    [ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(p.status)
                ).length
                state.meta.completedProjects = projects.filter(p =>
                    p.status === ProjectStatus.COMPLETED
                ).length

                // Cachear proyectos
                cacheProjects(projects, options)
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.projectsStatus = LOADING_STATES.ERROR
                state.projectsError = action.payload?.message || 'Error obteniendo proyectos'

                // Intentar cargar desde cache
                const cachedProjects = loadCachedProjects(state.projectFilters)
                if (cachedProjects) {
                    projectsAdapter.setAll(state.projects, cachedProjects)
                    state.projectsStatus = LOADING_STATES.SUCCESS
                }
            })

        // =============================================
        // FETCH PROJECT BY ID
        // =============================================
        builder
            .addCase(fetchProjectById.pending, (state) => {
                state.projectsStatus = LOADING_STATES.LOADING
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                const project = action.payload
                projectsAdapter.upsertOne(state.projects, project)
                state.currentProject = project.id
                state.projectsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.projectsStatus = LOADING_STATES.ERROR
                state.projectsError = action.payload?.message || 'Error obteniendo proyecto'
            })

        // =============================================
        // CREATE PROJECT
        // =============================================
        builder
            .addCase(createProject.pending, (state) => {
                state.projectsStatus = LOADING_STATES.LOADING
            })
            .addCase(createProject.fulfilled, (state, action) => {
                const project = action.payload
                projectsAdapter.addOne(state.projects, project)
                state.meta.totalProjects += 1

                if (project.status === ProjectStatus.ACTIVE) {
                    state.meta.activeProjects += 1
                }

                state.projectsStatus = LOADING_STATES.SUCCESS
                state.meta.lastActivity = new Date().toISOString()

                updateProductivityScore(state)
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
                const updatedProject = action.payload
                projectsAdapter.upsertOne(state.projects, updatedProject)
                state.lastUpdated = new Date().toISOString()

                // Si cambió el estado, actualizar contadores
                const oldProject = state.projects.entities[updatedProject.id]
                if (oldProject && oldProject.status !== updatedProject.status) {
                    if ([ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(oldProject.status)) {
                        state.meta.activeProjects = Math.max(0, state.meta.activeProjects - 1)
                    } else if (oldProject.status === ProjectStatus.COMPLETED) {
                        state.meta.completedProjects = Math.max(0, state.meta.completedProjects - 1)
                    }

                    if ([ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(updatedProject.status)) {
                        state.meta.activeProjects += 1
                    } else if (updatedProject.status === ProjectStatus.COMPLETED) {
                        state.meta.completedProjects += 1
                    }
                }
            })

        // =============================================
        // DELETE PROJECT
        // =============================================
        builder
            .addCase(deleteProject.fulfilled, (state, action) => {
                const { projectId } = action.payload
                const project = state.projects.entities[projectId]

                if (project) {
                    if ([ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(project.status)) {
                        state.meta.activeProjects = Math.max(0, state.meta.activeProjects - 1)
                    } else if (project.status === ProjectStatus.COMPLETED) {
                        state.meta.completedProjects = Math.max(0, state.meta.completedProjects - 1)
                    }
                }

                projectsAdapter.removeOne(state.projects, projectId)
                state.meta.totalProjects = Math.max(0, state.meta.totalProjects - 1)

                updateProductivityScore(state)
            })

        // =============================================
        // FETCH PROJECT TASKS
        // =============================================
        builder
            .addCase(fetchProjectTasks.pending, (state) => {
                state.tasksStatus = LOADING_STATES.LOADING
                state.tasksError = null
            })
            .addCase(fetchProjectTasks.fulfilled, (state, action) => {
                const { projectId, tasks, options } = action.payload
                tasksAdapter.setAll(state.tasks, tasks)
                state.taskFilters = options
                state.tasksStatus = LOADING_STATES.SUCCESS

                // Actualizar contadores
                state.meta.totalTasks = tasks.length
                state.meta.completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length
                state.meta.pendingTasks = tasks.filter(t => t.status === TaskStatus.TODO).length

                updateProductivityScore(state)
            })
            .addCase(fetchProjectTasks.rejected, (state, action) => {
                state.tasksStatus = LOADING_STATES.ERROR
                state.tasksError = action.payload?.message || 'Error obteniendo tareas'
            })

        // =============================================
        // CREATE TASK
        // =============================================
        builder
            .addCase(createTask.fulfilled, (state, action) => {
                const { projectId, task } = action.payload
                tasksAdapter.addOne(state.tasks, task)
                state.meta.totalTasks += 1
                state.meta.pendingTasks += 1
                state.meta.lastActivity = new Date().toISOString()

                updateProductivityScore(state)
            })

        // =============================================
        // UPDATE TASK
        // =============================================
        builder
            .addCase(updateTask.fulfilled, (state, action) => {
                const { projectId, taskId, task } = action.payload
                const oldTask = state.tasks.entities[taskId]

                tasksAdapter.upsertOne(state.tasks, task)

                // Actualizar contadores si cambió el estado
                if (oldTask && oldTask.status !== task.status) {
                    updateTaskCounters(state, oldTask.status, task.status)
                }
            })

        // =============================================
        // DELETE TASK
        // =============================================
        builder
            .addCase(deleteTask.fulfilled, (state, action) => {
                const { projectId, taskId } = action.payload
                const task = state.tasks.entities[taskId]

                if (task) {
                    if (task.status === TaskStatus.COMPLETED) {
                        state.meta.completedTasks = Math.max(0, state.meta.completedTasks - 1)
                    } else if (task.status === TaskStatus.TODO) {
                        state.meta.pendingTasks = Math.max(0, state.meta.pendingTasks - 1)
                    }
                }

                tasksAdapter.removeOne(state.tasks, taskId)
                state.meta.totalTasks = Math.max(0, state.meta.totalTasks - 1)

                updateProductivityScore(state)
            })

        // =============================================
        // FETCH PROJECT MEMBERS
        // =============================================
        builder
            .addCase(fetchProjectMembers.pending, (state) => {
                state.membersStatus = LOADING_STATES.LOADING
                state.membersError = null
            })
            .addCase(fetchProjectMembers.fulfilled, (state, action) => {
                const { projectId, members } = action.payload
                membersAdapter.setAll(state.members, members)
                state.membersStatus = LOADING_STATES.SUCCESS

                // Actualizar contador de colaboradores
                state.meta.totalCollaborators = members.length
                updateCollaborationScore(state)
            })
            .addCase(fetchProjectMembers.rejected, (state, action) => {
                state.membersStatus = LOADING_STATES.ERROR
                state.membersError = action.payload?.message || 'Error obteniendo miembros'
            })

        // =============================================
        // INVITE TO PROJECT
        // =============================================
        builder
            .addCase(inviteToProject.fulfilled, (state, action) => {
                const { projectId, invitation } = action.payload
                state.invitations.push(invitation)
            })

        // =============================================
        // UPDATE MEMBER ROLE
        // =============================================
        builder
            .addCase(updateMemberRole.fulfilled, (state, action) => {
                const { projectId, userId, member } = action.payload
                membersAdapter.upsertOne(state.members, member)
            })

        // =============================================
        // REMOVE PROJECT MEMBER
        // =============================================
        builder
            .addCase(removeProjectMember.fulfilled, (state, action) => {
                const { projectId, userId } = action.payload
                membersAdapter.removeOne(state.members, userId)
                state.meta.totalCollaborators = Math.max(0, state.meta.totalCollaborators - 1)

                updateCollaborationScore(state)
            })

        // =============================================
        // FETCH PROJECT DISCUSSIONS
        // =============================================
        builder
            .addCase(fetchProjectDiscussions.pending, (state) => {
                state.discussionsStatus = LOADING_STATES.LOADING
                state.discussionsError = null
            })
            .addCase(fetchProjectDiscussions.fulfilled, (state, action) => {
                const { projectId, discussions, options } = action.payload
                discussionsAdapter.setAll(state.discussions, discussions)
                state.discussionsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchProjectDiscussions.rejected, (state, action) => {
                state.discussionsStatus = LOADING_STATES.ERROR
                state.discussionsError = action.payload?.message || 'Error obteniendo discusiones'
            })

        // =============================================
        // CREATE DISCUSSION
        // =============================================
        builder
            .addCase(createDiscussion.fulfilled, (state, action) => {
                const { projectId, discussion } = action.payload
                discussionsAdapter.addOne(state.discussions, discussion)
            })

        // =============================================
        // FETCH PROJECT ATTACHMENTS
        // =============================================
        builder
            .addCase(fetchProjectAttachments.pending, (state) => {
                state.attachmentsStatus = LOADING_STATES.LOADING
                state.attachmentsError = null
            })
            .addCase(fetchProjectAttachments.fulfilled, (state, action) => {
                const { projectId, attachments } = action.payload
                attachmentsAdapter.setAll(state.attachments, attachments)
                state.meta.totalAttachments = attachments.length
                state.attachmentsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchProjectAttachments.rejected, (state, action) => {
                state.attachmentsStatus = LOADING_STATES.ERROR
                state.attachmentsError = action.payload?.message || 'Error obteniendo archivos'
            })

        // =============================================
        // UPLOAD ATTACHMENT
        // =============================================
        builder
            .addCase(uploadAttachment.pending, (state) => {
                state.isUploading = true
                state.uploadProgress = 0
                state.attachmentsError = null
            })
            .addCase(uploadAttachment.fulfilled, (state, action) => {
                const { projectId, attachment } = action.payload
                attachmentsAdapter.addOne(state.attachments, attachment)
                state.isUploading = false
                state.uploadProgress = 100
                state.meta.totalAttachments += 1
                state.meta.lastActivity = new Date().toISOString()
            })
            .addCase(uploadAttachment.rejected, (state, action) => {
                state.isUploading = false
                state.attachmentsError = action.payload?.message || 'Error subiendo archivo'
            })

        // =============================================
        // DELETE ATTACHMENT
        // =============================================
        builder
            .addCase(deleteAttachment.fulfilled, (state, action) => {
                const { projectId, attachmentId } = action.payload
                attachmentsAdapter.removeOne(state.attachments, attachmentId)
                state.meta.totalAttachments = Math.max(0, state.meta.totalAttachments - 1)
            })

        // =============================================
        // FETCH PROJECT STATS
        // =============================================
        builder
            .addCase(fetchProjectStats.pending, (state) => {
                state.statsStatus = LOADING_STATES.LOADING
                state.statsError = null
            })
            .addCase(fetchProjectStats.fulfilled, (state, action) => {
                const { projectId, stats } = action.payload
                state.projectStats = stats
                state.statsStatus = LOADING_STATES.SUCCESS
            })
            .addCase(fetchProjectStats.rejected, (state, action) => {
                state.statsStatus = LOADING_STATES.ERROR
                state.statsError = action.payload?.message || 'Error obteniendo estadísticas'
            })

        // =============================================
        // SEARCH PROJECTS
        // =============================================
        builder
            .addCase(searchProjects.pending, (state) => {
                state.searchStatus = LOADING_STATES.LOADING
                state.searchError = null
            })
            .addCase(searchProjects.fulfilled, (state, action) => {
                const { results, searchParams } = action.payload
                state.searchResults = results
                state.searchParams = searchParams
                state.searchStatus = LOADING_STATES.SUCCESS
            })
            .addCase(searchProjects.rejected, (state, action) => {
                state.searchStatus = LOADING_STATES.ERROR
                state.searchError = action.payload?.message || 'Error buscando proyectos'
            })

        // =============================================
        // FETCH RECOMMENDED PROJECTS
        // =============================================
        builder
            .addCase(fetchRecommendedProjects.fulfilled, (state, action) => {
                const { projects } = action.payload
                state.recommendedProjects = projects
            })

        // =============================================
        // CLONE PROJECT
        // =============================================
        builder
            .addCase(cloneProject.fulfilled, (state, action) => {
                const { originalId, clonedProject } = action.payload
                projectsAdapter.addOne(state.projects, clonedProject)
                state.meta.totalProjects += 1
            })
    }
})

// =============================================
// FUNCIONES DE CACHE
// =============================================

/**
 * Cachea proyectos en localStorage
 */
const cacheProjects = (projects, filters) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHED_PROJECTS}_${JSON.stringify(filters)}`
        const cacheData = {
            projects,
            filters,
            _cachedAt: Date.now(),
            _expiresAt: Date.now() + CACHE_CONFIG.TTL.MEDIUM
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
        console.warn('Error cacheando proyectos:', error)
    }
}

/**
 * Carga proyectos desde cache
 */
const loadCachedProjects = (filters) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHED_PROJECTS}_${JSON.stringify(filters)}`
        const cached = localStorage.getItem(cacheKey)
        if (!cached) return null

        const cacheData = JSON.parse(cached)

        // Verificar expiración
        if (cacheData._expiresAt && Date.now() > cacheData._expiresAt) {
            localStorage.removeItem(cacheKey)
            return null
        }

        return cacheData.projects
    } catch (error) {
        console.warn('Error cargando proyectos desde cache:', error)
        return null
    }
}

// =============================================
// SELECTORS
// =============================================

// Selectores básicos
export const selectProjectsState = (state) => state.projects
export const selectCurrentProject = (state) => state.projects.currentProject
export const selectProjectFilters = (state) => state.projects.projectFilters
export const selectTaskFilters = (state) => state.projects.taskFilters
export const selectCurrentTask = (state) => state.projects.currentTask
export const selectCurrentDiscussion = (state) => state.projects.currentDiscussion
export const selectInvitations = (state) => state.projects.invitations
export const selectUploadProgress = (state) => state.projects.uploadProgress
export const selectIsUploading = (state) => state.projects.isUploading
export const selectProjectStats = (state) => state.projects.projectStats
export const selectSearchResults = (state) => state.projects.searchResults
export const selectSearchParams = (state) => state.projects.searchParams
export const selectRecommendedProjects = (state) => state.projects.recommendedProjects
export const selectProjectsMeta = (state) => state.projects.meta
export const selectProjectsStatus = (state) => state.projects.status
export const selectProjectsError = (state) => state.projects.error

// Selectores de entity adapters
export const {
    selectAll: selectAllProjects,
    selectById: selectProjectById,
    selectIds: selectProjectIds,
    selectTotal: selectTotalProjects
} = projectsAdapter.getSelectors((state) => state.projects.projects)

export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds,
    selectTotal: selectTotalTasks
} = tasksAdapter.getSelectors((state) => state.projects.tasks)

export const {
    selectAll: selectAllMembers,
    selectById: selectMemberById,
    selectIds: selectMemberIds,
    selectTotal: selectTotalMembers
} = membersAdapter.getSelectors((state) => state.projects.members)

export const {
    selectAll: selectAllDiscussions,
    selectById: selectDiscussionById,
    selectIds: selectDiscussionIds,
    selectTotal: selectTotalDiscussions
} = discussionsAdapter.getSelectors((state) => state.projects.discussions)

export const {
    selectAll: selectAllAttachments,
    selectById: selectAttachmentById,
    selectIds: selectAttachmentIds,
    selectTotal: selectTotalAttachments
} = attachmentsAdapter.getSelectors((state) => state.projects.attachments)

// Selectores derivados
export const selectProjectsByStatus = (status) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => project.status === status)
}

export const selectActiveProjects = (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project =>
        [ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(project.status)
    )
}

export const selectCompletedProjects = (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => project.status === ProjectStatus.COMPLETED)
}

export const selectProjectsByDifficulty = (difficulty) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => project.difficulty === difficulty)
}

export const selectProjectsByType = (type) => (state) => {
    const allProjects = selectAllProjects(state)
    return allProjects.filter(project => project.type === type)
}

export const selectRecentProjects = (limit = 5) => (state) => {
    const allProjects = selectAllProjects(state)
    return [...allProjects]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
}

export const selectTasksByStatus = (status) => (state) => {
    const allTasks = selectAllTasks(state)
    return allTasks.filter(task => task.status === status)
}

export const selectTasksByPriority = (priority) => (state) => {
    const allTasks = selectAllTasks(state)
    return allTasks.filter(task => task.priority === priority)
}

export const selectTodoTasks = (state) => {
    const allTasks = selectAllTasks(state)
    return allTasks.filter(task => task.status === TaskStatus.TODO)
}

export const selectCompletedTasks = (state) => {
    const allTasks = selectAllTasks(state)
    return allTasks.filter(task => task.status === TaskStatus.COMPLETED)
}

export const selectTasksByProject = (projectId) => (state) => {
    const allTasks = selectAllTasks(state)
    return allTasks.filter(task => task.projectId === projectId)
}

export const selectOverdueTasks = (state) => {
    const allTasks = selectAllTasks(state)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return allTasks.filter(task =>
        task.dueDate &&
        task.status !== TaskStatus.COMPLETED &&
        new Date(task.dueDate) < today
    )
}

export const selectUpcomingTasks = (days = 7) => (state) => {
    const allTasks = selectAllTasks(state)
    const today = new Date()
    const future = new Date()
    future.setDate(today.getDate() + days)

    return allTasks.filter(task =>
        task.dueDate &&
        task.status !== TaskStatus.COMPLETED &&
        new Date(task.dueDate) >= today &&
        new Date(task.dueDate) <= future
    )
}

export const selectMembersByRole = (role) => (state) => {
    const allMembers = selectAllMembers(state)
    return allMembers.filter(member => member.role === role)
}

export const selectProjectOwners = (state) => {
    return selectMembersByRole(CollaborationRole.OWNER)(state)
}

export const selectProjectContributors = (state) => {
    return selectMembersByRole(CollaborationRole.CONTRIBUTOR)(state)
}

export const selectDiscussionsByProject = (projectId) => (state) => {
    const allDiscussions = selectAllDiscussions(state)
    return allDiscussions.filter(discussion => discussion.projectId === projectId)
}

export const selectUnresolvedDiscussions = (state) => {
    const allDiscussions = selectAllDiscussions(state)
    return allDiscussions.filter(discussion => !discussion.isResolved)
}

export const selectRecentDiscussions = (limit = 10) => (state) => {
    const allDiscussions = selectAllDiscussions(state)
    return [...allDiscussions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
}

export const selectAttachmentsByType = (fileType) => (state) => {
    const allAttachments = selectAllAttachments(state)
    return allAttachments.filter(attachment => attachment.fileType === fileType)
}

export const selectImageAttachments = (state) => {
    const allAttachments = selectAllAttachments(state)
    return allAttachments.filter(attachment =>
        attachment.fileType && attachment.fileType.startsWith('image/')
    )
}

export const selectDocumentAttachments = (state) => {
    const allAttachments = selectAllAttachments(state)
    return allAttachments.filter(attachment =>
        attachment.fileType && (
            attachment.fileType.startsWith('application/') ||
            attachment.fileType.startsWith('text/')
        )
    )
}

export const selectCurrentProjectDetails = (state) => {
    const currentProjectId = selectCurrentProject(state)
    return currentProjectId ? selectProjectById(state, currentProjectId) : null
}

export const selectCurrentProjectTasks = (state) => {
    const currentProjectId = selectCurrentProject(state)
    return currentProjectId ? selectTasksByProject(currentProjectId)(state) : []
}

export const selectCurrentProjectMembers = (state) => {
    const allMembers = selectAllMembers(state)
    const currentProjectId = selectCurrentProject(state)

    return currentProjectId ?
        allMembers.filter(member => member.projectId === currentProjectId) : []
}

export const selectProductivityMetrics = (state) => {
    const meta = selectProjectsMeta(state)

    return {
        totalProjects: meta.totalProjects,
        activeProjects: meta.activeProjects,
        completedProjects: meta.completedProjects,
        totalTasks: meta.totalTasks,
        completedTasks: meta.completedTasks,
        pendingTasks: meta.pendingTasks,
        productivityScore: meta.productivityScore,
        collaborationScore: meta.collaborationScore,
        completionRate: meta.totalTasks > 0 ?
            Math.round((meta.completedTasks / meta.totalTasks) * 100) : 0,
        activeProjectRate: meta.totalProjects > 0 ?
            Math.round((meta.activeProjects / meta.totalProjects) * 100) : 0
    }
}

export const selectProjectProgress = (projectId) => (state) => {
    const project = selectProjectById(state, projectId)
    if (!project) return 0

    const projectTasks = selectTasksByProject(projectId)(state)
    if (projectTasks.length === 0) return 0

    const completedTasks = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length
    return Math.round((completedTasks / projectTasks.length) * 100)
}

export const selectTaskCountByProject = (projectId) => (state) => {
    const projectTasks = selectTasksByProject(projectId)(state)

    return {
        total: projectTasks.length,
        todo: projectTasks.filter(t => t.status === TaskStatus.TODO).length,
        inProgress: projectTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
        completed: projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
        blocked: projectTasks.filter(t => t.status === TaskStatus.BLOCKED).length
    }
}

// =============================================
// EXPORTACIONES
// =============================================

// Exportar acciones
export const {
    setCurrentProject,
    setProjectFilters,
    setTaskFilters,
    setCurrentTask,
    setCurrentDiscussion,
    addTemporaryProject,
    addTemporaryTask,
    updateTaskLocally,
    removeTemporaryItem,
    setUploadProgress,
    cancelUpload,
    addMemberLocally,
    addDiscussionLocally,
    filterProjectsByStatus,
    filterProjectsByDifficulty,
    filterProjectsByType,
    filterTasksByStatus,
    filterTasksByPriority,
    sortProjectsBy,
    sortTasksBy,
    sortDiscussionsBy,
    markTaskAsCompleted,
    markDiscussionAsResolved,
    updateTaskCounters,
    updateProductivityScore,
    updateCollaborationScore,
    clearProjectsError,
    clearTemporaryData,
    resetProjectsState,
    simulateProjectEvent
} = projectsSlice.actions

// Exportar thunks
export {
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    fetchProjectTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchProjectMembers,
    inviteToProject,
    acceptProjectInvitation,
    updateMemberRole,
    removeProjectMember,
    fetchProjectDiscussions,
    createDiscussion,
    fetchProjectAttachments,
    uploadAttachment,
    deleteAttachment,
    fetchProjectStats,
    searchProjects,
    fetchRecommendedProjects,
    cloneProject,
    exportProject,
    importProject
}

// Exportar reducer
export default projectsSlice.reducer

// Exportar tipos
/**
 * @typedef {Object} ProjectsState
 * @property {Object} projects
 * @property {string|null} currentProject
 * @property {Object} projectFilters
 * @property {string} projectsStatus
 * @property {string|null} projectsError
 * @property {Object} tasks
 * @property {Object} taskFilters
 * @property {string|null} currentTask
 * @property {string} tasksStatus
 * @property {string|null} tasksError
 * @property {Object} members
 * @property {Array} invitations
 * @property {string} membersStatus
 * @property {string|null} membersError
 * @property {Object} discussions
 * @property {string|null} currentDiscussion
 * @property {string} discussionsStatus
 * @property {string|null} discussionsError
 * @property {Object} attachments
 * @property {number} uploadProgress
 * @property {boolean} isUploading
 * @property {string} attachmentsStatus
 * @property {string|null} attachmentsError
 * @property {Object|null} projectStats
 * @property {Array} searchResults
 * @property {Object} searchParams
 * @property {Array} recommendedProjects
 * @property {string} statsStatus
 * @property {string} searchStatus
 * @property {string|null} statsError
 * @property {string|null} searchError
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastUpdated
 * @property {Object} meta
 */