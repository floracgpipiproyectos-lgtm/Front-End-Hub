// components/GamificationDashboard.jsx
import React, { useEffect } from 'react'
import { useGamification, useRewards } from '@/store/hooks/useGamification'

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

    const {
        rewardProjectCompletion,
        rewardDailyLogin
    } = useRewards()

    // Cargar datos al montar
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

    // Simular recompensa diaria
    const handleDailyReward = async () => {
        await rewardDailyLogin()
        sendNotification({
            type: 'success',
            title: '¡Recompensa diaria!',
            message: 'Has recibido 10 XP por iniciar sesión hoy',
            timestamp: new Date().toISOString()
        })
    }

    if (isLoading) {
        return <div>Cargando gamificación...</div>
    }

    if (hasError) {
        return <div>Error cargando datos de gamificación</div>
    }

    return (
        <div className="gamification-dashboard">
            {/* Sección de progreso */}
            <div className="progress-section">
                <h2>Tu Progreso</h2>
                <div className="level-info">
                    <span className="level">Nivel {progress.level}</span>
                    <div className="xp-bar">
                        <div
                            className="xp-fill"
                            style={{ width: `${levelProgress.percentage}%` }}
                        />
                        <span className="xp-text">
                            {progress.xp} / {progress.nextLevelXP} XP
                        </span>
                    </div>
                    {isNearLevelUp && (
                        <div className="level-up-alert">
                            ¡Casi subes de nivel! Faltan {levelProgress.needed} XP
                        </div>
                    )}
                </div>

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
            </div>

            {/* Sección de badges */}
            <div className="badges-section">
                <h2>Tus Badges</h2>
                <div className="badges-grid">
                    {userBadges.slice(0, 8).map((userBadge) => (
                        <div key={userBadge.badge.id} className="badge">
                            <img
                                src={userBadge.badge.iconUrl}
                                alt={userBadge.badge.name}
                                className={`badge-icon ${userBadge.isNew ? 'new' : ''}`}
                            />
                            <span className="badge-name">{userBadge.badge.name}</span>
                            {userBadge.isNew && <span className="badge-new">Nuevo</span>}
                        </div>
                    ))}
                </div>
                {newBadges.length > 0 && (
                    <div className="new-badges-alert">
                        Tienes {newBadges.length} badges nuevos por ver
                    </div>
                )}
            </div>

            {/* Sección de leaderboard */}
            {currentLeaderboard && (
                <div className="leaderboard-section">
                    <h2>Leaderboard {currentLeaderboard.type === 'weekly' ? 'Semanal' : 'General'}</h2>
                    <div className="leaderboard">
                        <div className="leaderboard-header">
                            <span>Posición</span>
                            <span>Usuario</span>
                            <span>Puntuación</span>
                        </div>
                        {currentLeaderboard.topEntries.map((entry) => (
                            <div
                                key={entry.userId}
                                className={`leaderboard-entry ${entry.rank === currentLeaderboard.userRank ? 'current-user' : ''}`}
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
                </div>
            )}

            {/* Sección de metas */}
            <div className="goals-section">
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
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Notificaciones */}
            {unreadNotificationsCount > 0 && (
                <div className="notifications-badge">
                    <span>{unreadNotificationsCount}</span>
                </div>
            )}

            {/* Botones de acción */}
            <div className="actions">
                <button onClick={handleDailyReward} className="btn-primary">
                    Reclamar recompensa diaria
                </button>
            </div>
        </div>
    )
}

export default GamificationDashboard