/**
 * Componente principal App con rutas
 * OPTIMIZADO: Code splitting con React.lazy y Suspense
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy } from 'react'
import Spinner from './components/common/Spinner'

// Pages - Carga lazy para mejorar performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const MentoresPage = lazy(() => import('./pages/MentoresPage'))
const FAQPage = lazy(() => import('./pages/FAQ'))
const PreciosPage = lazy(() => import('./pages/Precios'))
const ContactoPage = lazy(() => import('./pages/Contacto'))
const CaracteristicasPage = lazy(() => import('./pages/Caracteristicas'))
const PrivacidadPage = lazy(() => import('./pages/Privacidad'))
const TerminosPage = lazy(() => import('./pages/Terminos'))

/**
 * Componente para rutas protegidas
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Spinner />
  }

  return user ? children : <Navigate to="/login" />
}

/**
 * Componente principal
 */
function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
          />
          
          {/* Rutas públicas adicionales */}
          <Route path="/mentores" element={<MentoresPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/precios" element={<PreciosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/caracteristicas" element={<CaracteristicasPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="/terminos" element={<TerminosPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
