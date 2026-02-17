import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

/**
 * Proveedor de contexto de autenticación
 * Gestiona el estado global del usuario y las funciones de login/logout
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    return null
  })
  const [loading] = useState(false)
  const [error, setError] = useState(null)

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    // Effect body is now empty - initialization happens in useState
  }, [])

  const login = async (email) => {
    setError(null)
    // Mock login - reemplazar con llamada real a API
    const user = {
      id: '1',
      email,
      alias: email.split('@')[0],
      skills: [],
      badges: [],
      cv_url: null,
      createdAt: new Date().toISOString()
    }
    const token = 'mock-token-' + Date.now()
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return { token, user }
  }

  const register = async (alias, email) => {
    setError(null)
    const user = {
      id: '1',
      email,
      alias,
      skills: [],
      badges: [],
      cv_url: null,
      createdAt: new Date().toISOString()
    }
    const token = 'mock-token-' + Date.now()
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return { token, user }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
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
