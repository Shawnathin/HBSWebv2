# Route Map

Decision date: 2026-06-13

Scope: map the current static prototype routes to proposed production routes for the future Next.js + BigCommerce storefront. This document does not change or remove existing HTML files.

## Route Principles

- Preserve the current UX flow and category intent.
- Prefer clean production URLs without `.html`.
- Keep redirects from current `.html` routes during migration.
- Let BigCommerce product/category custom URLs inform final canonical paths.
- Use dynamic route resolution where catalog URLs need to come from BigCommerce.
- Mark MVP routes separately from later routes so staging can launch with a focused surface area.

## Current Root Static Routes

| Current file | Current URL | Current role | Status |
| --- | --- | --- | --- |
| `index.html` | `/` | Home/department landing page | MVP |
| `contact-us.html` | `/contact-us.html` | Contact/showroom page | MVP |
| `pool-tables.html` | `/pool-tables.html` | Pool table category listing | MVP |
| `austin-pool-table.html` | `/austin-pool-table.html` | Austin pool table builder/PDP | MVP |
| `cues.html` | `/cues.html` | Cue category listing | Later |
| `bull-carbon-black-with-6-purple-abalone-points.html` | `/bull-carbon-black-with-6-purple-abalone-points.html` | Cue PDP/configurator | Later |
| `ping-pong-tables.html` | `/ping-pong-tables.html` | Table tennis category listing | Later |
| `whistler-indoor-table-tennis-table.html` | `/whistler-indoor-table-tennis-table.html` | Whistler table tennis PDP/configurator | Later |
| `traeger-smokers.html` | `/traeger-smokers.html` | Traeger category listing | Later |
| `dartboards.html` | `/dartboards.html` | Dartboard category listing | Later |

## Supporting Static/Tool Routes

These files should not become public production routes as-is:

| Existing path | Proposed treatment |
| --- | --- |
| `product-scraper/public/index.html` | Keep as local migration tooling only. |
| `pool-table-project-handoff-2026-05-23-v2/public/index.html` | Keep as historical render/tooling reference. |
| `pool-table-project-handoff-2026-05-23-v2/public/finish.html` | Keep as historical finish-render tooling reference. |
| `pool-table-project-handoff-2026-05-23-v2/public/cutout.html` | Keep as historical cloth-mask tooling reference. |
| `contact-us-page-export/index.html` | Treat as contact-page reference/export only. |
| `contact-us-page-export/contact-us-embed.html` | Treat as reference/embed only. |
| `backups/home-page-final-2026-05-25/index.html` | Keep as backup/reference. |

## Proposed Production Routes

| Production route | Route type | Source data | MVP |
| --- | --- | --- | --- |
| `/` | Home page | Home config + BigCommerce category/product modules | Yes |
| `/contact-us` | Contact/showroom page | Store config + contact endpoint | Yes |
| `/pool-tables` | Category alias | BigCommerce category `TODO_BC_CATEGORY_ID_POOL_TABLES` | Yes |
| `/pool-tables/austin-pool-table` | Product/builder route | BigCommerce product `TODO_BC_PRODUCT_ID_AUSTIN` + renderer manifest | Yes |
| `/search` | Search page | BigCommerce product search via adapter | Yes, basic |
| `/cart` | Cart page/drawer route | BigCommerce cart via adapter | Yes, basic |
| `/quote` | Quote submission endpoint/page | Server quote endpoint | Yes |
| `/cues` | Category alias | BigCommerce category `TODO_BC_CATEGORY_ID_CUES` | Later |
| `/cues/bull-carbon-black-with-6-purple-abalone-points` | Product route | BigCommerce product `TODO_BC_PRODUCT_ID_BULL_CARBON_PURPLE_ABALONE` | Later |
| `/ping-pong-tables` | Category alias | BigCommerce category `TODO_BC_CATEGORY_ID_PING_PONG_TABLES` | Later |
| `/ping-pong-tables/whistler-indoor-table-tennis-table` | Product route | BigCommerce product `TODO_BC_PRODUCT_ID_WHISTLER_INDOOR` | Later |
| `/traeger-smokers` | Category alias | BigCommerce category `TODO_BC_CATEGORY_ID_TRAEGER` | Later |
| `/dartboards` | Category alias | BigCommerce category `TODO_BC_CATEGORY_ID_DARTBOARDS` | Later |
| `/products/[slug]` | Generic product fallback | BigCommerce product/custom URL resolver | Later |
| `/collections/[slug]` | Generic category fallback | BigCommerce category/custom URL resolver | Later |
| `/resources/[slug]` | Editorial content | CMS/static config/BigCommerce pages, TBD | Later |
| `/services/[slug]` | Service detail pages | CMS/static config, TBD | Later |

## MVP Route Set

The MVP should focus on the smallest route set that proves the full architecture:

- `/`
- `/contact-us`
- `/pool-tables`
- `/pool-tables/austin-pool-table`
- `/search`
- `/cart`
- `/quote`

This proves:

- shared header/nav/footer.
- category data from BigCommerce.
- product-card rendering.
- a rich builder PDP.
- renderer manifest loading.
- cart/quote split.
- server-side API adapter and secure environment handling.
- Render staging deployment.

## Later Route Set

After MVP parity is stable, migrate:

- `/cues`
- `/cues/bull-carbon-black-with-6-purple-abalone-points`
- `/ping-pong-tables`
- `/ping-pong-tables/whistler-indoor-table-tennis-table`
- `/traeger-smokers`
- `/dartboards`
- generic category/product resolver routes.
- services/resource content pages.
- customer account, wishlist, and richer search if required.

## Redirect Plan

Keep the current static URLs working during migration:

| Legacy URL | Redirect target |
| --- | --- |
| `/contact-us.html` | `/contact-us` |
| `/pool-tables.html` | `/pool-tables` |
| `/austin-pool-table.html` | `/pool-tables/austin-pool-table` |
| `/cues.html` | `/cues` |
| `/bull-carbon-black-with-6-purple-abalone-points.html` | `/cues/bull-carbon-black-with-6-purple-abalone-points` |
| `/ping-pong-tables.html` | `/ping-pong-tables` |
| `/whistler-indoor-table-tennis-table.html` | `/ping-pong-tables/whistler-indoor-table-tennis-table` |
| `/traeger-smokers.html` | `/traeger-smokers` |
| `/dartboards.html` | `/dartboards` |

Final redirect status codes should be decided when launch timing and SEO preservation are confirmed. Use temporary redirects during staging and permanent redirects only after production launch approval.

## Route Implementation Notes

- Start with explicit routes for MVP pages rather than a single catch-all resolver.
- Add a catalog URL resolver later when BigCommerce product and category custom URLs are validated.
- Keep route data contracts separate from component rendering so aliases and BigCommerce URLs can share the same components.
- Do not hardcode real product/category IDs until the BigCommerce catalog audit confirms them.
