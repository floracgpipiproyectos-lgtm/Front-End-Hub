// components/network/ConnectionRequests.jsx
import React, { useEffect } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

const ConnectionRequests = () => {
    const {
        loadConnections,
        pendingConnections,
        acceptConnection,
        rejectConnection,
        isLoading
    } = useNetwork()

    useEffect(() => {
        loadConnections({ status: 'pending' })
    }, [loadConnections])

    const handleAccept = async (connectionId) => {
        await acceptConnection(connectionId)
    }

    const handleReject = async (connectionId) => {
        await rejectConnection(connectionId)
    }

    if (isLoading) return <div>Cargando solicitudes...</div>
    if (pendingConnections.length === 0) return <div>No hay solicitudes pendientes</div>

    return (
        <div className="connection-requests">
            <h3>Solicitudes de Conexión ({pendingConnections.length})</h3>
            {pendingConnections.map(connection => (
                <div key={connection.id} className="request-item">
                    <img src={connection.userAvatarUrl} alt={connection.userAlias} />
                    <div className="request-info">
                        <h4>{connection.userAlias}</h4>
                        <p>{connection.message}</p>
                        <div className="common-skills">
                            {connection.commonSkills.map(skill => (
                                <span key={skill}>{skill}</span>
                            ))}
                        </div>
                    </div>
                    <div className="request-actions">
                        <button onClick={() => handleAccept(connection.id)}>
                            Aceptar
                        </button>
                        <button onClick={() => handleReject(connection.id)}>
                            Rechazar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ConnectionRequests