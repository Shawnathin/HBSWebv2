# Render Staging Deployment

Decision date: 2026-06-18

Scope: staging deployment notes for Home Billiards previews. The current staff-facing preview should use the original static HTML prototype. The Next.js app foundation remains available for engineering validation, but it is not the primary staff truth source yet.

For the staff prototype preview, use `docs/STATIC_PROTOTYPE_RENDER_PREVIEW.md`.

## Deployment Shape

- Render service type for staff review: Static Site.
- Runtime: Static.
- Service name: `hbs-static-prototype-preview`.
- Branch for first staff preview: `feature/nextjs-foundation`.
- Build command: `npm run build:static-prototype`.
- Publish directory: `dist-static`.
- The root `render.yaml` now points at the static prototype preview.

## GitHub / Render Setup

Use one of these paths:

1. Fast staff preview:
   - Create a new Render Static Site from `Shawnathin/HBSWebv2`.
   - Select branch `feature/nextjs-foundation`.
   - Use the build and publish settings above.
   - Keep auto-deploy enabled for commits to that branch.

2. Blueprint path:
   - In Render, create a Blueprint from the repo root `render.yaml`.
   - Confirm the generated service uses `npm run build:static-prototype` and publishes `dist-static`.

After the branch is merged to the default branch, point the staff preview at the default branch unless the team intentionally wants branch-only previews.

## Environment Variables

Only non-secret environment variables are modeled in `render.yaml`:

```text
SKIP_INSTALL_DEPS=true
```

Do not add BigCommerce, email, CRM, quote, cart, or private renderer credentials until the relevant backend adapter is implemented and reviewed. Add future secrets directly in the Render Dashboard or a protected Render environment group, never in committed files.

## Staff Preview Scope

The staging preview is suitable for:

- static homepage visual/content review.
- static pool-table category review.
- static Austin builder flow review.
- shared prototype navigation/header/footer review.
- route, copy, merchandising, and flow feedback.

It is not suitable for:

- real checkout.
- real quote submission.
- inventory promises.
- live shipping calculations.
- real BigCommerce catalog validation.

## Routes To Verify On Render

- `/`
- `/pool-tables.html`
- `/austin-pool-table.html`
- `/contact-us.html`
- `/cues.html`
- `/ping-pong-tables.html`
- `/whistler-indoor-table-tennis-table.html`
- `/traeger-smokers.html`
- `/dartboards.html`

Do not create or use `/pool_tables`.

## Known Notes

- The preserved root `.html` prototype files remain reference material and are not rewritten by this deployment.
- Fulfillment, availability, and shipping promise copy in the prototype remains mock/reference copy until catalog-backed later.
- Find a Dealer / dealer locator functionality remains out of scope for the production MVP, even if any reference material suggests it.
