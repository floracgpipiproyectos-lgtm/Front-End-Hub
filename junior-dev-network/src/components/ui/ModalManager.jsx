/**
 * @fileoverview Componente ModalManager para gestionar modales de la aplicación
 * Renderiza dinámicamente diferentes tipos de modales (success, error, confirm)
 */

import React from 'react'
import { useUI } from '@/store/hooks/useUI'
import SuccessModal from './modals/SuccessModal'
import ErrorModal from './modals/ErrorModal'
import ConfirmModal from './modals/ConfirmModal'

/**
 * Componente que gestiona la visualización de modales dinámicamente
 * @component
 * @returns {React.ReactElement|null} Modal activo o null si no hay modal abierto
 * 
 * @example
 * <ModalManager />
 */
const ModalManager = () => {
    const { activeModal, closeModal } = useUI()

    // No renderizar si no hay modal activo
    if (!activeModal) return null

    /**
     * Renderiza el modal correcto según su tipo
     * @returns {React.ReactElement} Componente de modal correspondiente
     */
    const renderModal = () => {
        switch (activeModal.type) {
            case 'success':
                return <SuccessModal {...activeModal.props} />
            case 'error':
                return <ErrorModal {...activeModal.props} />
            case 'confirm':
                return <ConfirmModal {...activeModal.props} />
            default:
                return null
        }
    }

    return (
        <div className="modal-manager" role="presentation">
            {/* Backdrop para cerrar modal al hacer clic */}
            <div
                className="modal-backdrop"
                onClick={() => closeModal(activeModal.id)}
                role="button"
                tabIndex="0"
                aria-label="Cerrar modal"
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        closeModal(activeModal.id)
                    }
                }}
            />
            {/* Contenedor del modal */}
            <div className="modal-container" role="dialog" aria-modal="true">
                {renderModal()}
            </div>
        </div>
    )
}

export default ModalManager