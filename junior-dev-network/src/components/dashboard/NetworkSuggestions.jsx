/**
 * NetworkSuggestions - Muestra sugerencias de conexiones y comunidades
 */
import { useState } from 'react'
import { FiCheckCircle, FiUserPlus, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import Card from '../common/Card'

/**
 * Componente para sugerencias de red
 * @component
 * @param {Array<Object>} suggestions - Array de desarrolladores sugeridos
 * @returns {JSX.Element}
 */
export default function NetworkSuggestions({ suggestions = [] }) {
  const [connected, setConnected] = useState({})

  const defaultSuggestions = [
    {
      id: 1,
      name: 'María González',
      alias: '@mariag',
      role: 'Frontend Developer',
      skills: ['React', 'Vue.js', 'TypeScript'],
      avatar: '👩‍💻',
      mutual: 3,
    },
    {
      id: 2,
      name: 'David López',
      alias: '@davidl',
      role: 'Full Stack Developer',
      skills: ['Node.js', 'React', 'MongoDB'],
      avatar: '👨‍💻',
      mutual: 2,
    },
    {
      id: 3,
      name: 'Sophia Martínez',
      alias: '@sophiam',
      role: 'Backend Developer',
      skills: ['Python', 'Django', 'PostgreSQL'],
      avatar: '👩‍🔬',
      mutual: 1,
    },
  ]

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions

  const handleConnect = (suggestion) => {
    setConnected((prev) => ({
      ...prev,
      [suggestion.id]: !prev[suggestion.id],
    }))
    const message = connected[suggestion.id]
      ? `Solicitud eliminada`
      : `Solicitud de conexión enviada a ${suggestion.name}`
    toast.success(message)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiUsers className="text-blue-500" />
        Sugerencias de Conexión
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {displaySuggestions.map((suggestion) => (
          <Card key={suggestion.id} hover>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="text-5xl">{suggestion.avatar}</div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{suggestion.name}</h4>
                  <p className="text-sm text-gray-600">{suggestion.alias}</p>
                  <p className="text-sm font-medium text-blue-600 mb-2">{suggestion.role}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {suggestion.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Mutual connections */}
                  <p className="text-xs text-gray-500 mt-2">
                    {suggestion.mutual} conexión{suggestion.mutual !== 1 ? 'es' : ''} mutua
                    {suggestion.mutual !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Connect button */}
              <div>
                {connected[suggestion.id] ? (
                  <button
                    onClick={() => handleConnect(suggestion)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FiCheckCircle size={18} />
                    Enviada
                  </button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleConnect(suggestion)}
                    className="flex items-center gap-2"
                  >
                    <FiUserPlus size={18} />
                    Conectar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
