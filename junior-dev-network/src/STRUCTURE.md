# Estructura de Carpetas - JuniorDev Network

Esta documentación describe la organización de carpetas del proyecto JuniorDev Network.

## 📁 Estructura General

```
src/
├── features/              # Módulos de funcionalidades (feature-based)
│   ├── auth/             # Autenticación y autorización
│   │   ├── components/   # Componentes específicos de auth
│   │   ├── hooks/        # Custom hooks de auth
│   │   └── services/     # Servicios de autenticación
│   ├── cv-analysis/      # Análisis de CVs
│   │   ├── components/   # Componentes de análisis de CV
│   │   ├── hooks/        # Hooks para análisis
│   │   └── services/     # Servicios de procesamiento de CV
│   ├── projects/         # Gestión de proyectos
│   │   ├── components/   # Componentes de proyectos
│   │   ├── hooks/        # Hooks de proyectos
│   │   └── services/     # Servicios de proyectos
│   ├── network/          # Red de contactos y networking
│   │   ├── components/   # Componentes de networking
│   │   ├── hooks/        # Hooks de networking
│   │   └── services/     # Servicios de networking
│   ├── gamification/     # Sistema de badges y logros
│   │   ├── components/   # Componentes de gamificación
│   │   ├── hooks/        # Hooks de gamificación
│   │   └── services/     # Servicios de gamificación
│   ├── portfolio/        # Builder de portafolio
│   │   ├── components/   # Componentes de portafolio
│   │   ├── hooks/        # Hooks de portafolio
│   │   └── services/     # Servicios de portafolio
│   └── profile/          # Perfil de usuario
│       ├── components/   # Componentes de perfil
│       ├── hooks/        # Hooks de perfil
│       └── services/     # Servicios de perfil
│
├── components/           # Componentes reutilizables compartidos
│   ├── ui/              # Componentes UI básicos (Button, Card, Modal, etc.)
│   ├── layout/          # Componentes de layout (Header, Footer, Sidebar, etc.)
│   └── forms/           # Componentes de formularios reutilizables
│
├── pages/               # Páginas/Views principales (rutas)
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ...
│
├── hooks/               # Custom hooks compartidos
│   ├── useAuth.js
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── ...
│
├── api/                 # Configuración y servicios de API
│   └── services/        # Servicios de API (axios instances, endpoints)
│       ├── authService.js
│       ├── cvService.js
│       ├── projectService.js
│       └── ...
│
├── store/               # Redux store y state management
│   ├── slices/          # Redux slices (authSlice, projectSlice, etc.)
│   ├── selectors/      # Selectores de Redux
│   ├── middleware/     # Middleware personalizado
│   └── store.js        # Configuración del store
│
├── utils/               # Utilidades y helpers
│   ├── formatDate.js
│   ├── validateEmail.js
│   ├── formatSkills.js
│   └── ...
│
├── constants/           # Constantes de la aplicación
│   ├── routes.js        # Rutas de la aplicación
│   ├── apiEndpoints.js  # Endpoints de API
│   ├── skills.js        # Lista de skills disponibles
│   └── ...
│
├── validations/         # Esquemas de validación (Zod)
│   ├── authSchemas.js
│   ├── cvSchemas.js
│   ├── projectSchemas.js
│   └── ...
│
├── types/               # Tipos y definiciones (si se migra a TypeScript)
│   └── ...
│
├── config/              # Configuración de la aplicación
│   ├── axios.js         # Configuración de axios
│   ├── reactQuery.js    # Configuración de React Query
│   └── ...
│
└── assets/              # Recursos estáticos
    ├── images/          # Imágenes
    └── icons/           # Iconos
```

## 🎯 Principios de Organización

### 1. Feature-Based Structure
Cada feature tiene su propia carpeta con:
- **components/**: Componentes específicos de esa feature
- **hooks/**: Custom hooks relacionados
- **services/**: Lógica de negocio y llamadas API específicas

### 2. Componentes Compartidos
- **components/ui/**: Componentes UI básicos reutilizables (Button, Input, Card, etc.)
- **components/layout/**: Componentes de estructura (Header, Footer, Navigation)
- **components/forms/**: Componentes de formularios reutilizables

### 3. State Management
- **store/slices/**: Redux slices organizados por dominio
- **store/selectors/**: Selectores memoizados para acceder al estado
- **store/middleware/**: Middleware personalizado (logger, persist, etc.)

### 4. API Services
- **api/services/**: Servicios organizados por dominio (auth, projects, etc.)
- Cada servicio maneja las llamadas HTTP relacionadas con su dominio

### 5. Utilidades y Constantes
- **utils/**: Funciones helper reutilizables
- **constants/**: Valores constantes de la aplicación
- **validations/**: Esquemas de validación con Zod

## 📝 Convenciones de Nomenclatura

### Archivos
- **Componentes**: PascalCase (ej: `UserProfile.jsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAuth.js`)
- **Utilidades**: camelCase (ej: `formatDate.js`)
- **Constantes**: camelCase (ej: `apiEndpoints.js`)

### Carpetas
- **Features**: kebab-case (ej: `cv-analysis`)
- **Componentes**: kebab-case (ej: `user-profile`)

## 🔄 Flujo de Datos

```
Pages → Features/Components → Hooks → Services → API
                              ↓
                         Redux Store
                              ↓
                         Selectors
```

## 📦 Ejemplo de Uso

### Importar un componente de feature
```javascript
import { CVUploader } from '@/features/cv-analysis/components/CVUploader'
```

### Importar un hook compartido
```javascript
import { useAuth } from '@/hooks/useAuth'
```

### Importar un servicio
```javascript
import { authService } from '@/api/services/authService'
```

### Importar una utilidad
```javascript
import { formatDate } from '@/utils/formatDate'
```

## 🚀 Próximos Pasos

1. Crear archivos `index.js` en cada carpeta para facilitar imports
2. Configurar path aliases en `vite.config.js` para usar `@/` como alias de `src/`
3. Implementar los componentes base en `components/ui/`
4. Configurar Redux store en `store/store.js`
5. Configurar React Query en `config/reactQuery.js`
