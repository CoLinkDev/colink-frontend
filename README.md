# CoLink Frontend

Web interface for CoLink account and device management.

**Tech stack:** Vue 3 · TypeScript · Vite · Tailwind CSS · Pinia · vue-router · vue-i18n · Radix Vue

## Development

```sh
pnpm install
pnpm dev        # Vite dev server; /api proxied to localhost:8080
```

## Build

```sh
pnpm build      # outputs to dist/
pnpm preview    # preview production build locally
```

The production build is served as static files by `colink-server`.
