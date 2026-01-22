# API Services - JuniorDev Network

Esta carpeta contiene todos los servicios de API para comunicarse con el backend.

## 📁 Estructura

```
api/
├── apiClient.js          # Cliente axios configurado con interceptores
├── services/
│   ├── authService.js       # Autenticación y autorización
│   ├── cvService.js         # Análisis de CVs
│   ├── projectService.js    # Gestión de proyectos
│   ├── networkService.js    # Networking y conexiones
│   ├── gamificationService.js # Badges y logros
│   ├── portfolioService.js  # Portafolio
│   └── profileService.js    # Perfil de usuario
└── index.js              # Exportaciones principales
```

## 🚀 Uso

### Importar servicios

```javascript
// Importar servicios individuales
import { authService, projectService } from '@/api/services'

// O importar desde el index principal
import { authService } from '@/api'
```

### Ejemplo: Autenticación

```javascript
import { authService } from '@/api/services'

// Login
const handleLogin = async (email, password) => {
  try {
    const { token, user } = await authService.login({ email, password })
    // Token se guarda automáticamente en localStorage
    console.log('Usuario autenticado:', user)
  } catch (error) {
    console.error('Error en login:', error)
  }
}

// Registro
const handleRegister = async (userData) => {
  try {
    const result = await authService.register(userData)
    console.log('Usuario registrado:', result)
  } catch (error) {
    console.error('Error en registro:', error)
  }
}
```

### Ejemplo: Análisis de CV

```javascript
import { cvService } from '@/api/services'

// Subir CV
const handleCVUpload = async (file) => {
  try {
    const onProgress = (percent) => {
      console.log(`Progreso: ${percent}%`)
    }
    
    const { cvId } = await cvService.uploadCV(file, onProgress)
    
    // Analizar CV
    const analysis = await cvService.analyzeCV(cvId)
    console.log('Análisis completado:', analysis)
    
    // Obtener skills extraídas
    const skills = await cvService.getSkills()
    console.log('Skills detectadas:', skills)
  } catch (error) {
    console.error('Error en análisis de CV:', error)
  }
}
```

### Ejemplo: Proyectos

```javascript
import { projectService } from '@/api/services'

// Obtener proyectos recomendados
const getRecommendedProjects = async () => {
  try {
    const projects = await projectService.getRecommendedProjects()
    return projects
  } catch (error) {
    console.error('Error al obtener proyectos:', error)
  }
}

// Unirse a un proyecto
const joinProject = async (projectId) => {
  try {
    await projectService.joinProject(projectId)
    console.log('Te has unido al proyecto')
  } catch (error) {
    console.error('Error al unirse al proyecto:', error)
  }
}
```

### Ejemplo: Networking

