/**
 * Componente MentorArea - Muestra mentores destacados
 */
import { useState, useEffect } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import { networkService } from '../../api/services/networkService'
import Spinner from '../common/Spinner'

export default function MentorArea() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    networkService.getMentorSuggestions()
        .then((data) => {
          if (isMounted) {
            setMentors(data.slice(0, 4));
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Error loading mentors:', error);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });

    return () => {
      isMounted = false;
    };
  }, []);


  if (loading) {
    return <Spinner />
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mentores Destacados
          </h2>
          <p className="text-xl text-gray-600">
            Conecta con profesionales experimentados que quieren ayudarte a crecer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
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
                  {mentor.skills.map((skill, idx) => (
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

        {/* View all link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">¿Buscas más mentores?</p>
          <Button variant="outline" size="lg">
            Ver todos los mentores →
          </Button>
        </div>
      </div>
    </section>
  )
}
