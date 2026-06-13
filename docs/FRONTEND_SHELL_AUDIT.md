# Frontend Shell Audit

Audit date: 2026-06-13

Repository: `Shawnathin/HBSWebv2`

Scope: audit the existing static/mockup shell as reference material for a future Home Billiards custom headless ecommerce frontend. This document does not propose deleting or rewriting the current prototype files. It records what exists, what UX/data signals should be preserved, and where the prototype implies reusable frontend components.

## Executive Summary

The repository is a static prototype shell, not a production architecture. The current HTML files preserve desired page flow, visual direction, navigation structure, product/category merchandising, product-builder interactions, and business logic hints.

The live shell is made of ten root-level HTML routes:

- `index.html`
- `contact-us.html`
- `pool-tables.html`
- `austin-pool-table.html`
- `cues.html`
- `bull-carbon-black-with-6-purple-abalone-points.html`
- `ping-pong-tables.html`
- `whistler-indoor-table-tennis-table.html`
- `traeger-smokers.html`
- `dartboards.html`

Most pages duplicate the same header, search bar, mega navigation, footer, CSS blocks, product grid patterns, and small interaction scripts. One shared stylesheet exists at `assets/mobile-overrides.css`, but the core layout/styling is embedded per page.

There are three major data sources inside the repo:

- Hardcoded data inside HTML scripts and markup.
- Product-card markdown and images in `Product card assets/`.
- Scraped product exports in `scraped-products/`.

There is also a separate pool-table image/rendering workbench in `pool-table-project-handoff-2026-05-23-v2/`. It should be treated as supporting asset/data tooling, not as the main frontend.

## Top-Level File Structure

### Root Files

- `AGENTS.md` - repository operating instructions. Read first for this audit.
- `index.html` - home page shell.
- `contact-us.html` - current contact page shell.
- `pool-tables.html` - pool table category listing and client-side filtering.
- `austin-pool-table.html` - Austin pool table product builder/configurator.
- `cues.html` - cue category listing and client-side filtering.
- `bull-carbon-black-with-6-purple-abalone-points.html` - cue product-detail configurator.
- `ping-pong-tables.html` - table tennis category listing and client-side filtering.
- `whistler-indoor-table-tennis-table.html` - table tennis product-detail configurator.
- `traeger-smokers.html` - Traeger category listing with fully hardcoded product cards.
- `dartboards.html` - dartboard category listing and client-side filtering.
- `package.json` - minimal package file with one script: `npm run scraper`.
- `PRODUCT_SCRAPER_README.md` - instructions for the local product scraper.
- `START_PRODUCT_SCRAPER.command` - launcher for scraper.
- `HANDOFF_READ_ME_FIRST.md`, `WEBSITE_HANDOFF.md` - project handoff notes.
- `.DS_Store` - macOS artifact.

### Main Directories

- `assets/`
  - Current visual assets used by root HTML pages.
  - Contains hero images, category images, service/resource images, product images, Austin gallery/renders, finish swatches, and one shared `mobile-overrides.css`.
- `Product card assets/`
  - Product-card source assets grouped by `cues`, `dartboards`, and `ping-pong-tables`.
  - Each group has `images/` and `products/` markdown files.
- `scraped-products/`
  - Output from the local scraper.
  - Contains `catalog.json` plus product folders with `product.json`, `product.md`, and downloaded images.
- `product-scraper/`
  - Local Node scraper app and browser UI.
- `pool-table-project-handoff-2026-05-23-v2/`
  - Separate local app/data workspace for collecting pool table images, cutting cloth masks, and creating finish renders.
- `contact-us-page-export/`
  - Standalone exported contact page assets and embed.
- `backups/`
  - Includes a saved home page snapshot under `home-page-final-2026-05-25/`.

## Routes And Pages

