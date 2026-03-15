# Guía de Contribución — WhatsApp Sender Dashboard

Referencia rápida para trabajar con el sistema de diseño del proyecto.

---

## Estructura de archivos

```
dashboard_whatsapp_sender/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── dashboard.module.css
│   ├── styles/
│   │   ├── tokens/
│   │   │   ├── colors.css        # Paleta de colores (--color-primary-*, --color-neutral-*, etc.)
│   │   │   ├── typography.css    # Escala tipográfica y pesos de fuente
│   │   │   ├── spacing.css       # Escala de espaciado (--spacing-1 … --spacing-24)
│   │   │   ├── shadows.css       # Niveles de elevación (--shadow-sm … --shadow-xl)
│   │   │   ├── borders.css       # Radios de borde (--radius-sm … --radius-full)
│   │   │   └── animations.css    # Duraciones y easings
│   │   ├── themes/
│   │   │   └── light.css         # Variables semánticas del tema claro
│   │   ├── base.css              # CSS reset y estilos base
│   │   └── utilities.css         # Clases utilitarias (flex, grid, etc.)
│   └── globals.css               # Importa tokens, tema y base
├── components/
│   ├── ui/                       # Componentes de biblioteca (sin lógica de negocio)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Spinner/
│   │   ├── Modal/
│   │   ├── Dropdown/
│   │   ├── Toast/
│   │   ├── Skeleton/
│   │   ├── ProgressBar/
│   │   ├── EmptyState/
│   │   └── ErrorMessage/
│   ├── layout/                   # Componentes de estructura
│   │   ├── Container/
│   │   ├── Grid/
│   │   └── Header/
│   ├── panels/                   # Paneles de dominio
│   │   ├── SessionPanel.tsx
│   │   └── UserPanel.tsx
│   └── whatsapp/                 # Componentes específicos de WhatsApp
│       ├── SessionView.tsx
│       └── MessagesView.tsx
├── hooks/                        # Custom hooks reutilizables
├── lib/                          # Utilidades y clientes de API
└── app/interfaces/               # Tipos e interfaces TypeScript
```

---

## Convenciones de nombres

### Archivos y carpetas

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componente React | PascalCase, carpeta propia | `Button/Button.tsx` |
| CSS Module | Mismo nombre que el componente | `Button.module.css` |
| Test unitario | Sufijo `.test.tsx` | `Button.test.tsx` |
| Hook | camelCase con prefijo `use` | `useCopyToClipboard.ts` |
| Utilidad / lib | camelCase | `api.ts`, `auth.ts` |
| Página Next.js | `page.tsx` dentro de su ruta | `app/dashboard/page.tsx` |

### Componentes React

- Nombre en **PascalCase**: `SessionCard`, `UserPanel`
- Exportación nombrada preferida sobre exportación default
- Props tipadas con interfaz o type explícito

```tsx
// ✅ Correcto
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, ...props }: ButtonProps) { ... }
```

### Clases CSS (CSS Modules)

- **camelCase** en el archivo `.module.css`
- Nombres descriptivos del elemento, no del estilo visual

```css
/* ✅ Correcto */
.container { ... }
.headerTitle { ... }
.errorMessage { ... }

/* ❌ Evitar */
.blueBox { ... }
.bigText { ... }
```

### Variables CSS (tokens)

- Prefijo por categoría: `--color-`, `--spacing-`, `--font-`, `--shadow-`, `--radius-`, `--duration-`
- Escala numérica para colores (50–900) y espaciado (1–24)

```css
/* Colores */
--color-primary-500: #3b82f6;
--color-neutral-100: #f3f4f6;
--color-error-500: #ef4444;

/* Espaciado */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */

/* Tipografía */
--font-size-sm: 0.875rem;
--font-weight-semibold: 600;
```

---

## Cómo crear un nuevo componente

### Paso 1 — Crear la carpeta y archivos

```
components/ui/MyComponent/
├── MyComponent.tsx
├── MyComponent.module.css
└── MyComponent.test.tsx   (opcional pero recomendado)
```

