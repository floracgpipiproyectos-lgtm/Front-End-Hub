// noinspection GrazieInspection

import { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '@/api/services/authService'

const AuthContext = createContext()

/**
 * Proveedor de contexto de autenticación
 * Gestiona el estado global del usuario y las funciones de login/logout
 * CONECTADO AL BACKEND REAL via authService
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    setLoading(true);

    Promise.resolve()
        .then(() => {
          const cachedUser = authService.getCachedUser();

          if (cachedUser && authService.isAuthenticated()) {
            setUser(cachedUser);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        })
        .catch((err) => {
          console.error('Error inicializando auth:', err);
        })
        .finally(() => {
          setLoading(false);
        });

  }, []);

  /**
   * Inicia sesión usando el servicio de autenticación real
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    
    try {
      const { user: userData, token, refreshToken } = await authService.login({ 
        email, 
        password 
      })
      
      setUser(userData)
      return { token, user: userData, refreshToken }
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Registra un nuevo usuario usando el servicio real
   * @param {string} alias - Nombre de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  const register = async (alias, email, password) => {
    setError(null)
    setLoading(true)
    
    try {
      const { user: userData, token, refreshToken } = await authService.registerUser({ 
        alias, 
        email, 
        password 
      })
      
      setUser(userData)
      return { token, user: userData, refreshToken }
    } catch (err) {
      const errorMessage = err.message || 'Error al registrarse'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cierra sesión y limpia el estado
   */
  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      // Limpiar localmente aunque falle el logout remoto
      console.warn('Logout remoto falló, limpiando localmente:', err)
    } finally {
      setUser(null)
      setError(null)
    }
  }

  /**
   * Actualiza los datos del usuario en el estado
   * @param {Object} updatedUser - Datos actualizados del usuario
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    // Actualizar también en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      updateUser,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
