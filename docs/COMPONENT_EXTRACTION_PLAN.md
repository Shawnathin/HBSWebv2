# Component Extraction Plan

Decision date: 2026-06-13

Scope: map repeated static HTML sections into future React components for a custom Next.js + TypeScript storefront. This is a planning document only; no production code should be refactored from the current shell until a dedicated implementation branch exists.

## Extraction Principles

- Preserve the current UX flow before improving it.
- Extract components around repeated behavior and data contracts, not just visual chunks.
- Keep BigCommerce and renderer data access outside presentation components.
- Use typed view models so hardcoded prototype data can be replaced one route at a time.
- Keep existing HTML files as reference fixtures until dynamic parity is verified.

## App Shell Components

| Prototype source | Future component | Notes |
| --- | --- | --- |
| Repeated header across root HTML pages | `CommerceHeader` | Owns logo, search, contact CTA, cart link/state, mobile menu trigger. |
| Header search form | `SearchBar` | Starts as submit-to-search route; later supports suggestions. |
| Repeated horizontal nav and mega menus | `MegaNavigation` | Data should come from `GET /api/nav` or app config backed by BigCommerce categories. |
| Individual mega menu columns | `MegaMenuGroup` | Represents grouped category links and featured links. |
| Mega menu image/content blocks | `MegaMenuFeature` | Use CMS/config fields; do not hardcode final copy until approved. |
| Repeated footer | `SiteFooter` | Footer columns, contact info, category links, social links, legal copy. |

Data contract:

```text
HeaderViewModel
FooterViewModel
MegaNavItemViewModel
CartSummaryViewModel
```

## Home Page Components

| Prototype section | Future component | Notes |
| --- | --- | --- |
| Home hero | `HomeHero` | Preserve CTAs to pool tables, Austin builder, contact/showroom. |
| Department grid | `DepartmentGrid` and `DepartmentCard` | Back with BigCommerce category IDs and merchandising config. |
| Featured Austin block | `FeaturedBuilderPromo` | Link to Austin builder route and show catalog-backed price/quote state when available. |
| Service tiles | `ServiceTileGrid` and `ServiceTile` | Service content likely comes from config/CMS, not BigCommerce catalog. |
| Resource cards | `ResourceCardGrid` and `ResourceCard` | Later CMS/static content route. |
| Design center CTA | `DesignCenterBand` | Contact/quote lead path. |

## Category Page Components

Current category-like pages:

- `pool-tables.html`
- `cues.html`
- `ping-pong-tables.html`
- `dartboards.html`
- `traeger-smokers.html`

| Prototype section | Future component | Notes |
| --- | --- | --- |
| Category hero | `CategoryHero` | Title, intro, image, merchandising copy. |
| Toolbar | `CategoryToolbar` | Result count, sort select, view controls if added later. |
| Top filter chips | `FilterChipRow` and `FilterChip` | Derived from category facets or configured merchandising filters. |
| Facet sidebar | `FacetPanel` | Brand, category, type, availability, size, use case, series, price. |
| Price range | `PriceRangeFilter` | Should reflect real min/max values from the category result set. |
| Sort select | `SortSelect` | Featured, price, fastest delivery, newest, etc. |
| Product grid | `ProductGrid` | Accepts normalized product-card view models. |
| Empty state | `CategoryEmptyState` | Triggered by client-side filters or no catalog results. |
| Load more | `LoadMoreButton` or pagination | Needed for pool-table scale and future larger categories. |

Category data contract:

```text
CategoryPageViewModel
CategoryFacetViewModel
CategorySortOptionViewModel
ProductCardViewModel
```

MVP extraction target: `pool-tables.html`, because it has the broadest category behavior and largest product set.

## Product Card Components

Current card patterns appear in pool tables, cues, ping pong, dartboards, Traeger, Austin related products, and PDP related mini-cards.

| Prototype pattern | Future component | Notes |
| --- | --- | --- |
| Standard category card | `ProductCard` | Image, name, brand, price label, badges, meta, swatches, CTA. |
| Pool table card | `PoolTableProductCard` or `ProductCard` variant | Needs size, finish/stock/custom cues, and builder/detail CTA. |
| Traeger card | `ProductCard` with sale/preorder states | Traeger hardcodes live links and CDN images today; normalize through BigCommerce. |
| Related mini-card | `RelatedProductCard` | Smaller layout, same core data model. |
| Swatches | `SwatchList` and `Swatch` | Can represent finish, color, cloth, tabletop color. |
| Badges | `BadgeRow` and `ProductBadge` | Sale, in stock, custom build, preorder, made in Canada, etc. |

Product card data should never invent price or inventory. Unknown values should display approved fallback labels such as `Request quote` or `Price coming soon`, depending on business approval.

## Product Detail Components

Current PDP/configurator pages:

- `austin-pool-table.html`
- `bull-carbon-black-with-6-purple-abalone-points.html`
- `whistler-indoor-table-tennis-table.html`

