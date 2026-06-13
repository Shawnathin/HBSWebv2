# BigCommerce Austin Catalog Mapping

Decision date: 2026-06-13

Scope: catalog mapping assumptions and TODO placeholders for wiring the Austin Pool Table builder to BigCommerce later. This file does not assert real BigCommerce IDs, SKUs, inventory, pricing, or availability.

## Product Mapping Assumptions

- Austin should start as one BigCommerce product unless the real catalog proves size-specific products are required.
- BigCommerce remains the source of truth for product, variant, modifier, price, inventory, cart, checkout, and order validation.
- The frontend fixture can display prototype-derived labels and previews, but cart and quote payloads must be validated server-side before launch.
- Renderer manifests store visual asset mapping. BigCommerce metafields should store short renderer pointers only.
- Add-ons may become modifiers or separate products depending on real catalog, tax, inventory, fulfillment, and reporting needs.

## Product Placeholder

| Field | Placeholder |
| --- | --- |
| Product name | Austin Pool Table |
| Brand | California House |
| BigCommerce product ID | `TODO_BC_PRODUCT_ID_AUSTIN` |
| BigCommerce product slug/path | `TODO_BC_PRODUCT_PATH_AUSTIN` |
| Product metafield namespace | `hbc_renderer` |
| Product metafield key | `renderer_config_v1` |
| Renderer manifest URL | `TODO_RENDERER_MANIFEST_URL_AUSTIN` |
| Product group key | `california_house|austin|pool_table|TODO_SIZE_SCOPE` |

## Variant Axes

Austin variant axes should represent SKU-level choices that may affect price, inventory, build spec, fulfillment, or renderer overlay selection.

| Axis | BigCommerce option placeholder | Value placeholders |
| --- | --- | --- |
| Size | `TODO_BC_OPTION_ID_AUSTIN_SIZE` | `TODO_BC_SIZE_VALUE_ID_7FT`, `TODO_BC_SIZE_VALUE_ID_8FT`, `TODO_BC_SIZE_VALUE_ID_9FT`, `TODO_BC_SIZE_VALUE_ID_CUSTOM` |
| Material / Wood Species | `TODO_BC_OPTION_ID_AUSTIN_MATERIAL` | `TODO_BC_MATERIAL_VALUE_ID_MAPLE`, `TODO_BC_MATERIAL_VALUE_ID_OAK`, `TODO_BC_MATERIAL_VALUE_ID_TODO_OTHER` |
| Finish | `TODO_BC_OPTION_ID_AUSTIN_FINISH` | `TODO_BC_FINISH_VALUE_ID_[FINISH_SLUG]` |

Example conceptual variant key:

```text
TODO_BC_VARIANT_ID_AUSTIN_[SIZE]_[MATERIAL]_[FINISH]
```

Do not treat the example key as a real SKU or BigCommerce ID.

## Finish Values

Prototype finish slugs that need real BigCommerce option-value mapping:

```text
auburn-distressed-glazed
auburn
coastal-grey-glazed
coastal-grey
dusk
frost
honey-distressed-glazed
honey
java
midnight
sand
toast
copper-oak
graphite-oak
rustic-white-oak
truffle
```

Required mapping per finish:

- `finish_slug`
- `display_name`
- `material_or_wood_species`
- `TODO_BC_FINISH_VALUE_ID_[FINISH_SLUG]`
- `TODO_BC_VARIANT_ID_AUSTIN_[SIZE]_[MATERIAL]_[FINISH]`
- `renderer_finish_key`
- status: `available`, `unavailable`, `quote_only`, or `hidden`

## Renderer Keys Needed For Each Variant

Each cartable size/material/finish variant needs enough renderer data to resolve a visual overlay without embedding large manifests in BigCommerce.

| Field | Example placeholder |
| --- | --- |
| Product group key | `california_house|austin|pool_table|TODO_SIZE_SCOPE` |
| View slug | `front-3q` |
| Material slug | `maple` or `oak` |
| Finish slug | `truffle` |
| Renderer finish key | `maple|truffle` |
| Variant metafield namespace | `hbc_renderer` |
| Variant metafield key | `finish_overlay_key` |
| Variant metafield value | `california_house|austin|pool_table|TODO_SIZE_SCOPE|front-3q|TODO_MATERIAL_SLUG|TODO_FINISH_SLUG` |

## Modifiers

Modifiers represent shopper choices that should not multiply every size/material/finish variant.

| Modifier | Option placeholder | Value placeholder pattern |
| --- | --- | --- |
| Cloth Colour | `TODO_BC_MODIFIER_OPTION_ID_CLOTH_COLOUR` | `TODO_BC_MODIFIER_VALUE_ID_CLOTH_COLOUR_[CLOTH_SLUG]` |
| Cloth Grade | `TODO_BC_MODIFIER_OPTION_ID_CLOTH_GRADE` | `TODO_BC_MODIFIER_VALUE_ID_CLOTH_GRADE_INVITATIONAL`, `TODO_BC_MODIFIER_VALUE_ID_CLOTH_GRADE_TOUR` |
| Dining Top | `TODO_BC_MODIFIER_OPTION_ID_DINING_TOP` | `TODO_BC_MODIFIER_VALUE_ID_DINING_TOP_NONE`, `TODO_BC_MODIFIER_VALUE_ID_DINING_TOP_MATCHING` |
| Bench Set | `TODO_BC_MODIFIER_OPTION_ID_BENCH_SET` | `TODO_BC_MODIFIER_VALUE_ID_BENCH_NONE`, `TODO_BC_MODIFIER_VALUE_ID_BENCH_MATCHING_SET` |
| Lighting | `TODO_BC_MODIFIER_OPTION_ID_LIGHTING` | `TODO_BC_MODIFIER_VALUE_ID_LIGHTING_NONE`, `TODO_BC_MODIFIER_VALUE_ID_LIGHTING_PREMIUM` |
| Delivery / Install Preference | `TODO_BC_MODIFIER_OPTION_ID_DELIVERY_INSTALL` | `TODO_BC_MODIFIER_VALUE_ID_DELIVERY_INSTALL_GREATER_VANCOUVER`, `TODO_BC_MODIFIER_VALUE_ID_DELIVERY_INSTALL_QUOTE_REQUIRED` |
| Custom Cloth / Logo Request | `TODO_BC_MODIFIER_OPTION_ID_CUSTOM_CLOTH_LOGO` | `TODO_BC_MODIFIER_VALUE_ID_CUSTOM_CLOTH_LOGO_NONE`, `TODO_BC_MODIFIER_VALUE_ID_CUSTOM_CLOTH_LOGO_REQUESTED` |

