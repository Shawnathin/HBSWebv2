# Static Prototype Render Preview

Decision date: 2026-06-18

Scope: staff-facing Render preview for the original static HTML prototype. This is the recommended preview for staff who need to review the current visual direction and build the real site from the most faithful reference.

## Recommendation

Use the static prototype for staff review and planning. Keep the Next.js foundation available for engineering work, but do not use it as the staff truth source yet.

## What Gets Published

The static build copies only the staff-browsable prototype surface into `dist-static`:

- root prototype HTML pages.
- `assets/`.
- `scraped-products/`, because the prototype references a few image files from it.

It does not publish the Next.js app source, planning docs, scraper UI, node modules, or local workbench folders.

## Render Setup

Use the root `render.yaml` Blueprint or create a Static Site manually with:

```text
Service type: Static Site
Branch: feature/nextjs-foundation
Build command: npm run build:static-prototype
Publish directory: dist-static
```

The Blueprint service name is:

```text
hbs-static-prototype-preview
```

No BigCommerce credentials, API keys, or `.env` files are required.

## Staff Review URLs

- `/`
- `/pool-tables.html`
- `/austin-pool-table.html`
- `/contact-us.html`
- `/cues.html`
- `/bull-carbon-black-with-6-purple-abalone-points.html`
- `/ping-pong-tables.html`
- `/whistler-indoor-table-tennis-table.html`
- `/traeger-smokers.html`
- `/dartboards.html`

Convenience rewrites are configured for extensionless paths such as `/pool-tables` and `/austin-pool-table`, but the prototype's own links still use `.html`.

## Guardrails

- Treat this preview as prototype truth, not production architecture.
- Do not add live commerce credentials.
- Do not treat mock prices, shipping copy, availability, or generated product data as final catalog truth.
- Keep the preserved static HTML files unchanged unless a future explicit prototype-edit task says otherwise.
