/**
 * Página de Características
 */
export default function Caracteristicas() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Características de JuniorDev</h1>
          <p className="text-xl">Todo lo que necesitas para comenzar tu carrera en desarrollo web</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="flex gap-8 items-start">
              <div className="text-5xl">📄</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Análisis de CV Inteligente</h2>
                <p className="text-gray-600">
                  Sube tu CV y automáticamente detectamos tus habilidades técnicas y áreas de interés. 
                  Nuestro sistema de IA analiza tu experiencia y te sugiere proyectos perfectos para tu nivel.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-8 items-start">
              <div className="text-5xl">🎯</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Proyectos Personalizados</h2>
                <p className="text-gray-600">
                  Recibe sugerencias de proyectos open-source, challenges y trabajos freelance 
                  específicamente diseñados para desarrolladores junior.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-8 items-start">
              <div className="text-5xl">👥</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Red de Mentores</h2>
                <p className="text-gray-600">
                  Conecta con desarrolladores experimentados que quieren guiar tu carrera. 
                  Obtén feedback directo y acelera tu aprendizaje.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-8 items-start">
              <div className="text-5xl">🏆</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Gamificación</h2>
                <p className="text-gray-600">
                  Gana badges, progresa de nivel y visualiza tu crecimiento profesional. 
                  Cada logro te acerca más a tu primer trabajo como desarrollador.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-8 items-start">
              <div className="text-5xl">💼</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Portafolio Automático</h2>
                <p className="text-gray-600">
                  Tu perfil se convierte en un portafolio profesional que muestra tu trayectoria, 
                  proyectos completados y habilidades adquiridas.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-8 items-start">
              <div className="text-5xl">🌐</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Comunidades Relevantes</h2>
                <p className="text-gray-600">
                  Únete a comunidades de desarrolladores con intereses similares. 
                  Comparte conocimientos y crece junto a otros juniors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
