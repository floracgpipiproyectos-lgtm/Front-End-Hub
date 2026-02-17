# TODO - Mejoras del Proyecto Junior Dev Network

## ✅ COMPLETADOS

### 1. Conectar AuthContext al authService real ✅
- [x] Actualizar AuthContext.jsx para usar authService en lugar de mock data
- [x] Integrar manejo de tokens reales
- [x] Agregar logout real

### 2. Eliminar duplicación AuthContext vs Redux ✅
- [x] Revisar authSlice de Redux
- [x] Decidir si usar solo AuthContext o solo Redux para auth - DECISIÓN: Usar AuthContext (más simple)
- [x] Sincronizar estado entre ambos si es necesario

### 3. Implementar code splitting ✅
- [x] Agregar React.lazy y Suspense para páginas

### 4. Correcciones de navegación ✅
- [x] FAQ.jsx - Corregido import Link, typo, anchor→Link
- [x] Navbar - Actualizado con todos los enlaces
- [x] Hero - Actualizado con enlaces adicionales
- [x] Footer - Actualizado con React Router Links

## PENDIENTES

### 5. Agregar validaciones de formulario
- [ ] Usar las validaciones existentes en el LoginPage
- [ ] Mejorar mensajes de error

### 6. Optimizar rendimiento
- [ ] Agregar React.memo a componentes que se repiten
- [ ] Implementar virtualización si hay listas grandes

## Notas
- El authService ya está bien implementado con API real
- AuthContext ahora usa el servicio real de autenticación
- Code splitting implementado para mejor rendimiento
- Se decidió usar solo AuthContext (no Redux) para autenticación
