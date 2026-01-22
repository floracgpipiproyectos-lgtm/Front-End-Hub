# 🖼️ Images - JuniorDev Network

Esta carpeta contiene todas las imágenes del proyecto.

## 📁 Organización

### `hero/`
Imágenes para secciones hero/banner principales
- **Tamaño recomendado**: 1920x1080px
- **Formato**: JPG (alta calidad) o WebP
- **Uso**: Banners principales, landing page

### `illustrations/`
Ilustraciones SVG para estados y mensajes
- **Formato**: SVG (preferido) o PNG
- **Uso**: Estados vacíos, mensajes de éxito/error, decoraciones

### `avatars/`
Avatares por defecto y placeholders
- **Tamaño**: 128x128px, 256x256px
- **Formato**: PNG con transparencia
- **Uso**: Perfiles de usuario, mentores

### `backgrounds/`
Fondos, texturas y patrones
- **Formato**: SVG (preferido) o PNG
- **Uso**: Fondos de secciones, gradientes

## 📝 Ejemplos de Uso

```javascript
// Importar imagen
import heroBanner from '@/assets/images/hero/hero-banner.jpg'
import emptyState from '@/assets/images/illustrations/empty-state.svg'
import defaultAvatar from '@/assets/images/avatars/default-avatar.png'

// Usar en componente
<img src={heroBanner} alt="Hero banner" />
<img src={emptyState} alt="No hay proyectos" />
<img src={defaultAvatar} alt="Avatar por defecto" />
```

## 🎨 Recursos Recomendados

- **Ilustraciones gratuitas**: [Undraw](https://undraw.co), [DrawKit](https://drawkit.com)
- **Fotos gratuitas**: [Unsplash](https://unsplash.com), [Pexels](https://pexels.com)
- **Avatares**: [UI Avatars](https://ui-avatars.com), [DiceBear](https://dicebear.com)
