// store/hooks/usePortfolio.js
// noinspection DuplicatedCode,UnnecessaryLocalVariableJS,GrazieInspection

import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
    // Thunks
    fetchPortfolio,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    // Acciones síncronas
    setCurrentProject,
    setProjectFilters,
    addTemporaryProject,
    removeTemporaryProject,
    updateTemporaryProject,
    updateSettingsLocally,
    // Selectores
    selectPortfolioState,
    selectAllProjects,
    selectCurrentProject,
    selectProjectFilters,
    selectAllExperiences,
    selectAllEducation,
    selectAllCertifications,
    selectAllFeaturedSkills,
    selectPortfolioSettings,
    selectPortfolioUpload,
    selectPortfolioPreview,
    selectPortfolioStats,
    selectPortfolioMeta,
    selectPortfolioStatus,
    selectPortfolioError
} from '../slices/portfolioSlice'
import { ProjectStatus, ProjectVisibility } from '@/api/services/portfolioService'

// noinspection GrazieInspection
/**
 * Hook personalizado para portfolio
 */
export const usePortfolio = () => {
    const dispatch = useDispatch()

    // Selectores básicos
    const portfolioState = useSelector(selectPortfolioState)
    const allProjects = useSelector(selectAllProjects)
    const currentProject = useSelector(selectCurrentProject)
    const projectFilters = useSelector(selectProjectFilters)
    const allExperiences = useSelector(selectAllExperiences)
    const allEducation = useSelector(selectAllEducation)
    const allCertifications = useSelector(selectAllCertifications)
    const allFeaturedSkills = useSelector(selectAllFeaturedSkills)
    const settings = useSelector(selectPortfolioSettings)
    const upload = useSelector(selectPortfolioUpload)
    const preview = useSelector(selectPortfolioPreview)
    const stats = useSelector(selectPortfolioStats)
    const meta = useSelector(selectPortfolioMeta)
    const status = useSelector(selectPortfolioStatus)
    const error = useSelector(selectPortfolioError)

    // Acciones asíncronas
    const loadPortfolio = useCallback(async () => {
        try {
            const portfolio = await dispatch(fetchPortfolio()).unwrap()
            return portfolio
        } catch (error) {
            console.error('Error cargando portfolio:', error)
            throw error
        }
    }, [dispatch])

    const loadProjects = useCallback(async (options = {}) => {
        try {
            const projects = await dispatch(fetchProjects(options)).unwrap()
            return projects
        } catch (error) {
            console.error('Error cargando proyectos:', error)
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

    const deleteExistingProject = useCallback(async (projectId) => {
        try {
            const result = await dispatch(deleteProject(projectId)).unwrap()
            return result
        } catch (error) {
            console.error('Error eliminando proyecto:', error)
            throw error
        }
    }, [dispatch])

    // ... continuar con las demás acciones asíncronas

    // Acciones síncronas
    const selectProject = useCallback((project) => {
        dispatch(setCurrentProject(project))
    }, [dispatch])

    const applyProjectFilters = useCallback((filters) => {
        dispatch(setProjectFilters(filters))
    }, [dispatch])

    const addTempProject = useCallback((projectData) => {
        dispatch(addTemporaryProject(projectData))
    }, [dispatch])

    const updateTempProject = useCallback((id, updates) => {
        dispatch(updateTemporaryProject({ id, updates }))
    }, [dispatch])

    const removeTempProject = useCallback((projectId) => {
        dispatch(removeTemporaryProject(projectId))
    }, [dispatch])

    const updateLocalSettings = useCallback((settingsUpdate) => {
        dispatch(updateSettingsLocally(settingsUpdate))
    }, [dispatch])

    // Utilitarios
    const getProjectById = useCallback((projectId) => {
        return allProjects.find(project => project.id === projectId)
    }, [allProjects])

    const getExperienceById = useCallback((experienceId) => {
        return allExperiences.find(exp => exp.id === experienceId)
    }, [allExperiences])

    const getCertificationById = useCallback((certificationId) => {
        return allCertifications.find(cert => cert.id === certificationId)
    }, [allCertifications])

    const getSkillById = useCallback((skillId) => {
        return allFeaturedSkills.find(skill => skill.id === skillId)
    }, [allFeaturedSkills])

    const getProjectsByTechnology = useCallback((technology) => {
        return allProjects.filter(project => 
            project.technologies && project.technologies.includes(technology)
        )
    }, [allProjects])

    const getTotalProjectDuration = useCallback((projects) => {
        return projects.reduce((total, project) => {
            const start = new Date(project.startDate || project.createdAt)
            const end = project.endDate ? new Date(project.endDate) : new Date()
            const months = (end - start) / (1000 * 60 * 60 * 24 * 30)
            return total + months
        }, 0)
    }, [])

    // Valores memoizados
    const publicProjects = useMemo(() => {
        return allProjects.filter(project => 
            project.visibility === ProjectVisibility.PUBLIC && 
            project.status === ProjectStatus.COMPLETED
        )
    }, [allProjects])

    const draftProjects = useMemo(() => {
        return allProjects.filter(project => 
            project.status === ProjectStatus.DRAFT
        )
    }, [allProjects])

    const completedProjects = useMemo(() => {
        return allProjects.filter(project => 
            project.status === ProjectStatus.COMPLETED
        )
    }, [allProjects])

    const currentExperiences = useMemo(() => {
        return allExperiences.filter(exp => exp.current)
    }, [allExperiences])

    const topSkills = useMemo(() => {
        return [...allFeaturedSkills]
            .sort((a, b) => b.proficiency - a.proficiency)
            .slice(0, 6)
    }, [allFeaturedSkills])

    const portfolioMetrics = useMemo(() => {
        return {
            totalProjects: allProjects.length,
            publicProjects: publicProjects.length,
            draftProjects: draftProjects.length,
            totalExperiences: allExperiences.length,
            currentExperiences: currentExperiences.length,
            totalEducation: allEducation.length,
            totalCertifications: allCertifications.length,
            totalSkills: allFeaturedSkills.length,
            portfolioCompleteness: meta.portfolioCompleteness,
            isPublished: settings.isPublished,
            viewsCount: meta.viewsCount,
            contactRequests: meta.contactRequests
        }
    }, [allProjects, publicProjects, draftProjects, allExperiences, currentExperiences, 
        allEducation, allCertifications, allFeaturedSkills, meta, settings])

    const isLoading = useMemo(() => status === 'loading', [status])
    const hasError = useMemo(() => status === 'error', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isUploading = useMemo(() => upload.isUploading, [upload.isUploading])

    return {
        // Estado
        portfolioState,
        allProjects,
        currentProject,
        projectFilters,
        allExperiences,
        allEducation,
        allCertifications,
        allFeaturedSkills,
        settings,
        upload,
        preview,
        stats,
        meta,
        status,
        error,

        // Proyectos filtrados
        publicProjects,
        draftProjects,
        completedProjects,
        currentExperiences,
        topSkills,

        // Acciones asíncronas
        loadPortfolio,
        loadProjects,
        createNewProject,
        updateExistingProject,
        deleteExistingProject,
        // ... demás acciones asíncronas

        // Acciones síncronas
        selectProject,
        applyProjectFilters,
        addTempProject,
        updateTempProject,
        removeTempProject,
        updateLocalSettings,
        // ... demás acciones síncronas

        // Utilitarios
        getProjectById,
        getExperienceById,
        getCertificationById,
        getSkillById,
        getProjectsByTechnology,
        getTotalProjectDuration,

        // Métricas
        portfolioMetrics,

        // Estados derivados
        isLoading,
        isUploading,
        hasError,
        isSuccess,

        // Flags de conveniencia
        hasProjects: allProjects.length > 0,
        hasPublicProjects: publicProjects.length > 0,
        hasExperiences: allExperiences.length > 0,
        hasEducation: allEducation.length > 0,
        hasCertifications: allCertifications.length > 0,
        hasFeaturedSkills: allFeaturedSkills.length > 0,
        isPortfolioPublished: settings.isPublished,
        hasPortfolioStats: !!stats,
        hasPreview: !!preview,
        isPortfolioComplete: meta.portfolioCompleteness >= 80
    }
}