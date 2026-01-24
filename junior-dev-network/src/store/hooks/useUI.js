/**
 * @fileoverview useUI Hook - Custom React hook for UI state management
 * @description Provides convenient access to UI state and actions from Redux store
 */

import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo, useEffect } from 'react'
import {
    // Acciones
    setThemeMode,
    toggleSidebar,
    openModal,
    closeModal,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    startLoading,
    stopLoading,
    setGlobalSearch,
    lockScroll,
    unlockScroll,
    // ... más acciones según necesites
    
    // Selectores
    selectUIState,
    selectThemeMode,
    selectIsDarkMode,
    selectIsSidebarCollapsed,
    selectCurrentRoute,
    selectActiveModal,
    selectModalCount,
    selectIsBackdropVisible,
    selectIsLeftDrawerOpen,
    selectIsRightDrawerOpen,
    selectToasts,
    selectVisibleToasts,
    selectBadgeCounts,
    selectTotalBadgeCount,
    selectIsLoading,
    selectLoadingText,
    selectLoadingProgress,
    selectGlobalSearch,
    selectActiveFilters,
    selectIsMobile,
    selectIsTablet,
    selectIsDesktop,
    selectIsScrollLocked,
    selectIsOnboardingCompleted,
    selectFeatureFlags,
    selectIsFeatureEnabled,
    
    // Selectores derivados
    selectUILayout,
    selectUITheme,
    selectUINotifications,
    selectUILoadingState
} from '../slices/uiSlice'
import { ThemeMode, NotificationType, ModalSize } from '../slices/uiSlice'

/**
 * Hook personalizado para UI
 */
