# Guía para Desplegar Proyectos en Vercel

Esta guía te ayudará a desplegar tus proyectos en Vercel, una plataforma de despliegue gratuita y fácil de usar, especialmente diseñada para aplicaciones web modernas.

## ¿Qué es Vercel?

Vercel es una plataforma de despliegue que permite alojar aplicaciones web estáticas, dinámicas y serverless. Es ideal para proyectos de frontend (React, Vue, Next.js) y también soporta backends a través de funciones serverless.

## Prerrequisitos

1. **Cuenta en Vercel**: Regístrate en [vercel.com](https://vercel.com) usando tu cuenta de GitHub, GitLab o Bitbucket.
2. **Repositorio Git**: Tu proyecto debe estar en un repositorio Git (GitHub recomendado).
3. **Node.js**: Asegúrate de tener Node.js instalado localmente para desarrollo.

## Desplegando un Proyecto Frontend (Ejemplo: junior-dev-network)

Tu proyecto `junior-dev-network` es una aplicación React con Vite. Aquí están los pasos:

### 1. Preparar el Proyecto

Asegúrate de que tu `package.json` tenga los scripts necesarios:
- `build`: Para construir la aplicación
- `start` o `dev`: Para desarrollo local

En tu caso, ya tienes:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### 2. Configurar Vercel

1. Ve a [vercel.com](https://vercel.com) y haz login.
2. Haz clic en "New Project".
3. Importa tu repositorio de GitHub (asegúrate de que `junior-dev-network` esté pushado).
4. Vercel detectará automáticamente que es un proyecto Vite/React.

### 3. Configurar el Build

Vercel debería detectar automáticamente:
- **Framework Preset**: Vite
- **Root Directory**: `./junior-dev-network` (si está en una subcarpeta)
- **Build Command**: `npm run build` o `yarn build`
- **Output Directory**: `dist` (por defecto para Vite)

Si necesitas configuraciones personalizadas, crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Variables de Entorno

Si tu aplicación usa variables de entorno:
1. En Vercel Dashboard, ve a tu proyecto > Settings > Environment Variables
2. Agrega las variables necesarias (ej: API_URL para conectar con el backend)

### 5. Desplegar

1. Haz commit y push de tus cambios.
2. Vercel desplegará automáticamente (o haz clic en "Deploy" manualmente).
3. Tu sitio estará disponible en una URL como `https://junior-dev-network.vercel.app`

## Desplegando un Backend con Vercel Functions (Ejemplo: junior-dev-backend)

Para backends Node.js/Express, puedes usar Vercel Functions (serverless).

### 1. Estructura del Proyecto

Convierte tus rutas Express en funciones serverless. Crea una carpeta `api` en la raíz:

```
junior-dev-backend/
├── api/
│   ├── users.js
│   └── auth.js
├── package.json
└── vercel.json
```

### 2. Convertir Rutas a Funciones

Ejemplo: Convierte `routes/users.js` en `api/users.js`:

```javascript
// api/users.js
const express = require('express');
const mongoose = require('mongoose');
// ... tu lógica existente

module.exports = async (req, res) => {
  // Conecta a MongoDB si es necesario
  await mongoose.connect(process.env.MONGODB_URI);

  // Tu lógica de rutas aquí
  if (req.method === 'GET') {
    // Lógica para GET /api/users
  } else if (req.method === 'POST') {
    // Lógica para POST /api/users
  }
  // ...
};
```

### 3. Archivo vercel.json

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

### 4. Variables de Entorno

Configura variables como `MONGODB_URI`, `JWT_SECRET`, etc. en Vercel Dashboard.

## Despliegue Full-Stack

Para aplicaciones full-stack:

1. **Despliega el backend primero** en un proyecto separado.
2. **Actualiza el frontend** con la URL del backend desplegado.
3. **Despliega el frontend**.

Ejemplo: En tu frontend, cambia las llamadas API para usar la URL de Vercel del backend.

## Comandos Útiles

### Despliegue Local
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Despliegue de producción
vercel --prod
```

### Monitoreo
- Revisa los logs en Vercel Dashboard > Functions
- Usa `vercel logs` para ver logs en terminal

## Consejos Avanzados

1. **Custom Domain**: En Settings > Domains, agrega tu dominio personalizado.
2. **Environment Variables**: Usa diferentes sets para preview/production.
3. **Rewrites/Redirects**: Configura en `vercel.json` para SPA routing.
4. **Analytics**: Integra Vercel Analytics para métricas.
5. **Edge Functions**: Para mejor performance global.

## Solución de Problemas Comunes

- **Build falla**: Verifica que todas las dependencias estén en `package.json`
- **404 en rutas**: Asegura que tengas rewrites para SPA
- **CORS issues**: Configura CORS en tus funciones API
- **Database connections**: Usa connection pooling para serverless

## Recursos Adicionales

- [Documentación Oficial de Vercel](https://vercel.com/docs)
- [Guías de Frameworks](https://vercel.com/docs/frameworks)
- [Vercel CLI](https://vercel.com/docs/cli)

¡Con esta guía, deberías poder desplegar tus proyectos `junior-dev-network` y `junior-dev-backend` en Vercel sin problemas!
