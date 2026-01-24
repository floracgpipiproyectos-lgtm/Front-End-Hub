// components/ui/ModalManager.jsx
import React from 'react'
import { useUI } from '@/store/hooks/useUI'
import SuccessModal from './modals/SuccessModal'
import ErrorModal from './modals/ErrorModal'
import ConfirmModal from './modals/ConfirmModal'

const ModalManager = () => {
    const { activeModal, closeModal } = useUI()

    if (!activeModal) return null

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
        <div className="modal-manager">
            <div className="modal-backdrop" onClick={() => closeModal(activeModal.id)} />
            <div className="modal-container">
                {renderModal()}
            </div>
        </div>
    )
}

export default ModalManager