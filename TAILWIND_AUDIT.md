# Auditoría de Uso de Tailwind CSS

> Tarea 9.1 — Requisito 13.2  
> Fecha: 2025

---

## Resumen Ejecutivo

Se identificaron **15 archivos** con clases de Tailwind CSS en los directorios `app/` y `components/`. Los componentes de la biblioteca UI (`components/ui/`) ya fueron migrados a CSS Modules en fases anteriores. Los archivos pendientes de migración son principalmente páginas, componentes de layout heredados y componentes de dominio.

El archivo `app/globals.css` ya **no contiene directivas Tailwind** (`@tailwind base/components/utilities`). Usa el nuevo sistema de tokens CSS.

---

## Archivos con Uso de Tailwind CSS

### 🔴 Alta Prioridad (componentes de dominio con mucho uso)

| Archivo | Clases Tailwind aprox. | Descripción |
|---|---|---|
| `components/whatsapp/SessionView.tsx` | ~40 | Vista principal de sesiones WhatsApp |
| `components/panels/SessionPanel.tsx` | ~35 | Panel lateral de creación de sesión |
| `components/panels/UserPanel.tsx` | ~30 | Panel de información del usuario |
| `components/whatsapp/MessagesView.tsx` | ~25 | Vista de envío de mensajes |
| `components/ActivityFeed.tsx` | ~20 | Feed de actividad reciente |
| `components/SessionCard.tsx` | ~18 | Tarjeta de sesión individual |

### 🟡 Media Prioridad (layout y páginas de autenticación)

| Archivo | Clases Tailwind aprox. | Descripción |
|---|---|---|
| `app/(auth)/login/page.tsx` | ~20 | Página de login |
| `app/(auth)/register/page.tsx` | ~22 | Página de registro |
| `components/layout/Header.tsx` | ~25 | Header principal |
| `components/layout/Navbar.tsx` | ~10 | Barra de navegación |
| `components/layout/Footer.tsx` | ~12 | Footer |
| `components/layout/DashboardLayout.tsx` | ~5 | Layout del dashboard |

### 🟢 Baja Prioridad (páginas con uso mínimo)

| Archivo | Clases Tailwind aprox. | Descripción |
|---|---|---|
| `app/dashboard/page.tsx` | ~15 | Página principal del dashboard |
| `app/dashboard/whatsapp/page.tsx` | ~4 | Página de WhatsApp |
| `components/StatsCards.tsx` | ~15 | Tarjetas de estadísticas |
| `components/whatsapp/WhatsAppSidebar.tsx` | ~10 | Sidebar de WhatsApp |
| `app/page.tsx` | ~3 | Página raíz (redirect) |

---

## Componentes YA Migrados (no requieren acción)

Los siguientes componentes de `components/ui/` ya usan CSS Modules exclusivamente:

- `components/ui/Button/` — `Button.module.css` ✅
- `components/ui/Input/` — `Input.module.css` ✅
- `components/ui/Card/` — `Card.module.css` ✅
- `components/ui/Badge/` — `Badge.module.css` ✅
- `components/ui/Avatar/` — `Avatar.module.css` ✅
- `components/ui/Spinner/` — `Spinner.module.css` ✅
- `components/ui/Modal/` — `Modal.module.css` ✅
- `components/ui/Toast/` — `Toast.module.css` ✅
- `components/ui/Dropdown/` — `Dropdown.module.css` ✅

---

## Clases Tailwind Más Usadas y Sus Equivalentes CSS

### Layout y Flexbox

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `flex` | `display: flex` |
| `flex-1` | `flex: 1` |
| `flex-col` | `flex-direction: column` |
| `items-center` | `align-items: center` |
| `justify-between` | `justify-content: space-between` |
| `justify-center` | `justify-content: center` |
| `gap-2` / `gap-3` / `gap-4` / `gap-6` | `gap: var(--spacing-2)` / `var(--spacing-3)` / etc. |
| `space-y-4` | `> * + * { margin-top: var(--spacing-4) }` |
| `space-y-6` | `> * + * { margin-top: var(--spacing-6) }` |
| `min-h-screen` | `min-height: 100vh` |

### Grid

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `grid` | `display: grid` |
| `grid-cols-1` | `grid-template-columns: 1fr` |
| `md:grid-cols-3` | `@media (min-width: 768px) { grid-template-columns: repeat(3, 1fr) }` |
| `lg:grid-cols-3` | `@media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr) }` |
| `lg:col-span-2` | `grid-column: span 2` |