export const useUI = () => {
    const dispatch = useDispatch()
    
    // Selectores básicos
    const uiState = useSelector(selectUIState)
    const themeMode = useSelector(selectThemeMode)
    const isDarkMode = useSelector(selectIsDarkMode)
    const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed)
    const currentRoute = useSelector(selectCurrentRoute)
    const activeModal = useSelector(selectActiveModal)
    const modalCount = useSelector(selectModalCount)
    const isBackdropVisible = useSelector(selectIsBackdropVisible)
    const isLeftDrawerOpen = useSelector(selectIsLeftDrawerOpen)
    const isRightDrawerOpen = useSelector(selectIsRightDrawerOpen)
    const toasts = useSelector(selectToasts)
    const visibleToasts = useSelector(selectVisibleToasts)
    const badgeCounts = useSelector(selectBadgeCounts)
    const totalBadgeCount = useSelector(selectTotalBadgeCount)
    const isLoading = useSelector(selectIsLoading)
    const loadingText = useSelector(selectLoadingText)
    const loadingProgress = useSelector(selectLoadingProgress)
    const globalSearch = useSelector(selectGlobalSearch)
    const activeFilters = useSelector(selectActiveFilters)
    const isMobile = useSelector(selectIsMobile)
    const isTablet = useSelector(selectIsTablet)
    const isDesktop = useSelector(selectIsDesktop)
    const isScrollLocked = useSelector(selectIsScrollLocked)
    const isOnboardingCompleted = useSelector(selectIsOnboardingCompleted)
    const featureFlags = useSelector(selectFeatureFlags)
    
    // Selectores derivados
    const uiLayout = useSelector(selectUILayout)
    const uiTheme = useSelector(selectUITheme)
    const uiNotifications = useSelector(selectUINotifications)
    const uiLoading = useSelector(selectUILoadingState)
    
    // Acciones de tema
    const toggleTheme = useCallback(() => {
        const newMode = themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT
        dispatch(setThemeMode(newMode))
    }, [dispatch, themeMode])
    
    const setLightTheme = useCallback(() => {
        dispatch(setThemeMode(ThemeMode.LIGHT))
    }, [dispatch])
    
    const setDarkTheme = useCallback(() => {
        dispatch(setThemeMode(ThemeMode.DARK))
    }, [dispatch])
    
    // Acciones de layout
    const toggleSidebarAction = useCallback(() => {
        dispatch(toggleSidebar())
    }, [dispatch])
    
    const expandSidebarAction = useCallback(() => {
        if (isSidebarCollapsed) {
            dispatch(toggleSidebar())
        }
    }, [dispatch, isSidebarCollapsed])
    
    const collapseSidebarAction = useCallback(() => {
        if (!isSidebarCollapsed) {
            dispatch(toggleSidebar())
        }
    }, [dispatch, isSidebarCollapsed])
    
    // Acciones de modales
    const openModalAction = useCallback((id, type, props = {}, size = ModalSize.MEDIUM) => {
        dispatch(openModal({ id, type, props, size }))
    }, [dispatch])
    
    const closeModalAction = useCallback((modalId) => {
        dispatch(closeModal(modalId))
    }, [dispatch])
    
    const closeAllModalsAction = useCallback(() => {
        dispatch(closeAllModals())
    }, [dispatch])
    
    // Acciones de notificaciones
    const showNotification = useCallback((notification) => {
        dispatch(showToast(notification))
    }, [dispatch])
    
    const showSuccessNotification = useCallback((message, title = '¡Éxito!') => {
        dispatch(showSuccessToast({ message, title }))
    }, [dispatch])
    
    const showErrorNotification = useCallback((message, title = 'Error') => {
        dispatch(showErrorToast({ message, title }))
    }, [dispatch])
    
    const showWarningNotification = useCallback((message, title = 'Advertencia') => {
        dispatch(showWarningToast({ message, title }))
    }, [dispatch])
    
    const closeNotification = useCallback((toastId) => {
        dispatch(closeToast(toastId))
    }, [dispatch])
    
    const closeAllNotifications = useCallback(() => {
        dispatch(closeAllToasts())
    }, [dispatch])
    
    // Acciones de loading
    const startLoadingAction = useCallback((text = null, blocking = false) => {
        dispatch(startLoading({ text, blocking }))
    }, [dispatch])
    
    const updateLoadingProgressAction = useCallback((progress) => {
        // Esta acción no existe en el slice, sería necesario agregarla
        // dispatch(updateLoadingProgress(progress))
    }, [dispatch])
    
    const stopLoadingAction = useCallback(() => {
        dispatch(stopLoading())
    }, [dispatch])
    
    // Acciones de búsqueda y filtros
    const setGlobalSearchAction = useCallback((searchTerm) => {
        dispatch(setGlobalSearch(searchTerm))
    }, [dispatch])
    
    const clearGlobalSearch = useCallback(() => {
        dispatch(setGlobalSearch(''))
    }, [dispatch])
    
    // Acciones de scroll
    const lockScrollAction = useCallback(() => {
        dispatch(lockScroll())
    }, [dispatch])
    
    const unlockScrollAction = useCallback(() => {
        dispatch(unlockScroll())
    }, [dispatch])
    
    // Efecto para detectar cambios en el viewport
    useEffect(() => {
        const handleResize = () => {
            // Esta acción no existe en el slice, sería necesario agregarla
            // dispatch(updateViewportSize({
            //   width: window.innerWidth,
            //   height: window.innerHeight
            // }))
        }
        
        window.addEventListener('resize', handleResize)
        handleResize() // Llamar inicialmente
        
        return () => window.removeEventListener('resize', handleResize)
    }, [dispatch])
    
    // Efecto para tema del sistema
    useEffect(() => {
        if (themeMode === ThemeMode.SYSTEM && typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            
            const handleChange = (e) => {
                // Actualizar tema basado en preferencia del sistema
                // Esta lógica sería manejada por el selector selectIsDarkMode
            }
            
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [themeMode])
    
    // Utilitarios
    const isFeatureEnabled = useCallback((feature) => {
        return !!featureFlags[feature]
    }, [featureFlags])
    
    const getFilterValue = useCallback((module, filterKey) => {
        return activeFilters[module]?.[filterKey] || null
    }, [activeFilters])
    
    const hasActiveFilters = useCallback((module) => {
        if (!module) {
            return Object.keys(activeFilters).length > 0
        }
        return activeFilters[module] && Object.keys(activeFilters[module]).length > 0
    }, [activeFilters])
    
    // Valores memoizados
    const layoutInfo = useMemo(() => ({
        isMobile,
        isTablet,
        isDesktop,
        sidebarVisible: !isSidebarCollapsed && !isMobile,
        headerVisible: uiLayout.headerVisible,
        footerVisible: uiLayout.footerVisible,
        breadcrumbsVisible: uiLayout.breadcrumbsVisible
    }), [isMobile, isTablet, isDesktop, isSidebarCollapsed, uiLayout])
    
    const themeInfo = useMemo(() => ({
        mode: themeMode,
        isDark: isDarkMode,
        primaryColor: uiTheme.colors.primary,
        secondaryColor: uiTheme.colors.secondary,
        accentColor: uiTheme.colors.accent,
        backgroundColor: uiTheme.colors.background,
        textColor: uiTheme.colors.text
    }), [themeMode, isDarkMode, uiTheme])
    
    const loadingInfo = useMemo(() => ({
        isLoading,
        isBlocking: uiLoading.blocking,
        text: loadingText,
        progress: loadingProgress,
        hasTasks: uiLoading.hasTasks,
        taskCount: uiLoading.taskCount,
        tasks: uiLoading.tasks
    }), [isLoading, uiLoading, loadingText, loadingProgress])
    
    return {
        // Estado
        uiState,
        themeMode,
        isDarkMode,
        isSidebarCollapsed,
        currentRoute,
        activeModal,
        modalCount,
        isBackdropVisible,
        isLeftDrawerOpen,
        isRightDrawerOpen,
        toasts,
        visibleToasts,
        badgeCounts,
        totalBadgeCount,
        isLoading: loadingInfo.isLoading,
        loadingText: loadingInfo.text,
        loadingProgress: loadingInfo.progress,
        globalSearch,
        activeFilters,
        isMobile,
        isTablet,
        isDesktop,
        isScrollLocked,
        isOnboardingCompleted,
        featureFlags,
        
        // Estado derivado
        layoutInfo,
        themeInfo,
        uiNotifications,
        loadingInfo,
        
        // Acciones de tema
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        
        // Acciones de layout
        toggleSidebar: toggleSidebarAction,
        expandSidebar: expandSidebarAction,
        collapseSidebar: collapseSidebarAction,
        
        // Acciones de modales
        openModal: openModalAction,
        closeModal: closeModalAction,
        closeAllModals: closeAllModalsAction,
        
        // Acciones de notificaciones
        showNotification,
        showSuccessNotification,
        showErrorNotification,
        showWarningNotification,
        closeNotification,
        closeAllNotifications,
        
        // Acciones de loading
        startLoading: startLoadingAction,
        updateLoadingProgress: updateLoadingProgressAction,
        stopLoading: stopLoadingAction,
        
        // Acciones de búsqueda
        setGlobalSearch: setGlobalSearchAction,
        clearGlobalSearch,
        
        // Acciones de scroll
        lockScroll: lockScrollAction,
        unlockScroll: unlockScrollAction,
        
        // Utilitarios
        isFeatureEnabled,
        getFilterValue,
        hasActiveFilters,
        
        // Flags de conveniencia
        hasActiveModal: !!activeModal,
        hasModals: modalCount > 0,
        hasToasts: toasts.length > 0,
        hasNotifications: totalBadgeCount > 0,
        hasLoadingTasks: loadingInfo.hasTasks,
        isBlockingLoading: loadingInfo.isBlocking,
        hasGlobalSearch: !!globalSearch,
        shouldShowSidebar: layoutInfo.sidebarVisible,
        isSmallScreen: isMobile || isTablet,
        isLargeScreen: isDesktop,
        isTouchDevice: isMobile || isTablet
    }
}