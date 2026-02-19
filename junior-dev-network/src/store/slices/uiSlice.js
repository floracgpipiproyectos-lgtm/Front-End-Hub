// store/slices/uiSlice.js
// noinspection UnnecessaryLocalVariableJS,JSDeprecatedSymbols

import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/constants/apiConfig'
import { LOADING_STATES } from '@/constants/apiConfig'
import { APP_CONSTANTS } from '@/constants/appConstants'

// =============================================
// ENUMS Y CONSTANTES
// =============================================

/**
 * @enum {string}
 */
export const ThemeMode = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
}

/**
 * @enum {string}
 */
export const LayoutType = {
    STANDARD: 'standard',
    COMPACT: 'compact',
    SPACIOUS: 'spacious'
}

/**
 * @enum {string}
 */
export const NotificationType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    DEFAULT: 'default'
}

/**
 * @enum {string}
 */
export const ToastPosition = {
    TOP_LEFT: 'top-left',
    TOP_CENTER: 'top-center',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_RIGHT: 'bottom-right'
}

/**
 * @enum {string}
 */
export const ModalSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge',
    FULLSCREEN: 'fullscreen'
}

// =============================================
// ESTADO INICIAL
// =============================================

const initialState = {
    // Tema y apariencia
    theme: {
        mode: localStorage.getItem(STORAGE_KEYS.THEME) || ThemeMode.LIGHT,
        primaryColor: APP_CONSTANTS.COLORS.PRIMARY,
        secondaryColor: APP_CONSTANTS.COLORS.SECONDARY,
        accentColor: APP_CONSTANTS.COLORS.ACCENT,
        isHighContrast: false,
        fontSize: 'medium',
        borderRadius: 'medium'
    },

    // Layout y navegación
    layout: {
        type: LayoutType.STANDARD,
        sidebarCollapsed: false,
        sidebarWidth: 240,
        headerVisible: true,
        footerVisible: true,
        breadcrumbsVisible: true
    },

    // Navegación y rutas
    navigation: {
        currentRoute: '/',
        previousRoute: null,
        routeHistory: [],
        redirectTo: null,
        isNavigating: false,
        navigationBlocked: false,
        blockNavigationMessage: null
    },

    // Modales y overlays
    modals: {
        activeModals: [], // Array de modales abiertos {id, type, props}
        backdropVisible: false,
        modalStack: [] // Para manejar modales anidados
    },

    // Drawers y paneles laterales
    drawers: {
        leftDrawer: {
            open: false,
            width: 320,
            content: null,
            persistent: false
        },
        rightDrawer: {
            open: false,
            width: 400,
            content: null,
            persistent: false
        },
        bottomSheet: {
            open: false,
            height: 300,
            content: null,
            snapPoints: [100, 300, 500]
        }
    },

    // Notificaciones y toasts
    notifications: {
        toasts: [],
        banners: [],
        badgeCounts: {
            notifications: 0,
            messages: 0,
            tasks: 0
        },
        position: ToastPosition.BOTTOM_RIGHT,
        autoCloseDelay: 5000,
        maxVisible: 3
    },

    // Carga y progreso
    loading: {
        isLoading: false,
        loadingText: null,
        progress: 0,
        indeterminate: true,
        blocking: false,
        loadingTasks: {} // {taskId: {text, progress, indeterminate}}
    },

    // Formularios y validación
    forms: {
        activeForm: null,
        dirtyForms: [], // IDs de formularios con cambios sin guardar
        submitting: false,
        submissionErrors: {},
        autoSaveEnabled: true,
        autoSaveInterval: 30000 // 30 segundos
    },

    // Filtros y búsqueda
    filters: {
        globalSearch: '',
        activeFilters: {}, // {module: {filterKey: value}}
        savedFilters: [], // Filtros guardados por el usuario
        filterPresets: {} // Presets predefinidos
    },

    // Tooltips y ayuda
    tooltips: {
        enabled: true,
        showTooltips: true,
        activeTooltip: null,
        dismissedTooltips: [], // IDs de tooltips que el usuario ha descartado
        helpMode: false // Modo tutorial/ayuda activado
    },

    // Animaciones y transiciones
    animations: {
        enabled: true,
        reducedMotion: false,
        transitionSpeed: 'normal', // 'slow', 'normal', 'fast'
        rippleEffect: true,
        hoverEffects: true
    },

    // Scroll y viewport
    viewport: {
        scrollPosition: {}, // {route: {x, y}}
        viewportSize: {
            width: typeof window !== 'undefined' ? window.innerWidth : 1024,
            height: typeof window !== 'undefined' ? window.innerHeight : 768
        },
        breakpoint: 'desktop', // 'mobile', 'tablet', 'desktop', 'large'
        orientation: 'landscape',
        scrollLocked: false
    },

    // Estado general
    status: LOADING_STATES.IDLE,
    error: null,
    lastUpdated: null,

    // Metadata
    meta: {
        firstVisit: !localStorage.getItem(STORAGE_KEYS.FIRST_VISIT),
        onboardingCompleted: !!localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        tourCompleted: !!localStorage.getItem(STORAGE_KEYS.TOUR_COMPLETED),
        lastActivity: Date.now(),
        sessionStart: Date.now(),
        uiVersion: '1.0.0',
        featureFlags: {} // Flags de funcionalidades
    }
}

