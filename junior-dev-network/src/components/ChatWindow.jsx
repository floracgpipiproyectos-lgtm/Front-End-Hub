/**
 * @fileoverview Componente ChatWindow para comunicación en tiempo real entre usuarios
 * Gestiona visualización de mensajes, envío de mensajes y suscripción a actualizaciones WebSocket
 */

import React, { useState, useEffect, useRef } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

/**
 * Componente que renderiza una ventana de chat interactiva con soporte para WebSocket
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {string} props.conversationId - ID de la conversación actual
 * @param {string} props.userId - ID del usuario actual para identificar mensajes propios
 * @returns {React.ReactElement} Ventana de chat con historial de mensajes y formulario de envío
 * 
 * @example
 * <ChatWindow conversationId="conv-123" userId="user-456" />
 */
const ChatWindow = ({ conversationId, userId }) => {
    const {
        getMessagesByConversation,
        sendMessage,
        loadMessages,
        addMessage,
        markMessageAsRead
    } = useNetwork()

    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef(null)

    // Obtener mensajes de la conversación actual
    const messages = getMessagesByConversation(conversationId)

    /**
     * Carga los mensajes existentes al montar o cambiar de conversación
     */
    useEffect(() => {
        loadMessages({ conversationId })
    }, [conversationId, loadMessages])

    /**
     * Establece conexión WebSocket para mensajes en tiempo real
     * Escucha nuevos mensajes y marca como leídos automáticamente
     */
    useEffect(() => {
        // Simular WebSocket para mensajes en tiempo real
        const ws = new WebSocket(`ws://tu-api/chat/${conversationId}`)

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            addMessage(message)

            // Marcar como leído si es para el usuario actual
            if (message.recipientId === userId) {
                markMessageAsRead(message.id)
            }
        }

        return () => ws.close()
    }, [conversationId, userId, addMessage, markMessageAsRead])

    /**
     * Maneja el envío de mensajes al servidor
     * @async
     * @param {React.FormEvent} e - Evento del formulario
     * @throws {Error} Si falla el envío del mensaje
     */
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || isSending) return

        setIsSending(true)
        try {
            await sendMessage({
                recipientId: userId,
                conversationId,
                content: newMessage
            })
            setNewMessage('')
        } finally {
            setIsSending(false)
        }
    }

    /**
     * Desplaza automáticamente al último mensaje
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="chat-window">
            <div className="messages-container">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`message ${message.senderId === userId ? 'sent' : 'received'}`}
                    >
                        <p>{message.content}</p>
                        {/* Mostrar timestamp del mensaje */}
                        <span className="timestamp">
                            {new Date(message.sentAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Formulario de envío de mensajes */}
            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    disabled={isSending}
                />
                <button type="submit" disabled={isSending || !newMessage.trim()}>
                    {isSending ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    )
}

export default ChatWindow