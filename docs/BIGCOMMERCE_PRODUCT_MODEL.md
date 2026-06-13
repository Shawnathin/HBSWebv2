# BigCommerce Product Model

Decision date: 2026-06-13

Scope: product modeling plan for the custom Home Billiards headless storefront. This document uses TODO placeholders where BigCommerce IDs are unknown and does not assert real product facts.

## Modeling Principles

- BigCommerce is the source of truth for sellable catalog data, pricing, inventory, cart, checkout, and orders.
- The frontend may display calculated build summaries, but final price/cart validity must be confirmed server-side.
- Variants should represent sellable SKU-level differences.
- Modifiers should represent shopper choices that should not multiply SKU combinations.
- Product and variant metafields should store compact pointers to renderer/config data, not large image manifests.
- Add-ons should be modeled as separate products when they need independent inventory, fulfillment, tax, reporting, or merchandising.

## Products, Variants, And Modifiers

| BigCommerce concept | Use for | Avoid using for |
| --- | --- | --- |
| Product | A sellable model/family or standalone item. Example: Austin Pool Table. | Every cosmetic combination when a variant would be enough. |
| Variant | SKU-level choices that affect price, inventory, build spec, or fulfillment. Example: size + material/finish if catalog-backed. | High-cardinality cosmetic choices such as dozens of cloth colors. |
| Modifier | Choices added to the product without creating every SKU combination. Example: cloth color, service preference, custom text. | Choices that require distinct inventory or a true SKU. |
| Custom field | Simple shopper-facing product attributes. | Private integration data or complex JSON. |
| Metafield | Integration/config pointers, renderer keys, internal flags. | Large renderer manifests or image data. |
| Related product/add-on product | Accessories or services that should be separate line items. | Required options that must travel as part of the configured base product. |

## Austin Pool Table Recommendation

Use one BigCommerce product for the Austin pool table unless the real catalog forces size-specific products.

Product placeholder:

```text
TODO_BC_PRODUCT_ID_AUSTIN
```

Recommended model:

```text
Product:
  Austin Pool Table

Variant axes, pending catalog confirmation:
  Size
  Material or wood species, if applicable
  Finish, if finish affects SKU/price/inventory/build spec

Modifiers:
  Cloth color
  Cloth grade/family, if not represented as separate modifier groups
  Custom cloth/logo request, later
  Delivery/install preference, if applicable

Add-on products or modifiers:
  Dining top
  Bench set
  Premium lighting
  Designer finish review / quote-only service
```

Open decision: if size materially changes shipping, production workflow, pricing, or SKU structure beyond normal variants, consider separate products per size. Do not decide this until the real BigCommerce catalog is audited.

## Variant Strategy

Preferred Austin variant approach:

```text
Size x Material/Wood x Finish
```

Example conceptual variant key:

```text
8ft|maple|truffle
```

Do not treat this example as a real SKU or BigCommerce ID.

Variant fields needed:

- `TODO_BC_VARIANT_ID`
- size option value ID.
- material/wood option value ID, if used.
- finish option value ID.
- SKU.
- price/sale price/MSRP where applicable.
- inventory/availability.
- renderer finish overlay key, likely through variant metafield.

Reasoning:

- Size and finish can affect price and build spec.
- Finish selection controls renderer overlay lookup.
- Variant-backed values make cart/order details clearer.

Variant explosion to avoid:

```text
sizes x materials x finishes x cloth colors x add-ons
```

Cloth and most add-ons should not be variant axes unless BigCommerce operations require it.

## Cloth As Modifier

Cloth should be modeled as a BigCommerce modifier for the Austin MVP.

Modifier placeholders:

```text
TODO_BC_MODIFIER_OPTION_ID_CLOTH
TODO_BC_MODIFIER_VALUE_ID_CLOTH_[SLUG]
```

Recommended cloth fields:

- cloth slug.
- display name.
- family/grade.
- hex value for solid-color preview.
- optional swatch image URL.
- BigCommerce modifier option ID.
- BigCommerce modifier value ID.
- upcharge, if catalog-approved.
- availability/status.
- renderer color/texture pointer, if needed.

Why cloth should be a modifier:

