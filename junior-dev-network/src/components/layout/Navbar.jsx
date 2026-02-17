/**
 * Componente Navbar de navegación
 * ACTUALIZADO: Incluye todos los enlaces a las páginas
 */
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import { FiLogOut, FiHome, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { to: '/mentores', label: 'Mentores' },
    { to: '/caracteristicas', label: 'Características' },
    { to: '/precios', label: 'Precios' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-blue-600">🚀 JuniorDev</div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Links públicos */}
          {!user && navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-blue-600"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {/* Links públicos */}
            {!user && navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block text-gray-700 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block text-red-600 hover:text-red-700 py-2 w-full text-left"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" fullWidth>Iniciar sesión</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" fullWidth>Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
