/**
 * BadgesProgress - Muestra las insignias ganadas y su progreso
 */
import { FiTrendingUp } from 'react-icons/fi'

/**
 * Componente para mostrar las insignias del usuario
 * @component
 * @param {Array<Object>} badges - Array de insignias con datos de progreso
 * @returns {React.JSX.Element}
 */
export default function BadgesProgress({ badges = [] }) {
  const defaultBadges = [
    {
      id: 1,
      name: 'Primer Paso',
      description: 'Completa tu primer proyecto',
      icon: '🚀',
      progress: 0,
      target: 1,
      unlocked: false,
    },
    {
      id: 2,
      name: 'Aprendiz',
      description: 'Completa 5 proyectos',
      icon: '📚',
      progress: 0,
      target: 5,
      unlocked: false,
    },
    {
      id: 3,
      name: 'Colaborador',
      description: 'Ayuda a 3 desarrolladores',
      icon: '🤝',
      progress: 0,
      target: 3,
      unlocked: false,
    },
    {
      id: 4,
      name: 'Maestro',
      description: 'Completa 20 proyectos',
      icon: '👨‍🎓',
      progress: 0,
      target: 20,
      unlocked: false,
    },
  ]

  const displayBadges = badges.length > 0 ? badges : defaultBadges

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-orange-500" />
        Insignias y Logros
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {displayBadges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              badge.unlocked
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h4 className="font-semibold text-gray-900 text-sm">{badge.name}</h4>
            <p className="text-xs text-gray-600 mb-3">{badge.description}</p>

            {/* Progress bar */}
            <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  badge.unlocked ? 'bg-orange-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min((badge.progress / badge.target) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {badge.progress} / {badge.target}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
