# Render Staging Deployment

Decision date: 2026-06-18

Scope: first staff-accessible staging deployment for the Next.js app foundation. This deployment uses mock/prototype-derived data only. It does not connect BigCommerce, does not require real API credentials, and does not add `.env` files.

## Deployment Shape

- Render service type: Web Service.
- Runtime: Node.
- Service name: `hbs-website-2-staging`.
- Branch for first staff preview: `feature/nextjs-foundation`.
- Build command: `npm ci && npm run build`.
- Start command: `npm run start`.
- Health check path: `/`.
- Current plan in `render.yaml`: `free` to avoid accidental paid usage. Upgrade to a paid instance later if staff need the preview to avoid sleep/cold starts.

## GitHub / Render Setup

Use one of these paths:

1. Fast staff preview:
   - Create a new Render Web Service from `Shawnathin/HBSWebv2`.
   - Select branch `feature/nextjs-foundation`.
   - Use the build and start commands above.
   - Keep auto-deploy enabled for commits to that branch.

2. Blueprint path:
   - Merge this branch after review.
   - In Render, create a Blueprint from the repo root `render.yaml`.
   - Confirm the generated service uses the same build and start commands.

After the branch is merged to the default branch, point the staging service at the default branch unless the team intentionally wants branch-only previews.

## Environment Variables

Only non-secret environment variables are modeled in `render.yaml`:

```text
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

Do not add BigCommerce, email, CRM, quote, cart, or private renderer credentials until the relevant backend adapter is implemented and reviewed. Add future secrets directly in the Render Dashboard or a protected Render environment group, never in committed files.

## Staff Preview Scope

The staging preview is suitable for:

- homepage visual/content review.
- pool-table category review.
- Austin builder flow review.
- shared navigation/header/footer review.
- route and copy feedback.

It is not suitable for:

- real checkout.
- real quote submission.
- inventory promises.
- live shipping calculations.
- real BigCommerce catalog validation.

## Routes To Verify On Render

- `/`
- `/pool-tables`
- `/pool-tables/austin-pool-table`
- `/search`
- `/cart`
- `/contact-us`

Do not create or use `/pool_tables`.

## Known Notes

- The preserved root `.html` prototype files remain reference material and are not rewritten by this deployment.
- `public/assets` is a relative symlink to `../assets`; confirm images load after the first Render deploy.
- Fulfillment, availability, and shipping promise copy remains data-driven mock data in staging and must come from backend/product data later.
- Find a Dealer / dealer locator functionality remains out of scope.
