/**
 * Componente Navbar de navegación
 */
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import { FiLogOut, FiHome, FiUser } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-blue-600">🚀 JuniorDev</div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FiHome /> <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FiUser /> <span>{user.alias}</span>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                <FiLogOut /> <span>Salir</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Registrarse</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <FiLogOut />
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