### Espaciado (Padding / Margin)

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `p-2` / `p-3` / `p-4` / `p-6` / `p-8` | `padding: var(--spacing-2)` / `var(--spacing-3)` / etc. |
| `px-4` / `py-2` / `py-3` | `padding-inline: var(--spacing-4)` / `padding-block: var(--spacing-2)` |
| `mt-1` / `mt-2` / `mt-4` / `mt-6` / `mt-8` | `margin-top: var(--spacing-1)` / etc. |
| `mb-2` / `mb-4` / `mb-6` / `mb-8` | `margin-bottom: var(--spacing-2)` / etc. |
| `mx-auto` | `margin-inline: auto` |
| `max-w-md` | `max-width: 28rem` |
| `max-w-2xl` | `max-width: 42rem` |
| `max-w-7xl` | `max-width: 80rem` |
| `w-full` | `width: 100%` |
| `w-4` / `w-5` / `w-6` / `w-8` / `w-10` / `w-16` / `w-64` | `width: 1rem` / `1.25rem` / `1.5rem` / `2rem` / `2.5rem` / `4rem` / `16rem` |
| `h-4` / `h-5` / `h-8` / `h-12` / `h-16` | `height: 1rem` / `1.25rem` / `2rem` / `3rem` / `4rem` |

### Tipografía

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `text-sm` | `font-size: var(--font-size-sm)` (14px) |
| `text-xs` | `font-size: var(--font-size-xs)` (12px) |
| `text-lg` | `font-size: var(--font-size-lg)` (18px) |
| `text-xl` | `font-size: var(--font-size-xl)` (20px) |
| `text-2xl` | `font-size: var(--font-size-2xl)` (24px) |
| `text-3xl` | `font-size: var(--font-size-3xl)` (30px) |
| `font-medium` | `font-weight: var(--font-weight-medium)` (500) |
| `font-semibold` | `font-weight: var(--font-weight-semibold)` (600) |
| `font-bold` | `font-weight: var(--font-weight-bold)` (700) |
| `text-center` | `text-align: center` |
| `text-left` | `text-align: left` |

### Colores de Texto

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `text-gray-400` | `color: var(--color-neutral-400)` |
| `text-gray-500` | `color: var(--color-neutral-500)` |
| `text-gray-600` | `color: var(--color-neutral-600)` |
| `text-gray-700` | `color: var(--color-neutral-700)` |
| `text-gray-900` | `color: var(--color-neutral-900)` |
| `text-white` | `color: #ffffff` |
| `text-blue-600` | `color: var(--color-primary-600)` |
| `text-blue-700` | `color: var(--color-primary-700)` |
| `text-blue-800` | `color: var(--color-primary-800)` |
| `text-red-600` | `color: var(--color-error-600)` |
| `text-red-700` | `color: var(--color-error-700)` |
| `text-green-600` | `color: var(--color-success-600)` |
| `text-green-700` | `color: var(--color-success-700)` |
| `text-purple-600` | `color: var(--color-purple-600)` |

### Colores de Fondo

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `bg-white` | `background-color: var(--color-surface)` |
| `bg-gray-50` | `background-color: var(--color-neutral-50)` |
| `bg-gray-100` | `background-color: var(--color-neutral-100)` |
| `bg-gray-200` | `background-color: var(--color-neutral-200)` |
| `bg-blue-50` | `background-color: var(--color-primary-50)` |
| `bg-blue-100` | `background-color: var(--color-primary-100)` |
| `bg-blue-500` | `background-color: var(--color-primary-500)` |
| `bg-blue-600` | `background-color: var(--color-primary-600)` |
| `bg-red-50` | `background-color: var(--color-error-50)` |
| `bg-red-600` | `background-color: var(--color-error-600)` |
| `bg-green-50` | `background-color: var(--color-success-50)` |
| `bg-green-100` | `background-color: var(--color-success-100)` |
| `bg-gradient-to-br from-blue-50 to-blue-100` | `background: linear-gradient(to bottom right, var(--color-primary-50), var(--color-primary-100))` |
| `bg-gradient-to-br from-blue-500 to-blue-600` | `background: linear-gradient(to bottom right, var(--color-primary-500), var(--color-primary-600))` |

