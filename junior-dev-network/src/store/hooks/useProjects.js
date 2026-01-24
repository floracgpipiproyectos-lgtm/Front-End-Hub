// store/hooks/useProjects.js
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
    // Thunks
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
    importProject,

    // Acciones síncronas
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
    simulateProjectEvent,

    // Selectores
    selectProjectsState,
    selectAllProjects,
    selectCurrentProject,
    selectProjectFilters,
    selectTaskFilters,
    selectCurrentTask,
    selectCurrentDiscussion,
    selectInvitations,
    selectUploadProgress,
    selectIsUploading,
    selectProjectStats,
    selectSearchResults,
    selectSearchParams,
    selectRecommendedProjects,
    selectProjectsMeta,
    selectProjectsStatus,
    selectProjectsError,

    // Selectores derivados
    selectProjectsByStatus,
    selectActiveProjects,
    selectCompletedProjects,
    selectProjectsByDifficulty,
    selectProjectsByType,
    selectRecentProjects,
    selectTasksByStatus,
    selectTasksByPriority,
    selectTodoTasks,
    selectCompletedTasks,
    selectTasksByProject,
    selectOverdueTasks,
    selectUpcomingTasks,
    selectMembersByRole,
    selectProjectOwners,
    selectProjectContributors,
    selectDiscussionsByProject,
    selectUnresolvedDiscussions,
    selectRecentDiscussions,
    selectAttachmentsByType,
    selectImageAttachments,
    selectDocumentAttachments,
    selectCurrentProjectDetails,
    selectCurrentProjectTasks,
    selectCurrentProjectMembers,
    selectProductivityMetrics,
    selectProjectProgress,
    selectTaskCountByProject
} from '../slices/projectsSlice'
import {
    ProjectStatus,
    ProjectDifficulty,
    TaskStatus,
    TaskPriority,
    CollaborationRole
} from '@/api/services/projectsService'

/**
 * Hook personalizado para proyectos
 */
