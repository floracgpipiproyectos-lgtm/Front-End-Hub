# 📁 Assets - JuniorDev Network

Esta carpeta contiene todos los recursos estáticos del proyecto (imágenes, iconos, etc.).

## 📂 Estructura

```
assets/
├── icons/          # Iconos SVG y componentes de iconos
│   ├── logo.svg           # Logo principal de JuniorDev Network
│   ├── logo-icon.svg      # Icono simplificado para favicon
│   ├── features/          # Iconos por feature
│   │   ├── cv-analysis.svg
│   │   ├── projects.svg
│   │   ├── network.svg
│   │   ├── gamification.svg
│   │   ├── portfolio.svg
│   │   └── profile.svg
│   └── common/            # Iconos comunes
│       ├── badge.svg
│       ├── mentor.svg
│       ├── community.svg
│       └── skill.svg
│
└── images/         # Imágenes (JPG, PNG, WebP)
    ├── hero/              # Imágenes hero/banner
    │   └── hero-banner.jpg
    ├── illustrations/     # Ilustraciones y gráficos
    │   ├── empty-state.svg
    │   ├── success.svg
    │   └── error.svg
    ├── avatars/           # Avatares por defecto
    │   └── default-avatar.png
    └── backgrounds/       # Fondos y texturas
        └── gradient-bg.svg
```

## 🎨 Tipos de Assets

### Icons (`assets/icons/`)
- **Formato recomendado**: SVG
- **Tamaño estándar**: 24x24px, 32x32px, 48x48px
- **Uso**: Iconos de interfaz, logos, badges
- **Librería recomendada**: Lucide React (ya instalada) para iconos comunes

### Images (`assets/images/`)
- **Formatos soportados**: JPG, PNG, WebP, SVG
- **Optimización**: Usar WebP cuando sea posible
- **Uso**: Fotos, ilustraciones, avatares, fondos

## 📝 Convenciones

### Nomenclatura
- **Iconos**: `kebab-case.svg` (ej: `cv-analysis.svg`)
- **Imágenes**: `kebab-case.jpg/png` (ej: `hero-banner.jpg`)
- **Carpetas**: `kebab-case` (ej: `hero/`, `illustrations/`)

### Tamaños Recomendados
- **Logo principal**: 200x200px (SVG preferido)
- **Favicon**: 32x32px, 64x64px
- **Avatares**: 128x128px, 256x256px
- **Hero images**: 1920x1080px (Full HD)
- **Thumbnails**: 400x300px

## 🚀 Uso en el Proyecto

### Importar imágenes
```javascript
import logo from '@/assets/icons/logo.svg'
import heroImage from '@/assets/images/hero/hero-banner.jpg'

<img src={logo} alt="JuniorDev Network" />
```

### Usar iconos de Lucide React
```javascript
import { User, Code, Award } from 'lucide-react'

<User size={24} />
<Code size={32} />
<Award size={48} />
```

## 🎯 Assets Necesarios para el Proyecto

### Prioridad Alta
- ✅ Logo principal (creado: `logo.svg`)
- ✅ Favicon (creado: `logo-icon.svg`)
- ⬜ Ilustración hero/banner
- ⬜ Avatar por defecto
- ⬜ Iconos de features principales

### Prioridad Media
- ⬜ Ilustraciones de estados vacíos
- ⬜ Badges visuales
- ⬜ Fondos y texturas

### Prioridad Baja
- ⬜ Imágenes de ejemplo para proyectos
- ⬜ Fotos de mentores (placeholders)

## 📚 Recursos Recomendados

### Para crear/editar iconos
- [Figma](https://figma.com) - Diseño vectorial
- [Iconify](https://iconify.design) - Biblioteca de iconos
- [Heroicons](https://heroicons.com) - Iconos SVG

### Para imágenes
- [Unsplash](https://unsplash.com) - Fotos gratuitas
- [Pexels](https://pexels.com) - Fotos gratuitas
- [Undraw](https://undraw.co) - Ilustraciones SVG gratuitas

### Optimización
- [TinyPNG](https://tinypng.com) - Comprimir imágenes
- [Squoosh](https://squoosh.app) - Optimizar imágenes
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimizar SVG