### Bordes

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `border` | `border: 1px solid` |
| `border-b` | `border-bottom: 1px solid` |
| `border-t` | `border-top: 1px solid` |
| `border-gray-100` | `border-color: var(--color-neutral-100)` |
| `border-gray-200` | `border-color: var(--color-neutral-200)` |
| `border-gray-300` | `border-color: var(--color-neutral-300)` |
| `border-red-200` | `border-color: var(--color-error-200)` |
| `border-green-200` | `border-color: var(--color-success-200)` |
| `border-blue-200` | `border-color: var(--color-primary-200)` |
| `rounded` | `border-radius: var(--radius-sm)` |
| `rounded-lg` | `border-radius: var(--radius-md)` |
| `rounded-xl` | `border-radius: var(--radius-lg)` |
| `rounded-2xl` | `border-radius: var(--radius-xl)` |
| `rounded-full` | `border-radius: var(--radius-full)` |

### Sombras

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `shadow-sm` | `box-shadow: var(--shadow-sm)` |
| `shadow-lg` | `box-shadow: var(--shadow-lg)` |
| `shadow-xl` | `box-shadow: var(--shadow-xl)` |

### Posicionamiento

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `relative` | `position: relative` |
| `absolute` | `position: absolute` |
| `sticky` | `position: sticky` |
| `top-0` | `top: 0` |
| `right-0` | `right: 0` |
| `z-50` | `z-index: 50` |
| `overflow-hidden` | `overflow: hidden` |

### Estados y Transiciones

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `transition` | `transition: all var(--duration-normal) var(--ease-in-out)` |
| `hover:bg-blue-700` | `&:hover { background-color: var(--color-primary-700) }` |
| `hover:bg-gray-100` | `&:hover { background-color: var(--color-neutral-100) }` |
| `hover:text-blue-600` | `&:hover { color: var(--color-primary-600) }` |
| `hover:text-red-700` | `&:hover { color: var(--color-error-700) }` |
| `disabled:opacity-50` | `&:disabled { opacity: 0.5 }` |
| `disabled:cursor-not-allowed` | `&:disabled { cursor: not-allowed }` |
| `focus:ring-2 focus:ring-blue-500` | `&:focus { outline: 2px solid var(--color-primary-500); outline-offset: 2px }` |
| `focus:border-transparent` | `&:focus { border-color: transparent }` |

### Animaciones

| Clase Tailwind | Equivalente CSS Module |
|---|---|
| `animate-spin` | `animation: spin var(--duration-slow) linear infinite` (definir keyframe `spin`) |
| `animate-pulse` | `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` (definir keyframe `pulse`) |

---

## Orden de Migración Recomendado

### Fase 1 — Componentes de Autenticación (Tarea 10.1)
1. `app/(auth)/login/page.tsx`
2. `app/(auth)/register/page.tsx`

### Fase 2 — Componentes de Sesiones WhatsApp (Tarea 10.2)
3. `components/whatsapp/SessionView.tsx`
4. `components/panels/SessionPanel.tsx`
5. `components/whatsapp/MessagesView.tsx`
6. `components/whatsapp/WhatsAppSidebar.tsx`
7. `components/SessionCard.tsx`

### Fase 3 — Componentes del Dashboard (Tarea 10.3)
8. `components/StatsCards.tsx`
9. `components/ActivityFeed.tsx`
10. `components/panels/UserPanel.tsx`
11. `app/dashboard/page.tsx`
12. `app/dashboard/whatsapp/page.tsx`

### Fase 4 — Layout y Navegación (Tarea 14)
13. `components/layout/Header.tsx`
14. `components/layout/Navbar.tsx`
15. `components/layout/Footer.tsx`
16. `components/layout/DashboardLayout.tsx`
17. `app/page.tsx`

---

## Notas de Migración

- Los tokens CSS ya están definidos en `app/styles/tokens/` — usar variables como `var(--color-primary-600)` en lugar de valores hardcoded.
- Para clases utilitarias muy repetidas (`flex`, `items-center`, etc.) se puede crear `app/styles/utilities.css` (Tarea 9.2).
- Las animaciones `animate-spin` y `animate-pulse` deben definirse en `app/styles/tokens/animations.css` o en el CSS Module correspondiente.
- Cada componente migrado debe tener su propio archivo `.module.css` en la misma carpeta.
- Mantener la apariencia visual actual durante la migración (Requisito 13.5).
