# Component Library

UI components for the WhatsApp Sender Dashboard. All components are written in TypeScript, use CSS Modules for styling, and follow WCAG 2.1 AA accessibility guidelines.

## Table of Contents

- [Button](#button)
- [Input](#input)
- [Card](#card)
- [Badge](#badge)
- [Avatar](#avatar)
- [Spinner](#spinner)
- [Toast / useToast](#toast--usetoast)
- [Modal](#modal)
- [Dropdown](#dropdown)
- [Skeleton](#skeleton)
- [ProgressBar](#progressbar)
- [EmptyState](#emptystate)
- [ErrorMessage](#errormessage)

---

## Button

`components/ui/Button/Button.tsx`

A versatile button with multiple variants, sizes, loading state, and optional icons.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows inline spinner and disables the button |
| `disabled` | `boolean` | `false` | Disables the button |
| `leadingIcon` | `ReactNode` | — | Icon rendered before the label |
| `trailingIcon` | `ReactNode` | — | Icon rendered after the label |
| `iconOnly` | `boolean` | `false` | Renders icon-only button (requires `aria-label`) |
| `aria-label` | `string` | — | Required when `iconOnly` is true |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |

Extends all native `<button>` attributes.

### Examples

```tsx
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon } from 'lucide-react';

// Variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Export</Button>
<Button variant="ghost">Learn more</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button leadingIcon={<PlusIcon size={16} />}>New Session</Button>
<Button trailingIcon={<TrashIcon size={16} />} variant="danger">Delete</Button>

// Loading state
<Button loading>Saving…</Button>

// Icon-only
<Button iconOnly aria-label="Add item">
  <PlusIcon size={20} />
</Button>

// Submit form
<Button type="submit" variant="primary">Sign In</Button>
```

### Accessibility

- Sets `aria-disabled` and `aria-busy` when loading or disabled
- `iconOnly` buttons **must** have an `aria-label`
- Leading/trailing icons are hidden from screen readers (`aria-hidden="true"`)
- Fully keyboard accessible (Enter / Space)

---

## Input

`components/ui/Input/Input.tsx`

A form input with label, helper text, error state, and optional icons.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Visible label above the input |
| `helperText` | `string` | — | Hint text shown below the input |
| `errorMessage` | `string` | — | Error text; activates error state when present |
| `leadingIcon` | `ReactNode` | — | Icon inside the input on the left |
| `trailingIcon` | `ReactNode` | — | Icon inside the input on the right |
| `containerClassName` | `string` | — | Extra class for the root wrapper |
| `disabled` | `boolean` | `false` | Disables the input |

Extends all native `<input>` attributes.

### Examples

```tsx
import { Input } from '@/components/ui/Input';
import { SearchIcon, EyeIcon } from 'lucide-react';

// Basic with label
<Input label="Email" type="email" placeholder="you@example.com" />

// With helper text
<Input
  label="Phone number"
  helperText="Include country code, e.g. +1 555 000 0000"
  type="tel"
/>

// Error state
<Input
  label="Password"
  type="password"
  errorMessage="Password must be at least 8 characters"
/>

// With icons
<Input
  label="Search"
  leadingIcon={<SearchIcon size={16} />}
  placeholder="Search sessions…"
/>

// Controlled
const [value, setValue] = useState('');
<Input
  label="Session name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Accessibility

- `<label>` is linked to the input via `htmlFor` / `id` (auto-generated with `useId` if not provided)
- `aria-invalid` is set when `errorMessage` is present
- `aria-describedby` links the input to helper and error text
- Error text uses `role="alert"` for immediate screen reader announcement
- Icons are hidden from screen readers (`aria-hidden="true"`)

---

## Card

`components/ui/Card/Card.tsx`

A container component with optional Header, Body, and Footer sub-components and two elevation variants.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevation` | `'flat' \| 'elevated'` | `'flat'` | Shadow level |
| `onClick` | `MouseEventHandler` | — | Makes the card interactive/clickable |
| `as` | `'article' \| 'div' \| 'section'` | `'div'` | Semantic HTML element |

Extends all native HTML element attributes.

### Sub-components

- `Card.Header` — top section, typically title + actions
- `Card.Body` — main content area
- `Card.Footer` — bottom section, typically actions or metadata

### Examples

```tsx
import { Card } from '@/components/ui/Card';

// Simple card
<Card elevation="elevated">
  <Card.Body>Content goes here</Card.Body>
</Card>

// Full structure
<Card as="article" elevation="elevated">
  <Card.Header>
    <h3>Session #1</h3>
    <Badge variant="success">Connected</Badge>
  </Card.Header>
  <Card.Body>
    <p>Created on Jan 1, 2025</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="danger" size="sm">Delete</Button>
  </Card.Footer>
</Card>

// Interactive card
<Card onClick={() => router.push('/sessions/1')}>
  <Card.Body>Click to view details</Card.Body>
</Card>
```

### Accessibility

- Interactive cards (with `onClick`) receive `role="button"` and `tabIndex={0}`
- Keyboard activation via Enter and Space is handled automatically
- Use `as="article"` for semantically independent content

---

## Badge

`components/ui/Badge/Badge.tsx`

A small inline label for status indicators and tags.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Semantic color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |

Extends all native `<span>` attributes.

### Examples

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success">Connected</Badge>
<Badge variant="warning">Waiting QR</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Inactive</Badge>
<Badge variant="default">Unknown</Badge>

// Small badge in a table
<Badge variant="success" size="sm">Active</Badge>
```

### Accessibility

- Renders as a `<span>` — purely visual, no interactive role
- For dynamic status changes, wrap in an `aria-live` region so screen readers announce updates

---

## Avatar

`components/ui/Avatar/Avatar.tsx`

Displays a user avatar image with automatic fallback to initials.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alt` | `string` | **required** | Accessible label for the avatar |
| `src` | `string` | — | Image URL |
| `name` | `string` | — | User name used to generate initials fallback |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |

### Examples

```tsx
import { Avatar } from '@/components/ui/Avatar';

// With image
<Avatar src="/users/john.jpg" alt="John Doe" name="John Doe" />

// Initials fallback (no src or broken image)
<Avatar alt="Jane Smith" name="Jane Smith" size="lg" />

// Sizes
<Avatar alt="User" name="U" size="xs" />
<Avatar alt="User" name="U" size="xl" />
```

### Accessibility

- The wrapper `<span>` has `role="img"` and `aria-label` set to `alt`
- The initials text is `aria-hidden="true"` (the `aria-label` on the wrapper conveys the meaning)
- If the image fails to load, initials are shown automatically

---

## Spinner

`components/ui/Spinner/Spinner.tsx`

An animated loading indicator for indeterminate operations.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size (16 / 24 / 32 px) |
| `label` | `string` | `'Cargando…'` | Screen reader label |

### Examples

```tsx
import { Spinner } from '@/components/ui/Spinner';

// Default
<Spinner />

// Custom label
<Spinner label="Loading sessions…" size="lg" />

// Inline with text
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Spinner size="sm" />
  <span>Processing…</span>
</div>
```

### Accessibility

- Uses `role="status"` and `aria-label` so screen readers announce the loading state
- The SVG is `aria-hidden="true"` — the label on the wrapper conveys the meaning

---

## Toast / useToast

`components/ui/Toast/Toast.tsx` · `components/ui/Toast/ToastContext.tsx`

Temporary notification messages. Use the `useToast` hook to trigger toasts from anywhere in the app.

### Setup

Wrap your app (or layout) with `ToastProvider`:

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/ui/Toast/ToastContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### useToast hook

```ts
const { showToast } = useToast();
showToast(message, variant?, duration?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `message` | `string` | **required** | Text to display |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Semantic color and icon |
| `duration` | `number` | `3000` | Auto-dismiss delay in ms (0 to disable) |

### Toast Props (direct usage)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | **required** | Notification text |
| `variant` | `ToastVariant` | `'info'` | Visual style |
| `onClose` | `() => void` | **required** | Called when dismissed |
| `duration` | `number` | `3000` | Auto-dismiss in ms |
| `exiting` | `boolean` | `false` | Triggers exit animation |

### Examples

```tsx
import { useToast } from '@/components/ui/Toast/ToastContext';

function SessionActions() {
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteSession(id);
      showToast('Session deleted successfully', 'success');
    } catch {
      showToast('Failed to delete session. Please try again.', 'error');
    }
  };

  return <Button variant="danger" onClick={handleDelete}>Delete</Button>;
}
```

### Accessibility

- Each toast has `role="alert"` and `aria-live="assertive"` for immediate announcement
- The container has `aria-live="polite"` as a secondary region
- Close button has `aria-label="Cerrar notificación"`
- Toasts auto-dismiss after `duration` ms; users can also close manually

---

## Modal

`components/ui/Modal/Modal.tsx`

An accessible dialog with focus trapping, keyboard support, and enter/exit animations.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **required** | Controls visibility |
| `onClose` | `() => void` | **required** | Called when the modal should close |
| `title` | `string` | **required** | Dialog title (shown in header) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog width |
| `children` | `ReactNode` | **required** | Dialog body content |

### Examples

```tsx
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

function QRModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show QR Code</Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Scan QR Code"
        size="sm"
      >
        <img src={qrDataUrl} alt="WhatsApp QR code" />
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </Modal>
    </>
  );
}
```

### Composition pattern — confirmation dialog

```tsx
<Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Session">
  <p>Are you sure you want to delete this session? This action cannot be undone.</p>
  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
    <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
  </div>
</Modal>
```

### Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title
- Focus moves to the first focusable element when opened
- Focus is trapped inside the modal (Tab / Shift+Tab cycle within)
- Focus returns to the trigger element when closed
- ESC key closes the modal
- Clicking the backdrop closes the modal
- `document.body` scroll is locked while open
- Rendered via React Portal to avoid z-index stacking issues

---

## Dropdown

`components/ui/Dropdown/Dropdown.tsx`

An accessible dropdown menu with keyboard navigation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | **required** | Element that opens the menu |
| `items` | `DropdownItem[]` | **required** | Menu items |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Menu alignment |

### DropdownItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | ✓ | Visible text |
| `onClick` | `() => void` | ✓ | Action handler |
| `icon` | `ReactNode` | — | Optional leading icon |
| `disabled` | `boolean` | — | Disables the item |

### Examples

```tsx
import { Dropdown } from '@/components/ui/Dropdown';
import { UserIcon, SettingsIcon, LogOutIcon } from 'lucide-react';

const userMenuItems = [
  { label: 'Profile', icon: <UserIcon size={16} />, onClick: () => router.push('/profile') },
  { label: 'Settings', icon: <SettingsIcon size={16} />, onClick: () => router.push('/settings') },
  { label: 'Sign out', icon: <LogOutIcon size={16} />, onClick: handleSignOut },
];

<Dropdown
  trigger={<Avatar src={user.avatar} alt={user.name} size="sm" />}
  items={userMenuItems}
  placement="bottom-end"
/>
```

### Accessibility

- Trigger has `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`
- Menu has `role="menu"` and `aria-labelledby`
- Items have `role="menuitem"`
- Keyboard: Enter/Space/ArrowDown opens; ArrowUp/ArrowDown navigates; Home/End jump to first/last; ESC closes and returns focus to trigger; Tab closes
- Clicking outside closes the menu

---

## Skeleton

`components/ui/Skeleton/Skeleton.tsx`

Placeholder shapes shown while content is loading.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'rect'` | Shape |
| `width` | `string \| number` | — | CSS width (e.g. `'100%'`, `120`) |
| `height` | `string \| number` | — | CSS height (e.g. `'16px'`, `48`) |
| `lines` | `number` | `1` | Number of text lines (only for `variant="text"`) |

### Examples

```tsx
import { Skeleton } from '@/components/ui/Skeleton';

// Text placeholder
<Skeleton variant="text" lines={3} />

// Avatar placeholder
<Skeleton variant="circle" width={40} height={40} />

// Card placeholder
<Card>
  <Card.Body>
    <Skeleton variant="rect" height={120} />
    <Skeleton variant="text" lines={2} style={{ marginTop: 12 }} />
  </Card.Body>
</Card>
```

### Accessibility

- All Skeleton elements are `aria-hidden="true"` — they are purely decorative
- Pair with a visible loading label or `Spinner` if the loading state needs to be announced

---

## ProgressBar

`components/ui/ProgressBar/ProgressBar.tsx`

A progress bar for operations with a known completion percentage.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | **required** | Progress value 0–100 |
| `label` | `string` | — | Descriptive label |
| `showValue` | `boolean` | `false` | Display numeric percentage |

### Examples

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar value={65} label="Uploading contacts" showValue />

// Without label
<ProgressBar value={30} />
```

### Accessibility

- Uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-label` falls back to `"Progreso: X%"` when no `label` is provided
- The numeric display is `aria-hidden="true"` (the `aria-valuenow` conveys the value)

---

## EmptyState

`components/ui/EmptyState/EmptyState.tsx`

A full-section placeholder for when there is no data to display.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Main heading |
| `description` | `string` | — | Supporting text |
| `illustration` | `ReactNode` | default SVG | Custom illustration |
| `action` | `{ label: string; onClick: () => void }` | — | Call-to-action button |

### Examples

```tsx
import { EmptyState } from '@/components/ui/EmptyState';

// Sessions list
<EmptyState
  title="No sessions yet"
  description="Create your first WhatsApp session to get started."
  action={{ label: 'New Session', onClick: () => setCreateOpen(true) }}
/>

// Activity feed
<EmptyState
  title="No recent activity"
  description="Activity will appear here once you start using sessions."
/>
```

### Accessibility

- Root element has `role="status"` and `aria-label` set to `title`
- The default illustration is `aria-hidden="true"`

---

## ErrorMessage

`components/ui/ErrorMessage/ErrorMessage.tsx`

Inline, banner, or card-style error display with an optional retry action.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | **required** | Primary error text |
| `description` | `string` | — | Additional detail or resolution hint |
| `variant` | `'inline' \| 'banner' \| 'card'` | `'inline'` | Visual style |
| `onRetry` | `() => void` | — | Shows a retry button when provided |
| `retryLabel` | `string` | `'Reintentar'` | Retry button text |
| `id` | `string` | — | For use with `aria-describedby` |

### Examples

```tsx
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Inline field error
<ErrorMessage message="Failed to load sessions" onRetry={fetchSessions} />

// Banner with description
<ErrorMessage
  variant="banner"
  message="Connection error"
  description="Check your internet connection and try again."
  onRetry={handleRetry}
/>

// Card-style for full-section errors
<ErrorMessage
  variant="card"
  message="Something went wrong"
  description="We couldn't load your data. Please try again."
  onRetry={reload}
  retryLabel="Reload"
/>
```

### Accessibility

- Uses `role="alert"` and `aria-live="assertive"` for immediate screen reader announcement
- `aria-atomic="true"` ensures the full message is read when updated
- The error icon is `aria-hidden="true"`

---

## Composition Patterns

### Form with validation

```tsx
const [error, setError] = useState('');
const { showToast } = useToast();

async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  if (!phone) { setError('Phone number is required'); return; }

  try {
    await createSession(phone);
    showToast('Session created', 'success');
  } catch {
    showToast('Failed to create session', 'error');
  }
}

<form onSubmit={handleSubmit}>
  <Input
    label="Phone number"
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    errorMessage={error}
  />
  <Button type="submit" loading={isLoading}>Create Session</Button>
</form>
```

### Loading state with Skeleton

```tsx
{isLoading ? (
  <Card>
    <Card.Body>
      <Skeleton variant="circle" width={40} height={40} />
      <Skeleton variant="text" lines={2} />
    </Card.Body>
  </Card>
) : (
  <Card>
    <Card.Header>
      <Avatar src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </Card.Header>
    <Card.Body>{/* content */}</Card.Body>
  </Card>
)}
```

### Error with retry

```tsx
{error ? (
  <ErrorMessage
    variant="card"
    message="Failed to load sessions"
    onRetry={fetchSessions}
  />
) : sessions.length === 0 ? (
  <EmptyState
    title="No sessions"
    action={{ label: 'Create Session', onClick: openModal }}
  />
) : (
  sessions.map(s => <SessionCard key={s.id} session={s} />)
)}
```
