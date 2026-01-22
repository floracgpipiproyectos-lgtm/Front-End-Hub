import apiClient from '../apiClient'
import { PORTFOLIO_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Servicio de portafolio
 * Maneja la generación, actualización y despliegue de portafolios
 */
export const portfolioService = {
  /**
   * Obtener portafolio del usuario actual
   * @returns {Promise} Datos del portafolio
   */
  getPortfolio: async () => {
    const response = await apiClient.get(PORTFOLIO_ENDPOINTS.GET_PORTFOLIO)
    return response.data
  },

  /**
   * Generar portafolio automáticamente
   * @param {Object} options - Opciones de generación (template, includeProjects, etc.)
   * @returns {Promise} Portafolio generado
   */
  generatePortfolio: async (options = {}) => {
    const response = await apiClient.post(PORTFOLIO_ENDPOINTS.GENERATE_PORTFOLIO, options)
    return response.data
  },

  /**
   * Actualizar portafolio
   * @param {Object} portfolioData - Datos del portafolio a actualizar
   * @returns {Promise} Portafolio actualizado
   */
  updatePortfolio: async (portfolioData) => {
    const response = await apiClient.put(PORTFOLIO_ENDPOINTS.UPDATE_PORTFOLIO, portfolioData)
    return response.data
  },

  /**
   * Desplegar portafolio a GitHub Pages
   * @param {Object} deployOptions - Opciones de despliegue
   * @returns {Promise} URL del portafolio desplegado
   */
  deployPortfolio: async (deployOptions = {}) => {
    const response = await apiClient.post(PORTFOLIO_ENDPOINTS.DEPLOY_PORTFOLIO, deployOptions)
    return response.data
  },

  /**
   * Obtener plantillas disponibles
   * @returns {Promise} Lista de plantillas
   */
  getTemplates: async () => {
    const response = await apiClient.get(PORTFOLIO_ENDPOINTS.GET_TEMPLATES)
    return response.data
  },

  /**
   * Obtener preview del portafolio
   * @param {Object} portfolioData - Datos del portafolio para preview
   * @returns {Promise} URL de preview
   */
  previewPortfolio: async (portfolioData) => {
    const response = await apiClient.post(PORTFOLIO_ENDPOINTS.PREVIEW_PORTFOLIO, portfolioData)
    return response.data
  },
}
