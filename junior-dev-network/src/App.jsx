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
  const [activeTab, setActiveTab] = useState('info')

  // Form hooks
  const loginForm = useForm({
    resolver: zodResolver(loginSchema)
  })

  const contactForm = useForm({
    resolver: zodResolver(contactSchema)
  })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema)
  })

  // Form submission handlers
  const onLoginSubmit = (data) => {
    const result = validateLogin(data)
    if (result.success) {
      alert('✅ Login válido!')
    } else {
      alert('❌ Errores: ' + result.errors.map(e => e.message).join(', '))
    }
  }

  const onContactSubmit = (data) => {
    const result = validateContact(data)
    if (result.success) {
      alert('✅ Contacto válido!')
      contactForm.reset()
    } else {
      alert('❌ Errores: ' + result.errors.map(e => e.message).join(', '))
    }
  }

  const onProfileSubmit = (data) => {
    const result = validateProfile(data)
    if (result.success) {
      alert('✅ Perfil válido!')
      profileForm.reset()
    } else {
      alert('❌ Errores: ' + result.errors.map(e => e.message).join(', '))
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <img src={logo} alt="JuniorDev Network Logo" className="main-logo" />
          <img src={logoIcon} alt="JuniorDev Network Icon" className="icon-logo" />
        </div>
        <h1>🚀 JuniorDev Network</h1>
        <p className="subtitle">Plataforma para desarrolladores frontend junior</p>
      </header>

      <nav className="app-navigation">
        <button
          className={`nav-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Información
        </button>
        <button
          className={`nav-tab ${activeTab === 'validations' ? 'active' : ''}`}
          onClick={() => setActiveTab('validations')}
        >
          Validaciones
        </button>
        <button
          className={`nav-tab ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
        <button
          className={`nav-tab ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => setActiveTab('test')}
        >
          Test
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'info' && (
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
        )}

        {activeTab === 'validations' && (
          <section className="validations-section">
            <h2>🔍 Sistema de Validaciones</h2>
            <div className="validation-forms">
              <div className="validation-card">
                <h3>🔐 Login</h3>
                <form className="validation-form" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      {...loginForm.register('email')}
                      placeholder="usuario@example.com"
                    />
                    {loginForm.formState.errors.email && (
                      <div className="error">{loginForm.formState.errors.email.message}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="login-password">Contraseña</label>
                    <input
                      id="login-password"
                      type="password"
                      {...loginForm.register('password')}
                      placeholder="Contraseña123!"
                    />
                    {loginForm.formState.errors.password && (
                      <div className="error">{loginForm.formState.errors.password.message}</div>
                    )}
                  </div>
                  <button type="submit" className="submit-btn">Validar Login</button>
                </form>
              </div>

              <div className="validation-card">
                <h3>📧 Contacto</h3>
                <form className="validation-form" onSubmit={contactForm.handleSubmit(onContactSubmit)}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name">Nombre</label>
                      <input
                        id="contact-name"
                        type="text"
                        {...contactForm.register('name')}
                        placeholder="Juan Pérez"
                      />
                      {contactForm.formState.errors.name && (
                        <div className="error">{contactForm.formState.errors.name.message}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        {...contactForm.register('email')}
                        placeholder="juan@example.com"
                      />
                      {contactForm.formState.errors.email && (
                        <div className="error">{contactForm.formState.errors.email.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject">Asunto</label>
                    <input
                      id="contact-subject"
                      type="text"
                      {...contactForm.register('subject')}
                      placeholder="Consulta sobre mentoría"
                    />
                    {contactForm.formState.errors.subject && (
                      <div className="error">{contactForm.formState.errors.subject.message}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Mensaje</label>
                    <textarea
                      id="contact-message"
                      {...contactForm.register('message')}
                      placeholder="Escribe tu mensaje aquí..."
                      rows="4"
                    />
                    {contactForm.formState.errors.message && (
                      <div className="error">{contactForm.formState.errors.message.message}</div>
                    )}
                  </div>
                  <button type="submit" className="submit-btn">Enviar Contacto</button>
                </form>
              </div>

              <div className="validation-card">
                <h3>👤 Perfil</h3>
                <form className="validation-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-firstName">Nombre</label>
                      <input
                        id="profile-firstName"
                        type="text"
                        {...profileForm.register('firstName')}
                        placeholder="Juan"
                      />
                      {profileForm.formState.errors.firstName && (
                        <div className="error">{profileForm.formState.errors.firstName.message}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-lastName">Apellido</label>
                      <input
                        id="profile-lastName"
                        type="text"
                        {...profileForm.register('lastName')}
                        placeholder="Pérez"
                      />
                      {profileForm.formState.errors.lastName && (
                        <div className="error">{profileForm.formState.errors.lastName.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-bio">Biografía</label>
                    <textarea
                      id="profile-bio"
                      {...profileForm.register('bio')}
                      placeholder="Desarrollador frontend apasionado..."
                      rows="3"
                    />
                    {profileForm.formState.errors.bio && (
                      <div className="error">{profileForm.formState.errors.bio.message}</div>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-location">Ubicación</label>
                      <input
                        id="profile-location"
                        type="text"
                        {...profileForm.register('location')}
                        placeholder="Madrid, España"
                      />
                      {profileForm.formState.errors.location && (
                        <div className="error">{profileForm.formState.errors.location.message}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-website">Sitio Web</label>
                      <input
                        id="profile-website"
                        type="url"
                        {...profileForm.register('website')}
                        placeholder="https://miportafolio.com"
                      />
                      {profileForm.formState.errors.website && (
                        <div className="error">{profileForm.formState.errors.website.message}</div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="submit-btn">Actualizar Perfil</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'assets' && (
          <section className="assets-section">
            <h2>🎨 Assets Disponibles</h2>
            <div className="assets-grid">
              <div className="asset-card">
                <h3>Logos</h3>
                <div className="asset-display">
                  <img src={logo} alt="Logo Principal" className="asset-image" />
                  <img src={logoIcon} alt="Icono Logo" className="asset-image small" />
                </div>
              </div>

              <div className="asset-card">
                <h3>Imágenes Hero</h3>
                <div className="asset-display">
                  <img src={heroBanner} alt="Banner Hero" className="asset-image" />
                </div>
              </div>

              <div className="asset-card">
                <h3>Avatares</h3>
                <div className="asset-display">
                  <img src={defaultAvatar} alt="Avatar Default" className="asset-image avatar" />
                </div>
              </div>

              <div className="asset-card">
                <h3>Fondos</h3>
                <div className="asset-display">
                  <img src={gradientBg} alt="Fondo Gradiente" className="asset-image" />
                </div>
              </div>

              <div className="asset-card">
                <h3>Ilustraciones</h3>
                <div className="asset-display">
                  <img src={emptyState} alt="Estado Vacío" className="asset-image small" />
                  <img src={errorState} alt="Estado Error" className="asset-image small" />
                  <img src={successState} alt="Estado Éxito" className="asset-image small" />
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'test' && (
          <section className="test-section">
            <h2>🧪 Test de Funcionalidades</h2>
            <div className="test-grid">
              <div className="test-card">
                <h3>HMR Test</h3>
                <p>Prueba Hot Module Replacement</p>
                <div className="test-demo">
                  <button onClick={() => setCount((count) => count + 1)}>
                    Contador: {count}
                  </button>
                  <code>Edita src/App.jsx para probar HMR</code>
                </div>
              </div>

              <div className="test-card">
                <h3>Responsive Design</h3>
                <p>Prueba el diseño responsivo</p>
                <div className="test-demo">
                  <div className="demo-box primary">Desktop</div>
                  <div className="demo-box secondary">Tablet</div>
                  <div className="demo-box responsive">Mobile</div>
                </div>
              </div>

              <div className="test-card">
                <h3>Animaciones</h3>
                <p>Prueba las animaciones CSS</p>
                <div className="test-demo">
                  <div className="animated-box">Hover me!</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>JuniorDev Network</h4>
            <p>Conectando desarrolladores junior con oportunidades profesionales</p>
          </div>
          <div className="footer-section">
            <h4>Recursos</h4>
            <ul>
              <li><a href="#docs">Documentación API</a></li>
              <li><a href="#guide">Guía Rápida</a></li>
              <li><a href="#structure">Estructura del Proyecto</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li><a href="#support">Soporte</a></li>
              <li><a href="#github">GitHub</a></li>
              <li><a href="#discord">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 JuniorDev Network. Todos los derechos reservados.</p>
          <p>
            Hecho con ❤️ para la comunidad de desarrolladores junior
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