// =============================================
// SLICE PRINCIPAL
// =============================================

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // =============================================
        // TEMA Y APARIENCIA
        // =============================================

        /**
         * Cambia el tema de la aplicación
         */
        setThemeMode: (state, action) => {
            const mode = action.payload
            state.theme.mode = mode
            localStorage.setItem(STORAGE_KEYS.THEME, mode)

            // Aplicar tema al DOM
            if (typeof document !== 'undefined') {
                if (mode === ThemeMode.DARK) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            }
        },

        /**
         * Cambia el color primario
         */
        setPrimaryColor: (state, action) => {
            state.theme.primaryColor = action.payload
            // Actualizar CSS variables
            updateCSSVariable('--color-primary', action.payload)
        },

        /**
         * Cambia el color secundario
         */
        setSecondaryColor: (state, action) => {
            state.theme.secondaryColor = action.payload
            updateCSSVariable('--color-secondary', action.payload)
        },

        /**
         * Cambia el tamaño de fuente
         */
        setFontSize: (state, action) => {
            const size = action.payload
            state.theme.fontSize = size

            const sizeMap = {
                'small': '14px',
                'medium': '16px',
                'large': '18px',
                'xlarge': '20px'
            }

            updateCSSVariable('--font-size-base', sizeMap[size] || '16px')
        },

        /**
         * Alterna modo alto contraste
         */
        toggleHighContrast: (state) => {
            state.theme.isHighContrast = !state.theme.isHighContrast
            document.documentElement.classList.toggle('high-contrast', state.theme.isHighContrast)
        },

        /**
         * Restablece tema a valores por defecto
         */
        resetTheme: (state) => {
            state.theme = {
                ...initialState.theme,
                mode: localStorage.getItem(STORAGE_KEYS.THEME) || ThemeMode.LIGHT
            }

            // Restaurar CSS variables
            restoreDefaultCSSVariables()
        },

        // =============================================
        // LAYOUT Y NAVEGACIÓN
        // =============================================

        /**
         * Cambia tipo de layout
         */
        setLayoutType: (state, action) => {
            state.layout.type = action.payload
        },

        /**
         * Alterna sidebar (colapsar/expandir)
         */
        toggleSidebar: (state) => {
            state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed
        },

        /**
         * Expande sidebar
         */
        expandSidebar: (state) => {
            state.layout.sidebarCollapsed = false
        },

        /**
         * Colapsa sidebar
         */
        collapseSidebar: (state) => {
            state.layout.sidebarCollapsed = true
        },

        /**
         * Muestra/oculta header
         */
        toggleHeader: (state) => {
            state.layout.headerVisible = !state.layout.headerVisible
        },

        /**
         * Muestra/oculta footer
         */
        toggleFooter: (state) => {
            state.layout.footerVisible = !state.layout.footerVisible
        },

        /**
         * Muestra/oculta breadcrumbs
         */
        toggleBreadcrumbs: (state) => {
            state.layout.breadcrumbsVisible = !state.layout.breadcrumbsVisible
        },

        /**
         * Actualiza ancho del sidebar
         */
        setSidebarWidth: (state, action) => {
            const width = Math.max(200, Math.min(400, action.payload))
            state.layout.sidebarWidth = width
        },

        // =============================================
        // NAVEGACIÓN Y RUTAS
        // =============================================

        /**
         * Navega a una nueva ruta
         */
        navigateTo: (state, action) => {
            const route = action.payload
            const currentRoute = state.navigation.currentRoute

            // Guardar ruta anterior
            if (currentRoute && currentRoute !== route) {
                state.navigation.previousRoute = currentRoute

                // Guardar en historial (limitado a 50 rutas)
                state.navigation.routeHistory.unshift({
                    route: currentRoute,
                    timestamp: Date.now()
                })

                if (state.navigation.routeHistory.length > 50) {
                    state.navigation.routeHistory.pop()
                }
            }

            state.navigation.currentRoute = route
            state.navigation.isNavigating = false
        },

        /**
         * Inicia navegación
         */
        startNavigation: (state) => {
            state.navigation.isNavigating = true
        },

        /**
         * Cancela navegación
         */
        cancelNavigation: (state) => {
            state.navigation.isNavigating = false
        },

        /**
         * Redirige a una ruta
         */
        setRedirect: (state, action) => {
            state.navigation.redirectTo = action.payload
        },

        /**
         * Limpia redirección
         */
        clearRedirect: (state) => {
            state.navigation.redirectTo = null
        },

        /**
         * Bloquea navegación (para prevenir salir sin guardar)
         */
        blockNavigation: (state, action) => {
            state.navigation.navigationBlocked = true
            state.navigation.blockNavigationMessage = action.payload || 'Hay cambios sin guardar. ¿Seguro que quieres salir?'
        },

        /**
         * Desbloquea navegación
         */
        unblockNavigation: (state) => {
            state.navigation.navigationBlocked = false
            state.navigation.blockNavigationMessage = null
        },

        // =============================================
        // MODALES
        // =============================================

        /**
         * Abre un modal
         */
        openModal: (state, action) => {
            const { id, type, props = {}, size = ModalSize.MEDIUM } = action.payload

            const modal = {
                id,
                type,
                props,
                size,
                openedAt: Date.now()
            }

            // Agregar al stack
            state.modals.modalStack.push(modal)
            state.modals.activeModals.push(modal)
            state.modals.backdropVisible = true
        },

        /**
         * Cierra un modal específico
         */
        closeModal: (state, action) => {
            const modalId = action.payload

            // Remover del stack
            state.modals.modalStack = state.modals.modalStack.filter(m => m.id !== modalId)
            state.modals.activeModals = state.modals.activeModals.filter(m => m.id !== modalId)

            // Ocultar backdrop si no hay modales
            state.modals.backdropVisible = state.modals.activeModals.length > 0
        },

        /**
         * Cierra todos los modales
         */
        closeAllModals: (state) => {
            state.modals.modalStack = []
            state.modals.activeModals = []
            state.modals.backdropVisible = false
        },

        /**
         * Cierra el modal superior
         */
        closeTopModal: (state) => {
            if (state.modals.modalStack.length > 0) {
                const topModal = state.modals.modalStack.pop()
                state.modals.activeModals = state.modals.activeModals.filter(m => m.id !== topModal.id)
                state.modals.backdropVisible = state.modals.activeModals.length > 0
            }
        },

        /**
         * Actualiza props de un modal
         */
        updateModalProps: (state, action) => {
            const { modalId, props } = action.payload
            const modalIndex = state.modals.activeModals.findIndex(m => m.id === modalId)

            if (modalIndex !== -1) {
                state.modals.activeModals[modalIndex].props = {
                    ...state.modals.activeModals[modalIndex].props,
                    ...props
                }
            }
        },

        // =============================================
        // DRAWERS Y PANELES
        // =============================================

        /**
         * Abre drawer izquierdo
         */
        openLeftDrawer: (state, action) => {
            state.drawers.leftDrawer.open = true
            if (action.payload?.content) {
                state.drawers.leftDrawer.content = action.payload.content
            }
            if (action.payload?.width) {
                state.drawers.leftDrawer.width = action.payload.width
            }
        },

        /**
         * Cierra drawer izquierdo
         */
        closeLeftDrawer: (state) => {
            state.drawers.leftDrawer.open = false
        },

        /**
         * Abre drawer derecho
         */
        openRightDrawer: (state, action) => {
            state.drawers.rightDrawer.open = true
            if (action.payload?.content) {
                state.drawers.rightDrawer.content = action.payload.content
            }
            if (action.payload?.width) {
                state.drawers.rightDrawer.width = action.payload.width
            }
        },

        /**
         * Cierra drawer derecho
         */
        closeRightDrawer: (state) => {
            state.drawers.rightDrawer.open = false
        },

        /**
         * Abre bottom sheet
         */
        openBottomSheet: (state, action) => {
            state.drawers.bottomSheet.open = true
            if (action.payload?.content) {
                state.drawers.bottomSheet.content = action.payload.content
            }
            if (action.payload?.height) {
                state.drawers.bottomSheet.height = action.payload.height
            }
        },

        /**
         * Cierra bottom sheet
         */
        closeBottomSheet: (state) => {
            state.drawers.bottomSheet.open = false
        },

        /**
         * Alterna drawer izquierdo
         */
        toggleLeftDrawer: (state) => {
            state.drawers.leftDrawer.open = !state.drawers.leftDrawer.open
        },

        /**
         * Alterna drawer derecho
         */
        toggleRightDrawer: (state) => {
            state.drawers.rightDrawer.open = !state.drawers.rightDrawer.open
        },

        // =============================================
        // NOTIFICACIONES Y TOASTS
        // =============================================

        /**
         * Muestra un toast
         */
        showToast: (state, action) => {
            const toast = {
                id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: NotificationType.INFO,
                title: null,
                message: '',
                duration: 5000,
                createdAt: Date.now(),
                ...action.payload
            }

            state.notifications.toasts.unshift(toast)

            // Limitar cantidad visible
            if (state.notifications.toasts.length > state.notifications.maxVisible) {
                state.notifications.toasts = state.notifications.toasts.slice(0, state.notifications.maxVisible)
            }
        },

        /**
         * Muestra toast de éxito
         */
        showSuccessToast: (state, action) => {
            const payload = typeof action.payload === 'string'
                ? { message: action.payload }
                : action.payload

            state.ui.showToast({
                type: NotificationType.SUCCESS,
                title: '¡Éxito!',
                ...payload
            })
        },

        /**
         * Muestra toast de error
         */
        showErrorToast: (state, action) => {
            const payload = typeof action.payload === 'string'
                ? { message: action.payload }
                : action.payload

            state.ui.showToast({
                type: NotificationType.ERROR,
                title: 'Error',
                ...payload
            })
        },

        /**
         * Muestra toast de advertencia
         */
        showWarningToast: (state, action) => {
            const payload = typeof action.payload === 'string'
                ? { message: action.payload }
                : action.payload

            state.ui.showToast({
                type: NotificationType.WARNING,
                title: 'Advertencia',
                ...payload
            })
        },

        /**
         * Cierra un toast específico
         */
        closeToast: (state, action) => {
            const toastId = action.payload
            state.notifications.toasts = state.notifications.toasts.filter(t => t.id !== toastId)
        },

        /**
         * Cierra todos los toasts
         */
        closeAllToasts: (state) => {
            state.notifications.toasts = []
        },

        /**
         * Actualiza contador de badges
         */
        updateBadgeCount: (state, action) => {
            const { type, count } = action.payload
            if (state.notifications.badgeCounts.hasOwnProperty(type)) {
                state.notifications.badgeCounts[type] = count
            }
        },

        /**
         * Incrementa contador de badges
         */
        incrementBadgeCount: (state, action) => {
            const { type, amount = 1 } = action.payload
            if (state.notifications.badgeCounts.hasOwnProperty(type)) {
                state.notifications.badgeCounts[type] += amount
            }
        },

        /**
         * Decrementa contador de badges
         */
        decrementBadgeCount: (state, action) => {
            const { type, amount = 1 } = action.payload
            if (state.notifications.badgeCounts.hasOwnProperty(type)) {
                state.notifications.badgeCounts[type] = Math.max(0, state.notifications.badgeCounts[type] - amount)
            }
        },

        /**
         * Resetea contadores de badges
         */
        resetBadgeCounts: (state) => {
            state.notifications.badgeCounts = {
                notifications: 0,
                messages: 0,
                tasks: 0
            }
        },

        // =============================================
        // CARGA Y PROGRESO
        // =============================================

        /**
         * Inicia loading global
         */
        startLoading: (state, action) => {
            state.loading.isLoading = true
            state.loading.loadingText = action.payload?.text || null
            state.loading.blocking = action.payload?.blocking || false
            state.loading.indeterminate = action.payload?.indeterminate ?? true
            state.loading.progress = 0
        },

        /**
         * Actualiza progreso de loading
         */
        updateLoadingProgress: (state, action) => {
            if (state.loading.isLoading) {
                state.loading.progress = Math.min(100, Math.max(0, action.payload))
                state.loading.indeterminate = false
            }
        },

        /**
         * Finaliza loading global
         */
        stopLoading: (state) => {
            state.loading.isLoading = false
            state.loading.loadingText = null
            state.loading.progress = 0
            state.loading.blocking = false
        },

        /**
         * Inicia una tarea de loading específica
         */
        startLoadingTask: (state, action) => {
            const { taskId, text, blocking = false, indeterminate = true } = action.payload

            state.loading.loadingTasks[taskId] = {
                text,
                progress: 0,
                indeterminate,
                startedAt: Date.now()
            }

            // Si es blocking, activar loading global
            if (blocking) {
                state.loading.isLoading = true
                state.loading.blocking = true
            }
        },

        /**
         * Actualiza progreso de una tarea
         */
        updateLoadingTask: (state, action) => {
            const { taskId, progress, text } = action.payload
            const task = state.loading.loadingTasks[taskId]

            if (task) {
                if (progress !== undefined) {
                    task.progress = Math.min(100, Math.max(0, progress))
                    task.indeterminate = false
                }
                if (text !== undefined) {
                    task.text = text
                }
            }
        },

        /**
         * Finaliza una tarea de loading
         */
        stopLoadingTask: (state, action) => {
            const taskId = action.payload
            delete state.loading.loadingTasks[taskId]

            // Si no hay más tareas, desactivar loading global
            if (Object.keys(state.loading.loadingTasks).length === 0) {
                state.loading.isLoading = false
                state.loading.blocking = false
            }
        },

        // =============================================
        // FORMULARIOS
        // =============================================

        /**
         * Establece formulario activo
         */
        setActiveForm: (state, action) => {
            state.forms.activeForm = action.payload
        },

        /**
         * Marca formulario como dirty (con cambios)
         */
        markFormAsDirty: (state, action) => {
            const formId = action.payload
            if (!state.forms.dirtyForms.includes(formId)) {
                state.forms.dirtyForms.push(formId)
            }
        },

        /**
         * Marca formulario como clean (sin cambios)
         */
        markFormAsClean: (state, action) => {
            const formId = action.payload
            state.forms.dirtyForms = state.forms.dirtyForms.filter(id => id !== formId)
        },

        /**
         * Inicia envío de formulario
         */
        startFormSubmission: (state) => {
            state.forms.submitting = true
        },

        /**
         * Finaliza envío de formulario
         */
        finishFormSubmission: (state) => {
            state.forms.submitting = false
        },

        /**
         * Agrega error de envío
         */
        addSubmissionError: (state, action) => {
            const { formId, error } = action.payload
            state.forms.submissionErrors[formId] = error
        },

        /**
         * Limpia errores de envío
         */
        clearSubmissionErrors: (state) => {
            state.forms.submissionErrors = {}
        },

        /**
         * Alterna autoguardado
         */
        toggleAutoSave: (state) => {
            state.forms.autoSaveEnabled = !state.forms.autoSaveEnabled
        },

        // =============================================
        // FILTROS Y BÚSQUEDA
        // =============================================

        /**
         * Establece búsqueda global
         */
        setGlobalSearch: (state, action) => {
            state.filters.globalSearch = action.payload
        },

        /**
         * Aplica filtro a un módulo específico
         */
        applyFilter: (state, action) => {
            const { module, filterKey, value } = action.payload

            if (!state.filters.activeFilters[module]) {
                state.filters.activeFilters[module] = {}
            }

            state.filters.activeFilters[module][filterKey] = value
        },

        /**
         * Elimina filtro de un módulo
         */
        removeFilter: (state, action) => {
            const { module, filterKey } = action.payload

            if (state.filters.activeFilters[module]) {
                delete state.filters.activeFilters[module][filterKey]

                // Si el módulo no tiene más filtros, eliminar el objeto
                if (Object.keys(state.filters.activeFilters[module]).length === 0) {
                    delete state.filters.activeFilters[module]
                }
            }
        },

        /**
         * Limpia todos los filtros de un módulo
         */
        clearModuleFilters: (state, action) => {
            const module = action.payload
            delete state.filters.activeFilters[module]
        },

        /**
         * Limpia todos los filtros
         */
        clearAllFilters: (state) => {
            state.filters.activeFilters = {}
            state.filters.globalSearch = ''
        },

        /**
         * Guarda un filtro para uso futuro
         */
        saveFilter: (state, action) => {
            const filter = action.payload
            state.filters.savedFilters.push({
                ...filter,
                id: `filter_${Date.now()}`,
                savedAt: Date.now()
            })
        },

        // =============================================
        // TOOLTIPS Y AYUDA
        // =============================================

        /**
         * Muestra un tooltip
         */
        showTooltip: (state, action) => {
            state.tooltips.activeTooltip = action.payload
        },

        /**
         * Oculta tooltip activo
         */
        hideTooltip: (state) => {
            state.tooltips.activeTooltip = null
        },

        /**
         * Marca tooltip como descartado
         */
        dismissTooltip: (state, action) => {
            const tooltipId = action.payload
            if (!state.tooltips.dismissedTooltips.includes(tooltipId)) {
                state.tooltips.dismissedTooltips.push(tooltipId)
            }
        },

        /**
         * Activa modo ayuda/tutorial
         */
        enableHelpMode: (state) => {
            state.tooltips.helpMode = true
            state.tooltips.showTooltips = true
        },

        /**
         * Desactiva modo ayuda/tutorial
         */
        disableHelpMode: (state) => {
            state.tooltips.helpMode = false
        },

        /**
         * Alterna tooltips
         */
        toggleTooltips: (state) => {
            state.tooltips.showTooltips = !state.tooltips.showTooltips
        },

        // =============================================
        // ANIMACIONES
        // =============================================

        /**
         * Alterna animaciones
         */
        toggleAnimations: (state) => {
            state.animations.enabled = !state.animations.enabled
            document.documentElement.classList.toggle('no-animations', !state.animations.enabled)
        },

        /**
         * Activa reducción de movimiento
         */
        enableReducedMotion: (state) => {
            state.animations.reducedMotion = true
            document.documentElement.classList.add('reduced-motion')
        },

        /**
         * Desactiva reducción de movimiento
         */
        disableReducedMotion: (state) => {
            state.animations.reducedMotion = false
            document.documentElement.classList.remove('reduced-motion')
        },

        /**
         * Cambia velocidad de transiciones
         */
        setTransitionSpeed: (state, action) => {
            state.animations.transitionSpeed = action.payload

            const speedMap = {
                'slow': '0.5s',
                'normal': '0.3s',
                'fast': '0.15s'
            }

            updateCSSVariable('--transition-speed', speedMap[action.payload] || '0.3s')
        },

        /**
         * Alterna efecto ripple
         */
        toggleRippleEffect: (state) => {
            state.animations.rippleEffect = !state.animations.rippleEffect
        },

        /**
         * Alterna efectos hover
         */
        toggleHoverEffects: (state) => {
            state.animations.hoverEffects = !state.animations.hoverEffects
        },

        // =============================================
        // VIEWPORT Y SCROLL
        // =============================================

        /**
         * Actualiza tamaño del viewport
         */
        updateViewportSize: (state, action) => {
            const { width, height } = action.payload
            state.viewport.viewportSize = { width, height }

            // Determinar breakpoint
            if (width < 640) {
                state.viewport.breakpoint = 'mobile'
            } else if (width < 1024) {
                state.viewport.breakpoint = 'tablet'
            } else if (width < 1440) {
                state.viewport.breakpoint = 'desktop'
            } else {
                state.viewport.breakpoint = 'large'
            }

            // Determinar orientación
            state.viewport.orientation = width > height ? 'landscape' : 'portrait'
        },

        /**
         * Guarda posición de scroll para una ruta
         */
        saveScrollPosition: (state, action) => {
            const { route, x, y } = action.payload
            state.viewport.scrollPosition[route] = { x, y }
        },

        /**
         * Bloquea scroll
         */
        lockScroll: (state) => {
            state.viewport.scrollLocked = true
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'hidden'
            }
        },

        /**
         * Desbloquea scroll
         */
        unlockScroll: (state) => {
            state.viewport.scrollLocked = false
            if (typeof document !== 'undefined') {
                document.body.style.overflow = ''
            }
        },

        // =============================================
        // METADATA Y CONFIGURACIÓN
        // =============================================

        /**
         * Marca onboarding como completado
         */
        completeOnboarding: (state) => {
            state.meta.onboardingCompleted = true
            localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true')
        },

        /**
         * Marca tour como completado
         */
        completeTour: (state) => {
            state.meta.tourCompleted = true
            localStorage.setItem(STORAGE_KEYS.TOUR_COMPLETED, 'true')
        },

        /**
         * Actualiza actividad del usuario
         */
        updateActivity: (state) => {
            state.meta.lastActivity = Date.now()
        },

        /**
         * Establece feature flags
         */
        setFeatureFlags: (state, action) => {
            state.meta.featureFlags = action.payload
        },

        /**
         * Habilita un feature flag
         */
        enableFeatureFlag: (state, action) => {
            const feature = action.payload
            state.meta.featureFlags[feature] = true
        },

        /**
         * Deshabilita un feature flag
         */
        disableFeatureFlag: (state, action) => {
            const feature = action.payload
            state.meta.featureFlags[feature] = false
        },

        // =============================================
        // UTILITARIOS Y RESET
        // =============================================

        /**
         * Limpia errores de UI
         */
        clearUIError: (state) => {
            state.error = null
            state.status = LOADING_STATES.IDLE
        },

        /**
         * Resetea estado de UI
         */
        resetUIState: () => {
            // Mantener algunas configuraciones persistentes
            const persistentTheme = localStorage.getItem(STORAGE_KEYS.THEME)
            const onboardingCompleted = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED)

            return {
                ...initialState,
                theme: {
                    ...initialState.theme,
                    mode: persistentTheme || initialState.theme.mode
                },
                meta: {
                    ...initialState.meta,
                    onboardingCompleted: !!onboardingCompleted
                }
            }
        },

        /**
         * Simula evento de UI (para desarrollo)
         */
        simulateUIEvent: (state, action) => {
            const { type, data } = action.payload

            switch (type) {
                case 'show_notification':
                    state.ui.showToast({
                        type: data.type || 'info',
                        title: data.title || 'Notificación simulada',
                        message: data.message || 'Esto es una notificación de prueba'
                    })
                    break

                case 'toggle_sidebar':
                    state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed
                    break

                case 'change_theme':
                    const newTheme = state.theme.mode === 'light' ? 'dark' : 'light'
                    state.ui.setThemeMode(newTheme)
                    break
            }
        }
    }
})