```javascript
import { networkService } from '@/api/services'

// Obtener mentores
const getMentors = async () => {
  try {
    const mentors = await networkService.getMentors({
      skills: ['React', 'JavaScript'],
      location: 'Buenos Aires'
    })
    return mentors
  } catch (error) {
    console.error('Error al obtener mentores:', error)
  }
}

// Solicitar mentoría
const requestMentor = async (mentorId) => {
  try {
    await networkService.requestMentor(mentorId, {
      message: 'Me gustaría aprender más sobre React',
      goals: ['Mejorar en hooks', 'Aprender testing']
    })
  } catch (error) {
    console.error('Error al solicitar mentoría:', error)
  }
}
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Interceptores

El `apiClient` incluye interceptores automáticos para:

- **Request**: Agrega automáticamente el token de autenticación desde `localStorage`
- **Response**: Maneja errores globalmente y muestra notificaciones con `react-hot-toast`
- **401 Unauthorized**: Intenta refrescar el token automáticamente

## 📝 Servicios Disponibles

### authService
- `register(userData)` - Registro de usuario
- `login(credentials)` - Inicio de sesión
- `logout()` - Cerrar sesión
- `refreshToken(refreshToken)` - Refrescar token
- `forgotPassword(email)` - Recuperar contraseña
- `resetPassword(resetData)` - Restablecer contraseña
- `verifyEmail(token)` - Verificar email
- `loginWithLinkedIn(code)` - OAuth LinkedIn
- `loginWithGitHub(code)` - OAuth GitHub
- `getCurrentUser()` - Obtener usuario actual

### cvService
- `uploadCV(file, onUploadProgress)` - Subir CV
- `analyzeCV(cvId)` - Analizar CV
- `getAnalysis(analysisId)` - Obtener análisis
- `getSkills()` - Obtener skills extraídas
- `updateSkills(skills)` - Actualizar skills
- `getSuggestions(options)` - Obtener sugerencias

### projectService
- `getAllProjects(filters)` - Obtener todos los proyectos
- `getProjectById(projectId)` - Obtener proyecto por ID
- `getRecommendedProjects(options)` - Proyectos recomendados
- `getOpenSourceProjects(filters)` - Proyectos open-source
- `getFreelanceProjects(filters)` - Proyectos freelance
- `getChallenges(filters)` - Challenges educativos
- `joinProject(projectId)` - Unirse a proyecto
- `leaveProject(projectId)` - Abandonar proyecto
- `completeProject(projectId, completionData)` - Completar proyecto
- `getUserProjects(filters)` - Proyectos del usuario
- `searchProjects(query, filters)` - Buscar proyectos

### networkService
- `getMentors(filters)` - Obtener mentores
- `getMentorById(mentorId)` - Obtener mentor por ID
- `requestMentor(mentorId, requestData)` - Solicitar mentoría
- `getCommunities(filters)` - Obtener comunidades
- `joinCommunity(communityId)` - Unirse a comunidad
- `getConnections(filters)` - Obtener conexiones
- `sendConnectionRequest(connectionData)` - Enviar solicitud de conexión
- `acceptConnection(connectionId)` - Aceptar conexión
- `rejectConnection(connectionId)` - Rechazar conexión
- `getMessages(filters)` - Obtener mensajes
- `sendMessage(messageData)` - Enviar mensaje

### gamificationService
- `getBadges()` - Obtener todos los badges
- `getUserBadges()` - Obtener badges del usuario
- `getProgress()` - Obtener progreso del usuario
- `getLeaderboard(options)` - Obtener leaderboard
- `claimBadge(badgeId)` - Reclamar badge

### portfolioService
- `getPortfolio()` - Obtener portafolio
- `generatePortfolio(options)` - Generar portafolio
- `updatePortfolio(portfolioData)` - Actualizar portafolio
- `deployPortfolio(deployOptions)` - Desplegar portafolio
- `getTemplates()` - Obtener plantillas
- `previewPortfolio(portfolioData)` - Preview del portafolio

### profileService
- `getProfile()` - Obtener perfil actual
- `updateProfile(profileData)` - Actualizar perfil
- `getPublicProfile(userId)` - Obtener perfil público
- `uploadAvatar(file, onUploadProgress)` - Subir avatar
- `updatePreferences(preferences)` - Actualizar preferencias
- `deleteAccount(confirmationData)` - Eliminar cuenta

## 🔒 Manejo de Errores

Todos los servicios manejan errores automáticamente a través de los interceptores. Los errores se muestran al usuario mediante `react-hot-toast`.

Para manejar errores específicos:

```javascript
try {
  await authService.login(credentials)
} catch (error) {
  if (error.response?.status === 401) {
    // Credenciales inválidas
  } else if (error.response?.status === 500) {
    // Error del servidor
  }
}
```

## 🔄 Integración con React Query

Los servicios están diseñados para usarse con React Query:

```javascript
import { useQuery, useMutation } from '@tanstack/react-query'
import { projectService } from '@/api/services'

// Query
const { data: projects } = useQuery({
  queryKey: ['projects', 'recommended'],
  queryFn: () => projectService.getRecommendedProjects()
})

// Mutation
const { mutate: joinProject } = useMutation({
  mutationFn: (projectId) => projectService.joinProject(projectId),
  onSuccess: () => {
    toast.success('Te has unido al proyecto')
  }
})
```