### Paso 2 — Implementar el componente

```tsx
// components/ui/MyComponent/MyComponent.tsx
import styles from './MyComponent.module.css';

interface MyComponentProps {
  label: string;
  variant?: 'default' | 'highlighted';
  className?: string;
}

export function MyComponent({ label, variant = 'default', className }: MyComponentProps) {
  return (
    <div
      className={[
        styles.root,
        styles[variant],
        className,
      ].filter(Boolean).join(' ')}
    >
      {label}
    </div>
  );
}
```

### Paso 3 — Escribir los estilos con tokens

```css
/* components/ui/MyComponent/MyComponent.module.css */
.root {
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--duration-normal) var(--ease-in-out);
}

.default {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.highlighted {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-200);
}
```

### Paso 4 — Exportar desde el índice (si aplica)

Si el componente es parte de `components/ui/`, agrégalo al barrel export si existe, o impórtalo directamente:

```tsx
import { MyComponent } from '@/components/ui/MyComponent/MyComponent';
```

### Paso 5 — Agregar accesibilidad

- Usa elementos HTML semánticos (`<button>`, `<nav>`, `<article>`)
- Agrega `aria-label` a iconos sin texto visible
- Asegura que los elementos interactivos sean accesibles por teclado

---

## Guía de migración desde Tailwind CSS

Tailwind CSS ha sido eliminado completamente del proyecto. Usa CSS Modules con variables CSS en su lugar.

### Layout y Flexbox

| Tailwind | CSS Module |
|----------|-----------|
| `flex` | `display: flex` |
| `flex-col` | `flex-direction: column` |
| `flex-1` | `flex: 1` |
| `items-center` | `align-items: center` |
| `justify-between` | `justify-content: space-between` |
| `justify-center` | `justify-content: center` |
| `gap-4` | `gap: var(--spacing-4)` |
| `gap-6` | `gap: var(--spacing-6)` |
| `min-h-screen` | `min-height: 100vh` |
| `w-full` | `width: 100%` |

### Grid

| Tailwind | CSS Module |
|----------|-----------|
| `grid` | `display: grid` |
| `grid-cols-1` | `grid-template-columns: 1fr` |
| `md:grid-cols-2` | `@media (min-width: 640px) { grid-template-columns: repeat(2, 1fr) }` |
| `lg:grid-cols-3` | `@media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr) }` |
| `col-span-2` | `grid-column: span 2` |

### Espaciado

| Tailwind | CSS Module |
|----------|-----------|
| `p-4` | `padding: var(--spacing-4)` |
| `px-6` | `padding-inline: var(--spacing-6)` |
| `py-3` | `padding-block: var(--spacing-3)` |
| `mt-4` | `margin-top: var(--spacing-4)` |
| `mb-6` | `margin-bottom: var(--spacing-6)` |
| `mx-auto` | `margin-inline: auto` |

### Tipografía

| Tailwind | CSS Module |
|----------|-----------|
| `text-sm` | `font-size: var(--font-size-sm)` |
| `text-lg` | `font-size: var(--font-size-lg)` |
| `text-2xl` | `font-size: var(--font-size-2xl)` |
| `font-medium` | `font-weight: var(--font-weight-medium)` |
| `font-semibold` | `font-weight: var(--font-weight-semibold)` |
| `font-bold` | `font-weight: var(--font-weight-bold)` |
| `text-center` | `text-align: center` |

### Colores

| Tailwind | CSS Module |
|----------|-----------|
| `text-gray-600` | `color: var(--color-neutral-600)` |
| `text-gray-900` | `color: var(--color-neutral-900)` |
| `text-blue-600` | `color: var(--color-primary-600)` |
| `text-red-600` | `color: var(--color-error-600)` |
| `text-green-600` | `color: var(--color-success-600)` |
| `bg-white` | `background-color: var(--color-surface)` |
| `bg-gray-50` | `background-color: var(--color-neutral-50)` |
| `bg-blue-600` | `background-color: var(--color-primary-600)` |
| `bg-red-50` | `background-color: var(--color-error-50)` |

