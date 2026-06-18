# HBS Website 2.0

This repository now contains a Next.js + TypeScript app foundation alongside the existing static HTML prototype.

The root `.html` files and `assets/` directory are still preserved as prototype reference material. The Next app uses mock data extracted from those files and does not connect to BigCommerce yet.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Next.js app foundation:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is already busy, use another port:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Known local watcher note: this repo intentionally preserves large prototype, asset, scraper, and renderer-tooling folders. `next.config.mjs` includes watcher ignores for those legacy folders, but some local environments may still hit `EMFILE: too many open files` in `next dev`, especially through symlinked assets. The reliable workaround is:

```bash
npm run build
./node_modules/.bin/next start --hostname 127.0.0.1 --port 3001
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Start the production Next.js server locally after a build:

```bash
npm run start
```

Build the static prototype preview locally:

```bash
npm run build:static-prototype
```

The existing scraper command is still available:

```bash
npm run scraper
```

## Next App Routes

- `/`
- `/pool-tables`
- `/pool-tables/austin-pool-table`
- `/search`
- `/cart`
- `/contact-us`

Do not create or use `/pool_tables`.

## Render Staff Preview

The repo includes `render.yaml` for a staff staging preview on Render. The default staff preview serves the original static HTML prototype, because that is the more faithful reference for the team building the real site.

Recommended Render deployment:

```text
Service type: Static Site
Branch: feature/nextjs-foundation
Build command: npm run build:static-prototype
Publish directory: dist-static
```

This static preview does not connect to BigCommerce and does not require secrets or `.env` files. Keep all future secrets in the Render Dashboard or a protected environment group, never in committed files.

See `docs/STATIC_PROTOTYPE_RENDER_PREVIEW.md` for the staff-preview checklist. The Next.js foundation remains in the repo for engineering work, but it is not the staff truth source yet.

## Integration Notes

- BigCommerce is intentionally not connected.
- No `.env` file is required or committed.
- Unknown BigCommerce IDs remain explicit `TODO_...` placeholders.
- Adapter stubs live under `src/lib/bigcommerce/` and `src/lib/renderer/`.
- Austin builder fixture data lives in `src/data/mockAustinProduct.ts`.
- Renderer fixture data lives in `src/data/mockRendererManifest.ts`.
- Pool-table category fixture data is generated from `pool-tables.html` signals in `src/data/mockPoolTablesCategory.ts`.
- Find a Dealer / dealer locator functionality is intentionally excluded.
- Fulfillment/availability/shipping promise copy is data-driven. `Ships in 24 business hours` is an allowed display value only when product/category data provides it; the frontend must not apply it globally or create live shipping calculations yet.
