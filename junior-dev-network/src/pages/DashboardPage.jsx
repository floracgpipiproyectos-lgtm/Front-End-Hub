import { useAuth } from '../context/AuthContext'
import ProfileCard from '../components/dashboard/ProfileCard'
import CVUploader from '../components/dashboard/CVUploader'
import ProjectList from '../components/dashboard/ProjectList'
import SkillsDisplay from '../components/dashboard/SkillsDisplay'
import BadgesProgress from '../components/dashboard/BadgesProgress'
import NetworkSuggestions from '../components/dashboard/NetworkSuggestions'
import { networkService } from '../api/services/networkService'
import { useState, useEffect } from 'react'
import Spinner from '../components/common/Spinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const data = await networkService.getMentorSuggestions()
        setMentors(data.slice(0, 3))
      } catch (error) {
        console.error('Error loading mentors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMentors()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hola, {user?.alias}</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a tu dashboard. Aqui puedes gestionar tu perfil, CV y proyectos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <ProfileCard user={user} />
            <CVUploader />
            <BadgesProgress />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Proyectos Sugeridos</h2>
              <ProjectList />
            </div>

            <SkillsDisplay skills={user?.skills} />

            <NetworkSuggestions />

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : mentors.length > 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mentores Recomendados</h2>
                <div className="space-y-4">
                  {mentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{mentor.avatar}</span>
                        <div>
                          <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">@{mentor.alias}</p>
                          <div className="flex gap-1 mt-1">
                            {mentor.skills.slice(0, 2).map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