| Route | File | Current Role | Dynamic Data Needed Later |
| --- | --- | --- | --- |
| `/` | `index.html` | Home/department landing page with hero, departments, featured Austin builder, services, resources, design-center CTA. | Category tree, featured products/categories, promotional blocks, services/content, resource/blog entries, store contact data. |
| `/contact-us.html` | `contact-us.html` | Contact/showroom page with address, hours, review link, form, contact reasons. | Store location/hours/contact settings, form topic taxonomy, quote/contact submission endpoint. |
| `/pool-tables.html` | `pool-tables.html` | Pool table category listing. Generates 106 products from brand slug lists. | BigCommerce category/products, brand data, pricing, inventory/availability, size filters, finish data, product images, product URLs. |
| `/austin-pool-table.html` | `austin-pool-table.html` | Deep configurator for the California House Austin pool table. | Product, variant/modifier model, option pricing, finish/cloth/add-on data, generated render assets, stock package data, quote/cart API. |
| `/cues.html` | `cues.html` | Cue category listing with 15 inline products. | Category/products, brand/type filters, price, stock/order status, images, actual PDP URLs. |
| `/bull-carbon-black-with-6-purple-abalone-points.html` | `bull-carbon-black-with-6-purple-abalone-points.html` | Cue PDP/configurator with weight, shaft, tip, accessory choices. | Product, images, variants/modifiers for weight/shaft/tip, add-on products, availability, cart/quote flow. |
| `/ping-pong-tables.html` | `ping-pong-tables.html` | Ping pong/table tennis category listing with 7 inline products. | Category/products, indoor/outdoor filters, usage filters, price, images, actual PDP URLs. |
| `/whistler-indoor-table-tennis-table.html` | `whistler-indoor-table-tennis-table.html` | Whistler PDP/configurator with tabletop color, accessories, installation. | Product, images, options/modifiers, installation service option, accessory products, cart/quote flow. |
| `/traeger-smokers.html` | `traeger-smokers.html` | Traeger category page with 13 hardcoded product cards. | BigCommerce Traeger category/products, series/features filters, sale/list price, stock/preorder status, product URLs, add-to-cart status. |
| `/dartboards.html` | `dartboards.html` | Dartboard category listing with 8 inline products. | Category/products, brand/type/availability filters, price, images, actual PDP URLs. |

Routes are currently file-based. There is no router, framework, shared layout file, or server-side page rendering layer.

## Current UX Flow

### Global Header And Navigation

Every root HTML page carries a commerce header with:

- Home Billiards wordmark.
- Search form.
- Contact button.
- `My Cart` link pointing to `#`.
- Horizontal category nav.
- Large mega menu content for Billiards, Ping Pong, BBQ, Foosball, Darts, Games, Commercial, plus simple links for New Arrivals, Sale, and Made in Canada.

Search forms currently call `preventDefault()` and do not query data. The cart link is a placeholder. Many mega-menu child links are placeholders (`#`), but their labels are useful taxonomy hints.

### Home Page Flow

`index.html` presents:

- Hero with CTAs to pool tables, Austin builder, and contact/showroom.
- Department grid for Billiards, Ping Pong, Traeger Grills, Darts, and Cues.
- Featured Austin builder block with facts for in-stock/custom, finishes, cloth, and package.
- Service tiles for design help, moving, recovering, and commercial game rooms.
- Resource cards for planning/buying-guide content.
- Design center CTA.

The home page is a strong reference for future homepage modules and merchandising slots.

### Category Listing Flow

`pool-tables.html`, `cues.html`, `ping-pong-tables.html`, and `dartboards.html` share a repeated category page pattern:

- Category hero.
- Toolbar with title, result count, and sort select.
- Top filter chips.
- Facet sidebar.
- Price range control.
- Product grid.
- Empty-state message.
- Client-side render/filter/sort script.

`pool-tables.html` additionally has load-more pagination, initially showing 24 of 106 generated products.

`traeger-smokers.html` visually follows the same category pattern but the 13 product cards are static HTML. The filter chips, sort select, and facet controls are present visually but do not filter the cards.

### Product Detail / Configurator Flow

`austin-pool-table.html`, `bull-carbon-black-with-6-purple-abalone-points.html`, and `whistler-indoor-table-tennis-table.html` share a product configurator pattern:

- Sticky/side preview column.
- Thumbnail gallery.
- Main product image.
- Build summary panel.
- Product intro.
- Option accordion.
- Price recalculation.
- Quote and add-to-cart actions.
- Related products/cards.

The Austin builder is the most developed flow and includes a modal form for saving a build/quote request. The Bull Carbon and Whistler pages use quote/cart anchor links pointing to `#`.

## Duplicated Layouts And Reusable Components Implied

The HTML strongly implies these future components:

