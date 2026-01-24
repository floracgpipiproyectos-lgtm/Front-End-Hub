import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import './App.scss'

// Importar todas las validaciones
import {
  validateLogin,
  validateContact,
  validateProfile,
  loginSchema,
  contactSchema,
  profileSchema
} from './validations'

// Importar todos los assets disponibles
import logo from './assets/icons/logo.svg'
import logoIcon from './assets/icons/logo-icon.svg'
import heroBanner from './assets/images/hero/hero-banner.svg'
import gradientBg from './assets/images/backgrounds/gradient-bg.svg'
import defaultAvatar from './assets/images/avatars/default-avatar.svg'
import emptyState from './assets/images/illustrations/empty-state.svg'
import errorState from './assets/images/illustrations/error.svg'
import successState from './assets/images/illustrations/success.svg'

/**
 * Componente principal de la aplicación JuniorDev Network
 * @returns {JSX.Element} Componente App
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚀 JuniorDev Network</h1>
        <p className="subtitle">Plataforma para desarrolladores frontend junior</p>
      </header>

      <main className="app-main">
        <section className="info-section">
          <h2>✨ Estructura del Proyecto</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📁 API Services</h3>
              <p>Servicios de API completamente documentados con JSDoc</p>
              <ul>
                <li>✅ authService</li>
                <li>✅ cvService</li>
                <li>✅ projectService</li>
                <li>✅ networkService</li>
                <li>✅ gamificationService</li>
                <li>✅ portfolioService</li>
                <li>✅ profileService</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>🔧 Características</h3>
              <ul>
                <li>Análisis inteligente de CV</li>
                <li>Sistema de proyectos personalizados</li>
                <li>Red de contactos inteligente</li>
                <li>Gamificación y seguimiento</li>
                <li>Builder de portafolio</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>📚 Documentación</h3>
              <p>Todos los servicios incluyen:</p>
              <ul>
                <li>JSDoc completo</li>
                <li>Ejemplos de uso</li>
                <li>Tipos de parámetros</li>
                <li>Valores de retorno</li>
                <li>Manejo de errores</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="test-section">
          <h2>🧪 Test de HMR (Hot Module Replacement)</h2>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              Contador: {count}
            </button>
            <p>
              Edita <code>src/App.jsx</code> y guarda para probar HMR
            </p>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          📖 Revisa la documentación en <code>src/api/README.md</code>
        </p>
        <p>
          📁 Estructura completa en <code>src/STRUCTURE.md</code>
        </p>
      </footer>
    </div>
  )
}

export default App
