/**
 * @fileoverview Sistema de validaciones unificado para JuniorDev Network
 * @description Exporta todas las validaciones organizadas por módulo
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
// EXPORTACIONES DE VALIDACIONES
// =============================================

// Exportar validaciones de autenticación
export {
  loginSchema,
  registerSchema,
  passwordResetSchema,
  passwordChangeSchema,
  validateLogin,
  validateRegistration,
  validatePasswordReset,
  validatePasswordChange
} from './authValidations.js'

// Exportar validaciones de formularios generales
export {
  contactSchema,
  profileSchema,
  projectSchema,
  cvUploadSchema,
  portfolioSchema,
  validateContact,
  validateProfile,
  validateProject,
  validateCVUpload,
  validatePortfolio
} from './formValidations.js'

// Exportar validaciones de red/conexiones
export {
  connectionRequestSchema,
  mentorSearchSchema,
  communityPostSchema,
  mentorshipSessionSchema,
  feedbackSchema,
  invitationSchema,
  validateConnectionRequest,
  validateMentorSearch,
  validateCommunityPost,
  validateMentorshipSession,
  validateFeedback,
  validateInvitation
} from './networkValidations.js'
// =============================================
// EJEMPLO DE USO - Sistema de Validaciones
// =============================================
/**
 * @fileoverview Sistema de validaciones unificado para JuniorDev Network
 * Exporta todas las validaciones organizadas por módulo
 */

// Exportar validaciones de autenticación
export {
  loginSchema,
  registerSchema,
  passwordResetSchema,
  passwordChangeSchema,
  validateLogin,
  validateRegistration,
  validatePasswordReset,
  validatePasswordChange
} from './authValidations.js'

// Exportar validaciones de formularios generales
export {
  contactSchema,
  profileSchema,
  projectSchema,
  cvUploadSchema,
  portfolioSchema,
  validateContact,
  validateProfile,
  validateProject,
  validateCVUpload,
  validatePortfolio
} from './formValidations.js'

// Exportar validaciones de red/conexiones
export {
  connectionRequestSchema,
  mentorSearchSchema,
  communityPostSchema,
  mentorshipSessionSchema,
  feedbackSchema,
  invitationSchema,
  validateConnectionRequest,
  validateMentorSearch,
  validateCommunityPost,
  validateMentorshipSession,
  validateFeedback,
  validateInvitation
} from './networkValidations.js'

// =============================================
// EJEMPLO DE USO - Sistema de Validaciones
// =============================================

/*
import {
  validateLogin,
  validateContact,
  validateConnectionRequest
} from '@/validations'

// 1. Validación de login
const loginResult = validateLogin({
  email: 'user@example.com',
  password: 'SecurePass123!'
})
if (loginResult.success) {
  console.log('✅ Login válido')
} else {
  console.log('❌ Errores:', loginResult.errors)
}

// 2. Validación de formulario de contacto
const contactResult = validateContact({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  subject: 'Consulta sobre mentoría',
  message: 'Me gustaría saber más sobre...'
})
if (contactResult.success) {
  console.log('✅ Contacto válido')
}

// 3. Validación de solicitud de conexión
const connectionResult = validateConnectionRequest({
  recipientId: '550e8400-e29b-41d4-a716-446655440000',
  message: 'Hola, me gustaría conectar contigo'
})
if (connectionResult.success) {
  console.log('✅ Solicitud de conexión válida')
}
*/
