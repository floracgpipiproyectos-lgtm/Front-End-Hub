/**
 * @fileoverview Componente MentorCard para mostrar información de un mentor
 * Permite visualizar perfil del mentor y enviar solicitud de mentoría
 */

import React, { useState } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

/**
 * Tarjeta individual de mentor con información y opciones de solicitud
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {string} props.mentorId - ID del mentor a mostrar
 * @returns {React.ReactElement|null} Tarjeta de mentor o null si no existe
 * 
 * @example
 * <MentorCard mentorId="mentor-123" />
 */
const MentorCard = ({ mentorId }) => {
    const { getMentorById, requestMentor } = useNetwork()
    const mentor = getMentorById(mentorId)
    const [isRequesting, setIsRequesting] = useState(false)

    /**
     * Maneja la solicitud de mentoría al mentor
     * @async
     */
    const handleRequestMentorship = async () => {
        setIsRequesting(true)
        try {
            await requestMentor(mentorId, {
                message: 'Me gustaría aprender de tu experiencia',
                goals: ['Mejorar mis habilidades técnicas', 'Consejos de carrera']
            })
        } catch (error) {
            console.error('Error al solicitar mentoría:', error)
        } finally {
            setIsRequesting(false)
        }
    }

    // No renderizar si el mentor no existe
    if (!mentor) return null

    const canRequestMentorship = mentor.availability === 'available'

    return (
        <div className="mentor-card">
            {/* Avatar del mentor */}
            <img src={mentor.avatarUrl} alt={mentor.name} className="mentor-avatar" />

            {/* Información básica */}
            <h3 className="mentor-name">{mentor.name}</h3>
            <p className="mentor-bio">{mentor.bio}</p>

            {/* Skills del mentor */}
            <div className="skills">
                {mentor.skills.map(skill => (
                    <span key={skill} className="skill-tag">
                        {skill}
                    </span>
                ))}
            </div>

            {/* Estado de disponibilidad */}
            <div className="availability-status">
                <span
                    className={`status-indicator ${mentor.availability}`}
                    title={canRequestMentorship ? 'Disponible' : 'No disponible'}
                />
                <span className="availability-text">
                    {canRequestMentorship ? 'Disponible' : 'No disponible'}
                </span>
            </div>

            {/* Botón de solicitud */}
            <button
                onClick={handleRequestMentorship}
                disabled={isRequesting || !canRequestMentorship}
                className="btn-request-mentorship"
                title={
                    canRequestMentorship
                        ? 'Solicitar mentoría'
                        : 'Este mentor no está disponible'
                }
            >
                {isRequesting ? 'Enviando...' : 'Solicitar Mentoría'}
            </button>
        </div>
    )
}

export default MentorCard