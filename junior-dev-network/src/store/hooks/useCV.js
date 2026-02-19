// store/hooks/useCV.js
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
    // Thunks
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
    calculateDeveloperLevel,

    // Acciones síncronas
    setUploadProgress,
    cancelUpload,
    clearCVError,
    resetAnalysis,
    selectSkill as selectSkillAction,
    addTemporarySkill,
    removeTemporarySkill,
    clearCVState,

    // Selectores
    selectCVState,
    selectUpload,
    selectAnalysis,
    selectAllSkills,
    selectCVSkills,
    selectManualSkills,
    selectIsAnalyzing,
    selectHasCompletedAnalysis,
    selectDeveloperLevel,
    selectSkillStatistics,
    selectProjectSuggestions,
    selectSkillSuggestions,
    selectCVStatus,
    selectCVError
} from '../slices/cvSlice'

/**
 * Hook personalizado para manejo de CV
 */
export const useCV = () => {
    const dispatch = useDispatch()

    // Selectores
    const cvState = useSelector(selectCVState)
    const upload = useSelector(selectUpload)
    const analysis = useSelector(selectAnalysis)
    const allSkills = useSelector(selectAllSkills)
    const cvSkills = useSelector(selectCVSkills)
    const manualSkills = useSelector(selectManualSkills)
    const isAnalyzing = useSelector(selectIsAnalyzing)
    const hasCompletedAnalysis = useSelector(selectHasCompletedAnalysis)
    const developerLevel = useSelector(selectDeveloperLevel)
    const skillStats = useSelector(selectSkillStatistics)
    const projectSuggestions = useSelector(selectProjectSuggestions)
    const skillSuggestions = useSelector(selectSkillSuggestions)
    const status = useSelector(selectCVStatus)
    const error = useSelector(selectCVError)

    // Acciones
    const uploadCVFile = useCallback(async (file, onProgress) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(uploadCV({ file, onProgress })).unwrap()
            return result
        } catch (error) {
            console.error('Error subiendo CV:', error)
            throw error
        }
    }, [dispatch])

    const analyzeCVFile = useCallback(async (cvId) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(analyzeCV(cvId)).unwrap()
            return result
        } catch (error) {
            console.error('Error analizando CV:', error)
            throw error
        }
    }, [dispatch])

    const getCVAnalysis = useCallback(async (analysisId) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(getAnalysis(analysisId)).unwrap()
            return result
        } catch (error) {
            console.error('Error obteniendo análisis:', error)
            throw error
        }
    }, [dispatch])

    const waitForCVAnalysis = useCallback(async (analysisId, timeoutMs = 30000, pollInterval = 1000) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(waitForAnalysis({
                analysisId,
                timeoutMs,
                pollInterval
            })).unwrap()
            return result
        } catch (error) {
            console.error('Error esperando análisis:', error)
            throw error
        }
    }, [dispatch])

    const loadSkills = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const skills = await dispatch(fetchSkills()).unwrap()
            return skills
        } catch (error) {
            console.error('Error cargando skills:', error)
            throw error
        }
    }, [dispatch])

    const saveSkills = useCallback(async (skills) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(updateSkills(skills)).unwrap()
            return result
        } catch (error) {
            console.error('Error guardando skills:', error)
            throw error
        }
    }, [dispatch])

    const addNewSkill = useCallback(async (name, level) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const newSkill = await dispatch(addSkill({ name, level })).unwrap()
            return newSkill
        } catch (error) {
            console.error('Error agregando skill:', error)
            throw error
        }
    }, [dispatch])

    const changeSkillLevel = useCallback(async (skillName, newLevel) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const updatedSkill = await dispatch(updateSkillLevel({ skillName, newLevel })).unwrap()
            return updatedSkill
        } catch (error) {
            console.error('Error actualizando nivel:', error)
            throw error
        }
    }, [dispatch])

    const deleteSkill = useCallback(async (skillName) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const result = await dispatch(removeSkill(skillName)).unwrap()
            return result
        } catch (error) {
            console.error('Error eliminando skill:', error)
            throw error
        }
    }, [dispatch])

    const loadSuggestions = useCallback(async (options) => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const suggestions = await dispatch(fetchSuggestions(options)).unwrap()
            return suggestions
        } catch (error) {
            console.error('Error cargando sugerencias:', error)
            throw error
        }
    }, [dispatch])

    const loadStatistics = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const stats = await dispatch(fetchSkillStatistics()).unwrap()
            return stats
        } catch (error) {
            console.error('Error cargando estadísticas:', error)
            throw error
        }
    }, [dispatch])

    const calculateLevel = useCallback(async () => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const level = await dispatch(calculateDeveloperLevel()).unwrap()
            return level
        } catch (error) {
            console.error('Error calculando nivel:', error)
            throw error
        }
    }, [dispatch])

    // Acciones síncronas
    const setProgress = useCallback((progress) => {
        dispatch(setUploadProgress(progress))
    }, [dispatch])

    const cancelCVUpload = useCallback(() => {
        dispatch(cancelUpload())
    }, [dispatch])

    const clearErrors = useCallback(() => {
        dispatch(clearCVError())
    }, [dispatch])

    const resetCVAnalysis = useCallback(() => {
        dispatch(resetAnalysis())
    }, [dispatch])

    const selectSkill = useCallback((skillName) => {
        dispatch(selectSkillAction(skillName))
    }, [dispatch])

    const addTempSkill = useCallback((skill) => {
        dispatch(addTemporarySkill(skill))
    }, [dispatch])

    const removeTempSkill = useCallback((skillId) => {
        dispatch(removeTemporarySkill(skillId))
    }, [dispatch])

    const clearAllCVData = useCallback(() => {
        dispatch(clearCVState())
    }, [dispatch])

    // Utilitarios
    const getSkillByName = useCallback((skillName) => {
        return allSkills.find(skill => skill.name === skillName)
    }, [allSkills])

    const getSkillsByLevel = useCallback((level) => {
        return allSkills.filter(skill => skill.level === level)
    }, [allSkills])

    const getTopSkills = useCallback((limit = 10) => {
        return [...allSkills]
            .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
            .slice(0, limit)
    }, [allSkills])

    // Valores memoizados
    const skillCounts = useMemo(() => {
        // noinspection UnnecessaryLocalVariableJS
        const counts = {
            total: allSkills.length,
            cv: cvSkills.length,
            manual: manualSkills.length,
            byLevel: {
                beginner: allSkills.filter(s => s.level === 'beginner').length,
                intermediate: allSkills.filter(s => s.level === 'intermediate').length,
                advanced: allSkills.filter(s => s.level === 'advanced').length
            }
        }
        return counts
    }, [allSkills, cvSkills, manualSkills])

    const isLoading = useMemo(() => status === 'loading', [status])
    const hasError = useMemo(() => status === 'error', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isUploading = useMemo(() => upload.isUploading, [upload.isUploading])

    return {
        // Estado
        cvState,
        upload,
        analysis,
        allSkills,
        cvSkills,
        manualSkills,
        isAnalyzing,
        hasCompletedAnalysis,
        developerLevel,
        skillStats,
        projectSuggestions,
        skillSuggestions,
        status,
        error,

        // Acciones asíncronas
        uploadCVFile,
        analyzeCVFile,
        getCVAnalysis,
        waitForCVAnalysis,
        loadSkills,
        saveSkills,
        addNewSkill,
        changeSkillLevel,
        deleteSkill,
        loadSuggestions,
        loadStatistics,
        calculateLevel,

        // Acciones síncronas
        setProgress,
        cancelCVUpload,
        clearErrors,
        resetCVAnalysis,
        selectSkill,
        addTempSkill,
        removeTempSkill,
        clearAllCVData,

        // Utilitarios
        getSkillByName,
        getSkillsByLevel,
        getTopSkills,
        skillCounts,

        // Estados derivados
        isLoading,
        isUploading,
        hasError,
        isSuccess,

        // Flags de conveniencia
        hasSkills: allSkills.length > 0,
        hasCVSkills: cvSkills.length > 0,
        hasManualSkills: manualSkills.length > 0,
        hasUploadedCV: !!upload.lastUploaded,
        hasAnalysis: !!analysis.current,
        isAnalysisComplete: analysis.status === 'completed'
    }
}