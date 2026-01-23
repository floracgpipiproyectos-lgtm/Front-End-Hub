// Ejemplo de uso - ejemplo.js
/**
 * Ejemplo de uso del sistema de validaciones
 */

import {
    portfolioValidator,
    authValidator,
    formValidator,
    validationHelper,
    validationManager,
    ValidationRules,
    ValidatorFactory
} from './validations/index.js'

// =============================================
// 1. VALIDACIÓN DE PORTFOLIO
// =============================================
console.log('🧪 1. Portfolio Validation Test:\n')

const portfolioData = {
    title: 'Mi Portafolio',
    templateId: 'modern',
    description: 'Un portafolio profesional',
    primaryColor: '#FF5733',
    portfolioUrl: 'https://mi-portfolio.dev'
}

const portfolioResult = portfolioValidator.validate(portfolioData)
console.log(portfolioResult.toString())

// Validar campo específico
const titleResult = portfolioValidator.validateField('title', '')
console.log('Title validation:', titleResult.toString())

// =============================================
// 2. VALIDACIÓN DE AUTENTICACIÓN
// =============================================
console.log('\n\n🧪 2. Auth Validation Test:\n')

const authResult = authValidator.validateLoginCredentials(
    'usuario@example.com',
    'Password123'
)
console.log(authResult.toString())

// Validar fortaleza de contraseña
const passwordResult = authValidator.validatePasswordStrength('weakpass')
console.log('Password strength:', passwordResult.toString())

// =============================================
// 3. VALIDACIÓN CON MANAGER GLOBAL
// =============================================
console.log('\n\n🧪 3. Global Manager Test:\n')

const userData = {
    email: 'test@example.com',
    password: 'weak',
    username: 'user_123'
}

const managerResult = validationManager.validateWith('auth', userData)
console.log(managerResult.toString())

// Estadísticas
const stats = validationManager.getStats()
console.log('Statistics:', stats)

// =============================================
// 4. VALIDACIÓN DE FORMULARIO GENÉRICO
// =============================================
console.log('\n\n🧪 4. Form Validation Test:\n')

const formData = {
    email: 'user@domain.com',
    password: 'StrongPass123',
    confirmPassword: 'StrongPass123',
    agreeToTerms: true
}

const formRules = {
    email: ValidationRules.EMAIL,
    password: ValidationRules.PASSWORD_STRONG,
    confirmPassword: [
        { type: 'required', message: 'Please confirm your password' },
        {
            type: 'custom',
            message: 'Passwords do not match',
            customValidator: (value) => value === formData.password
        }
    ],
    agreeToTerms: [
        {
            type: 'custom',
            message: 'You must agree to the terms and conditions',
            customValidator: (value) => value === true || value === 'true'
        }
    ]
}

const formResult = formValidator.validateForm(formData, formRules)
console.log(formResult.toString())

// =============================================
// 5. USO DE VALIDATION HELPER
// =============================================
console.log('\n\n🧪 5. Helper Functions Test:\n')

console.log('Is valid email "test@example.com":',
    validationHelper.isValidEmail('test@example.com') ? '✅' : '❌')

console.log('Is valid URL "https://google.com":',
    validationHelper.isValidUrl('https://google.com') ? '✅' : '❌')

console.log('Is strong password "Pass123!":',
    validationHelper.isStrongPassword('Pass123!') ? '✅' : '❌')

// =============================================
// 6. VALIDACIÓN CON FACTORY
// =============================================
console.log('\n\n🧪 6. Factory Test:\n')

const portfolioValidator2 = ValidatorFactory.createValidator('portfolio')
const validationResult = portfolioValidator2.validate({
    title: 'Test Portfolio',
    templateId: 'invalid_template'
})

console.log('Factory-created validator result:', validationResult.toString())

// =============================================
// 7. VALIDACIÓN DE ARCHIVOS
// =============================================
console.log('\n\n🧪 7. File Validation Test:\n')

const fileResult = FileValidator.validateImage('avatar.jpg', 2 * 1024 * 1024) // 2MB
console.log('Image validation:', fileResult)

const pdfResult = FileValidator.validateDocument('cv.pdf', 8 * 1024 * 1024) // 8MB
console.log('PDF validation:', pdfResult.success ? '✅ Valid' : '❌ Invalid')

console.log('\n🎉 All validation tests completed!\n')