import { z } from 'zod'

/**
 * Zod schema for user login validation
 * @typedef {Object} LoginSchema
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial'
    )
})

/**
 * Validates login credentials using Zod schema
 * @param {Object} data - Login data to validate
 * @param {string} data.email - User's email
 * @param {string} data.password - User's password
 * @returns {Object} Validation result with success/error details
 */
export const validateLogin = (data) => {
  try {
    const result = loginSchema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    }
  }
}

/**
 * Zod schema for user registration validation
 * @typedef {Object} RegisterSchema
 * @property {string} username - User's username
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {string} confirmPassword - Confirmation of user's password
 * @property {boolean} acceptTerms - Acceptance of terms and conditions
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial'
    ),
  confirmPassword: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

/**
 * Zod schema for password reset validation
 * @typedef {Object} PasswordResetSchema
 * @property {string} email - User's email address for password reset
 */
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
})

/**
 * Zod schema for password change validation
 * @typedef {Object} PasswordChangeSchema
 * @property {string} currentPassword - User's current password
 * @property {string} newPassword - User's new password
 * @property {string} confirmNewPassword - Confirmation of new password
 */
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(1, 'La nueva contraseña es requerida')
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial'
    ),
  confirmNewPassword: z
    .string()
    .min(1, 'La confirmación de nueva contraseña es requerida')
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Las nuevas contraseñas no coinciden',
  path: ['confirmNewPassword']
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['newPassword']
})

/**
 * Validates registration data using Zod schema
 * @param {Object} data - Registration data to validate
 * @param {string} data.username - User's username
 * @param {string} data.email - User's email
 * @param {string} data.password - User's password
 * @param {string} data.confirmPassword - Confirmation password
 * @param {boolean} data.acceptTerms - Terms acceptance
 * @returns {Object} Validation result with success/error details
 */
export const validateRegistration = (data) => {
  try {
    const result = registerSchema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    }
  }
}

/**
 * Validates password reset request using Zod schema
 * @param {Object} data - Password reset data to validate
 * @param {string} data.email - User's email
 * @returns {Object} Validation result with success/error details
 */
export const validatePasswordReset = (data) => {
  try {
    const result = passwordResetSchema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    }
  }
}

/**
 * Validates password change data using Zod schema
 * @param {Object} data - Password change data to validate
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @param {string} data.confirmNewPassword - Confirmation of new password
 * @returns {Object} Validation result with success/error details
 */
export const validatePasswordChange = (data) => {
  try {
    const result = passwordChangeSchema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    }
  }
}
