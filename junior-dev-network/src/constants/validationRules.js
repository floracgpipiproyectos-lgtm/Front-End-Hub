// constants/validationRules.js
// noinspection JSCheckFunctionSignatures

/**
 * Reglas de validación para formularios y datos
 */
export const VALIDATION_RULES = {
    // Usuario
    USER: {
        EMAIL: {
            REQUIRED: true,
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            MIN_LENGTH: 5,
            MAX_LENGTH: 254,
            MESSAGE: {
                REQUIRED: 'El email es requerido',
                INVALID: 'Por favor ingresa un email válido',
                LENGTH: 'El email debe tener entre 5 y 254 caracteres'
            }
        },
        PASSWORD: {
            REQUIRED: true,
            MIN_LENGTH: 8,
            MAX_LENGTH: 100,
            PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            MESSAGE: {
                REQUIRED: 'La contraseña es requerida',
                LENGTH: 'La contraseña debe tener entre 8 y 100 caracteres',
                COMPLEXITY: 'Debe contener mayúsculas, minúsculas, números y un símbolo especial (@$!%*?&)'
            }
        },
        ALIAS: {
            REQUIRED: true,
            MIN_LENGTH: 3,
            MAX_LENGTH: 30,
            PATTERN: /^[a-zA-Z0-9_]+$/,
            MESSAGE: {
                REQUIRED: 'El alias es requerido',
                LENGTH: 'El alias debe tener entre 3 y 30 caracteres',
                PATTERN: 'Solo se permiten letras, números y guiones bajos'
            }
        },
        FULL_NAME: {
            REQUIRED: false,
            MIN_LENGTH: 2,
            MAX_LENGTH: 100,
            MESSAGE: {
                LENGTH: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        },
        BIO: {
            MAX_LENGTH: 500,
            MESSAGE: {
                LENGTH: 'La biografía no puede exceder los 500 caracteres'
            }
        }
    },

    // Proyectos
    PROJECT: {
        TITLE: {
            REQUIRED: true,
            MIN_LENGTH: 3,
            MAX_LENGTH: 100,
            MESSAGE: {
                REQUIRED: 'El título es requerido',
                LENGTH: 'El título debe tener entre 3 y 100 caracteres'
            }
        },
        DESCRIPTION: {
            REQUIRED: true,
            MIN_LENGTH: 10,
            MAX_LENGTH: 2000,
            MESSAGE: {
                REQUIRED: 'La descripción es requerida',
                LENGTH: 'La descripción debe tener entre 10 y 2000 caracteres'
            }
        },
        SKILLS: {
            MAX_COUNT: 10,
            MESSAGE: {
                MAX_COUNT: 'No puedes agregar más de 10 skills'
            }
        }
    },

    // Archivos
    FILE: {
        AVATAR: {
            MAX_SIZE: 5 * 1024 * 1024, // 5MB
            ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            MAX_DIMENSIONS: { width: 2000, height: 2000 },
            MESSAGE: {
                SIZE: 'La imagen no debe exceder los 5MB',
                TYPE: 'Formatos permitidos: JPEG, PNG, GIF, WebP',
                DIMENSIONS: 'La imagen no debe exceder 2000x2000 píxeles'
            }
        },
        CV: {
            MAX_SIZE: 10 * 1024 * 1024, // 10MB
            ALLOWED_TYPES: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ],
            MESSAGE: {
                SIZE: 'El archivo no debe exceder los 10MB',
                TYPE: 'Formatos permitidos: PDF, DOC, DOCX, TXT'
            }
        },
        PORTFOLIO_ASSET: {
            MAX_SIZE: 20 * 1024 * 1024, // 20MB
            ALLOWED_TYPES: [
                'image/*',
                'application/pdf',
                'video/mp4',
                'application/zip'
            ]
        }
    },

    // Skills
    SKILL: {
        NAME: {
            REQUIRED: true,
            MIN_LENGTH: 2,
            MAX_LENGTH: 50,
            MESSAGE: {
                REQUIRED: 'El nombre de la skill es requerido',
                LENGTH: 'El nombre debe tener entre 2 y 50 caracteres'
            }
        },
        LEVEL: {
            MIN: 1,
            MAX: 5,
            MESSAGE: {
                RANGE: 'El nivel debe estar entre 1 y 5'
            }
        }
    },

    // URLs
    URL: {
        PATTERN: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        MESSAGE: {
            INVALID: 'Por favor ingresa una URL válida'
        }
    }
};

/**
 * Funciones helper de validación
 */
export const VALIDATION_HELPERS = {
    validateEmail: (email) => {
        return VALIDATION_RULES.USER.EMAIL.PATTERN.test(email);
    },

    validatePassword: (password) => {
        return VALIDATION_RULES.USER.PASSWORD.PATTERN.test(password);
    },

    validateFileType: (file, allowedTypes) => {
        return allowedTypes.some(type => {
            if (type.endsWith('/*')) {
                const mainType = type.split('/')[0];
                return file.type.startsWith(mainType);
            }
            return file.type === type;
        });
    },

    validateFileSize: (file, maxSize) => {
        return file.size <= maxSize;
    },

    getFileSizeReadable: (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
};