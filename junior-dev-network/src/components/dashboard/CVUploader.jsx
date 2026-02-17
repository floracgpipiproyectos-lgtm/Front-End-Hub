/**
 * Componente CVUploader para el dashboard
 */
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '../../context/AuthContext'
import Card from '../common/Card'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import { FiUploadCloud, FiCheck } from 'react-icons/fi'

export default function CVUploader() {
  const { user, updateUser } = useAuth()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5242880 // 5MB
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // Simular análisis de CV - en producción llamarías a tu backend
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock de skills detectados
      const detectedSkills = ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js']

      // Actualizar usuario
      updateUser({
        ...user,
        skills: detectedSkills,
        cv_url: 'mock-cv-' + Date.now()
      })

      toast.success('¡CV analizado exitosamente! Hemos detectado tus skills.')
    } catch {
      toast.error('Error al subir el CV. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  if (user?.cv_url) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiCheck className="text-green-600 text-2xl" />
            <div>
              <h3 className="font-bold text-green-900">CV Cargado ✓</h3>
              <p className="text-sm text-green-700">Tu CV ha sido analizado exitosamente</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Cambiar CV</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiUploadCloud /> Sube tu CV
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📄</div>
        {isDragActive ? (
          <>
            <p className="font-semibold text-blue-600">Suelta tu CV aquí...</p>
            <p className="text-sm text-gray-600">Se analizará automáticamente</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-900">Arrastra tu CV aquí</p>
            <p className="text-sm text-gray-600">o haz clic para seleccionar un archivo</p>
            <p className="text-xs text-gray-500 mt-2">Soporta: PDF, DOC, DOCX, TXT (Máx 5MB)</p>
          </>
        )}
      </div>

      {file && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900">Archivo seleccionado:</p>
            <p className="text-gray-600">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Analizando...' : 'Analizar CV'}
          </Button>
        </div>
      )}

      {uploading && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            Analizando tu CV con IA... Esto puede tomar unos segundos.
          </p>
        </div>
      )}
    </Card>
  )
}