- `CommerceHeader`
- `SearchBar`
- `MegaNavigation`
- `MegaMenu`
- `MegaMenuGroup`
- `MegaMenuFeature`
- `SiteFooter`
- `CategoryHero`
- `CategoryToolbar`
- `FilterChip`
- `FacetPanel`
- `PriceRangeFilter`
- `SortSelect`
- `ProductGrid`
- `ProductCard`
- `BadgeRow`
- `SwatchList`
- `WishlistButton`
- `EmptyState`
- `LoadMore`
- `DepartmentCard`
- `ServiceTile`
- `ResourceCard`
- `HelpBand`
- `ProductGallery`
- `ProductPreviewStage`
- `BuildSummary`
- `ConfiguratorAccordion`
- `OptionCard`
- `FinishSwatchGrid`
- `ClothSwatchGrid`
- `AddOnSelector`
- `PurchasePanel`
- `QuoteModal`
- `ContactForm`
- `FooterColumn`

Repeated CSS appears directly inside each page. `assets/mobile-overrides.css` is the only shared stylesheet currently referenced and only handles responsive overrides.

## Hardcoded Product And Category Data

### Navigation Taxonomy

The mega nav hardcodes a broad future category tree:

- Billiards: pool tables, cues, balls, racks, cloth, lights, table covers, play packages, brands.
- Ping Pong: indoor/outdoor/competition/foldable tables, paddles, balls, nets, robots, covers, storage, family/club/commercial/Made in Germany groupings.
- BBQ: Traeger smokers, pellet grills, pizza ovens, portable grills, pellets, sauces, rubs, grill covers, tools, thermometers, cleaning.
- Foosball, Darts, Games, Commercial, New Arrivals, Sale, Made in Canada.

Most child links are placeholders and should become category, brand, or content URLs from BigCommerce/CMS data.

### Pool Tables

`pool-tables.html` hardcodes `productCatalog` by brand:

- California House: 14 slugs.
- Canada Billiard: 52 slugs.
- Olhausen: 40 slugs.
- Total generated products: 106.

The page uses generated data rather than real product facts for:

- Prices: computed from brand base price plus a formula.
- Availability: computed from index and brand.
- Size availability: computed from index and brand.
- Product names: generated from slugs.
- Product image path: `assets/pool-table-products/{brandId}/{slug}.png`.
- Featured products: Austin, Menlo, La Condo, Encore.

Only Austin links to a real product page. Other cards link to `#`, and clicks on placeholder cards are blocked.

Important: pool table prices/availability/sizes in this page should be treated as mock display logic, not authoritative product facts.

### Austin Pool Table Builder

`austin-pool-table.html` hardcodes:

- 4 sizes: 7 Foot, 8 Foot, 9 Foot, Custom Size.
- 16 California House finishes.
- 43 cloth options across Championship Invitational and Championship Tour Edition.
- 4 add-ons: Matching Dining Top, Matching Bench Set, Premium Table Lighting, Designer Finish Review.
- 1 stock package: 8ft Truffle, fastest delivery.
- 8 gallery entries.
- 3 Austin collection related products with placeholder IDs:
  - `bc-austin-pool-table`
  - `bc-austin-shuffleboard-table`
  - `bc-austin-game-table`

The builder computes subtotal, MSRP comparison, optional promo price, quote-only states, selected build summary, preview render, cloth overlay color, and quote/cart modal state entirely client-side.

### Cues

`cues.html` hardcodes 15 products with fields for:

- `id`, `name`, `brand`, `brandId`, `url`, `price`, `priceLabel`, `availability`, `category`, `type`, `deliveryRank`, `meta`, `badges`, `collections`, `featured`, `image`, `swatches`.

Brands represented in the inline array:

- Bull Carbon
- BCE
- Dufferin
- Koda
- K2
- Predator

The separate `Product card assets/cues/products/` folder also contains 15 markdown files with title, price, and `brand: "Unknown"`. Those markdown files should be reconciled with real BigCommerce product IDs and brand records.

The Bull Carbon PDP exists, but the category card currently uses `url: "#"`, so the listing does not navigate to the PDP yet.

### Bull Carbon PDP

`bull-carbon-black-with-6-purple-abalone-points.html` hardcodes:

- Base price: `$1,999`.
- Remote image URLs from BigCommerce CDN and Shopify CDN.
- 4 weights: 18 oz, 19 oz, 20 oz, 21 oz.
- 2 shafts: LD4 11.75 mm, LD5 12.25 mm.
- 2 tips: Kamui Black Soft, Kamui Black Medium.
- 3 accessories: Hard Cue Case, Premium Chalk Pack, Shaft Care Kit.
- Product detail copy and related mini-cards.

All option selections and price additions are local JavaScript only.

### Ping Pong

`ping-pong-tables.html` hardcodes 7 products:

