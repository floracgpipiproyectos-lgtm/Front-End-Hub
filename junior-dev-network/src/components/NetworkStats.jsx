// components/network/NetworkStats.jsx
import React from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

const NetworkStats = () => {
    const { networkMetrics } = useNetwork()

    const stats = [
        { label: 'Conexiones', value: networkMetrics.activeConnections },
        { label: 'Solicitudes Pendientes', value: networkMetrics.pendingRequests },
        { label: 'Mentores Disponibles', value: networkMetrics.availableMentors },
        { label: 'Comunidades', value: networkMetrics.joinedCommunities },
        { label: 'Mensajes No Leídos', value: networkMetrics.unreadMessages },
        { label: 'Chats Activos', value: networkMetrics.activeChats }
    ]

    return (
        <div className="network-stats">
            <h3>Estadísticas de tu Red</h3>
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NetworkStats