// components/network/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNetwork } from '@/store/hooks/useNetwork'

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

    const messages = getMessagesByConversation(conversationId)

    useEffect(() => {
        loadMessages({ conversationId })
    }, [conversationId, loadMessages])

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
                        <span className="timestamp">
                            {new Date(message.sentAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

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