- Whistler Indoor Table Tennis Table.
- Plaza Outdoor Table Tennis Table.
- Portland Outdoor Table Tennis Table.
- Portland Outdoor Table Tennis Table Gen 1.
- Expo Outdoor Table Tennis Table.
- Portland Indoor Table Tennis Table.
- Table Tennis Conversion Top.

Each product includes brand, image, price, category, delivery rank, uses, color swatches, badge, meta, and featured state.

The category cards render as links to `#`, and clicks are prevented, so the Whistler PDP is not currently reached from the listing grid even though it exists.

### Whistler PDP

`whistler-indoor-table-tennis-table.html` hardcodes:

- Base price: `$1,500`.
- Gallery images from `scraped-products/ping-pong-table/whistler-indoor-table-tennis-table/`.
- 2 tabletop colors: Blue, Green.
- 4 accessories: Fitted Table Cover, Premium Paddle Set, Training Ball Pack, Replacement Net Set.
- 2 installation options: No Installation, Add Installation.
- Product facts and spec sections for best use, tabletop, undercarriage, net, and safety.

All option selections and price additions are local JavaScript only.

### Dartboards

`dartboards.html` hardcodes 8 products:

- Winmau Blade X Official PDC Dartboard.
- Winmau Blade 360 Dartboard.
- Winmau Blade 6 Triple Core Professional Dartboard.
- Winmau Equalizer Dartboard.
- Winmau Blade 6 Dual Core Professional Dartboard.
- Winmau Blade 6 Professional Dartboard.
- Winmau MvG Diamond Dartboard.
- Swiftflyte Razr Premium Dartboard Set.

Fields mirror the cues listing: brand, brandId, url, price, availability, category/type, delivery rank, meta, badges, image, swatches.

All product URLs are currently `#`, and card clicks are prevented.

### Traeger

`traeger-smokers.html` hardcodes 13 product cards directly in HTML:

- Traeger Pro Series 575 Wood Pellet Grill.
- Traeger Timberline XL Wood Pellet Grill.
- Traeger Ironwood 650 Wood Pellet Grill.
- Traeger Flatrock 3 Zone.
- Traeger Woodridge Elite.
- Traeger Woodridge Pro.
- Traeger Woodridge.
- Traeger Ironwood XL Wood Pellet Grill.
- Traeger Ironwood Wood Pellet Grill.
- Traeger Timberline Wood Pellet Grill.
- Traeger Ranger Portable Wood Pellet Grill.
- Traeger Tailgater Wood Pellet Grill.
- Traeger Pro Series 780 Wood Pellet Grill.

The page uses remote `cdn11.bigcommerce.com` image URLs and product links to `homebilliards.ca`. Prices, badges, descriptions, action labels, and sale/stock/preorder states are hardcoded in markup.

### Contact Data

`contact-us.html` hardcodes:

- Address: 1644 SE Marine Drive, Vancouver, BC, Canada, V5P 2R6.
- Phone/email in footer: 604 321 5553, info@homebilliards.ca.
- Hours: Monday-Friday 9am-5pm, Saturday 10am-4pm, Sunday closed.
- Contact topics and service/support reasons.
- Google review link.

The contact form prevents default submission and has no backend.

## Asset Inventory

### `assets/`

Current assets include:

- General hero and service/resource assets.
- Category hero imagery for pool tables, ping pong, Traeger, darts, cues.
- Product images for cues, dartboards, ping pong, pool tables.
- California House Austin renders: 16 finish render PNGs.
- California House finish swatches: 16 JPGs.
- Austin gallery images: 7 JPGs.
- Cloth mask/alpha assets for Austin and Menlo.
- `mobile-overrides.css`.

Top-level asset group counts from the audit:

- `assets/california-house-finishes`: 16 files.
- `assets/california-house-austin-renders`: 16 files.
- `assets/cue-products`: 15 files.
- `assets/dartboard-products`: 8 files.
- `assets/ping-pong-products`: 7 files.
- `assets/austin-gallery`: 7 files.
- `assets/traeger-categories`: 6 files.
- `assets/pool-table-categories`: 3 files.
- `assets/ping-pong-categories`: 3 files.

### `Product card assets/`

Product-card asset counts:

- Cues: 15 product markdown files, 15 images.
- Dartboards: 8 product markdown files, 8 images.
- Ping pong tables: 7 product markdown files, 7 images.

These files appear to be source/reference data for card generation rather than currently imported by the root HTML pages.

### `scraped-products/`

`scraped-products/catalog.json` records 2 scraped products:

