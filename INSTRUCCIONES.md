# 🚀 Instrucciones para Ejecutar el Proyecto

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn instalado

## 🔧 Instalación

Si es la primera vez que ejecutas el proyecto:

```bash
cd junior-dev-network
npm install
```

## ▶️ Ejecutar en Modo Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El servidor se iniciará en: **http://localhost:5173**

Abre tu navegador y visita esa URL para ver la aplicación.

## 📝 Otros Comandos Disponibles

### Construir para Producción
```bash
npm run build
```

### Previsualizar Build de Producción
```bash
npm run preview
```

### Ejecutar Linter
```bash
npm run lint
```

## 🔍 Verificar que Todo Funciona

1. **Abre el navegador** en `http://localhost:5173`
2. **Deberías ver:**
   - Título "🚀 JuniorDev Network"
   - Sección con información de los servicios API
   - Botón de contador para probar HMR (Hot Module Replacement)
3. **Prueba el HMR:**
   - Edita `src/App.jsx`
   - Guarda el archivo
   - Los cambios deberían aparecer automáticamente en el navegador sin recargar

## 🌐 Variables de Entorno (Opcional)

Si necesitas configurar la URL de la API, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Por defecto, si no existe este archivo, usará: `http://localhost:3000/api`

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que el puerto 5173 no esté en uso
- Asegúrate de haber ejecutado `npm install`

### Errores de importación
- Verifica que todos los archivos estén guardados
- Revisa la consola del navegador para ver errores específicos

### No se ven los cambios
- Asegúrate de que el servidor esté corriendo
- Verifica que el archivo se haya guardado
- Revisa la consola del navegador

## 📚 Documentación

- **Estructura del proyecto:** `src/STRUCTURE.md`
- **Documentación de API:** `src/api/README.md`
- **Endpoints:** `src/constants/apiEndpoints.js`
