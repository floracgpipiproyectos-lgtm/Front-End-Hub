// store/hooks/useAuth.js
// noinspection UnnecessaryLocalVariableJS

import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshToken,
    setCredentials,
    clearCredentials
} from '../slices/authSlice'
import { STORAGE_KEYS } from '@/constants/apiConfig'

/**
 * Hook personalizado para manejo de autenticación
 */
export const useAuth = () => {
    const dispatch = useDispatch()
    const authState = useSelector((state) => state.auth)

    // Login
    const login = useCallback(async (credentials) => {
        try {
            const result = await dispatch(loginUser(credentials)).unwrap()
            return result
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }, [dispatch])

    // Register
    const register = useCallback(async (userData) => {
        try {
            const result = await dispatch(registerUser(userData)).unwrap()
            return result
        } catch (error) {
            console.error('Register failed:', error)
            throw error
        }
    }, [dispatch])

    // Logout
    const logout = useCallback(async () => {
        try {
            await dispatch(logoutUser()).unwrap()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }, [dispatch])

    // Check authentication status
    const checkAuth = useCallback(() => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        return !!token && authState.isAuthenticated
    }, [authState.isAuthenticated])

    // Get current user from cache or state
    const getCurrentUser = useCallback(() => {
        if (authState.user) return authState.user

        // Intentar desde localStorage
        try {
            const cachedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA)
            if (cachedUser) {
                return JSON.parse(cachedUser)
            }
        } catch (error) {
            console.error('Error parsing cached user:', error)
        }

        return null
    }, [authState.user])

    // Refresh token
    const refreshAuthToken = useCallback(async () => {
        try {
            const result = await dispatch(refreshToken()).unwrap()
            return result
        } catch (error) {
            console.error('Token refresh failed:', error)
            throw error
        }
    }, [dispatch])

    // Set credentials manually (útil para OAuth)
    const setAuthCredentials = useCallback((credentials) => {
        dispatch(setCredentials(credentials))
    }, [dispatch])

    // Clear credentials manually
    const clearAuth = useCallback(() => {
        dispatch(clearCredentials())
    }, [dispatch])

    return {
        // Estado
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        status: authState.status,
        error: authState.error,
        lastLogin: authState.lastLogin,

        // Acciones
        login,
        register,
        logout,
        checkAuth,
        getCurrentUser,
        refreshAuthToken,
        setAuthCredentials,
        clearAuth,

        // Utilitarios
        isLoggedIn: authState.isAuthenticated,
        isLoading: authState.status === 'loading',
        hasError: authState.status === 'error'
    }
}

/**
 * Hook para proteción de rutas
 */
export const useAuthGuard = () => {
    const { isAuthenticated, isLoading } = useAuth()

    return {
        canActivate: isAuthenticated && !isLoading,
        isLoading,
        redirectTo: '/login'
    }
}