### Bordes y sombras

| Tailwind | CSS Module |
|----------|-----------|
| `border` | `border: 1px solid var(--color-border)` |
| `border-gray-200` | `border-color: var(--color-neutral-200)` |
| `rounded` | `border-radius: var(--radius-sm)` |
| `rounded-lg` | `border-radius: var(--radius-md)` |
| `rounded-full` | `border-radius: var(--radius-full)` |
| `shadow-sm` | `box-shadow: var(--shadow-sm)` |
| `shadow-lg` | `box-shadow: var(--shadow-lg)` |

### Estados y transiciones

| Tailwind | CSS Module |
|----------|-----------|
| `hover:bg-blue-700` | `&:hover { background-color: var(--color-primary-700) }` |
| `hover:bg-gray-100` | `&:hover { background-color: var(--color-neutral-100) }` |
| `disabled:opacity-50` | `&:disabled { opacity: 0.5 }` |
| `disabled:cursor-not-allowed` | `&:disabled { cursor: not-allowed }` |
| `transition` | `transition: all var(--duration-normal) var(--ease-in-out)` |
| `focus:ring-2 focus:ring-blue-500` | `&:focus { outline: 2px solid var(--color-primary-500); outline-offset: 2px }` |

### Gradientes

```css
/* Tailwind: bg-gradient-to-br from-blue-50 to-blue-100 */
background: linear-gradient(
  to bottom right,
  var(--color-primary-50),
  var(--color-primary-100)
);
```

---

## Ejemplos de layouts responsivos

Los breakpoints del proyecto son:

| Nombre | Ancho mínimo |
|--------|-------------|
| mobile | < 640px (base) |
| tablet | ≥ 640px |
| desktop | ≥ 1024px |

### Layout de una columna → tres columnas

```tsx
import { Container } from '@/components/layout/Container/Container';
import { Grid } from '@/components/layout/Grid/Grid';
import { Card } from '@/components/ui/Card/Card';

export function StatsSection() {
  return (
    <Container>
      <Grid cols={1} tabletCols={2} desktopCols={3} gap="md">
        <Card elevation="elevated">
          <Card.Body>Sesiones totales: 12</Card.Body>
        </Card>
        <Card elevation="elevated">
          <Card.Body>Sesiones activas: 3</Card.Body>
        </Card>
        <Card elevation="elevated">
          <Card.Body>Actividades hoy: 47</Card.Body>
        </Card>
      </Grid>
    </Container>
  );
}
```

### Layout de dos columnas con sidebar

```tsx
// CSS Module
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 1fr 2fr;  /* sidebar + contenido principal */
  }
}

.sidebar {
  /* En móvil aparece primero */
}

.main {
  /* Ocupa el espacio restante */
}
```

```tsx
export function DashboardLayout() {
  return (
    <Container>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <SessionPanel />
        </aside>
        <main className={styles.main}>
          <SessionView />
        </main>
      </div>
    </Container>
  );
}
```

### Layout de contenido principal + columna lateral

```tsx
// CSS Module
.pageGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 1024px) {
  .pageGrid {
    grid-template-columns: 2fr 1fr;
  }
}

/* La columna lateral ocupa toda la fila en móvil,
   y aparece a la derecha en desktop */
.sideColumn {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
```

### Patrón mobile-first en CSS Module

Siempre escribe los estilos base para móvil y añade media queries para pantallas más grandes:

```css
.card {
  /* Móvil: ocupa todo el ancho */
  width: 100%;
  padding: var(--spacing-4);
}

@media (min-width: 640px) {
  /* Tablet: padding más generoso */
  .card {
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  /* Desktop: ancho fijo */
  .card {
    max-width: 480px;
  }
}
```

---

## Recursos adicionales

- **COMPONENTS.md** — Documentación completa de todos los componentes UI con props y ejemplos
- **DESIGN_SYSTEM.md** — Tokens de diseño, paleta de colores y escala tipográfica
- **TAILWIND_AUDIT.md** — Referencia completa de equivalencias Tailwind → CSS Module
