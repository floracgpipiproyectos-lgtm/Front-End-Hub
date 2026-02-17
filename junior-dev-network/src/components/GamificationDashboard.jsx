/**
 * @fileoverview Componente GamificationDashboard para mostrar progreso, badges y recompensas
 * Integra visualización de progreso, badges, leaderboard, metas y notificaciones
 */

import React, { useEffect } from 'react'
import { useGamification } from '@/store/hooks/useGamification'

/**
 * Componente principal del dashboard de gamificación
 * Muestra progreso de usuario, badges, leaderboard y objetivos activos
 * @component
 * @returns {React.ReactElement} Dashboard completo de gamificación
 * 
 * @example
 * <GamificationDashboard />
 */
const GamificationDashboard = () => {
    const {
        // Estado
        progress,
        userBadges,
        newBadges,
        currentLeaderboard,
        activeGoals,
        streakInfo,
        levelProgress,
        unreadNotificationsCount,

        // Acciones
        loadProgress,
        loadUserBadges,
        loadLeaderboard,
        loadGoals,
        sendNotification,
        markNotificationRead,

        // Estados
        isLoading,
        hasError,

        // Utilitarios
        getBadgesByType
    } = useGamification()

    /**
     * Carga todos los datos de gamificación al montar
     */
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                loadProgress(),
                loadUserBadges(),
                loadLeaderboard({ type: 'weekly' }),
                loadGoals()
            ])
        }

        loadData()
    }, [loadProgress, loadUserBadges, loadLeaderboard, loadGoals])

    /**
     * Calcula si el usuario está cerca de subir de nivel
     * @returns {boolean} True si faltan menos del 10% de XP
     */
    const isNearLevelUp = () => {
        return levelProgress.percentage >= 90
    }

    /**
     * Maneja la reclamación de recompensa diaria
     * @async
     */
    const handleDailyReward = async () => {
        // Recompensar login diario
        sendNotification({
            type: 'success',
            title: '¡Recompensa diaria!',
            message: 'Has recibido 10 XP por iniciar sesión hoy',
            timestamp: new Date().toISOString()
        })
    }

    if (isLoading) {
        return <div className="loading">Cargando gamificación...</div>
    }

    if (hasError) {
        return <div className="error-state">Error cargando datos de gamificación</div>
    }

    return (
        <div className="gamification-dashboard">
            {/* Sección de progreso de nivel */}
            <section className="progress-section">
                <h2>Tu Progreso</h2>
                <div className="level-info">
                    <span className="level">Nivel {progress.level}</span>
                    <div className="xp-bar">
                        <div
                            className="xp-fill"
                            style={{ width: `${levelProgress.percentage}%` }}
                            role="progressbar"
                            aria-valuenow={levelProgress.percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                        <span className="xp-text">
                            {progress.xp} / {progress.nextLevelXP} XP
                        </span>
                    </div>
                    {isNearLevelUp() && (
                        <div className="level-up-alert" role="status">
                            ¡Casi subes de nivel! Faltan {levelProgress.needed} XP
                        </div>
                    )}
                </div>

                {/* Estadísticas principales */}
                <div className="stats-grid">
                    <div className="stat">
                        <span className="stat-value">{progress.badgesEarned}</span>
                        <span className="stat-label">Badges</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{streakInfo.current}</span>
                        <span className="stat-label">Días seguidos</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{progress.projectsCompleted}</span>
                        <span className="stat-label">Proyectos</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{progress.connectionsMade}</span>
                        <span className="stat-label">Conexiones</span>
                    </div>
                </div>
            </section>

            {/* Sección de badges obtenidos */}
            <section className="badges-section">
                <h2>Tus Badges</h2>
                <div className="badges-grid">
                    {userBadges.slice(0, 8).map((userBadge) => (
                        <div
                            key={userBadge.badge.id}
                            className={`badge ${userBadge.isNew ? 'new-badge' : ''}`}
                            title={userBadge.badge.name}
                        >
                            <img
                                src={userBadge.badge.iconUrl}
                                alt={userBadge.badge.name}
                                className="badge-icon"
                            />
                            <span className="badge-name">{userBadge.badge.name}</span>
                            {userBadge.isNew && (
                                <span className="badge-new-indicator">Nuevo</span>
                            )}
                        </div>
                    ))}
                </div>
                {newBadges.length > 0 && (
                    <div className="new-badges-alert" role="status">
                        Tienes {newBadges.length} badges nuevos por ver
                    </div>
                )}
            </section>

            {/* Sección de leaderboard */}
            {currentLeaderboard && (
                <section className="leaderboard-section">
                    <h2>
                        Leaderboard {currentLeaderboard.type === 'weekly' ? 'Semanal' : 'General'}
                    </h2>
                    <div className="leaderboard">
                        <div className="leaderboard-header">
                            <span>Posición</span>
                            <span>Usuario</span>
                            <span>Puntuación</span>
                        </div>
                        {currentLeaderboard.topEntries.map((entry) => (
                            <div
                                key={entry.userId}
                                className={`leaderboard-entry ${
                                    entry.rank === currentLeaderboard.userRank ? 'current-user' : ''
                                }`}
                            >
                                <span className="rank">#{entry.rank}</span>
                                <span className="user">{entry.alias}</span>
                                <span className="score">{entry.score} pts</span>
                            </div>
                        ))}
                        {currentLeaderboard.userRank > 5 && (
                            <div className="current-user-position">
                                <span>Tu posición: #{currentLeaderboard.userRank}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Sección de metas activas */}
            <section className="goals-section">
                <h2>Tus Metas Activas</h2>
                <div className="goals-list">
                    {activeGoals.slice(0, 3).map((goal) => {
                        const percentage = (goal.currentValue / goal.targetValue) * 100
                        return (
                            <div key={goal.id} className="goal">
                                <div className="goal-info">
                                    <span className="goal-name">{goal.name}</span>
                                    <span className="goal-progress">
                                        {goal.currentValue} / {goal.targetValue}
                                    </span>
                                </div>
                                <div className="goal-bar">
                                    <div
                                        className="goal-fill"
                                        style={{ width: `${percentage}%` }}
                                        role="progressbar"
                                        aria-valuenow={percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Indicador de notificaciones */}
            {unreadNotificationsCount > 0 && (
                <div className="notifications-badge" role="status" aria-live="polite">
                    <span>{unreadNotificationsCount}</span>
                </div>
            )}

            {/* Botones de acción */}
            <div className="actions">
                <button
                    onClick={handleDailyReward}
                    className="btn-primary"
                    title="Reclamar recompensa diaria"
                >
                    Reclamar recompensa diaria
                </button>
            </div>
        </div>
    )
}

export default GamificationDashboard