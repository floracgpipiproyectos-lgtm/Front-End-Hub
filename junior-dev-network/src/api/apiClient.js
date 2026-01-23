// Ejemplo de uso (apiClientExample.js)
import { ApiClient, ApiClientFactory } from './apiClient'

// Función para mostrar notificaciones (podría integrarse con react-hot-toast)
const showNotification = (message, type) => {
  console.log(`[${type.toUpperCase()}] ${message}`)
  
  // En una app React, podrías usar:
  // if (type === 'error') toast.error(message)
  // else if (type === 'success') toast.success(message)
  // else if (type === 'info') toast.info(message)
  // else toast(message)
}

async function main() {
  console.log('=== Ejemplo de uso de ApiClient ===\n')

  // Crear instancia del cliente
  const apiClient = new ApiClient({
    baseURL: 'http://api.junior-dev.com',
    timeout: 30000,
    maxRetryAttempts: 3
  })

  // Configurar callbacks
  apiClient.setNotificationCallback(showNotification)

  apiClient.setTokenExpiredCallback(() => {
    console.log('🔐 Token expirado. Redirigiendo al login...')
    // window.location.href = '/login'
  })

  apiClient.setTokenRefreshedCallback((newToken) => {
    console.log('🔄 Token refrescado exitosamente')
  })

  // Establecer tokens (en una app real, estos vendrían del login)
  apiClient.setAuthToken('tu_jwt_token_aqui')
  apiClient.setRefreshToken('tu_refresh_token_aqui')

  // Agregar interceptor personalizado para logging
  apiClient.addRequestInterceptor((config) => {
    console.log(`>>> ${config.method.toUpperCase()} ${config.url}`)
    return config
  })

  apiClient.addResponseInterceptor((response) => {
    console.log(`<<< ${response.status} ${response.statusText}`)
    return response
  })

  // Ejemplo 1: Verificar conectividad
  console.log('1. Verificando conectividad...')
  const isConnected = await apiClient.checkConnectivity()
  console.log(isConnected ? '✅ Conectado' : '❌ No conectado')

  if (!isConnected) {
    console.log('No se puede conectar al servidor. Saliendo...')
    return
  }

  // Ejemplo 2: Obtener proyectos (GET)
  console.log('\n2. Obteniendo proyectos...')
  try {
    const projects = await apiClient.getData('/projects', {
      params: {
        limit: 5,
        skills: 'react,typescript'
      }
    })

    console.log(`📊 Total proyectos: ${projects.total || projects.length}`)
    
    if (Array.isArray(projects)) {
      projects.slice(0, 3).forEach(project => {
        console.log(`• ${project.title}`)
      })
    } else if (projects.projects) {
      projects.projects.slice(0, 3).forEach(project => {
        console.log(`• ${project.title}`)
      })
    }
  } catch (error) {
    console.error('Error obteniendo proyectos:', error.message)
  }

  // Ejemplo 3: Crear proyecto (POST)
  console.log('\n3. Creando nuevo proyecto...')
  try {
    const newProject = {
      title: 'Proyecto de ejemplo',
      description: 'Este es un proyecto creado desde el ApiClient',
      level: 'intermediate',
      type: 'open-source'
    }

    const createdProject = await apiClient.postData('/projects', newProject)
    console.log(`✅ Proyecto creado con ID: ${createdProject.id}`)
  } catch (error) {
    console.error('Error creando proyecto:', error.message)
  }

  // Ejemplo 4: Actualizar proyecto (PUT)
  console.log('\n4. Actualizando proyecto...')
  try {
    const updates = {
      description: 'Descripción actualizada desde ApiClient'
    }

    const updatedProject = await apiClient.putData('/projects/123', updates)
    console.log('✅ Proyecto actualizado')
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('⚠️ Proyecto no encontrado (esto es esperado para el ejemplo)')
    } else {
      console.error('Error actualizando proyecto:', error.message)
    }
  }

  // Ejemplo 5: Subir archivo
  console.log('\n5. Subiendo archivo...')
  try {
    // Crear archivo de prueba en navegador (en Node.js sería diferente)
    if (typeof File !== 'undefined') {
      const blob = new Blob(['Contenido de prueba'], { type: 'text/plain' })
      const file = new File([blob], 'test.txt', { type: 'text/plain' })
      
      const uploadResult = await apiClient.uploadFile(
        '/projects/123/files',
        file,
        'document',
        { description: 'Archivo de prueba' }
      )
      
      console.log(`✅ Archivo subido: ${uploadResult.data.url}`)
    } else {
      console.log('⚠️ File API no disponible en este entorno')
    }
  } catch (error) {
    console.error('Error subiendo archivo:', error.message)
  }

  // Ejemplo 6: Manejo de errores
  console.log('\n6. Probando manejo de errores...')
  try {
    // Intentar acceder a endpoint que no existe
    await apiClient.getData('/endpoint-que-no-existe')
  } catch (error) {
    console.log(`Manejado error ${error.response?.status || 'network'}: ${error.message}`)
  }

  // Ejemplo 7: Información del cliente
  console.log('\n7. Información del cliente:')
  const clientInfo = apiClient.getClientInfo()
  Object.entries(clientInfo).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`)
  })

  // Ejemplo 8: Usando factory
  console.log('\n8. Usando ApiClientFactory...')
  const testClient = ApiClientFactory.createForTesting()
  console.log(`Cliente de testing creado: ${testClient.config.baseURL}`)
}

// Ejecutar ejemplo
main().catch(console.error)