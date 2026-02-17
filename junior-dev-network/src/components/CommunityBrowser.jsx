/**
 * @fileoverview Componente CommunityBrowser para explorar y unirse a comunidades
 * Permite filtrar comunidades por tipo y búsqueda, visualizar información y gestionar membresías
 */

import React, { useState } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

/**
 * Componente que renderiza un navegador de comunidades con filtros y búsqueda
 * @component
 * @returns {React.ReactElement} Interfaz de exploración de comunidades con grid de tarjetas
 * 
 * @example
 * <CommunityBrowser />
 */
const CommunityBrowser = () => {
    const {
        loadCommunities,
        allCommunities,
        userCommunities,
        joinCommunity,
        isLoading,
        applyCommunityFilters
    } = useNetwork()

    const [selectedType, setSelectedType] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    /**
     * Carga comunidades disponibles al montar el componente
     */
    React.useEffect(() => {
        loadCommunities()
    }, [loadCommunities])

    /**
     * Aplica filtros de búsqueda y tipo cada vez que cambian
     */
    React.useEffect(() => {
        const filters = {}
        if (selectedType) filters.type = selectedType
        if (searchTerm) filters.search = searchTerm

        applyCommunityFilters(filters)
    }, [selectedType, searchTerm, applyCommunityFilters])

    /**
     * Maneja la solicitud para unirse a una comunidad
     * @async
     * @param {string} communityId - ID de la comunidad
     */
    const handleJoinCommunity = async (communityId) => {
        await joinCommunity(communityId)
    }

    // Obtener IDs de comunidades a las que ya pertenece el usuario
    const userCommunityIds = userCommunities.map(c => c.id)

    /**
     * Filtra comunidades por tipo y término de búsqueda
     */
    const filteredCommunities = allCommunities.filter(community => {
        const matchesType = !selectedType || community.type === selectedType
        const matchesSearch = !searchTerm ||
            community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            community.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesType && matchesSearch
    })

    if (isLoading) return <div className="loading">Cargando comunidades...</div>

    return (
        <div className="community-browser">
            {/* Sección de filtros */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar comunidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar comunidades"
                />
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    aria-label="Filtrar por tipo de comunidad"
                >
                    <option value="">Todos los tipos</option>
                    <option value="skill_based">Por skill</option>
                    <option value="location_based">Por ubicación</option>
                    <option value="project_based">Por proyecto</option>
                </select>
            </div>

            {/* Grid de comunidades */}
            <div className="communities-grid">
                {filteredCommunities.map(community => (
                    <div key={community.id} className="community-card">
                        <img src={community.iconUrl} alt={community.name} />
                        <h3>{community.name}</h3>
                        <p>{community.description}</p>
                        <div className="community-meta">
                            <span>{community.memberCount} miembros</span>
                            <span>{community.platform}</span>
                        </div>
                        {userCommunityIds.includes(community.id) ? (
                            <button disabled>Ya eres miembro</button>
                        ) : (
                            <button onClick={() => handleJoinCommunity(community.id)}>
                                Unirse
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommunityBrowser