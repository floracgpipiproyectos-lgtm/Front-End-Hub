// constants/validationConstants.js

/**
 * Reglas de validación para campos comunes
 */
export const VALIDATION_RULES = {
    USER: {
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            MAX_LENGTH: 254
        },
        PASSWORD: {
            MIN_LENGTH: 8,
            MAX_LENGTH: 100,
            PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        },
        ALIAS: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 30,
            PATTERN: /^[a-zA-Z0-9_]+$/
        },
        FULL_NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 100
        },
        BIO: {
            MAX_LENGTH: 500
        }
    },

    PROJECT: {
        TITLE: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 100
        },
        DESCRIPTION: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 2000
        },
        TAGS: {
            MAX_COUNT: 10,
            MAX_LENGTH: 20
        }
    },

    SKILL: {
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 50
        },
        LEVEL: {
            MIN: 1,
            MAX: 5
        }
    },

    FILE: {
        AVATAR: {
            MAX_SIZE: 5 * 1024 * 1024, // 5MB
            ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        },
        CV: {
            MAX_SIZE: 10 * 1024 * 1024, // 10MB
            ALLOWED_TYPES: ['application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        },
        PORTFOLIO: {
            MAX_SIZE: 50 * 1024 * 1024 // 50MB
        }
    }
};

/**
 * Mensajes de error de validación
 */
export const VALIDATION_MESSAGES = {
    REQUIRED: 'Este campo es requerido',
    INVALID_EMAIL: 'Por favor ingresa un email válido',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos {min} caracteres',
    PASSWORD_COMPLEXITY: 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos',
    FILE_TOO_LARGE: 'El archivo no debe exceder {maxSize}',
    FILE_TYPE_NOT_ALLOWED: 'Tipo de archivo no permitido',
    INVALID_URL: 'Por favor ingresa una URL válida',
    MIN_LENGTH: 'Debe tener al menos {min} caracteres',
    MAX_LENGTH: 'No debe exceder los {max} caracteres'
};