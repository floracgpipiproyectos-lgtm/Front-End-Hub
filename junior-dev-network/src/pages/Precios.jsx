/**
 * Página de Precios
 */
export default function Precios() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
          <p className="text-xl">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-lg p-8 text-center hover:shadow-lg transition">
              <h2 className="text-2xl font-bold mb-2">Gratis</h2>
              <p className="text-4xl font-bold text-blue-600 mb-4">$0</p>
              <p className="text-gray-600 mb-6">Para empezar</p>
              <ul className="text-left space-y-3 mb-8">
                <li>✅ Perfil básico</li>
                <li>✅ Subir CV</li>
                <li>✅ Ver proyectos</li>
                <li>✅ 3 conexiones/mes</li>
                <li>❌ Mentorías</li>
                <li>❌ Badges premium</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                Empezar Gratis
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-600 rounded-lg p-8 text-center shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Más Popular
              </div>
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <p className="text-4xl font-bold text-blue-600 mb-4">$9.99</p>
              <p className="text-gray-600 mb-6">/mes</p>
              <ul className="text-left space-y-3 mb-8">
                <li>✅ Todo del plan gratis</li>
                <li>✅ Perfil destacado</li>
                <li>✅ Conexiones ilimitadas</li>
                <li>✅ 2 mentorías/mes</li>
                <li>✅ Badges premium</li>
                <li>✅ Portafolio personalizado</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Obtener Pro
              </button>
            </div>

            {/* Team Plan */}
            <div className="border rounded-lg p-8 text-center hover:shadow-lg transition">
              <h2 className="text-2xl font-bold mb-2">Equipo</h2>
              <p className="text-4xl font-bold text-blue-600 mb-4">$29.99</p>
              <p className="text-gray-600 mb-6">/mes</p>
              <ul className="text-left space-y-3 mb-8">
                <li>✅ Todo del plan Pro</li>
                <li>✅ 5 miembros</li>
                <li>✅ Chat grupal</li>
                <li>✅ Mentorías grupales</li>
                <li>✅ Analytics avanzado</li>
                <li>✅ Soporte prioritario</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
