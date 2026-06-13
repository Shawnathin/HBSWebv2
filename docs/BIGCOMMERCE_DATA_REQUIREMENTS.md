# BigCommerce Data Requirements

Audit date: 2026-06-13

Scope: identify the BigCommerce and adjacent content data needed to turn the current Home Billiards static shell into a dynamic custom headless ecommerce frontend.

This document does not assume the current mock prices, availability values, descriptions, or option logic are authoritative. All product facts need to be validated against BigCommerce catalog data or approved source material before launch.

## API Reference Notes

Official BigCommerce docs checked during this audit:

- [GraphQL Storefront API overview](https://docs.bigcommerce.com/developer/docs/storefront/guides/graphql-storefront-api/overview)
- [REST Admin Catalog Products](https://docs.bigcommerce.com/developer/api-reference/rest/admin/catalog/products)
- [REST Admin Catalog Categories](https://docs.bigcommerce.com/developer/api-reference/rest/admin/catalog/categories)
- [REST Admin Management Carts](https://docs.bigcommerce.com/developer/api-reference/rest/admin/management/carts)

Relevant confirmed capabilities:

- BigCommerce's GraphQL Storefront API can power headless storefronts, query catalog data for search/filter/sort experiences, request product images at requested resolutions, look up categories/brands by URL, and create/fetch carts and initiate checkout.
- Catalog product APIs cover products, category assignments, channel assignments, complex rules, custom fields, images, metafields, reviews, videos, product modifiers, variants, and variant options.
- Category APIs cover categories, category trees, images, metafields, and product sort order.
- Cart management APIs can create carts, add/update/delete line items, create redirect URLs, and manage cart-level metafields/settings.

Architecture implication: use a server-side API adapter for BigCommerce Admin/Management APIs and private tokens. Do not expose admin API keys or private credentials in frontend code.

## Core Data Domains Needed

### Storefront Shell

Needed for every page:

- Store identity: name, logo/wordmark treatment, brand text.
- Header links: contact URL, cart URL/state, search endpoint.
- Mega navigation tree: top-level categories, child categories, featured links, feature-card images, labels, URLs.
- Footer columns: navigation links, category links, brand links, social links, copyright year.
- Store contact information: address, phone, email.
- Channel/site settings: canonical domain, currency, locale, image URL strategy.

Potential source:

- BigCommerce category trees and brands for commerce navigation.
- BigCommerce channel menus or a small CMS/config store for editorial mega-menu labels and feature blocks.
- Server-side adapter endpoint such as `GET /api/nav` and `GET /api/footer`.

### Catalog Product Card

Every listing card needs:

- BigCommerce product ID.
- Stable slug/path/custom URL.
- Product name.
- Brand name and brand ID.
- Category IDs and category slugs.
- Primary image with alt text.
- Price, sale price, retail/MSRP/compare-at price when available.
- Currency.
- Inventory/availability state.
- Purchasability state: add to cart, choose options, request quote, preorder, out of stock.
- Badges: sale, in stock, custom order, new arrival, pro series, etc.
- Sort data: featured rank, category sort order, delivery rank or availability rank.
- Filter attributes: brand, type, size, series, use case, category, availability, price range.
- Optional swatches/colors shown on cards.
- Short merchandising copy/meta line.

Potential source:

- Storefront GraphQL for shopper-safe product/listing data.
- Catalog Admin APIs on the server for custom fields/metafields that are not available in the storefront query.
- Product/category metafields for merchandising attributes.

### Product Detail Page

Every PDP needs:

- Product ID, variant IDs, SKU(s), URL path.
- Product name, brand, category breadcrumbs.
- Description and structured detail sections.
- Product facts/spec badges.
- Full image gallery with alt text and sort order.
- Videos if present.
- Pricing and sale/MSRP data.
- Inventory, preorder, quote-only, and stock messages.
- Variant options and modifier options.
- Required/optional add-ons.
- Related products and collection products.
- SEO title/description and canonical URL.

Potential source:

- Storefront GraphQL for shopper-facing product data and images.
- Catalog Products, Product Images, Product Variants, Product Variant Options, Product Modifiers, Product Custom Fields, and Product Metafields via the server adapter.

### Cart And Quote

Needed for cart-capable products:

- BigCommerce `product_id`.
- BigCommerce `variant_id` when option combinations resolve to variants.
- Modifier selections and modifier value IDs.
- Quantity.
- Custom line-item text/metadata if used for build notes.
- Cart ID/session ID.
- Checkout or cart redirect URL.

Needed for quote-only or hybrid builder flows:

- Full selected build JSON.
- Product ID and human-readable product name.
- Selected options with labels and internal IDs.
- Calculated display price or quote-required flag.
- Customer name, phone, email, notes.
- Source page/URL.
- Optional attachments later: room photos, finish samples, plans.
- Lead destination: CRM, email, BigCommerce quote app, or custom backend.

Important: BigCommerce cart data must be validated server-side. Frontend calculations should be treated as display helpers only.

## Page-Specific Requirements

### Home Page: `index.html`

Current modules:

- Hero with CTAs.
- Department grid.
- Featured Austin builder.
- Service tiles.
- Resource cards.
- Design center CTA.

Needed data:

- Featured departments/categories:
  - category ID/slug/title.
  - hero/card image.
  - short copy.
  - CTA URL.
- Featured product or collection:
  - Austin product ID.
  - current price or "from" price.
  - product image/render.
  - option summary: stock/custom, finishes, cloth, package.
- Services:
  - service title, eyebrow, copy, image, URL.
  - whether service is quote/contact only.
- Resources:
  - article/page title, excerpt, image, URL, category/eyebrow.
- Design center CTA content.

Likely sources:

- BigCommerce categories and products for commerce modules.
- CMS/static config for editorial copy, services, resources, and homepage merchandising order.

### Contact Page: `contact-us.html`

Current modules:

- Showroom location.
- Hours.
- Google review link.
- Contact form.
- Popular contact reasons.

Needed data:

- Store address, phone, email, map/search URL.
- Hours by day and holiday exceptions.
- Contact topics list.
- Form fields and validation rules.
- Lead routing destination.
- Service/contact reason cards.
- Response target copy.

Likely sources:

- Store config/CMS, not necessarily BigCommerce catalog.
- Backend endpoint `POST /api/contact`.

### Pool Tables Category: `pool-tables.html`

Current mock data:

- 106 generated products.
- Brands: California House, Canada Billiard, Olhausen.
- Filters: top filter, brand, availability, size, price.
- Sort: featured, price low/high, fastest delivery.
- Load more: 24 at a time.

Needed data:

- Category ID(s) for pool tables and subcategories.
- Product list for the pool table category.
- Brand data and brand images if needed.
- Product images for cards.
- Product custom URLs.
- Real price/from-price/quote-only state.
- Inventory and availability:
  - in stock.
  - custom order.
  - preorder.
  - out of stock.
  - quote required.
- Sizes available per table:
  - 7 ft, 8 ft, 9 ft, custom/other.
- Finish availability and swatch preview data.
- Product badges:
  - In stock.
  - Custom build.
  - Made in Canada.
  - Room review.
  - Sale.
- Featured rank/category sort order.
- Delivery rank or delivery messaging.
- Per-product action label:
  - Customize.
  - View details.
  - Request quote.
  - Preview card.
- Product detail page mapping.

Suggested BigCommerce modeling:

- Brand as BigCommerce brand.
- Size as variant option when it changes SKU/inventory/price.
- Finish as variant option if stock tracked per finish, otherwise modifier/custom field/metafield.
- Swatch colors/images as option values or product/category metafields.
- Quote-only/custom-order flags as product or variant metafields.
- Category sort order through BigCommerce category/product sort data.

### Austin Pool Table Builder: `austin-pool-table.html`

Current hardcoded data:

- 4 sizes.
- 16 finishes.
- 43 cloth options.
- 4 add-ons.
- 1 stock package.
- 8 gallery entries.
- 3 Austin collection related products.
- Client-side quote modal.

Needed data:

- Austin product ID, SKU(s), BigCommerce URL.
- Product description and facts.
- Gallery images and generated finish renders.
- Render mapping by finish:
  - finish ID/slug.
  - finish name.
  - finish family/group: Maple or Oak.
  - swatch image.
  - render image URL.
  - rail/grain colors if still needed for preview fallback.
  - upcharge/MSRP upcharge.
  - availability/status.
- Size options:
  - option ID.
  - label.
  - base price.
  - MSRP/retail price.
  - recommended room.
  - play feel.
  - quote-only flag.
  - variant ID if size is variant-backed.
- Cloth options:
  - option/modifier ID.
  - family.
  - name.
  - hex color.
  - swatch asset if available.
  - upcharge/MSRP upcharge.
  - availability.
- Add-ons:
  - add-on product ID or modifier ID.
  - label.
  - price/MSRP.
  - quote-only flag.
  - badge.
  - description.
  - compatibility rules.
- Stock packages:
  - package ID.
  - linked variant/product IDs.
  - fixed size/finish.
  - available quantity.
  - delivery/ETA messaging.
- Austin collection:
  - real BigCommerce product IDs for pool table, shuffleboard, and game table.
  - image, URL, price/quote status, category.
- Cart payload mapping:
  - product ID.
  - variant ID.
  - modifier selections.
  - selected add-on line items.
  - build summary metadata.
- Quote payload mapping:
  - same selected build data plus contact fields and room notes.

Open modeling decision:

- Do not assume every Austin option should become a variant. Size and finish may need variants if they change SKU, price, or inventory. Cloth and add-ons may fit better as modifiers, add-on products, or quote metadata. The final model should be chosen after the real BigCommerce catalog is audited to avoid a combinatorial variant explosion.

### Cues Category: `cues.html`

Current hardcoded data:

- 15 products.
- Filters: pool, snooker, break, Bull Carbon, Predator, new arrivals.
- Facets: brand, availability, type.
- Price max: `$2,000`.

Needed data:

- Cue category and subcategory IDs.
- Product IDs and URLs.
- Brands:
  - Bull Carbon.
  - BCE.
  - Dufferin.
  - Koda.
  - K2.
  - Predator.
- Product type:
  - pool cue.
  - snooker cue.
  - break cue.
  - butt only.
- Collections:
  - new arrivals.
  - sale if applicable.
- Price and availability.
- Images and alt text.
- Swatch/visual attributes.
- Actual PDP URLs.

Data gap:

- `Product card assets/cues/products/` markdown lists brand as `Unknown`; these records need to be reconciled to real BigCommerce brands.
- The Bull Carbon PDP exists locally, but the cue category card currently does not link to it.

### Bull Carbon Cue PDP: `bull-carbon-black-with-6-purple-abalone-points.html`

Current hardcoded data:

- Base product price: `$1,999`.
- Weight options: 18, 19, 20, 21 oz.
- Shaft options: LD4 11.75 mm, LD5 12.25 mm.
- Tip options: Kamui Black Soft, Kamui Black Medium.
- Accessories: case, chalk, shaft care kit.

Needed data:

- Product ID, SKU, variant IDs.
- Product gallery images stored in BigCommerce or an approved asset store.
- Weight option values and inventory/price impact.
- Shaft option values and inventory/price impact.
- Tip option values and inventory/price impact.
- Accessory products or modifiers with product IDs and prices.
- Required/optional option rules.
- Product specs/facts:
  - joint.
  - wrap.
  - shaft compatibility.
  - construction notes.
- Related products/categories.
- Cart payload for configured cue.

Suggested modeling:

- Weight/shaft may be variant options if they affect SKU or inventory.
- Tip can be modifier if it is a service/preference rather than stocked SKU.
- Accessories should likely be separate products added as additional line items.

### Ping Pong Category: `ping-pong-tables.html`

Current hardcoded data:

- 7 products.
- Top filters: all, indoor, outdoor.
- Facets: category, delivery, use.
- Uses: family, tournament, playback, conversion.
- Price max: `$2,500`.

Needed data:

- Category IDs for table tennis/ping pong tables.
- Product IDs, URLs, images.
- Indoor/outdoor category or custom attribute.
- Use-case attributes:
  - family.
  - tournament.
  - playback.
  - conversion.
- Delivery rank/availability.
- Top color swatches.
- Price and inventory.
- Accessory relationships.

Data gap:

- The Whistler PDP exists locally, but listing cards currently link to `#` and clicks are prevented.

### Whistler PDP: `whistler-indoor-table-tennis-table.html`

Current hardcoded data:

- Base price: `$1,500`.
- Top colors: Blue, Green.
- Accessories: fitted cover, paddle set, training ball pack, replacement net set.
- Installation: no installation, add installation.
- Product detail sections sourced from scraper/prototype copy.

Needed data:

- Product ID, SKU, variants.
- Gallery images and alt text.
- Tabletop color option:
  - variant or modifier IDs.
  - color names and swatches.
  - inventory/availability if color-specific.
- Accessories:
  - product IDs.
  - prices.
  - inventory.
  - add-to-cart relationship.
- Installation:
  - service product or modifier ID.
  - price.
  - eligibility by location if needed.
- Product specs:
  - indoor/weatherproof status.
  - tabletop material/thickness.
  - frame profile.
  - undercarriage.
  - net.
  - locking system.
  - wheel specs.
- Related products.
- Cart and quote payload mapping.

### Traeger Category: `traeger-smokers.html`

Current hardcoded data:

- 13 Traeger cards, each with live product URL, remote BigCommerce CDN image, badge(s), price, action label, and description.
- Visual filters for series/features exist but do not function.

Needed data:

- Traeger category ID and subcategory IDs.
- Product IDs, variants, URLs.
- Series:
  - Woodridge.
  - Ironwood.
  - Timberline.
  - Pro Series.
  - Portable.
  - Flat Top.
- Feature attributes:
  - WiFIRE connected.
  - Super Smoke.
  - Sear station.
  - fastest delivery.
  - cabinet, griddle, insulated, etc. if retained.
- Price, sale price, retail/MSRP, preorder state.
- Inventory/availability and fulfillment messaging.
- Add-to-cart vs choose-options vs preorder state.
- Primary images and alt text.
- Product descriptions/card meta.
- Sort data and featured rank.

Suggested source:

- BigCommerce category products via the storefront query.
- Product custom fields/metafields for series/features that are not first-class BigCommerce fields.

### Dartboards Category: `dartboards.html`

Current hardcoded data:

- 8 products.
- Top filters: Winmau, Blade 6, professional, home setup.
- Facets: brand, availability, type.
- Price max: `$250`.

Needed data:

- Dartboard category ID.
- Product IDs, brands, URLs, images.
- Product type:
  - professional.
  - home.
  - signature.
  - set.
- Availability:
  - stock.
  - special order.
- Series/category tags:
  - Blade 6.
  - professional.
  - home setup.
- Price, sale/MSRP if applicable.
- Product badges and swatches if retained.

Data gap:

- Product URLs are all placeholders and card clicks are prevented.

## Search Requirements

Current state:

- Search exists in the header but only prevents form submission.

Needed data and behavior:

- Query products by text.
- Filter by category/brand/type.
- Return product name, image, price, URL, availability.
- Include content/resource pages if desired.
- Preserve search term in URL or state.
- Server adapter endpoint: `GET /api/search?q=...`.

Potential source:

- BigCommerce Storefront GraphQL search/filter capabilities.
- Optional external search later if catalog grows and richer search is needed.

## Wishlist Requirements

Current state:

- Heart icons are visual only.

Needed data and behavior:

- Anonymous wishlist/session save or customer-auth wishlist.
- Product ID and variant/options if needed.
- Add/remove/toggle endpoint.
- Customer login integration if persistent wishlists are required.

Potential source:

- BigCommerce wishlist/customer APIs if available for the chosen frontend/auth model, or custom app storage.

## Recommended Adapter Endpoints

These are frontend-facing endpoints for the future custom app. They should be implemented server-side so BigCommerce credentials stay private.

- `GET /api/nav`
  - returns header/footer navigation, mega-menu groups, featured nav cards.
- `GET /api/home`
  - returns home merchandising modules.
- `GET /api/categories/:slug`
  - returns category metadata, filters, products, sort options, pagination.
- `GET /api/products/:slug`
  - returns PDP data, gallery, options, related products.
- `GET /api/products/:slug/configurator`
  - returns rich builder data for Austin-style configurators if kept separate from standard PDP payloads.
- `POST /api/cart`
  - validates selected product/options, creates or updates BigCommerce cart, returns cart state/redirect URL.
- `POST /api/quote`
  - saves quote-only or hybrid build requests.
- `POST /api/contact`
  - submits contact form.
- `GET /api/search`
  - returns product/content search results.

## Data Modeling Checklist

Before building the dynamic frontend, confirm:

- BigCommerce store hash and channel/site configuration.
- Final category tree and URLs.
- Product IDs and slugs for every hardcoded prototype product.
- Brand records for all represented brands.
- Whether products are simple, variant-backed, modifier-backed, quote-only, or hybrid.
- Which attributes are filters:
  - brand.
  - category.
  - product type.
  - series.
  - size.
  - finish.
  - cloth family.
  - use case.
  - availability.
  - delivery rank.
- Which fields belong in:
  - BigCommerce native fields.
  - variants/options/modifiers.
  - custom fields.
  - metafields.
  - external CMS/config.
- Real price, sale price, MSRP, and currency.
- Inventory/availability source of truth.
- Product image source of truth.
- Generated pool-table render storage and naming convention.
- Quote-only rules and lead destination.
- Cart line item metadata strategy for configured builds.
- SEO fields and redirects from old/static URLs.

## Highest-Priority Data Gaps

1. Confirm real BigCommerce product IDs for every current hardcoded product/card.
2. Reconcile `Product card assets/` markdown with catalog records and real brands.
3. Replace generated/mock pool table prices, availability, and sizes with catalog-backed data.
4. Decide Austin option modeling: variants vs modifiers vs metafields vs quote metadata.
5. Connect listing cards to real PDP URLs.
6. Normalize Traeger data currently embedded as live `homebilliards.ca` links and CDN images.
7. Define quote/contact backend destinations.
8. Decide whether editorial content/resources live in BigCommerce pages/blog, a CMS, or local config.
9. Define secure env var and token handling for Render deployment.
10. Set cache and revalidation strategy for category/product pages.

## Security Requirements

- Never expose BigCommerce Admin API tokens in frontend code.
- Never commit `.env` files.
- Keep private tokens on the server/adapter layer.
- Use least-privilege API credentials.
- Validate cart/quote payloads server-side against BigCommerce product/option data.
- Treat client-side price calculations as display-only.
- Redact contact/quote personally identifiable information from logs.
- Add webhook or scheduled revalidation strategy for product/category data changes.

## Migration Sequence For Data Integration

1. Create a catalog map from prototype product slugs to BigCommerce product IDs.
2. Build read-only category adapter for one category.
3. Migrate `pool-tables.html` data contract first because it exposes the broadest catalog model.
4. Build a standard product-card component against real category data.
5. Build a standard PDP contract using Whistler or Bull Carbon as a smaller test case.
6. Build Austin configurator contract after BigCommerce option modeling is decided.
7. Wire cart creation for simple/configured products.
8. Wire quote-only build submission.
9. Wire search, contact, and wishlist.
10. Add caching, preview/staging, and data validation before replacing static files.
