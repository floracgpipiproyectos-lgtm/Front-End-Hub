import { z } from 'zod'

/**
 * Zod schema for contact form validation
 * @typedef {Object} ContactSchema
 * @property {string} name - Contact's full name
 * @property {string} email - Contact's email address
 * @property {string} subject - Message subject
 * @property {string} message - Contact message
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  subject: z
    .string()
    .min(1, 'El asunto es requerido')
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto no puede exceder 200 caracteres'),
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
})

/**
 * Zod schema for profile update validation
 * @typedef {Object} ProfileSchema
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} bio - User's biography
 * @property {string} location - User's location
 * @property {string} website - User's website URL
 * @property {string} linkedin - User's LinkedIn profile
 * @property {string} github - User's GitHub profile
 */
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
  location: z
    .string()
    .max(100, 'La ubicación no puede exceder 100 caracteres')
    .optional(),
  website: z
    .string()
    .url('URL de sitio web inválida')
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .regex(/^https:\/\/(www\.)?linkedin\.com\/.*$/, 'URL de LinkedIn inválida')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .regex(/^https:\/\/(www\.)?github\.com\/.*$/, 'URL de GitHub inválida')
    .optional()
    .or(z.literal(''))
})

/**
 * Zod schema for project creation/update validation
 * @typedef {Object} ProjectSchema
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {string} technologies - Technologies used (comma-separated)
 * @property {string} repositoryUrl - Repository URL
 * @property {string} liveUrl - Live demo URL
 * @property {string} status - Project status
 */
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  technologies: z
    .string()
    .min(1, 'Las tecnologías son requeridas')
    .max(500, 'Las tecnologías no pueden exceder 500 caracteres'),
  repositoryUrl: z
    .string()
    .url('URL de repositorio inválida')
    .optional()
    .or(z.literal('')),
  liveUrl: z
    .string()
    .url('URL de demo inválida')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['planning', 'in-progress', 'completed', 'on-hold'], {
      errorMap: () => ({ message: 'Estado de proyecto inválido' })
    })
})

/**
 * Zod schema for CV upload validation
 * @typedef {Object} CVUploadSchema
 * @property {File} file - CV file to upload
 * @property {string} title - CV title
 * @property {boolean} isPublic - Whether CV is public
 */
export const cvUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'El archivo no puede exceder 5MB')
    .refine(
      file => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Solo se permiten archivos PDF, DOC o DOCX'
    ),
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede exceder 100 caracteres'),
  isPublic: z.boolean()
})

/**
 * Zod schema for portfolio customization validation
 * @typedef {Object} PortfolioSchema
 * @property {string} template - Portfolio template
 * @property {string} primaryColor - Primary color (hex)
 * @property {string} secondaryColor - Secondary color (hex)
 * @property {string} title - Portfolio title
 * @property {string} description - Portfolio description
 * @property {string} customDomain - Custom domain
 */
export const portfolioSchema = z.object({
  template: z
    .enum(['modern', 'minimal', 'creative', 'professional'], {
      errorMap: () => ({ message: 'Plantilla inválida' })
    }),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color primario debe ser un código hex válido'),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color secundario debe ser un código hex válido'),
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  customDomain: z
    .string()
    .regex(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'Dominio personalizado inválido')
    .optional()
    .or(z.literal(''))
})

/**
 * Validates contact form data using Zod schema
 * @param {Object} data - Contact form data to validate
 * @param {string} data.name - Contact's name
 * @param {string} data.email - Contact's email
 * @param {string} data.subject - Message subject
 * @param {string} data.message - Contact message
 * @returns {Object} Validation result with success/error details
 */
export const validateContact = (data) => {
  try {
    const result = contactSchema.parse(data)
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
 * Validates profile update data using Zod schema
 * @param {Object} data - Profile data to validate
 * @param {string} data.firstName - User's first name
 * @param {string} data.lastName - User's last name
 * @param {string} data.bio - User's bio
 * @param {string} data.location - User's location
 * @param {string} data.website - User's website
 * @param {string} data.linkedin - LinkedIn profile
 * @param {string} data.github - GitHub profile
 * @returns {Object} Validation result with success/error details
 */
export const validateProfile = (data) => {
  try {
    const result = profileSchema.parse(data)
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
 * Validates project data using Zod schema
 * @param {Object} data - Project data to validate
 * @param {string} data.title - Project title
 * @param {string} data.description - Project description
 * @param {string} data.technologies - Technologies used
 * @param {string} data.repositoryUrl - Repository URL
 * @param {string} data.liveUrl - Live demo URL
 * @param {string} data.status - Project status
 * @returns {Object} Validation result with success/error details
 */
export const validateProject = (data) => {
  try {
    const result = projectSchema.parse(data)
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
 * Validates CV upload data using Zod schema
 * @param {Object} data - CV upload data to validate
 * @param {File} data.file - CV file
 * @param {string} data.title - CV title
 * @param {boolean} data.isPublic - Public visibility
 * @returns {Object} Validation result with success/error details
 */
export const validateCVUpload = (data) => {
  try {
    const result = cvUploadSchema.parse(data)
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
 * Validates portfolio customization data using Zod schema
 * @param {Object} data - Portfolio data to validate
 * @param {string} data.template - Template choice
 * @param {string} data.primaryColor - Primary color
 * @param {string} data.secondaryColor - Secondary color
 * @param {string} data.title - Portfolio title
 * @param {string} data.description - Portfolio description
 * @param {string} data.customDomain - Custom domain
 * @returns {Object} Validation result with success/error details
 */
export const validatePortfolio = (data) => {
  try {
    const result = portfolioSchema.parse(data)
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
