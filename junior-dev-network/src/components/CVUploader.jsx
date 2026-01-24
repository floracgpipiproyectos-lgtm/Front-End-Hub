// components/CVUploader.jsx
import React, { useState, useCallback } from 'react'
import { useCV } from '@/store/hooks/useCV'
import { VALIDATION_RULES } from '@/constants/validationRules'

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

    const handleFileSelect = (event) => {
        const file = event.target.files[0]

        if (!file) return

        // Validar archivo
        if (!VALIDATION_HELPERS.validateFileType(file, VALIDATION_RULES.FILE.CV.ALLOWED_TYPES)) {
            setValidationError(VALIDATION_RULES.FILE.CV.MESSAGE.TYPE)
            return
        }

        if (!VALIDATION_HELPERS.validateFileSize(file, VALIDATION_RULES.FILE.CV.MAX_SIZE)) {
            const maxSize = VALIDATION_HELPERS.getFileSizeReadable(VALIDATION_RULES.FILE.CV.MAX_SIZE)
            setValidationError(`Archivo demasiado grande. Máximo: ${maxSize}`)
            return
        }

        setSelectedFile(file)
        setValidationError('')
        clearErrors()
    }

    const handleUpload = useCallback(async () => {
        if (!selectedFile) return

        try {
            // Subir CV
            const uploadResult = await uploadCVFile(selectedFile, (progress) => {
                setProgress(progress)
            })

            // Iniciar análisis automáticamente
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

    const handleCancel = () => {
        setSelectedFile(null)
        setValidationError('')
        clearErrors()
    }

    return (
        <div className="cv-uploader">
            <div className="file-input">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    disabled={isUploading || isAnalyzing}
                />
                {selectedFile && (
                    <div className="file-info">
                        <span>{selectedFile.name}</span>
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                )}
            </div>

            {validationError && (
                <div className="validation-error">{validationError}</div>
            )}

            {hasError && (
                <div className="upload-error">
                    <strong>Error:</strong> {error}
                    <button onClick={clearErrors}>Cerrar</button>
                </div>
            )}

            {isUploading && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${upload.progress}%` }}
                        />
                    </div>
                    <span>{upload.progress}%</span>
                </div>
            )}

            {isAnalyzing && (
                <div className="analyzing">
                    <div className="spinner" />
                    <span>Analizando CV...</span>
                </div>
            )}

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