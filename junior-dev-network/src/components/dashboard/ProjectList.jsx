/**
 * Componente ProjectList - Lista de proyectos sugeridos
 */
import { useState, useEffect } from 'react'
import Card from '../common/Card'
import ProjectCard from './ProjectCard'
import Spinner from '../common/Spinner'
import { projectService } from '@/api/index.js'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    projectService.getSuggestedProjects()
        .then((data) => {
          if (isMounted) {
            setProjects(data);
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Error loading projects:', error);
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">🎯 Proyectos para ti</h2>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Sube tu CV para obtener proyectos personalizados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Ver todos los proyectos →
          </a>
        </div>
      )}
    </Card>
  )
}