- The current Austin prototype has 43 cloth options.
- Cloth should render dynamically in the frontend.
- Cloth usually should not multiply every size/material/finish combination.
- Custom logo/artwork cloth will need a custom proofing flow beyond standard variants.

If cloth has inventory-tracked SKUs later, revisit this decision for that subset only.

## Add-Ons Strategy

Use one of three strategies per add-on:

| Add-on type | Preferred model | Reason |
| --- | --- | --- |
| Physical accessory with its own SKU/inventory | Separate BigCommerce product added as an additional cart line | Independent inventory, fulfillment, reporting, and returns. |
| Required built-in configuration option | Product modifier or variant, depending on SKU impact | Keeps the configured base product complete. |
| Quote-only review/service | Modifier or quote metadata | May not belong in cart checkout until staff review. |

Austin add-on placeholders:

```text
TODO_BC_PRODUCT_ID_AUSTIN_DINING_TOP
TODO_BC_PRODUCT_ID_AUSTIN_BENCH_SET
TODO_BC_PRODUCT_ID_PREMIUM_TABLE_LIGHTING
TODO_QUOTE_SERVICE_ID_DESIGNER_FINISH_REVIEW
```

The current prototype add-ons should not be assumed cart-ready until the real catalog confirms pricing, SKU, and fulfillment behavior.

## Renderer Metafields

Use BigCommerce metafields for short renderer pointers only.

Product metafield placeholder:

```json
{
  "namespace": "hbc_renderer",
  "key": "renderer_config_v1",
  "permission_set": "read_and_sf_access",
  "value": {
    "renderer_enabled": true,
    "product_group_key": "california_house|austin|pool_table|TODO_SIZE_SCOPE",
    "asset_manifest_url": "TODO_RENDERER_MANIFEST_URL"
  }
}
```

If BigCommerce requires the metafield value to be stored as a string, serialize the object as JSON from the server-side catalog tooling.

Variant metafield placeholder:

```json
{
  "namespace": "hbc_renderer",
  "key": "finish_overlay_key",
  "permission_set": "read_and_sf_access",
  "value": "california_house|austin|pool_table|TODO_SIZE_SCOPE|TODO_VIEW|TODO_MATERIAL|TODO_FINISH"
}
```

Optional product metafields:

```text
hbc_commerce.quote_required
hbc_commerce.builder_enabled
hbc_commerce.stock_package_key
hbc_merchandising.badges
hbc_merchandising.delivery_rank
```

Keep large manifests, masks, overlays, and gallery data in the renderer asset system, not inside BigCommerce metafields.

## Cart Payload Strategy

Cartable Austin build payload should resolve to:

- product ID: `TODO_BC_PRODUCT_ID_AUSTIN`.
- variant ID: `TODO_BC_VARIANT_ID_AUSTIN_SELECTED_BUILD`.
- quantity.
- modifier selections:
  - cloth option/value IDs.
  - delivery/install preference if applicable.
  - custom design reference if applicable later.
- add-on product line items, if selected and cartable.

Server-side validation must confirm:

- product exists and is purchasable.
- selected variant belongs to the product.
- selected modifier values are valid for the product.
- selected add-ons are compatible.
- displayed price has not drifted from BigCommerce.
- quote-only selections do not enter checkout incorrectly.

## Quote Payload Strategy

Quote-only or hybrid builds should include:

- product ID placeholder.
- selected option labels and TODO BigCommerce IDs.
- selected add-ons and quote-only flags.
- renderer manifest URL/key.
- generated preview image URL if available later.
- customer contact fields.
- source route.
- staff notes/room notes.

Quote destination is still TBD:

```text
TODO_QUOTE_DESTINATION
```

Potential destinations include email, CRM, BigCommerce quote app, or a custom backend database. Decide before launch.

## Data Audit Required Before Implementation

Confirm:

- real BigCommerce product ID for Austin.
- whether Austin sizes are variants or separate products.
- whether finish is a variant option, modifier, or custom-order metafield.
- real modifier IDs for cloth values.
- add-on product IDs and whether each add-on is cartable or quote-only.
- real prices, MSRP, sale rules, and quote-required states.
- inventory rules for stock packages.
- renderer asset URLs and product group keys.
- checkout behavior for configured products.