| Prototype section | Future component | Notes |
| --- | --- | --- |
| PDP layout | `ProductDetailLayout` | Shared two-column/sticky layout where applicable. |
| Product intro | `ProductInfo` | Name, brand, breadcrumbs, copy, facts, badges. |
| Gallery | `ProductGallery` | Standard image gallery fallback. |
| Option accordions | `ConfiguratorAccordion` and `ConfiguratorStep` | Product-specific option groups. |
| Option cards | `OptionCard` | Shared for size, finish, cloth, accessories, installation. |
| Purchase/summary panel | `BuildSummary` and `PurchasePanel` | Displays selected options, price label, quote/cart actions. |
| Related products | `RelatedProducts` | BigCommerce related products or configured collection. |
| Specs/details | `ProductDetailSections` | Structured product specs and approved detail copy. |

PDP data contract:

```text
ProductDetailViewModel
ProductOptionGroupViewModel
ProductOptionValueViewModel
RelatedProductViewModel
```

## Austin Builder Components

The Austin builder should be extracted as a specialized composition on top of shared PDP components.

| Prototype section | Future component | Notes |
| --- | --- | --- |
| Main visual preview | `AustinBuilderPreview` | Wraps renderer/gallery fallback. |
| Size step | `SizeSelector` | Size may map to variants; confirm against BigCommerce. |
| Finish step | `FinishSelector` | Finish may map to variants and renderer overlay keys. |
| Cloth step | `ClothSelector` | Cloth should be a modifier to avoid variant explosion. |
| Add-ons step | `AddOnSelector` | Add-ons may be line-item products, modifiers, or quote-only items. |
| Stock package panel | `StockPackageCallout` | Uses inventory-backed or configured package data. |
| Summary | `BuildSummary` | Shows selected size, finish, cloth, add-ons, price/quote state. |
| Actions | `BuilderActions` | Add to cart, request quote, save build. |

Austin-specific state should be expressed as a typed build model:

```text
AustinBuildState
  - selectedSizeSlug
  - selectedMaterialSlug
  - selectedFinishSlug
  - selectedClothSlug
  - selectedAddOnSlugs
  - selectedVariantId: TODO until catalog mapping
  - quoteRequired
```

## Quote Modal Components

The Austin quote modal is the most complete current quote flow. It should become a shared quote path for configurable and quote-only products.

| Prototype section | Future component | Notes |
| --- | --- | --- |
| Modal shell | `QuoteModal` | Accessible dialog with focus management and close behavior. |
| Contact fields | `QuoteContactFields` | Name, email, phone, notes; exact required fields TBD. |
| Build summary | `QuoteBuildSummary` | Includes selected product/options and readable labels. |
| Submission state | `QuoteSubmitButton` | Loading, success, error. |

Server endpoint:

```text
POST /api/quote
```

Quote payload should include:

- BigCommerce product ID placeholder until known: `TODO_BC_PRODUCT_ID_AUSTIN`.
- selected variant ID placeholder until known.
- modifier selections with TODO BigCommerce option IDs.
- selected add-ons.
- renderer manifest/product group key.
- customer contact fields.
- source URL.

Do not log personally identifiable information in plain application logs.

## Renderer And Gallery Components

| Prototype/source | Future component | Notes |
| --- | --- | --- |
| Austin finish render images | `PoolTableRenderer` | Uses manifest-driven overlays and cloth masks. |
| Austin gallery thumbnails | `ProductGallery` | Fallback when renderer is disabled or missing. |
| Cloth color overlay behavior | `ClothLayer` | Solid color MVP; custom artwork later. |
| Finish image switcher | `FinishOverlayLayer` | Uses selected material/finish/view key. |
| Missing asset behavior | `RendererFallback` | Falls back to standard product image and keeps selections active. |

Renderer component boundary:

```text
PoolTableRenderer receives a resolved RendererManifestViewModel and selected option slugs.
It does not fetch BigCommerce directly.
It does not decide price, inventory, or cart validity.
```

## Extraction Phases

1. Define TypeScript view models for header, footer, category, product card, PDP, builder, quote, and renderer.
2. Build static React components using copied prototype data fixtures.
3. Replace fixture data with adapter output for the pool-table category.
4. Build the Austin PDP/builder against a fixture manifest.
5. Connect Austin builder to BigCommerce product/options after product modeling is confirmed.
6. Add cart and quote server endpoints.
7. Migrate later category/PDP pages using the same components.

## Quality Checks Before Replacing A Static Route

- Visual flow matches the prototype or has documented intentional changes.
- Product/category facts come from BigCommerce or approved config.
- Unknown BigCommerce IDs remain TODO placeholders until confirmed.
- Cart and quote payloads are validated server-side.
- Mobile layout preserves header, filters, cards, builder, and modal usability.
- Renderer has fallback behavior for missing manifests/assets.
- `.html` redirect is configured for the migrated route.