// =============================================
// FUNCIONES HELPER
// =============================================

/**
 * Actualiza variable CSS en el documento
 */
const updateCSSVariable = (variable, value) => {
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(variable, value)
    }
}

/**
 * Restaura variables CSS por defecto
 */
const restoreDefaultCSSVariables = () => {
    if (typeof document !== 'undefined') {
        // Restaurar colores
        updateCSSVariable('--color-primary', APP_CONSTANTS.COLORS.PRIMARY)
        updateCSSVariable('--color-secondary', APP_CONSTANTS.COLORS.SECONDARY)
        updateCSSVariable('--color-accent', APP_CONSTANTS.COLORS.ACCENT)

        // Restaurar tamaño de fuente
        updateCSSVariable('--font-size-base', '16px')

        // Restaurar velocidad de transición
        updateCSSVariable('--transition-speed', '0.3s')
    }
}

// =============================================
// SELECTORS
// =============================================

// Selectores básicos
export const selectUIState = (state) => state.ui
export const selectTheme = (state) => state.ui.theme
export const selectLayout = (state) => state.ui.layout
export const selectNavigation = (state) => state.ui.navigation
export const selectModals = (state) => state.ui.modals
export const selectDrawers = (state) => state.ui.drawers
export const selectNotifications = (state) => state.ui.notifications
export const selectLoading = (state) => state.ui.loading
export const selectForms = (state) => state.ui.forms
export const selectFilters = (state) => state.ui.filters
export const selectTooltips = (state) => state.ui.tooltips
export const selectAnimations = (state) => state.ui.animations
export const selectViewport = (state) => state.ui.viewport
export const selectUIMeta = (state) => state.ui.meta
export const selectUIStatus = (state) => state.ui.status
export const selectUIError = (state) => state.ui.error

