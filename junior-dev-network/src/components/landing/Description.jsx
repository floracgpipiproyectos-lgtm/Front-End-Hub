/**
 * Componente Description de características principales
 */
import Card from '../common/Card'

export default function Description() {
  const features = [
    {
      icon: '📄',
      title: 'Análisis de CV Inteligente',
      description: 'Sube tu CV y automáticamente detectamos tus habilidades técnicas y áreas de interés'
    },
    {
      icon: '🎯',
      title: 'Proyectos Personalizados',
      description: 'Recibe sugerencias de proyectos open-source, challenges y freelance Junior-friendly'
    },
    {
      icon: '👥',
      title: 'Red de Mentores',
      description: 'Conecta con desarrolladores experimentados que quieren guiar tu carrera'
    },
    {
      icon: '🏆',
      title: 'Gamificación',
      description: 'Gana badges, progresa de nivel y visualiza tu crecimiento profesional'
    },
    {
      icon: '💼',
      title: 'Portafolio Automático',
      description: 'Tu perfil se convierte en un portafolio profesional que muestra tu trayectoria'
    },
    {
      icon: '🌐',
      title: 'Comunidades Relevantes',
      description: 'Únete a comunidades de desarrolladores con intereses similares'
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Características Principales
          </h2>
          <p className="text-xl text-gray-600">
            Todo lo que necesitas para comenzar tu carrera en desarrollo web
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="p-8">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-12">
          <h3 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Regístrate', desc: 'Crea tu cuenta en segundos' },
              { num: '2', title: 'Sube CV', desc: 'Carga tu CV para análisis' },
              { num: '3', title: 'Descubre', desc: 'Encuentra proyectos perfectos' },
              { num: '4', title: 'Crece', desc: 'Obtén experiencia y badges' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
