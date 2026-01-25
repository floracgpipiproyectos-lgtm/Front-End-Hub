# Lista Unificada de Tareas para JuniorDev Network

Basado en la descripción del proyecto en `2025-10-07.md`, aquí está la lista completa y unificada de tareas específicas para hacer que tanto el frontend como el backend sean funcionales y desplegables en Vercel. Incluye tareas para construir el backend desde cero, con comandos de instalación y pasos detallados, considerando la Guía de Despliegue en Vercel.

## 🔧 **Backend (junior-dev-backend) - Construcción desde Cero**

### **0. Configuración Inicial del Proyecto Backend**
- [X] Crear carpeta `junior-dev-backend` en el directorio raíz
- [X Inicializar proyecto Node.js: `npm init -y`
- [X] Instalar dependencias básicas:
  ```
  npm install express mongoose bcryptjs jsonwebtoken cors dotenv helmet morgan express-rate-limit multer
  ```
- [X] Instalar dependencias de desarrollo:
  ```
  npm install --save-dev nodemon @types/node typescript ts-node
  ```
- [ ] Crear estructura de carpetas:
  ```
  junior-dev-backend/
  ├── src/
  │   ├── controllers/
  │   ├── models/
  │   ├── routes/
  │   ├── middleware/
  │   ├── utils/
  │   └── config/
  ├── api/  # Para Vercel Functions
  ├── tests/
  ├── package.json
  ├── vercel.json
  └── .env.example
  ```
- [ ] Configurar scripts en `package.json`:
  ```json
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build step required'",
    "test": "jest"
  }
  ```
- [ ] Crear archivo `.env.example` con variables necesarias:
  ```
  MONGODB_URI=mongodb://localhost:27017/juniordev
  JWT_SECRET=your_jwt_secret_here
  PORT=5000
  NODE_ENV=development
  ```

### **1. Configuración de Base de Datos y Servidor**
- [ ] Configurar conexión a MongoDB en `src/config/database.js`
- [ ] Crear servidor Express básico en `src/server.js`
- [ ] Configurar middleware básico (CORS, JSON parsing, logging)
- [ ] Configurar variables de entorno con `dotenv`
- [ ] Probar conexión local: `npm run dev`

### **2. Modelos de Datos**
- [ ] Crear `models/User.js` con todos los campos requeridos:
  - `alias`, `email`, `password`, `cv_url`, `skills[]`, `proyectos_completados[]`, `contactos[]`, `badges[]`, `preferencias`
- [ ] Crear `models/Project.js` para proyectos
- [ ] Crear `models/Connection.js` para conexiones
- [ ] Crear `models/CV.js` para análisis de CVs
- [ ] Crear índices en MongoDB para búsquedas eficientes

### **3. Autenticación y Autorización**
- [ ] Crear `controllers/authController.js` con lógica de registro/login
- [ ] Crear `routes/auth.js` con endpoints:
  - POST `/api/auth/register` - Registro de usuarios
  - POST `/api/auth/login` - Login con JWT
  - POST `/api/auth/logout` - Logout
  - GET `/api/auth/me` - Obtener usuario actual
- [ ] Implementar middleware de autenticación JWT en `middleware/auth.js`
- [ ] Configurar bcrypt para hashing de passwords

### **4. Rutas de API Principales**
- [ ] Crear `routes/connections.js` con endpoints para:
  - GET `/api/connections` - Obtener conexiones del usuario
  - POST `/api/connections` - Enviar solicitud de conexión
  - PUT `/api/connections/:id/accept` - Aceptar conexión
  - DELETE `/api/connections/:id` - Rechazar conexión
- [ ] Crear `routes/projects.js` con endpoints para:
  - GET `/api/projects` - Obtener proyectos sugeridos
  - POST `/api/projects/:id/join` - Unirse a proyecto
  - PUT `/api/projects/:id/complete` - Marcar proyecto como completado
- [ ] Crear `routes/cv.js` con endpoints para:
  - POST `/api/cv/upload` - Subir y procesar CV
  - GET `/api/cv/analysis` - Obtener análisis de skills

### **5. Lógica de Negocio Avanzada**
- [ ] Implementar análisis de CV con OCR/NLP (usar Tesseract.js o servicio externo)
- [ ] Sistema de matching para proyectos basado en skills
- [ ] Sistema de matching para mentores/conexiones
- [ ] Gamificación: badges y progreso

### **6. Integraciones Externas**
- [ ] Integración con GitHub API para proyectos open-source
- [ ] Integración con LinkedIn OAuth
- [ ] Integración con Twitter API
- [ ] Procesamiento de CVs con IA (OpenAI o similar)

### **7. Seguridad y Validación**
- [ ] Implementar validaciones completas con middleware
- [ ] Configurar CORS correctamente para Vercel
- [ ] Manejo de errores robusto
- [ ] Rate limiting por endpoint
- [ ] Implementar Helmet para headers de seguridad

### **8. Conversión a Vercel Functions**
- [ ] Crear carpeta `api/` en la raíz del backend
- [ ] Convertir rutas Express a funciones serverless (ej: `api/auth.js`, `api/connections.js`)
- [ ] Configurar `vercel.json` para API routes:
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "api/**/*.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/api/$1"
      }
    ]
  }
  ```
- [ ] Probar funciones con `vercel dev`

## 🎨 **Frontend (junior-dev-network) - Mejoras y Completado**

### **1. Validaciones y Formularios**
- [x] Crear `authValidations.js` con Zod schemas para autenticación
- [x] Crear `formValidations.js` con general form validation schemas
- [x] Crear `networkValidations.js` para network-related validations
- [x] Update `validations/index.js` to export all validation modules
- [x] Modify `pages/network/index.js` to include form validations
- [x] Integrate React Hook Form with Zod schemas in network page
- [x] Add validation error display and handling

### **2. Documentación JSDoc**
- [x] Add JSDoc to apiClient.js (completed)
- [ ] Add JSDoc to remaining files in `src/` directory
- [ ] Verify and complete JSDoc in existing files
- [ ] Ensure all functions, components, parameters, and return types are documented

### **3. Conversión a SCSS**
- [x] Install SASS as dev dependency
- [x] Convert `App.css` to `App.scss` with variables, mixins, and nesting
- [x] Convert `index.css` to `index.scss` with improved structure
- [x] Update imports in `App.jsx` and `main.jsx`
- [x] Create beautiful and functional SCSS with comprehensive styling

### **4. Uso de Assets**
- [x] Import and display all available assets in components
- [x] Update `App.jsx` to showcase all assets
- [x] Ensure assets are used in testing sections

### **5. Conectar con Backend**
- [ ] Configurar `apiClient.js` con URLs correctas del backend desplegado
- [ ] Implementar manejo de autenticación JWT en todos los servicios
- [ ] Crear hooks personalizados para cada API endpoint

### **6. Completar Componentes Principales**
- [ ] `LoginForm.jsx` - Formulario funcional con validación
- [ ] `CVUploader.jsx` - Subida de archivos con drag & drop
- [ ] `CommunityBrowser.jsx` - Navegación de usuarios/comunidades
- [ ] `ConnectionRequests.jsx` - Gestión de solicitudes de conexión
- [ ] `GamificationDashboard.jsx` - Dashboard con badges y progreso
- [ ] `MentorCard.jsx` - Cards de mentores con matching
- [ ] `NetworkStats.jsx` - Estadísticas de red
- [ ] `ChatWindow.jsx` - Chat interno básico

### **7. Implementar Páginas Completas**
- [ ] Página de Onboarding (registro + subida CV)
- [ ] Dashboard principal con proyectos sugeridos
- [ ] Página de perfil de usuario
- [ ] Página de exploración de proyectos
- [ ] Página de conexiones y networking
- [ ] Página de portafolio generado automáticamente

### **8. Estado Global y Gestión**
- [ ] Completar slices de Redux:
  - `authSlice.js` - Autenticación completa
  - `cvSlice.js` - Gestión de CV y análisis
  - `networkSlice.js` - Conexiones y matching
  - `gamificationSlice.js` - Badges y progreso
  - `portfolioSlice.js` - Proyectos completados
- [ ] Implementar persistencia de estado
- [ ] Manejo de errores global

### **9. UI/UX y Responsive**
- [ ] Implementar diseño mobile-first completo
- [ ] Animaciones con Framer Motion
- [ ] Tema oscuro/claro funcional
- [ ] Notificaciones con react-hot-toast
- [ ] Loading states y skeletons

## 🚀 **Despliegue y Configuración**

### **1. Backend en Vercel**
- [ ] Crear proyecto separado en Vercel para el backend
- [ ] Configurar variables de entorno (MONGODB_URI, JWT_SECRET, etc.)
- [ ] Convertir rutas Express a Vercel Functions
- [ ] Configurar `vercel.json` para API routes
- [ ] Probar endpoints con Vercel dev

### **2. Frontend en Vercel**
- [ ] Configurar build settings para Vite
- [ ] Actualizar `apiClient.js` con URL del backend desplegado
- [ ] Configurar variables de entorno para producción
- [ ] Probar aplicación completa en preview deployments

### **3. Base de Datos**
- [ ] Configurar MongoDB Atlas o similar
- [ ] Crear índices para búsquedas eficientes
- [ ] Implementar migraciones si es necesario
- [ ] Backup y recuperación

### **4. Testing y QA**
- [ ] Tests unitarios para componentes críticos
- [ ] Tests de integración para APIs
- [ ] Testing end-to-end con Cypress o similar
- [ ] Testing de responsive design
- [ ] Validación de accesibilidad

## 📋 **Priorización por Fases**

### **Fase 1: MVP Básico (2-3 semanas)**
- Backend: Auth básico + Users CRUD
- Frontend: Login + Dashboard simple
- Despliegue: Frontend funcional

### **Fase 2: Funcionalidades Core (2-3 semanas)**
- Backend: CV upload + Projects + Connections
- Frontend: Onboarding completo + Exploración
- Despliegue: Full-stack básico

### **Fase 3: Features Avanzadas (1-2 semanas)**
- Gamificación completa
- Integraciones externas
- Optimizaciones y testing

### **Fase 4: Pulido y Lanzamiento (1 semana)**
- UI/UX final
- Testing completo
- Documentación
- Despliegue production

## 🔍 **Verificación de Funcionalidad**

Antes de desplegar, verificar que:
- [ ] Onboarding completo funciona (registro → CV upload → análisis → dashboard)
- [ ] Sistema de proyectos: sugerencias → unirse → completar → badge
- [ ] Networking: buscar usuarios → enviar solicitud → aceptar → chat
- [ ] Perfil actualizable con skills y progreso
- [ ] Responsive en móvil y desktop
- [ ] Sin errores de consola en producción

## 🛠️ **Herramientas y Dependencias Adicionales**

### **Backend**
- `multer` para file uploads
- `tesseract.js` o `google-cloud-vision` para OCR
- `passport` para OAuth (LinkedIn, GitHub)
- `socket.io` para chat en tiempo real

### **Frontend**
- `@hookform/resolvers/zod` para validaciones
- `react-query` para cache de datos
- `react-router-dom` para navegación
- `lucide-react` para iconos

¿Quieres que comience implementando alguna de estas tareas específicas? ¿Cuál te gustaría priorizar primero?
