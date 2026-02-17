/**
 * Componente Hero de la landing page
 * ACTUALIZADO: Incluye más enlaces a otras páginas
 */
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-2">JuniorDev</h1>
        <p className="text-xl mb-4">Para desarrolladores junior</p>
        <h2 className="text-4xl font-semibold mb-6">Tu primer paso en el mundo tech</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Sube tu CV, descubre proyectos accesibles, conecta con mentores y construye tu portafolio desde cero.
          Todo lo que necesitas para conseguir tu primer trabajo como desarrollador.
        </p>
        <div className="space-x-4 mb-8">
          <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Comienza gratis →
          </Link>
          <Link to="/login" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-block">
            Tengo cuenta
          </Link>
        </div>
        
        {/* Links adicionales */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/mentores" className="text-blue-200 hover:text-white underline">
            🧑‍🏫 Encuentra un Mentor
          </Link>
          <Link to="/caracteristicas" className="text-blue-200 hover:text-white underline">
            ✨ Ver Características
          </Link>
          <Link to="/precios" className="text-blue-200 hover:text-white underline">
            💰 Planes y Precios
          </Link>
          <Link to="/faq" className="text-blue-200 hover:text-white underline">
            ❓ Preguntas Frecuentes
          </Link>
        </div>
      </div>
    </section>
  )
}
