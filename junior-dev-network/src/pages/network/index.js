/**
 * @fileoverview Network Page Component with Form Validations
 * @description Main network page with connection requests, mentor search, and community features
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MentorList from '@/components/network/MentorList'
import ConnectionRequests from '@/components/network/ConnectionRequests'
import NetworkStats from '@/components/network/NetworkStats'
import CommunityBrowser from '@/components/network/CommunityBrowser'

// Import validations
import {
  validateConnectionRequest,
  validateMentorSearch,
  validateCommunityPost,
  connectionRequestSchema,
  mentorSearchSchema,
  communityPostSchema
} from '@/validations'

/**
 * NetworkPage Component
 * @returns {JSX.Element} Network page with validation forms
 */
const NetworkPage = () => {
    const [activeTab, setActiveTab] = useState('overview')
    const [successMessage, setSuccessMessage] = useState('')

    // Form hooks for different validations
    const connectionForm = useForm({
        resolver: zodResolver(connectionRequestSchema),
        defaultValues: {
            recipientEmail: '',
            message: '',
            connectionType: 'professional'
        }
    })

    const mentorForm = useForm({
        resolver: zodResolver(mentorSearchSchema),
        defaultValues: {
            skills: '',
            experience: '',
            location: '',
            availability: 'any'
        }
    })

    const communityForm = useForm({
        resolver: zodResolver(communityPostSchema),
        defaultValues: {
            title: '',
            content: '',
            tags: '',
            category: 'general'
        }
    })

    /**
     * Handle connection request form submission
     * @param {Object} data - Form data
     */
    const onConnectionSubmit = async (data) => {
        try {
            const result = validateConnectionRequest(data)
            if (result.success) {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                setSuccessMessage('✅ Solicitud de conexión enviada exitosamente')
                connectionForm.reset()
                setTimeout(() => setSuccessMessage(''), 3000)
            }
        } catch (error) {
            console.error('Connection request error:', error)
        }
    }

    /**
     * Handle mentor search form submission
     * @param {Object} data - Form data
     */
    const onMentorSubmit = async (data) => {
        try {
            const result = validateMentorSearch(data)
            if (result.success) {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                setSuccessMessage('✅ Búsqueda de mentor realizada exitosamente')
                mentorForm.reset()
                setTimeout(() => setSuccessMessage(''), 3000)
            }
        } catch (error) {
            console.error('Mentor search error:', error)
        }
    }

    /**
     * Handle community post form submission
     * @param {Object} data - Form data
     */
    const onCommunitySubmit = async (data) => {
        try {
            const result = validateCommunityPost(data)
            if (result.success) {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                setSuccessMessage('✅ Publicación creada exitosamente')
                communityForm.reset()
                setTimeout(() => setSuccessMessage(''), 3000)
            }
        } catch (error) {
            console.error('Community post error:', error)
        }
    }

    return (
        <div className="network-page">
            {/* Navigation Tabs */}
            <div className="network-navigation">
                <button
                    className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Vista General
                </button>
                <button
                    className={`nav-tab ${activeTab === 'connections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('connections')}
                >
                    🤝 Conexiones
                </button>
                <button
                    className={`nav-tab ${activeTab === 'mentors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mentors')}
                >
                    👨‍🏫 Mentores
                </button>
                <button
                    className={`nav-tab ${activeTab === 'community' ? 'active' : ''}`}
                    onClick={() => setActiveTab('community')}
                >
                    🌐 Comunidad
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="success-banner">
                    {successMessage}
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="network-content">
                    <div className="sidebar">
                        <NetworkStats />
                        <ConnectionRequests />
                    </div>
                    <div className="main-content">
                        <MentorList />
                        <CommunityBrowser />
                    </div>
                </div>
            )}

            {activeTab === 'connections' && (
                <div className="network-content">
                    <div className="form-container">
                        <h3>📨 Nueva Solicitud de Conexión</h3>
                        <form onSubmit={connectionForm.handleSubmit(onConnectionSubmit)} className="validation-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="recipientEmail">Email del Destinatario</label>
                                    <input
                                        id="recipientEmail"
                                        type="email"
                                        {...connectionForm.register('recipientEmail')}
                                        placeholder="usuario@ejemplo.com"
                                    />
                                    {connectionForm.formState.errors.recipientEmail && (
                                        <span className="error">
                                            {connectionForm.formState.errors.recipientEmail.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="connectionType">Tipo de Conexión</label>
                                    <select id="connectionType" {...connectionForm.register('connectionType')}>
                                        <option value="professional">Profesional</option>
                                        <option value="mentorship">Mentoría</option>
                                        <option value="collaboration">Colaboración</option>
                                        <option value="friendship">Amistad</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Mensaje Personalizado</label>
                                <textarea
                                    id="message"
                                    {...connectionForm.register('message')}
                                    placeholder="Cuéntale por qué quieres conectar..."
                                    rows="4"
                                />
                                {connectionForm.formState.errors.message && (
                                    <span className="error">
                                        {connectionForm.formState.errors.message.message}
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={connectionForm.formState.isSubmitting}
                            >
                                {connectionForm.formState.isSubmitting ? '⏳ Enviando...' : '📨 Enviar Solicitud'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'mentors' && (
                <div className="network-content">
                    <div className="form-container">
                        <h3>🔍 Buscar Mentores</h3>
                        <form onSubmit={mentorForm.handleSubmit(onMentorSubmit)} className="validation-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="skills">Habilidades</label>
                                    <input
                                        id="skills"
                                        {...mentorForm.register('skills')}
                                        placeholder="React, Node.js, Python..."
                                    />
                                    {mentorForm.formState.errors.skills && (
                                        <span className="error">
                                            {mentorForm.formState.errors.skills.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="experience">Experiencia</label>
                                    <select id="experience" {...mentorForm.register('experience')}>
                                        <option value="">Seleccionar...</option>
                                        <option value="junior">Junior (1-3 años)</option>
                                        <option value="mid">Mid-level (3-5 años)</option>
                                        <option value="senior">Senior (5+ años)</option>
                                        <option value="expert">Experto (10+ años)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="location">Ubicación</label>
                                    <input
                                        id="location"
                                        {...mentorForm.register('location')}
                                        placeholder="Ciudad, País"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="availability">Disponibilidad</label>
                                    <select id="availability" {...mentorForm.register('availability')}>
                                        <option value="any">Cualquier momento</option>
                                        <option value="weekdays">Días de semana</option>
                                        <option value="weekends">Fines de semana</option>
                                        <option value="evenings">Noches</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={mentorForm.formState.isSubmitting}
                            >
                                {mentorForm.formState.isSubmitting ? '🔍 Buscando...' : '🔍 Buscar Mentores'}
                            </button>
                        </form>
                    </div>
                    <div className="results-section">
                        <MentorList />
                    </div>
                </div>
            )}

            {activeTab === 'community' && (
                <div className="network-content">
                    <div className="form-container">
                        <h3>📝 Crear Publicación</h3>
                        <form onSubmit={communityForm.handleSubmit(onCommunitySubmit)} className="validation-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="title">Título</label>
                                    <input
                                        id="title"
                                        {...communityForm.register('title')}
                                        placeholder="Título de tu publicación"
                                    />
                                    {communityForm.formState.errors.title && (
                                        <span className="error">
                                            {communityForm.formState.errors.title.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category">Categoría</label>
                                    <select id="category" {...communityForm.register('category')}>
                                        <option value="general">General</option>
                                        <option value="question">Pregunta</option>
                                        <option value="tutorial">Tutorial</option>
                                        <option value="project">Proyecto</option>
                                        <option value="career">Carrera</option>
                                        <option value="discussion">Discusión</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Contenido</label>
                                <textarea
                                    id="content"
                                    {...communityForm.register('content')}
                                    placeholder="Comparte tu conocimiento, pregunta o experiencia..."
                                    rows="6"
                                />
                                {communityForm.formState.errors.content && (
                                    <span className="error">
                                        {communityForm.formState.errors.content.message}
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="tags">Etiquetas (separadas por comas)</label>
                                <input
                                    id="tags"
                                    {...communityForm.register('tags')}
                                    placeholder="react, javascript, tutorial, carrera"
                                />
                                {communityForm.formState.errors.tags && (
                                    <span className="error">
                                        {communityForm.formState.errors.tags.message}
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={communityForm.formState.isSubmitting}
                            >
                                {communityForm.formState.isSubmitting ? '📤 Publicando...' : '📤 Publicar'}
                            </button>
                        </form>
                    </div>
                    <div className="results-section">
                        <CommunityBrowser />
                    </div>
                </div>
            )}
        </div>
    )
}

export default NetworkPage