// Selectores derivados
export const selectThemeMode = (state) => state.ui.theme.mode
export const selectIsDarkMode = (state) => {
    const mode = state.ui.theme.mode
    if (mode === ThemeMode.SYSTEM && typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return mode === ThemeMode.DARK
}

export const selectIsSidebarCollapsed = (state) => state.ui.layout.sidebarCollapsed
export const selectCurrentRoute = (state) => state.ui.navigation.currentRoute
export const selectPreviousRoute = (state) => state.ui.navigation.previousRoute
export const selectIsNavigating = (state) => state.ui.navigation.isNavigating
export const selectIsNavigationBlocked = (state) => state.ui.navigation.navigationBlocked

export const selectActiveModal = (state) => {
    const modals = state.ui.modals.modalStack
    return modals.length > 0 ? modals[modals.length - 1] : null
}

export const selectModalCount = (state) => state.ui.modals.activeModals.length
export const selectIsBackdropVisible = (state) => state.ui.modals.backdropVisible

export const selectIsLeftDrawerOpen = (state) => state.ui.drawers.leftDrawer.open
export const selectIsRightDrawerOpen = (state) => state.ui.drawers.rightDrawer.open
export const selectIsBottomSheetOpen = (state) => state.ui.drawers.bottomSheet.open

export const selectToasts = (state) => state.ui.notifications.toasts
export const selectVisibleToasts = (state) => {
    const toasts = state.ui.notifications.toasts
    const maxVisible = state.ui.notifications.maxVisible
    return toasts.slice(0, maxVisible)
}

export const selectBadgeCounts = (state) => state.ui.notifications.badgeCounts
export const selectTotalBadgeCount = (state) => {
    const counts = state.ui.notifications.badgeCounts
    return Object.values(counts).reduce((sum, count) => sum + count, 0)
}

export const selectIsLoading = (state) => state.ui.loading.isLoading
export const selectLoadingText = (state) => state.ui.loading.loadingText
export const selectLoadingProgress = (state) => state.ui.loading.progress
export const selectIsLoadingBlocking = (state) => state.ui.loading.blocking
export const selectLoadingTasks = (state) => state.ui.loading.loadingTasks

export const selectActiveForm = (state) => state.ui.forms.activeForm
export const selectDirtyForms = (state) => state.ui.forms.dirtyForms
export const selectIsFormSubmitting = (state) => state.ui.forms.submitting
export const selectHasDirtyForms = (state) => state.ui.forms.dirtyForms.length > 0

export const selectGlobalSearch = (state) => state.ui.filters.globalSearch
export const selectActiveFilters = (state) => state.ui.filters.activeFilters
export const selectModuleFilters = (module) => (state) =>
    state.ui.filters.activeFilters[module] || {}

export const selectIsTooltipActive = (state) => state.ui.tooltips.activeTooltip !== null
export const selectActiveTooltip = (state) => state.ui.tooltips.activeTooltip
export const selectIsHelpModeActive = (state) => state.ui.tooltips.helpMode

export const selectAreAnimationsEnabled = (state) => state.ui.animations.enabled
export const selectIsReducedMotion = (state) => state.ui.animations.reducedMotion

export const selectViewportSize = (state) => state.ui.viewport.viewportSize
export const selectBreakpoint = (state) => state.ui.viewport.breakpoint
export const selectIsMobile = (state) => state.ui.viewport.breakpoint === 'mobile'
export const selectIsTablet = (state) => state.ui.viewport.breakpoint === 'tablet'
export const selectIsDesktop = (state) => state.ui.viewport.breakpoint === 'desktop'
export const selectIsLargeScreen = (state) => state.ui.viewport.breakpoint === 'large'
export const selectIsScrollLocked = (state) => state.ui.viewport.scrollLocked

export const selectScrollPosition = (route) => (state) =>
    state.ui.viewport.scrollPosition[route] || { x: 0, y: 0 }

export const selectIsOnboardingCompleted = (state) => state.ui.meta.onboardingCompleted
export const selectIsTourCompleted = (state) => state.ui.meta.tourCompleted
export const selectFeatureFlags = (state) => state.ui.meta.featureFlags
export const selectIsFeatureEnabled = (feature) => (state) =>
    !!state.ui.meta.featureFlags[feature]

export const selectIsFirstVisit = (state) => state.ui.meta.firstVisit
export const selectSessionDuration = (state) => {
    const start = state.ui.meta.sessionStart
    return Math.floor((Date.now() - start) / 1000) // segundos
}

// Selectores combinados
export const selectUILayout = createSelector(
    [selectLayout, selectViewport],
    (layout, viewport) => ({
        ...layout,
        isMobile: viewport.breakpoint === 'mobile',
        isTablet: viewport.breakpoint === 'tablet',
        sidebarVisible: !layout.sidebarCollapsed && viewport.breakpoint !== 'mobile'
    })
)

export const selectUITheme = createSelector(
    [selectTheme, selectIsDarkMode],
    (theme, isDarkMode) => ({
        ...theme,
        computedMode: isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT,
        colors: {
            primary: theme.primaryColor,
            secondary: theme.secondaryColor,
            accent: theme.accentColor,
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            text: isDarkMode ? '#ffffff' : '#000000'
        }
    })
)

export const selectUINotifications = createSelector(
    [selectNotifications, selectBadgeCounts],
    (notifications, badgeCounts) => ({
        ...notifications,
        toasts: notifications.toasts.slice(0, notifications.maxVisible),
        hasUnread: Object.values(badgeCounts).some(count => count > 0),
        totalUnread: Object.values(badgeCounts).reduce((sum, count) => sum + count, 0)
    })
)

export const selectUILoadingState = createSelector(
    [selectLoading, selectLoadingTasks],
    (loading, loadingTasks) => ({
        ...loading,
        hasTasks: Object.keys(loadingTasks).length > 0,
        taskCount: Object.keys(loadingTasks).length,
        tasks: Object.values(loadingTasks)
    })
)

// =============================================
// EXPORTACIONES
// =============================================

// Exportar acciones
export const {
    // Tema
    setThemeMode,
    setPrimaryColor,
    setSecondaryColor,
    setFontSize,
    toggleHighContrast,
    resetTheme,

    // Layout
    setLayoutType,
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
    toggleHeader,
    toggleFooter,
    toggleBreadcrumbs,
    setSidebarWidth,

    // Navegación
    navigateTo,
    startNavigation,
    cancelNavigation,
    setRedirect,
    clearRedirect,
    blockNavigation,
    unblockNavigation,

    // Modales
    openModal,
    closeModal,
    closeAllModals,
    closeTopModal,
    updateModalProps,

    // Drawers
    openLeftDrawer,
    closeLeftDrawer,
    openRightDrawer,
    closeRightDrawer,
    openBottomSheet,
    closeBottomSheet,
    toggleLeftDrawer,
    toggleRightDrawer,

    // Notificaciones
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    closeToast,
    closeAllToasts,
    updateBadgeCount,
    incrementBadgeCount,
    decrementBadgeCount,
    resetBadgeCounts,

    // Loading
    startLoading,
    updateLoadingProgress,
    stopLoading,
    startLoadingTask,
    updateLoadingTask,
    stopLoadingTask,

    // Formularios
    setActiveForm,
    markFormAsDirty,
    markFormAsClean,
    startFormSubmission,
    finishFormSubmission,
    addSubmissionError,
    clearSubmissionErrors,
    toggleAutoSave,

    // Filtros
    setGlobalSearch,
    applyFilter,
    removeFilter,
    clearModuleFilters,
    clearAllFilters,
    saveFilter,

    // Tooltips
    showTooltip,
    hideTooltip,
    dismissTooltip,
    enableHelpMode,
    disableHelpMode,
    toggleTooltips,

    // Animaciones
    toggleAnimations,
    enableReducedMotion,
    disableReducedMotion,
    setTransitionSpeed,
    toggleRippleEffect,
    toggleHoverEffects,

    // Viewport
    updateViewportSize,
    saveScrollPosition,
    lockScroll,
    unlockScroll,

    // Metadata
    completeOnboarding,
    completeTour,
    updateActivity,
    setFeatureFlags,
    enableFeatureFlag,
    disableFeatureFlag,

    // Utilitarios
    clearUIError,
    resetUIState,
    simulateUIEvent
} = uiSlice.actions

// Exportar reducer
export default uiSlice.reducer

// Exportar tipos
/**
 * @typedef {Object} UIState
 * @property {Object} theme
 * @property {Object} layout
 * @property {Object} navigation
 * @property {Object} modals
 * @property {Object} drawers
 * @property {Object} notifications
 * @property {Object} loading
 * @property {Object} forms
 * @property {Object} filters
 * @property {Object} tooltips
 * @property {Object} animations
 * @property {Object} viewport
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} lastUpdated
 * @property {Object} meta
 */