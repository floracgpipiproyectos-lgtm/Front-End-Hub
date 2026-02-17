/**
 * @fileoverview Componente NetworkStats para mostrar estadísticas de la red de usuario
 * Visualiza métricas de conexiones, mensajes y actividades de red
 */

import React from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

/**
 * Componente que muestra estadísticas resumidas de la red del usuario
 * @component
 * @returns {React.ReactElement} Grid de tarjetas con estadísticas de red
 * 
 * @example
 * <NetworkStats />
 */
const NetworkStats = () => {
    const { networkMetrics } = useNetwork()

    /**
     * Array de estadísticas a mostrar con sus valores e íconos
     * @type {Array<{label: string, value: number, icon?: string}>}
     */
    const stats = [
        {
            label: 'Conexiones',
            value: networkMetrics.activeConnections,
            icon: 'users'
        },
        {
            label: 'Solicitudes Pendientes',
            value: networkMetrics.pendingRequests,
            icon: 'inbox'
        },
        {
            label: 'Mentores Disponibles',
            value: networkMetrics.availableMentors,
            icon: 'mentor'
        },
        {
            label: 'Comunidades',
            value: networkMetrics.joinedCommunities,
            icon: 'community'
        },
        {
            label: 'Mensajes No Leídos',
            value: networkMetrics.unreadMessages,
            icon: 'message'
        },
        {
            label: 'Chats Activos',
            value: networkMetrics.activeChats,
            icon: 'chat'
        }
    ]

    return (
        <div className="network-stats">
            <h3>Estadísticas de tu Red</h3>
            {/* Grid de tarjetas de estadísticas */}
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                        {/* Valor de la estadística */}
                        <div className="stat-value" title={stat.label}>
                            {stat.value}
                        </div>
                        {/* Etiqueta descriptiva */}
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NetworkStats