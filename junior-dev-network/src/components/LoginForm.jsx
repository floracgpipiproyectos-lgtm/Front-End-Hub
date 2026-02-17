/**
 * @fileoverview Componente LoginForm para autenticación de usuarios
 * Valida credenciales y gestiona el proceso de login con manejo de errores
 */

import React, { useState } from 'react'
import { useAuth } from '@/store/hooks/useAuth'
import { VALIDATION_RULES } from '@/constants/validationRules'

/**
 * Componente de formulario de login con validación
 * @component
 * @returns {React.ReactElement} Formulario de inicio de sesión con validación en tiempo real
 * 
 * @example
 * <LoginForm />
 */
const LoginForm = () => {
    const { login, status, error } = useAuth()
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [validationErrors, setValidationErrors] = useState({})

    /**
     * Valida el formulario de login
     * @returns {boolean} True si el formulario es válido
     */
    const validateForm = () => {
        const errors = {}

        // Validar email
        if (!VALIDATION_RULES.USER.EMAIL.PATTERN.test(credentials.email)) {
            errors.email = VALIDATION_RULES.USER.EMAIL.MESSAGE.INVALID
        }

        // Validar contraseña
        if (credentials.password.length < VALIDATION_RULES.USER.PASSWORD.MIN_LENGTH) {
            errors.password = VALIDATION_RULES.USER.PASSWORD.MESSAGE.LENGTH
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    /**
     * Maneja el envío del formulario de login
     * @async
     * @param {React.FormEvent} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await login(credentials)
            // Redirección manejada por el hook useAuthGuard
        } catch (err) {
            // Error ya manejado por el store
        }
    }

    const isLoading = status === 'loading'

    return (
        <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Campo de email */}
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    disabled={isLoading}
                    required
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? 'email-error' : undefined}
                />
                {validationErrors.email && (
                    <span id="email-error" className="error-message">
                        {validationErrors.email}
                    </span>
                )}
            </div>

            {/* Campo de contraseña */}
            <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                    }
                    placeholder="•••••••"
                    disabled={isLoading}
                    required
                    aria-invalid={!!validationErrors.password}
                    aria-describedby={validationErrors.password ? 'password-error' : undefined}
                />
                {validationErrors.password && (
                    <span id="password-error" className="error-message">
                        {validationErrors.password}
                    </span>
                )}
            </div>

            {/* Botón de envío */}
            <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            {/* Mensajes de error del servidor */}
            {error && (
                <div className="error-message server-error" role="alert">
                    {error}
                </div>
            )}
        </form>
    )
}

export default LoginForm