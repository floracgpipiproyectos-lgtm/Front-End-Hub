/**
 * Página de Mentores
 */
import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { networkService } from '../api/services/networkService'

export default function MentoresPage() {
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const loadMentors = async () => {
            try {
                const data = await networkService.getMentorSuggestions()
                setMentors(data)
            } catch (error) {
                console.error('Error loading mentors:', error)
            } finally {
                setLoading(false)
            }
        }

        loadMentors()
    }, [])

    const filteredMentors = filter === 'all'
        ? mentors
        : mentors.filter(m => m.skills && m.skills.includes(filter))

    if (loading) {
        return <Spinner />
    }

    // Get unique skills for filter
    const allSkills = [...new Set(mentors.flatMap(m => m.skills || []))]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Encuentra tu Mentor</h1>
                    <p className="text-xl">Conecta con desarrolladores experimentados que te guiarán en tu carrera</p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 px-4 bg-white shadow">
                <div className="container mx-auto">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Todos
                        </button>
                        {allSkills.slice(0, 8).map((skill) => (
                            <button
                                key={skill}
                                onClick={() => setFilter(skill)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === skill
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mentors Grid */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMentors.map((mentor) => (
                            <Card key={mentor.id} hover className="p-6">
                                <div className="text-center space-y-4">
                                    {/* Avatar */}
                                    <div className="text-6xl">{mentor.avatar}</div>

                                    {/* Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                                        <p className="text-sm text-blue-600">@{mentor.alias}</p>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-gray-600 text-sm">{mentor.bio}</p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {mentor.skills && mentor.skills.slice(0, 4).map((skill, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Availability */}
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-green-700 font-semibold">Disponible</span>
                                    </div>

                                    {/* Button */}
                                    <Button variant="primary" size="sm" fullWidth>
                                        Solicitar Mentoría
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {filteredMentors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No se encontraron mentores con ese filtro.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
