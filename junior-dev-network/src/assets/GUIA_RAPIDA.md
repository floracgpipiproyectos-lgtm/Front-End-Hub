# 🎨 Guía Rápida de Assets

## ✅ ¿Qué hacer con react.svg?

**Puedes eliminarlo** - Ya fue eliminado. No es necesario para el proyecto.

## 📁 ¿Qué poner en cada carpeta?

### `assets/icons/`
**Iconos SVG personalizados de la marca:**
- ✅ `logo.svg` - Logo principal (ya creado)
- ✅ `logo-icon.svg` - Favicon (ya creado)
- ⬜ Iconos personalizados si los necesitas (opcional)

**Recomendación**: Usa **Lucide React** para la mayoría de iconos (ya está instalado)

```javascript
import { FileText, Code, Users, Award } from 'lucide-react'
```

### `assets/images/hero/`
**Banners e imágenes principales:**
- Imagen hero para la landing page (1920x1080px)
- Banners de secciones principales
- Formato: JPG o WebP

### `assets/images/illustrations/`
**Ilustraciones SVG para estados:**
- Estados vacíos (sin proyectos, sin conexiones)
- Mensajes de éxito/error
- Decoraciones
- Formato: SVG (preferido)

### `assets/images/avatars/`
**Avatares por defecto:**
- Avatar placeholder para usuarios sin foto
- Formato: PNG con transparencia (128x128px o 256x256px)

### `assets/images/backgrounds/`
**Fondos y texturas:**
- Gradientes SVG
- Patrones de fondo
- Texturas sutiles
- Formato: SVG (preferido)

## 🚀 Recursos Gratuitos Recomendados

### Para Ilustraciones
- **[Undraw](https://undraw.co)** - Ilustraciones SVG gratuitas y personalizables
- **[DrawKit](https://drawkit.com)** - Ilustraciones profesionales
- **[ManyPixels](https://www.manypixels.co/gallery)** - Ilustraciones gratuitas

### Para Fotos
- **[Unsplash](https://unsplash.com)** - Fotos de alta calidad
- **[Pexels](https://pexels.com)** - Fotos gratuitas
- **[Pixabay](https://pixabay.com)** - Fotos e ilustraciones

### Para Iconos
- **[Lucide Icons](https://lucide.dev)** - Ya instalado en el proyecto
- **[Heroicons](https://heroicons.com)** - Iconos SVG simples
- **[Iconify](https://iconify.design)** - Biblioteca masiva de iconos

## 💡 Ejemplo de Uso

```javascript
// Logo
import logo from '@/assets/icons/logo.svg'

// Ilustración
import emptyState from '@/assets/images/illustrations/empty-state.svg'

// Iconos de Lucide (recomendado)
import { FileText, Code, Users } from 'lucide-react'

function MyComponent() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <FileText size={24} />
      <Code size={32} color="#667eea" />
    </div>
  )
}
```

## 📝 Checklist de Assets

### Prioridad Alta
- ✅ Logo principal
- ✅ Favicon
- ⬜ Imagen hero (opcional)
- ⬜ Avatar por defecto (opcional)

### Prioridad Media
- ⬜ Ilustraciones de estados vacíos
- ⬜ Fondos/gradientes

### Prioridad Baja
- ⬜ Fotos de ejemplo
- ⬜ Más ilustraciones decorativas

**Nota**: Muchos de estos assets son opcionales. Puedes empezar sin ellos y agregarlos según necesites.
