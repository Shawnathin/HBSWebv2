# MVP Backlog

Decision date: 2026-06-13

Scope: phased implementation backlog from prototype preservation through Render staging deploy. This backlog does not authorize production-code refactoring in the current turn.

## Phase 0: Preserve And Baseline Prototype

Goal: keep the current shell intact and make it useful as a reference fixture.

Tasks:

- Keep existing root HTML files unchanged.
- Preserve `docs/FRONTEND_SHELL_AUDIT.md` as the current shell baseline.
- Preserve `docs/BIGCOMMERCE_DATA_REQUIREMENTS.md` as the data baseline.
- Preserve `docs/02_BIGCOMMERCE_HEADLESS_FRONTEND_RENDERER_INTEGRATION.md` as the renderer/backend handoff.
- Capture screenshots of current MVP pages before refactoring in a future branch.
- Record current `.html` routes and proposed redirects.

Acceptance criteria:

- Prototype files still open locally.
- No product facts or BigCommerce IDs are invented.
- Migration decisions are documented before implementation begins.

## Phase 1: App Foundation

Goal: create the custom Next.js + TypeScript app foundation without replacing the prototype yet.

Tasks:

- Create a dedicated implementation branch.
- Add Next.js App Router with TypeScript.
- Add basic project structure:
  - `app/`
  - `components/`
  - `lib/bigcommerce/`
  - `lib/renderer/`
  - `lib/view-models/`
  - `app/api/`
- Add lint/typecheck scripts.
- Add environment variable example documentation without committing secrets.
- Add initial Render service notes/config plan.

Acceptance criteria:

- App boots locally.
- TypeScript compiles.
- No `.env` file is committed.
- Static prototype remains available as reference.

## Phase 2: View Models And Fixture Data

Goal: define stable contracts before live BigCommerce integration.

Tasks:

- Create TypeScript view models for:
  - header/nav/footer.
  - category pages.
  - product cards.
  - PDPs.
  - Austin builder.
  - renderer manifests.
  - cart payloads.
  - quote payloads.
- Build fixture data from existing prototype values with clear `prototypeOnly` markers.
- Add TODO placeholders for unknown BigCommerce IDs:
  - `TODO_BC_CATEGORY_ID_POOL_TABLES`
  - `TODO_BC_PRODUCT_ID_AUSTIN`
  - `TODO_BC_MODIFIER_OPTION_ID_CLOTH`
  - `TODO_BC_VARIANT_ID_AUSTIN_SELECTED_BUILD`
- Add adapter function interfaces before wiring live APIs.
- If fulfillment badges are modeled, source `fulfillmentBadge`, `availabilityMessage`, `leadTimeLabel`, and `shippingPromise` from fixture data now and BigCommerce/backend catalog data later. `Ships in 24 business hours` is an allowed display value only when that data provides it.

Acceptance criteria:

- Components can render from fixture view models.
- Unknown IDs remain explicit TODO placeholders.
- Fixture data is not treated as catalog truth.

## Phase 3: Shared Shell Components

Goal: reproduce the global shell in React.

Tasks:

- Build `CommerceHeader`.
- Build `SearchBar`.
- Build `MegaNavigation`.
- Build `SiteFooter`.
- Build mobile nav behavior.
- Wire cart count placeholder from a `CartSummaryViewModel`.
- Render home page shell using prototype-informed sections.

Acceptance criteria:

- Header/nav/footer match the prototype flow.
- Search submits to `/search`.
- Cart link points to `/cart`.
- No private credentials are needed.

## Phase 4: Pool Tables Category MVP

Goal: migrate the richest category flow first.

Tasks:

- Build `CategoryHero`.
- Build `CategoryToolbar`.
- Build `FilterChipRow`.
- Build `FacetPanel`.
- Build `PriceRangeFilter`.
- Build `ProductGrid`.
- Build `ProductCard`.
- Add read-only BigCommerce category adapter for `TODO_BC_CATEGORY_ID_POOL_TABLES`.
- Map BigCommerce products into `ProductCardViewModel`.
- Keep prototype fixture fallback while BigCommerce data is incomplete.
- Add pagination or load-more behavior.

Acceptance criteria:

- `/pool-tables` renders a dynamic category page.
- Product facts come from BigCommerce or are clearly marked as placeholders.
- Austin card routes to `/pool-tables/austin-pool-table`.
- Filters do not invent unavailable catalog facts.

## Phase 5: Standard PDP And Cart Foundation

Goal: prove a standard product detail/cart path before the full Austin builder is wired.

