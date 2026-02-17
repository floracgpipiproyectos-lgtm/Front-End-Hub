/**
 * SkillsDisplay - Muestra las habilidades del usuario en forma de tags
 */
import { FiX } from 'react-icons/fi'

/**
 * Componente para mostrar las habilidades del usuario
 * @component
 * @param {Array<string>} skills - Array de habilidades a mostrar
 * @param {Function} onRemove - Callback cuando se elimina una habilidad
 * @returns {JSX.Element}
 */
export default function SkillsDisplay({ skills = [], onRemove = null }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h3>
        <p className="text-gray-500">
          Carga tu CV para detectar automáticamente tus habilidades
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades Detectadas</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium group hover:bg-blue-200 transition-colors"
          >
            <span>{skill}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(skill)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Eliminar ${skill}`}
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
