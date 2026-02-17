/**
 * Componente ProjectCard - Tarjeta individual de proyecto
 */
import Card from '../common/Card'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function ProjectCard({ project }) {
  const handleJoin = () => {
    toast.success(`¡Unido a ${project.name}! 🎉`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'open-source':
        return '🔓'
      case 'freelance':
        return '💼'
      case 'challenge':
        return '🏆'
      default:
        return '📌'
    }
  }

  return (
    <Card hover className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
          <span className="text-2xl">{getTypeIcon(project.type)}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty === 'beginner' ? '🌱 Principiante' : project.difficulty}
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
            {project.type}
          </span>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Skills necesarias:</p>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Button */}
        <Button variant="primary" size="sm" fullWidth onClick={handleJoin}>
          Unirse al Proyecto
        </Button>
      </div>
    </Card>
  )
}
