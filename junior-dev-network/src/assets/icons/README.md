# 🎨 Icons - JuniorDev Network

Esta carpeta contiene todos los iconos SVG del proyecto.

## 📁 Organización

### Iconos principales
- `logo.svg` - Logo completo de JuniorDev Network
- `logo-icon.svg` - Icono simplificado para favicon

### `features/`
Iconos específicos para cada feature del proyecto
- `cv-analysis.svg` - Análisis de CV
- `projects.svg` - Proyectos
- `network.svg` - Networking
- `gamification.svg` - Badges y logros
- `portfolio.svg` - Portafolio
- `profile.svg` - Perfil

### `common/`
Iconos comunes reutilizables
- `badge.svg` - Badge genérico
- `mentor.svg` - Mentor
- `community.svg` - Comunidad
- `skill.svg` - Skill/habilidad

## 📝 Uso

### Importar icono SVG
```javascript
import logo from '@/assets/icons/logo.svg'
import cvIcon from '@/assets/icons/features/cv-analysis.svg'

<img src={logo} alt="Logo" />
```

### Usar Lucide React (Recomendado)
El proyecto ya tiene instalado `lucide-react`, que es más flexible:

```javascript
import { FileText, Code, Users, Award, Briefcase, User } from 'lucide-react'

<FileText size={24} />  // Para CV
<Code size={24} />      // Para proyectos
<Users size={24} />      // Para networking
<Award size={24} />     // Para badges
<Briefcase size={24} /> // Para portafolio
<User size={24} />      // Para perfil
```

## 🎯 Iconos Necesarios

### Ya creados
- ✅ Logo principal
- ✅ Logo icon (favicon)

### Por crear (opcional - puedes usar Lucide React)
- ⬜ Iconos de features (o usar Lucide)
- ⬜ Iconos comunes (o usar Lucide)

## 💡 Recomendación

Para este proyecto, **recomendamos usar Lucide React** en lugar de crear SVG personalizados, ya que:
- ✅ Ya está instalado
- ✅ Tiene cientos de iconos
- ✅ Fácil de personalizar (tamaño, color)
- ✅ Optimizado y ligero
- ✅ Consistente en todo el proyecto

Solo crea SVG personalizados si necesitas:
- Logo específico de la marca
- Iconos únicos que no existen en Lucide
- Ilustraciones complejas
