import axios from 'axios'
import toast from 'react-hot-toast'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests - Agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage o del store de Redux
    const token = localStorage.getItem('authToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses - Manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (no autorizado) y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          )
          
          const { token } = response.data
          localStorage.setItem('authToken', token)
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si falla el refresh, redirigir al login
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Manejar otros errores
    if (error.response) {
      const { status, data } = error.response
      
      // Mostrar mensaje de error al usuario
      const errorMessage = data?.message || 'Ha ocurrido un error'
      
      if (status >= 500) {
        toast.error('Error del servidor. Por favor, intenta más tarde.')
      } else if (status === 404) {
        toast.error('Recurso no encontrado.')
      } else if (status === 403) {
        toast.error('No tienes permisos para realizar esta acción.')
      } else if (status !== 401) {
        toast.error(errorMessage)
      }
    } else if (error.request) {
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión.')
    } else {
      toast.error('Error inesperado. Por favor, intenta nuevamente.')
    }

    return Promise.reject(error)
  }
)

export default apiClient
