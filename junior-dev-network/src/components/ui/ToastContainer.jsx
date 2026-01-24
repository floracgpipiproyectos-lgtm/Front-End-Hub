// components/ui/ToastContainer.jsx
import React from 'react'
import { useUI } from '@/store/hooks/useUI'
import Toast from './Toast'

const ToastContainer = () => {
    const { visibleToasts, closeNotification } = useUI()

    if (visibleToasts.length === 0) return null

    return (
        <div className="toast-container">
            {visibleToasts.map(toast => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => closeNotification(toast.id)}
                />
            ))}
        </div>
    )
}

export default ToastContainer