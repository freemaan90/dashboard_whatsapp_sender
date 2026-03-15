# Performance Audit

## Target Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance Score | > 90 |
| Lighthouse Accessibility Score | > 95 |
| First Contentful Paint (FCP) | < 1500ms |
| Time to Interactive (TTI) | < 3000ms |
| Initial load time (3G) | < 2000ms |
| Total Blocking Time (TBT) | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |

## Running the Audit

### Prerequisites

Install Lighthouse CI globally:

```bash
npm install -g @lhci/cli
```

### Run the audit

1. Build and start the app:

```bash
npm run build
npm run start
```

2. In a separate terminal, run the audit:

```bash
npm run performance:audit
```

This runs `lhci autorun` using the configuration in `lighthouserc.json`.

### Manual audit (Chrome DevTools)

1. Open the app in Chrome
2. Open DevTools → Lighthouse tab
3. Select "Performance" and "Accessibility"
4. Click "Analyze page load"

## Configuration

Performance budgets are defined in `lighthouserc.json`. Assertions marked `error` will fail the CI run; those marked `warn` are advisory.

## Optimizations applied

- Code splitting via `React.lazy()` and `Suspense` for non-critical routes and heavy components
- Image optimization with Next.js `<Image>` (WebP/AVIF)
- CSS Modules (no Tailwind runtime overhead)
- `React.memo()` on frequently re-rendering components
- Virtualization for lists with > 50 items
- Gzip/Brotli compression via Next.js defaults