If dining top, bench set, or lighting need inventory, fulfillment, tax, returns, or separate reporting, model them as separate add-on products instead of modifiers:

```text
TODO_BC_PRODUCT_ID_AUSTIN_DINING_TOP
TODO_BC_PRODUCT_ID_AUSTIN_BENCH_SET
TODO_BC_PRODUCT_ID_PREMIUM_TABLE_LIGHTING
```

## Cloth Modifier Value Placeholders

Prototype cloth slugs that need real modifier values:

```text
invitational-red
invitational-burgundy
invitational-titanium
invitational-charcoal
invitational-steel-grey
invitational-black
invitational-purple
invitational-olive
invitational-taupe
invitational-golden
invitational-khaki
invitational-camel
invitational-brown
invitational-basic-green
invitational-championship-green
invitational-dark-green
invitational-bottle-green
invitational-english-green
invitational-aztec
invitational-brick
invitational-navy
invitational-wine
invitational-academy-blue
invitational-championship-blue
invitational-euro-blue
invitational-electric-blue
tour-championship-green
tour-dark-green
tour-red
tour-olive
tour-bottle-green
tour-electric-blue
tour-camel
tour-euro-blue
tour-navy
tour-burgundy
tour-merlot
tour-wine
tour-steel-grey
tour-charcoal
tour-black
tour-championship-blue
tour-lilac
```

Each cloth needs:

- `cloth_slug`
- display name
- grade/family
- hex color for renderer MVP
- `TODO_BC_MODIFIER_VALUE_ID_CLOTH_COLOUR_[CLOTH_SLUG]`
- optional upcharge from real catalog
- status from real catalog

## Cart Payload Fields Needed Later

The future server-side cart adapter should accept a normalized Austin build and resolve it against BigCommerce before creating or updating a cart.

Required payload fields:

- `productId`: `TODO_BC_PRODUCT_ID_AUSTIN`
- `variantId`: `TODO_BC_VARIANT_ID_AUSTIN_SELECTED_BUILD`
- `quantity`
- selected size label and `TODO_BC_SIZE_VALUE_ID`
- selected material / wood species label and `TODO_BC_MATERIAL_VALUE_ID`
- selected finish label and `TODO_BC_FINISH_VALUE_ID`
- selected cloth colour label and `TODO_BC_MODIFIER_VALUE_ID_CLOTH_COLOUR_[CLOTH_SLUG]`
- selected cloth grade label and `TODO_BC_MODIFIER_VALUE_ID_CLOTH_GRADE_[GRADE]`
- selected dining top option or add-on product ID
- selected bench set option or add-on product ID
- selected lighting option or add-on product ID
- delivery / install preference
- custom cloth / logo request flag and future `custom_design_id`, if applicable
- renderer product group key
- renderer finish key
- source route: `/pool-tables/austin-pool-table`

The adapter must reject or route to quote when:

- the selected variant is missing or unavailable.
- a selected modifier value is no longer valid.
- a selected add-on is quote-only or incompatible.
- BigCommerce price or availability differs from displayed fixture data.
- a custom cloth/logo request requires staff review.

## Unknowns Needed From The Real BigCommerce Store

- Real Austin product ID, SKU, URL path, and channel assignment.
- Whether Austin sizes are variant values or separate products.
- Whether Material / Wood Species is explicit in the catalog or inferred from finish.
- Real finish option IDs and finish value IDs.
- Real size option IDs and size value IDs.
- Real variant IDs for every cartable size/material/finish combination.
- Real cloth modifier option IDs and cloth modifier value IDs.
- Whether cloth grade and cloth colour are one combined modifier or separate modifiers.
- Whether dining top, bench set, and lighting are modifiers, separate add-on products, or quote-only metadata.
- Delivery and installation eligibility rules.
- Custom cloth/logo upload and proofing destination.
- Real prices, MSRP, sale prices, and upcharges.
- Real inventory, preorder, stock-package, and quote-only rules.
- Renderer manifest asset host URL and final asset naming convention.
- Quote destination and staff workflow.
- Cart line-item metadata strategy for build summaries and renderer keys.

## Guardrails

- Do not add real IDs until they are confirmed from the store.
- Do not expose Admin/Management API credentials in frontend code.
- Do not treat prototype fixture prices, fulfillment copy, or availability as catalog truth.
- Fulfillment, availability, and shipping promise copy must come from BigCommerce/backend catalog data. `Ships in 24 business hours` is an allowed display value only when that data provides it; do not calculate or promise live shipping timing in the frontend.
- Do not add Find a Dealer or dealer locator functionality to the Austin flow.
