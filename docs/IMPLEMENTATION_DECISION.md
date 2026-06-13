# Implementation Decision

Decision date: 2026-06-13

Scope: implementation planning for migrating the current Home Billiards static prototype shell into a maintainable headless ecommerce frontend. This document does not authorize refactoring or deleting the existing HTML files.

## Recommendation

Build a custom Next.js + TypeScript frontend backed by BigCommerce catalog/cart/checkout data, renderer manifests for pool-table visual configuration, and Render for staging/production hosting.

The production application should be a new app layer that uses the current static shell as a prototype/reference source. The current root HTML files should remain intact until dynamic parity is proven route by route.

Recommended architecture:

```text
Next.js app
  - app routes and layouts
  - React components extracted from prototype patterns
  - server actions/API routes for private operations
  - TypeScript view models for categories, PDPs, builders, cart, quote

Server-side adapter layer
  - BigCommerce storefront-safe reads
  - BigCommerce Admin/Management API calls only on the server
  - quote/contact endpoints
  - catalog normalization and validation

BigCommerce
  - products, categories, brands
  - variants, modifiers, pricing, inventory
  - carts, checkout, orders
  - product/category metafields for frontend pointers

Renderer asset system
  - external manifest JSON files
  - finish overlays, cloth masks, cloth shadow maps
  - CDN/static asset hosting
  - manifest URLs stored as BigCommerce metafield pointers

Render
  - staging web service
  - production web service later
  - environment variables for private credentials
  - deploys from GitHub
```

## Why Preserve The Static Shell

The current HTML files are not a production architecture, but they are valuable product/design evidence. They preserve page flow, category taxonomy, visual tone, builder behavior, option groupings, local-service emphasis, and hardcoded business logic hints that should inform the dynamic build.

Preserving the shell avoids losing:

- the intended home page sequence: hero, departments, Austin builder, services, resources, design-center CTA.
- the existing commerce header, mega-navigation grouping, and footer link model.
- category page interaction patterns: chips, facets, price range, sorting, empty state, load more.
- PDP/configurator patterns: gallery, sticky preview, build summary, accordions, option pricing, quote/cart split.
- Austin builder specifics: size guidance, finish families, cloth groups, add-ons, stock/custom path, render preview behavior.
- hardcoded product/category signals that need to be reconciled to real BigCommerce records.

Treat the static shell as the acceptance reference during migration. A dynamic page should be considered ready only when it preserves or intentionally improves the flow documented in `docs/FRONTEND_SHELL_AUDIT.md`.

## Chosen Stack

### Frontend

- Next.js with the App Router.
- TypeScript for data contracts and component props.
- React components organized by domain:
  - app shell.
  - catalog/category.
  - product detail.
  - configurator/builder.
  - renderer.
  - cart/quote/contact.
- Server-rendered category and product pages where possible for SEO and fast first paint.
- Client components only where interaction requires browser state: filters, option selectors, gallery controls, quote modal, renderer preview.

### Commerce Backend

- BigCommerce is the source of truth for products, categories, brands, prices, inventory, variants, modifiers, carts, checkout, and orders.
- BigCommerce Admin/Management credentials must stay server-side.
- Storefront-safe data can be requested through server-side adapters or storefront queries depending on final token/channel setup.
- Frontend price calculations are display helpers only; cart/quote submissions must be validated server-side.

### Renderer Manifests

- Renderer data should not be embedded directly into BigCommerce product descriptions or frontend code.
- BigCommerce metafields should store short pointers, such as `asset_manifest_url`, `product_group_key`, and `renderer_enabled`.
- External manifest files should describe masks, overlays, cloth values, dimensions, fallback imagery, and view slugs.
- The Austin pool table is the MVP renderer target.

### Deployment

- Render is the recommended deployment target.
- GitHub remains the source of truth.
- Use Render environment variables for BigCommerce tokens, quote/contact destinations, and asset host configuration.
- Do not commit `.env` files.

## Catalyst Position

BigCommerce Catalyst should be evaluated as a reference implementation, not adopted as the default base.

Use Catalyst for:

- understanding current BigCommerce headless patterns.
- comparing GraphQL storefront queries.
- studying cart/checkout integration details.
- checking conventions for product options, routes, and caching.

Do not default to Catalyst unless it proves useful for this specific project because:

- the existing Home Billiards shell has a custom luxury retail and builder flow.
- the Austin renderer needs custom manifests, masks, overlays, and fallback behavior.
- the category and configurator UX should preserve the prototype flow rather than conform to a generic starter storefront.
- adopting a starter base too early may create cleanup work before the data model is settled.

Decision: start from a custom Next.js app architecture. Reuse Catalyst ideas selectively after review.

## Non-Negotiable Boundaries

- Do not expose BigCommerce Admin API keys in frontend code.
- Do not commit `.env` files.
- Do not invent product facts, prices, inventory, availability, or real BigCommerce IDs.
- Use `TODO_...` placeholders for unknown product, variant, modifier, category, and metafield IDs.
- Preserve the current HTML prototype files until a planned route migration replaces them.
- Keep the scraper and pool-table rendering workbench as migration aids, not production catalog sources.

## Business Decisions To Preserve

- Do not build or include Find a Dealer, dealer locator, or store-locator functionality. If reference screenshots or product photos include Find a Dealer UI, treat it as third-party reference noise and do not add it to navigation, footer links, routes, search, or MVP scope.
- Fulfillment, availability, and shipping promise copy must be data-driven from BigCommerce/backend catalog data. `Ships in 24 business hours` is an allowed display value only when that product/category data provides it. The frontend may render `fulfillmentBadge`, `availabilityMessage`, `leadTimeLabel`, or `shippingPromise` fields, but must not apply the promise globally or create live shipping calculations yet.

## Implementation Decision Summary

The project should move forward as a custom Next.js + TypeScript headless storefront with BigCommerce as the commerce backend, renderer manifests as the product visualization layer, and Render as the hosting target. The static shell should remain a protected prototype/reference until each route has a dynamic equivalent and documented parity.
