// components/network/CommunityBrowser.jsx
import React, { useState } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

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

    React.useEffect(() => {
        loadCommunities()
    }, [loadCommunities])

    React.useEffect(() => {
        const filters = {}
        if (selectedType) filters.type = selectedType
        if (searchTerm) filters.search = searchTerm

        applyCommunityFilters(filters)
    }, [selectedType, searchTerm, applyCommunityFilters])

    const handleJoinCommunity = async (communityId) => {
        await joinCommunity(communityId)
    }

    const userCommunityIds = userCommunities.map(c => c.id)

    const filteredCommunities = allCommunities.filter(community => {
        const matchesType = !selectedType || community.type === selectedType
        const matchesSearch = !searchTerm ||
            community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            community.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesType && matchesSearch
    })

    if (isLoading) return <div>Cargando comunidades...</div>

    return (
        <div className="community-browser">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar comunidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="">Todos los tipos</option>
                    <option value="skill_based">Por skill</option>
                    <option value="location_based">Por ubicación</option>
                    <option value="project_based">Por proyecto</option>
                </select>
            </div>

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