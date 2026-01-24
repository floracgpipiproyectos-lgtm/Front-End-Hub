// store/middleware/apiMiddleware.js
import { API_CONFIG } from '@/constants/apiConfig'
import { createAction } from '@reduxjs/toolkit'

// Acciones para el middleware
export const apiCallBegan = createAction('api/callBegan')
export const apiCallSuccess = createAction('api/callSuccess')
export const apiCallFailed = createAction('api/callFailed')

// Middleware para manejar llamadas API
export const apiMiddleware = (store) => (next) => async (action) => {
    if (action.type !== apiCallBegan.type) {
        return next(action)
    }

    const {
        service,           // Función del servicio a ejecutar
        method,            // Método del servicio
        args = [],         // Argumentos para el método
        onStart,           // Acción a despachar al inicio
        onSuccess,         // Acción a despachar en éxito
        onError,           // Acción a despachar en error
        successMessage,    // Mensaje de éxito
        errorMessage,      // Mensaje de error
        retry = false      // Reintentar automáticamente
    } = action.payload

    // Despachar acción onStart si existe
    if (onStart) {
        store.dispatch({ type: onStart })
    }

    try {
        // Ejecutar el método del servicio
        const result = await service[method](...args)

        // Despachar acción de éxito global
        store.dispatch(
            apiCallSuccess({
                result,
                method,
                successMessage
            })
        )

        // Despachar acción onSuccess específica si existe
        if (onSuccess) {
            store.dispatch({
                type: onSuccess,
                payload: result
            })
        }

        return result
    } catch (error) {
        console.error(`API Error (${method}):`, error)

        // Despachar acción de error global
        store.dispatch(
            apiCallFailed({
                error: error.message,
                method,
                errorMessage: errorMessage || error.message
            })
        )

        // Despachar acción onError específica si existe
        if (onError) {
            store.dispatch({
                type: onError,
                payload: error.message
            })
        }

        // Reintentar si está configurado
        if (retry && error.isNetworkError) {
            console.log(`🔄 Reintentando ${method}...`)
            setTimeout(() => {
                store.dispatch(action)
            }, API_CONFIG.RETRY_CONFIG.DEFAULT.BASE_DELAY)
        }

        throw error
    }
}

// Helper para crear acciones API de manera tipada
export const createApiAction = (config) => apiCallBegan(config)