/**
 * Componente ProfileCard
 */
import Card from '../common/Card'
import { FiEdit2 } from 'react-icons/fi'

export default function ProfileCard({ user }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Mi Perfil</h2>
        <button className="text-blue-600 hover:text-blue-700">
          <FiEdit2 className="text-xl" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Avatar */}
        <div className="text-center">
          <div className="text-6xl mb-3">👨‍💻</div>
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Alias:</span>
            <span className="font-semibold">{user?.alias || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold text-sm">{user?.email || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Miembro desde:</span>
            <span className="font-semibold text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Nivel:</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              Junior
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-xs text-gray-600">Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-gray-600">Badges</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
