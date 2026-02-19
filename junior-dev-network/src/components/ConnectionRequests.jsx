// noinspection JSValidateTypes

/**
 * @fileoverview Componente ConnectionRequests para gestionar solicitudes de conexión pendientes
 * Permite aceptar o rechazar solicitudes de conexión de otros usuarios
 */

import React, { useEffect } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

/**
 * Componente que renderiza una lista de solicitudes de conexión pendientes
 * @component
 * @returns {React.ReactElement} Lista de solicitudes de conexión con opciones de aceptar/rechazar
 * 
 * @example
 * <ConnectionRequests />
 */
const ConnectionRequests = () => {
    const {
        loadConnections,
        pendingConnections,
        acceptConnection,
        rejectConnection,
        isLoading
    } = useNetwork()

    /**
     * Carga las solicitudes de conexión pendientes al montar
     */
    useEffect(() => {
        loadConnections({ status: 'pending' })
    }, [loadConnections])

    /**
     * Maneja la aceptación de una solicitud de conexión
     * @async
     * @param {string} connectionId - ID de la solicitud de conexión
     */
    const handleAccept = async (connectionId) => {
        await acceptConnection(connectionId)
    }

    /**
     * Maneja el rechazo de una solicitud de conexión
     * @async
     * @param {string} connectionId - ID de la solicitud de conexión
     */
    const handleReject = async (connectionId) => {
        await rejectConnection(connectionId)
    }

    if (isLoading) return <div className="loading">Cargando solicitudes...</div>
    if (pendingConnections.length === 0) {
        return <div className="empty-state">No hay solicitudes pendientes</div>
    }

    return (
        <div className="connection-requests">
            <h3>Solicitudes de Conexión ({pendingConnections.length})</h3>
            {/* Lista de solicitudes pendientes */}
            {pendingConnections.map(connection => (
                <div key={connection.id} className="request-item">
                    <img src={connection.userAvatarUrl} alt={connection.userAlias} />
                    <div className="request-info">
                        <h4>{connection.userAlias}</h4>
                        <p>{connection.message}</p>
                        {/* Skills en común */}
                        <div className="common-skills">
                            {connection.commonSkills.map(skill => (
                                <span key={skill} className="skill-badge">{skill}</span>
                            ))}
                        </div>
                    </div>
                    {/* Acciones para la solicitud */}
                    <div className="request-actions">
                        <button
                            onClick={() => handleAccept(connection.id)}
                            className="btn-accept"
                            title="Aceptar conexión"
                        >
                            Aceptar
                        </button>
                        <button
                            onClick={() => handleReject(connection.id)}
                            className="btn-reject"
                            title="Rechazar conexión"
                        >
                            Rechazar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ConnectionRequests