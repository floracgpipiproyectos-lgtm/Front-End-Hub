/**
 * @fileoverview Componente ToastContainer para mostrar notificaciones tipo toast
 * Gestiona múltiples notificaciones mostradas simultáneamente con auto-cierre
 */

import React from 'react'
import { useUI } from '@/store/hooks/useUI'
import Toast from './Toast'

/**
 * Contenedor que renderiza y gestiona todas las notificaciones tipo toast
 * @component
 * @returns {React.ReactElement|null} Contenedor de toasts o null si no hay notificaciones
 * 
 * @example
 * <ToastContainer />
 */
const ToastContainer = () => {
    const { visibleToasts, closeNotification } = useUI()

    // No renderizar si no hay notificaciones
    if (visibleToasts.length === 0) return null

    /**
     * Maneja el cierre de una notificación
     * @param {string} toastId - ID de la notificación a cerrar
     */
    const handleCloseNotification = (toastId) => {
        closeNotification(toastId)
    }

    return (
        <div className="toast-container" role="region" aria-live="polite" aria-label="Notificaciones">
            {/* Lista de notificaciones activas */}
            {visibleToasts.map(toast => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => handleCloseNotification(toast.id)}
                />
            ))}
        </div>
    )
}

export default ToastContainer