export const useProjects = () => {
    const dispatch = useDispatch()

    // Selectores básicos
    const projectsState = useSelector(selectProjectsState)
    const allProjects = useSelector(selectAllProjects)
    const currentProjectId = useSelector(selectCurrentProject)
    const projectFilters = useSelector(selectProjectFilters)
    const taskFilters = useSelector(selectTaskFilters)
    const currentTask = useSelector(selectCurrentTask)
    const currentDiscussion = useSelector(selectCurrentDiscussion)
    const invitations = useSelector(selectInvitations)
    const uploadProgress = useSelector(selectUploadProgress)
    const isUploading = useSelector(selectIsUploading)
    const projectStats = useSelector(selectProjectStats)
    const searchResults = useSelector(selectSearchResults)
    const searchParams = useSelector(selectSearchParams)
    const recommendedProjects = useSelector(selectRecommendedProjects)
    const meta = useSelector(selectProjectsMeta)
    const status = useSelector(selectProjectsStatus)
    const error = useSelector(selectProjectsError)

    // Selectores derivados (usando useMemo para memoización)
    const activeProjects = useMemo(() =>
        allProjects.filter(project =>
            [ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(project.status)
        ),
        [allProjects]
    )

    const completedProjects = useMemo(() =>
        allProjects.filter(project => project.status === ProjectStatus.COMPLETED),
        [allProjects]
    )

    const todoTasks = useMemo(() => {
        const allTasks = useSelector((state) => selectAllTasks(state))
        return allTasks.filter(task => task.status === TaskStatus.TODO)
    }, [useSelector, selectAllTasks])

    const overdueTasks = useMemo(() => {
        const allTasks = useSelector((state) => selectAllTasks(state))
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return allTasks.filter(task =>
            task.dueDate &&
            task.status !== TaskStatus.COMPLETED &&
            new Date(task.dueDate) < today
        )
    }, [useSelector, selectAllTasks])

    const currentProject = useMemo(() =>
        currentProjectId ? allProjects.find(p => p.id === currentProjectId) : null,
        [allProjects, currentProjectId]
    )

    // Acciones asíncronas
    const loadProjects = useCallback(async (options = {}) => {
        try {
            const result = await dispatch(fetchProjects(options)).unwrap()
            return result.projects
        } catch (error) {
            console.error('Error cargando proyectos:', error)
            throw error
        }
    }, [dispatch])

    const loadProject = useCallback(async (projectId) => {
        try {
            const project = await dispatch(fetchProjectById(projectId)).unwrap()
            return project
        } catch (error) {
            console.error('Error cargando proyecto:', error)
            throw error
        }
    }, [dispatch])

    const createNewProject = useCallback(async (projectData) => {
        try {
            const project = await dispatch(createProject(projectData)).unwrap()
            return project
        } catch (error) {
            console.error('Error creando proyecto:', error)
            throw error
        }
    }, [dispatch])

    const updateExistingProject = useCallback(async (id, updateData) => {
        try {
            const project = await dispatch(updateProject({ id, updateData })).unwrap()
            return project
        } catch (error) {
            console.error('Error actualizando proyecto:', error)
            throw error
        }
    }, [dispatch])

    // ... continuar con las demás acciones asíncronas

    // Acciones síncronas
    const selectProject = useCallback((projectId) => {
        dispatch(setCurrentProject(projectId))
    }, [dispatch])

    const applyProjectFilters = useCallback((filters) => {
        dispatch(setProjectFilters(filters))
    }, [dispatch])

    const applyTaskFilters = useCallback((filters) => {
        dispatch(setTaskFilters(filters))
    }, [dispatch])

    const selectTask = useCallback((task) => {
        dispatch(setCurrentTask(task))
    }, [dispatch])

    const selectDiscussion = useCallback((discussion) => {
        dispatch(setCurrentDiscussion(discussion))
    }, [dispatch])

    const addTempProject = useCallback((projectData) => {
        dispatch(addTemporaryProject(projectData))
    }, [dispatch])

    const addTempTask = useCallback((taskData) => {
        dispatch(addTemporaryTask(taskData))
    }, [dispatch])

    const updateTaskLocal = useCallback((taskId, updates) => {
        dispatch(updateTaskLocally({ taskId, updates }))
    }, [dispatch])

    const completeTask = useCallback((taskId) => {
        dispatch(markTaskAsCompleted(taskId))
    }, [dispatch])

    // Utilitarios
    const getProjectById = useCallback((projectId) => {
        return allProjects.find(project => project.id === projectId)
    }, [allProjects])

    const getProjectsByStatus = useCallback((status) => {
        return allProjects.filter(project => project.status === status)
    }, [allProjects])

    const getProjectsByDifficulty = useCallback((difficulty) => {
        return allProjects.filter(project => project.difficulty === difficulty)
    }, [allProjects])

    const getProjectProgress = useCallback((projectId) => {
        if (!projectId) return 0

        // Esta función asume que hay un selector específico
        // En una implementación real, podrías usar useSelector aquí
        return 0 // Placeholder
    }, [])

    const getUserRoleInProject = useCallback((projectId, userId) => {
        const project = getProjectById(projectId)
        if (!project || !project.members) return null

        const member = project.members.find(m => m.userId === userId)
        return member ? member.role : null
    }, [getProjectById])

    // Métricas y estadísticas
    const productivityMetrics = useMemo(() => {
        return {
            totalProjects: allProjects.length,
            activeProjects: activeProjects.length,
            completedProjects: completedProjects.length,
            totalTasks: meta.totalTasks || 0,
            completedTasks: meta.completedTasks || 0,
            pendingTasks: meta.pendingTasks || 0,
            productivityScore: meta.productivityScore || 0,
            collaborationScore: meta.collaborationScore || 0
        }
    }, [allProjects, activeProjects, completedProjects, meta])

    const projectCompletionRate = useMemo(() => {
        if (allProjects.length === 0) return 0
        return Math.round((completedProjects.length / allProjects.length) * 100)
    }, [allProjects, completedProjects])

    // Estados derivados
    const isLoading = useMemo(() => status === 'loading', [status])
    const hasError = useMemo(() => status === 'error', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isUploadingFile = useMemo(() => isUploading, [isUploading])

    return {
        // Estado
        projectsState,
        allProjects,
        currentProjectId,
        currentProject,
        projectFilters,
        taskFilters,
        currentTask,
        currentDiscussion,
        invitations,
        uploadProgress,
        isUploading: isUploadingFile,
        projectStats,
        searchResults,
        searchParams,
        recommendedProjects,
        meta,
        status,
        error,

        // Proyectos filtrados
        activeProjects,
        completedProjects,
        todoTasks,
        overdueTasks,

        // Acciones asíncronas
        loadProjects,
        loadProject,
        createNewProject,
        updateExistingProject,
        // ... demás acciones asíncronas

        // Acciones síncronas
        selectProject,
        applyProjectFilters,
        applyTaskFilters,
        selectTask,
        selectDiscussion,
        addTempProject,
        addTempTask,
        updateTaskLocal,
        completeTask,
        // ... demás acciones síncronas

        // Utilitarios
        getProjectById,
        getProjectsByStatus,
        getProjectsByDifficulty,
        getProjectProgress,
        getUserRoleInProject,

        // Métricas
        productivityMetrics,
        projectCompletionRate,

        // Estados derivados
        isLoading,
        hasError,
        isSuccess,
        isUploading: isUploadingFile,

        // Flags de conveniencia
        hasProjects: allProjects.length > 0,
        hasActiveProjects: activeProjects.length > 0,
        hasCompletedProjects: completedProjects.length > 0,
        hasCurrentProject: !!currentProjectId,
        hasInvitations: invitations.length > 0,
        hasSearchResults: searchResults.length > 0,
        hasRecommendedProjects: recommendedProjects.length > 0,
        hasProjectStats: !!projectStats,
        isProjectActive: currentProject ?
            [ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS].includes(currentProject.status) : false
    }
}