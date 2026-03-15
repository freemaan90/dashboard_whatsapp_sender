# Estructura del Frontend - WhatsApp Manager

## Descripción General
Frontend moderno construido con Next.js 16, React 19 y Tailwind CSS 4, con una arquitectura limpia y componentes reutilizables.

## Estructura de Componentes

### Layout Components (`components/layout/`)

#### Header.tsx
- Logo y título de la aplicación
- Menú de usuario con dropdown
- Botón de notificaciones
- Opción de cerrar sesión

#### Navbar.tsx
- Navegación principal con 4 secciones:
  - Dashboard (inicio)
  - Sesiones (gestión de sesiones)
  - Usuarios (administración)
  - Actividad (registro de eventos)
- Indicador visual de página activa

#### Footer.tsx
- Copyright y año actual
- Enlaces a documentación, soporte, términos y privacidad
- Iconos de redes sociales (Facebook, Twitter, GitHub)

#### DashboardLayout.tsx
- Layout principal que envuelve todas las páginas del dashboard
- Estructura: Header → Navbar → Content → Footer
- Fondo gris claro (bg-gray-50)

### Panel Components (`components/panels/`)

#### SessionPanel.tsx
- Formulario para crear nuevas sesiones
- Validación de número de teléfono
- Instrucciones paso a paso
- Manejo de errores y estados de carga

#### UserPanel.tsx
- Información del usuario actual
- Avatar con inicial del nombre
- ID de usuario y fecha de registro
- Estado de cuenta (Activo)
- Botón para editar perfil

### Feature Components (`components/`)

#### SessionCard.tsx
- Tarjeta individual de sesión
- Estados: Conectado, Esperando QR, Inactivo
- Visualización de código QR
- Botón para eliminar sesión
- Información de fecha de creación

#### StatsCards.tsx
- 3 tarjetas de estadísticas:
  - Total de sesiones (azul)
  - Sesiones activas (verde)
  - Total de actividades (púrpura)
- Iconos personalizados para cada métrica

#### ActivityFeed.tsx
- Feed de actividad reciente
- Iconos según tipo de evento:
  - session_created (azul)
  - session_deleted (rojo)
  - qr_generated (púrpura)
  - login_success (verde)
- Timestamps relativos (hace Xm, Xh, Xd)

## Páginas

### `/` (Home)
- Redirección automática a `/dashboard` o `/login`
- Spinner de carga durante la verificación

### `/login`
- Formulario de inicio de sesión
- Validación de email y contraseña
- Link a página de registro
- Diseño con gradiente azul

### `/register`
- Formulario de registro
- Campos: nombre, email, contraseña
- Validación mínima de 6 caracteres
- Link a página de login

### `/dashboard`
- Vista principal del dashboard
- Grid responsivo (3 columnas en desktop)
- Secciones:
  - Tarjetas de estadísticas (arriba)
  - Panel de sesión + Lista de sesiones (izquierda, 2 columnas)
  - Panel de usuario + Feed de actividad (derecha, 1 columna)

## Esquema de Colores

### Colores Principales
- Azul: `blue-500`, `blue-600`, `blue-700` (primario)
- Verde: `green-500`, `green-600`, `green-700` (éxito)
- Rojo: `red-500`, `red-600`, `red-700` (error/eliminar)
- Púrpura: `purple-500`, `purple-600` (actividad)
- Gris: `gray-50` a `gray-900` (neutros)

### Fondos
- Página: `bg-gray-50`
- Tarjetas: `bg-white`
- Gradientes: `from-blue-50 to-blue-100`

## Características

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Grid adaptativo según tamaño de pantalla

### Estados Interactivos
- Hover effects en botones y links
- Loading states con spinners
- Disabled states con opacidad reducida
- Transiciones suaves

### Iconografía
- SVG icons inline (sin dependencias externas)
- Heroicons style
- Tamaños consistentes (w-4, w-5, w-6)

### Accesibilidad
- Labels en todos los inputs
- Placeholders descriptivos
- Estados de error visibles
- Contraste de colores adecuado

## Utilidades y Helpers

### `/lib/api.ts`
- Cliente Axios configurado
- Interceptores para tokens
- Base URL desde variables de entorno

### `/lib/auth.ts`
- Funciones de autenticación
- Manejo de tokens en cookies
- Verificación de sesión

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Scripts Disponibles

```bash
npm run dev      # Desarrollo en puerto 4000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter ESLint
```

## Mejoras Implementadas

1. ✅ Eliminados todos los iconos y referencias específicas de WhatsApp
2. ✅ Creado Header profesional con logo y menú de usuario
3. ✅ Implementado Navbar con navegación clara
4. ✅ Diseñado Footer con links útiles
5. ✅ Creado Panel de Usuario con información detallada
6. ✅ Creado Panel de Sesión con formulario e instrucciones
7. ✅ Actualizado esquema de colores (verde → azul)
8. ✅ Mejorada estructura de componentes (separación de concerns)
9. ✅ Implementado layout reutilizable
10. ✅ Optimizada experiencia de usuario

## Próximos Pasos Sugeridos

- [ ] Implementar páginas de Usuarios y Actividad
- [ ] Agregar paginación en listas
- [ ] Implementar búsqueda y filtros
- [ ] Agregar modo oscuro
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar tests unitarios
- [ ] Mejorar manejo de errores global
- [ ] Implementar internacionalización (i18n)
