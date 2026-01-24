// components/LoginForm.jsx
import React, { useState } from 'react'
import { useAuth } from '@/store/hooks/useAuth'
import { VALIDATION_RULES } from '@/constants/validationRules'

const LoginForm = () => {
    const { login, status, error } = useAuth()
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [validationErrors, setValidationErrors] = useState({})

    const validateForm = () => {
        const errors = {}

        if (!VALIDATION_RULES.USER.EMAIL.PATTERN.test(credentials.email)) {
            errors.email = VALIDATION_RULES.USER.EMAIL.MESSAGE.INVALID
        }

        if (credentials.password.length < VALIDATION_RULES.USER.PASSWORD.MIN_LENGTH) {
            errors.password = VALIDATION_RULES.USER.PASSWORD.MESSAGE.LENGTH
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

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

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Email"
                disabled={status === 'loading'}
            />
            {validationErrors.email && <span>{validationErrors.email}</span>}

            <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Password"
                disabled={status === 'loading'}
            />
            {validationErrors.password && <span>{validationErrors.password}</span>}

            <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Iniciando sesión...' : 'Login'}
            </button>

            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default LoginForm