// components/network/MentorCard.jsx
import React from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

const MentorCard = ({ mentorId }) => {
    const { getMentorById, requestMentor } = useNetwork()
    const mentor = getMentorById(mentorId)
    const [isRequesting, setIsRequesting] = React.useState(false)

    const handleRequestMentorship = async () => {
        setIsRequesting(true)
        try {
            await requestMentor(mentorId, {
                message: 'Me gustaría aprender de tu experiencia',
                goals: ['Mejorar mis habilidades técnicas', 'Consejos de carrera']
            })
        } finally {
            setIsRequesting(false)
        }
    }

    if (!mentor) return null

    return (
        <div className="mentor-card">
            <img src={mentor.avatarUrl} alt={mentor.name} />
            <h3>{mentor.name}</h3>
            <p>{mentor.bio}</p>
            <div className="skills">
                {mentor.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                ))}
            </div>
            <button
                onClick={handleRequestMentorship}
                disabled={isRequesting || mentor.availability !== 'available'}
            >
                {isRequesting ? 'Enviando...' : 'Solicitar Mentoría'}
            </button>
        </div>
    )
}

export default MentorCard