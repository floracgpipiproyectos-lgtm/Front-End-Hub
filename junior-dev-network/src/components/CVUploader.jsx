/**
 * @fileoverview Componente CVUploader para subir y analizar archivos CV
 * Proporciona validación de archivos, barra de progreso y análisis automático
 */

import React, { useState, useCallback } from 'react'
import { useCV } from '@/store/hooks/useCV'
import { VALIDATION_RULES } from '@/constants/validationRules'

/**
 * Valida el tipo de archivo
 * @param {File} file - Archivo a validar
 * @param {string[]} allowedTypes - Tipos MIME permitidos
 * @returns {boolean} True si el tipo es permitido
 */
const validateFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type)
}

/**
 * Valida el tamaño del archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean} True si el tamaño es válido
 */
const validateFileSize = (file, maxSize) => {
    return file.size <= maxSize
}

/**
 * Convierte bytes a formato legible
 * @param {number} bytes - Bytes a convertir
 * @returns {string} Tamaño en formato legible (KB, MB, GB)
 */
const getFileSizeReadable = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Componente para subir y analizar archivos CV
 * @component
 * @returns {React.ReactElement} Interfaz de carga de CV con validación y análisis
 * 
 * @example
 * <CVUploader />
 */
const CVUploader = () => {
    const {
        uploadCVFile,
        setProgress,
        isUploading,
        upload,
        analyzeCVFile,
        isAnalyzing,
        hasError,
        error,
        clearErrors
    } = useCV()

    const [selectedFile, setSelectedFile] = useState(null)
    const [validationError, setValidationError] = useState('')

    /**
     * Maneja la selección de archivo y valida tipo y tamaño
     * @param {React.ChangeEvent<HTMLInputElement>} event - Evento del input de archivo
     */
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0]

        if (!file) return

        // Validar tipo de archivo
        if (!validateFileType(file, VALIDATION_RULES.FILE.CV.ALLOWED_TYPES)) {
            setValidationError(VALIDATION_RULES.FILE.CV.MESSAGE.TYPE)
            return
        }

        // Validar tamaño de archivo
        if (!validateFileSize(file, VALIDATION_RULES.FILE.CV.MAX_SIZE)) {
            const maxSize = getFileSizeReadable(VALIDATION_RULES.FILE.CV.MAX_SIZE)
            setValidationError(`Archivo demasiado grande. Máximo: ${maxSize}`)
            return
        }

        setSelectedFile(file)
        setValidationError('')
        clearErrors()
    }

    /**
     * Maneja la subida y análisis automático del CV
     * @async
     */
    const handleUpload = useCallback(async () => {
        if (!selectedFile) return

        try {
            // Subir CV con progreso
            const uploadResult = await uploadCVFile(selectedFile, (progress) => {
                setProgress(progress)
            })

            // Iniciar análisis automáticamente si la carga fue exitosa
            if (uploadResult.cvId) {
                await analyzeCVFile(uploadResult.cvId)
            }

            // Resetear formulario
            setSelectedFile(null)
            setValidationError('')

        } catch (error) {
            console.error('Error en el proceso de CV:', error)
        }
    }, [selectedFile, uploadCVFile, analyzeCVFile, setProgress])

    /**
     * Cancela la operación y limpia el estado
     */
    const handleCancel = () => {
        setSelectedFile(null)
        setValidationError('')
        clearErrors()
    }

    return (
        <div className="cv-uploader">
            {/* Sección de selección de archivo */}
            <div className="file-input">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    disabled={isUploading || isAnalyzing}
                    aria-label="Seleccionar archivo CV"
                />
                {selectedFile && (
                    <div className="file-info">
                        <span className="file-name">{selectedFile.name}</span>
                        <span className="file-size">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                )}
            </div>

            {/* Errores de validación */}
            {validationError && (
                <div className="validation-error" role="alert">
                    {validationError}
                </div>
            )}

            {/* Errores de carga */}
            {hasError && (
                <div className="upload-error" role="alert">
                    <strong>Error:</strong> {error}
                    <button onClick={clearErrors}>Cerrar</button>
                </div>
            )}

            {/* Barra de progreso de carga */}
            {isUploading && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${upload.progress}%` }}
                            role="progressbar"
                            aria-valuenow={upload.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                    </div>
                    <span className="progress-text">{upload.progress}%</span>
                </div>
            )}

            {/* Indicador de análisis */}
            {isAnalyzing && (
                <div className="analyzing">
                    <div className="spinner" />
                    <span>Analizando CV...</span>
                </div>
            )}

            {/* Botones de acción */}
            <div className="actions">
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading || isAnalyzing}
                    className="btn-primary"
                >
                    {isUploading ? 'Subiendo...' : 'Subir y Analizar CV'}
                </button>

                {(selectedFile || isUploading) && (
                    <button
                        onClick={handleCancel}
                        disabled={isAnalyzing}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    )
}

export default CVUploader