- Whistler Indoor Table Tennis Table.
  - Source URL: `https://homebilliards.ca/ping-pong/whistler-indoor-table-tennis-table`
  - 12 downloaded image candidates.
- Legacy Baylor Nutmeg.
  - Source URL includes a Home Billiards pool-table URL/search query.
  - 9 downloaded images plus product content.

Each product folder includes `product.json`, `product.md`, and downloaded images.

### `pool-table-project-handoff-2026-05-23-v2/`

This is a supporting app/workbench. Its handoff states:

- Imported product images: 106 tables total.
- California House finish swatches: 16.
- California House cloth cutouts: 14 approved PNG cutouts.
- AI wood finish renders complete for Atherton and Austin: 32 total renders.

Key app files:

- `server.js`
- `public/index.html`, `public/app.js`, `public/styles.css`
- `public/finish.html`, `public/finish.js`, `public/finish.css`
- `public/cutout.html`, `public/cutout.js`, `public/cutout.css`
- `tools/california-house-finish-prep.js`
- `tools/california-house-render-finishes.js`

This workspace also contains unusual folder names with backslashes and typoed vendor names. Treat it as historical/tooling material until normalized in a planned migration.

## Scripts And Local Apps

### Root `package.json`

The root package is minimal:

- `name`: `hbs-product-scraper`
- `type`: `module`
- script: `scraper` -> `node product-scraper/server.mjs`

No production frontend framework, build system, test command, lint command, or dev server is configured for the root site.

### Product Scraper

`product-scraper/server.mjs` runs a local scraper UI on `127.0.0.1:4177` by default.

Capabilities:

- Serves static UI from `product-scraper/public`.
- Accepts product detail URLs.
- Extracts page title, metadata, JSON-LD product data, descriptions, and images.
- Downloads images.
- Writes `scraped-products/catalog.json`.
- Writes per-product `product.json`, `product.md`, and images.

The scraper is useful as a migration aid but should not become the production catalog source.

### Pool Table Image Workbench

`pool-table-project-handoff-2026-05-23-v2/server.js` is a separate local app, not the storefront.

Capabilities from the handoff:

- Import vendor/store product images.
- Create cloth cutouts.
- Generate finish render batches.
- Store render manifests and assets.

This can inform future pool table image asset generation and option visualization.

## Notable Gaps And Risks

- No shared layout/component source exists yet.
- No production route model exists.
- No root application framework is configured.
- Most product/category data is duplicated in HTML and/or markdown.
- Many prices, availability values, and category facts are mock or hardcoded and must be validated against BigCommerce before launch.
- Search, cart, wishlist, contact forms, and quote forms are mostly placeholders.
- Several existing PDPs are not connected from their category cards.
- Some cards link to `#`, while Traeger cards link to live `homebilliards.ca` URLs.
- Remote images are mixed with local images and scraped copies.
- BigCommerce identifiers are mostly absent or placeholders.
- Pool table listing data is generated from slugs and formulas rather than catalog records.
- Product option logic is local JavaScript with no backend validation.
- Builder option modeling is not yet mapped to BigCommerce variants, modifiers, custom fields, or quote-only logic.

## Migration Signals To Preserve

- Luxury/home-game-room visual direction.
- Mega navigation category breadth and grouping.
- Home page flow: departments -> featured builder -> services -> resources -> design-center CTA.
- Category page behavior: hero, chips, facets, price range, sorting, grid, empty state, load more for large catalogs.
- Product configurator behavior: gallery, selected build summary, accordion steps, option pricing, quote/cart split.
- Austin builder business logic: stock vs custom path, room size guidance, finish groups, cloth families, add-ons, quote-only add-on.
- Pool table render workflow: selected finish changes table image; selected cloth changes overlay color.
- Service/support emphasis: local delivery, install, recovering, moving, design help, commercial planning.

## Recommended Refactor Order For A Future Branch

1. Freeze this audit as reference documentation.
2. Create a new branch for architecture work.
3. Pick the frontend framework and route structure.
4. Extract shared shell components: header, nav, footer, cards, category layout, product builder layout.
5. Define normalized data contracts for categories, product cards, PDPs, and configurators.
6. Build a server-side BigCommerce adapter layer.
7. Migrate one category page dynamically first, preferably `pool-tables.html` because it has the richest catalog structure.
8. Migrate Austin builder with a clear BigCommerce option/modifier/quote model.
9. Wire cart, quote, contact, search, and wishlist flows.
10. Replace hardcoded/root HTML pages only after dynamic parity is verified against this shell.