Tasks:

- Build `ProductDetailLayout`.
- Build `ProductGallery`.
- Build `ProductInfo`.
- Build `ProductOptionSelector`.
- Build `PurchasePanel`.
- Create `productAdapter`.
- Create `cartAdapter`.
- Implement `POST /api/cart`.
- Validate product, variant, modifier, and add-on selections server-side.

Acceptance criteria:

- A product page can render from normalized BigCommerce data.
- Cart submissions use server-side validation.
- Checkout redirect/cart state is returned by the adapter.
- Admin API credentials are never exposed to the browser.

## Phase 6: Austin Builder And Renderer MVP

Goal: launch the Austin builder experience with manifest-driven rendering.

Tasks:

- Build `AustinBuilderPreview`.
- Build `SizeSelector`.
- Build `FinishSelector`.
- Build `ClothSelector`.
- Build `AddOnSelector`.
- Build `BuildSummary`.
- Build `BuilderActions`.
- Create `renderManifestAdapter`.
- Create an Austin fixture manifest with TODO IDs.
- Replace fixture manifest with approved asset-host manifest.
- Connect Austin product `TODO_BC_PRODUCT_ID_AUSTIN`.
- Resolve selected variant and cloth modifier IDs.
- Add renderer fallback behavior.

Acceptance criteria:

- Selected finish changes the table overlay when assets exist.
- Selected cloth changes the cloth preview.
- Missing renderer assets fall back cleanly.
- Quote-only selections do not enter cart incorrectly.
- Cart/quote payloads include selected labels and TODO IDs only until real IDs are confirmed.

## Phase 7: Quote, Contact, Search

Goal: wire the non-checkout lead flows and basic search.

Tasks:

- Implement `QuoteModal`.
- Implement `POST /api/quote`.
- Implement `/contact-us`.
- Implement `POST /api/contact`.
- Implement `/search`.
- Add input validation.
- Add spam/rate-limit plan before public launch.
- Decide quote destination:
  - `TODO_QUOTE_DESTINATION`.

Acceptance criteria:

- Quote submissions include build summary and customer contact fields.
- Contact form submits to a server endpoint.
- Search returns product results through the adapter.
- Personally identifiable information is not written to plain logs.

## Phase 8: Render Staging Deploy

Goal: deploy a secure staging version for review.

Tasks:

- Create Render staging service.
- Configure environment variables in Render.
- Confirm GitHub deploy flow.
- Add staging domain.
- Add cache/revalidation strategy for product/category pages.
- Verify `.html` redirect behavior in staging.
- Test MVP routes:
  - `/`
  - `/contact-us`
  - `/pool-tables`
  - `/pool-tables/austin-pool-table`
  - `/search`
  - `/cart`
  - `/quote`
- Run visual QA against prototype screenshots.

Acceptance criteria:

- Staging deploy succeeds from GitHub.
- No secrets are committed.
- MVP routes work on Render.
- BigCommerce data is read through approved adapter paths.
- Cart/quote/contact flows are validated in staging.

## Phase 9: Later Catalog Expansion

Goal: reuse the MVP components for the remaining prototype routes.

Tasks:

- Migrate `/cues`.
- Migrate `/cues/bull-carbon-black-with-6-purple-abalone-points`.
- Migrate `/ping-pong-tables`.
- Migrate `/ping-pong-tables/whistler-indoor-table-tennis-table`.
- Migrate `/traeger-smokers`.
- Migrate `/dartboards`.
- Add generic product/category URL resolver if needed.
- Add wishlist/customer-account features if approved.
- Add richer resource/service pages if approved.

Acceptance criteria:

- Reused components cover the later category/PDP surfaces.
- Product URLs and IDs are reconciled to BigCommerce.
- Placeholder `#` links are removed only when real destinations exist.

## Cross-Phase Guardrails

- Do not delete or rewrite existing HTML files until dynamic parity is approved.
- Do not commit `.env` files.
- Do not expose BigCommerce Admin/Management tokens in frontend code.
- Do not invent real product facts, prices, availability, or IDs.
- Do not build or include Find a Dealer, dealer locator, or store-locator functionality in nav, footer, routes, search, or backlog.
- Treat fulfillment, availability, and shipping promise copy as data-driven. Do not globally apply `Ships in 24 business hours`; render it only when the product/category data provides that fulfillment value, and do not derive it from a fake live shipping calculation.
- Keep Catalyst as a reference, not the default base, unless a future proof shows it reduces work without compromising the custom builder.
- Use Render staging before production launch.
