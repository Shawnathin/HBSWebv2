# BigCommerce Headless Frontend + Product Renderer Integration

**Project:** Home Billiards custom frontend / BigCommerce backend / pool table builder  
**Created:** 2026-06-13  
**Take this to:** the chat or repo that has the custom frontend mockup shell.

---

## New chat instruction

Use this document as the implementation handoff.

The user has a custom frontend shell/mockup with no backend. The task is to inspect the frontend structure, parse the existing HTML/CSS/JS/components, and create a plan to connect it to BigCommerce as the commerce backend while also supporting a custom pool table renderer that uses cloth masks and wood-finish overlays.

Do not redesign the whole website from scratch unless absolutely necessary. Preserve the visual direction of the existing shell and map it to real data.

---

## Core architecture

```text
BigCommerce = products, variants, modifiers, cart, checkout, orders
Custom frontend = UI, configurator, image renderer, cloth preview, custom design UX
Render asset system = masks, finish overlays, renderer manifests, CDN URLs
Internal pricing/data app = compatibility truth and catalog export truth
```

BigCommerce should not be the renderer. The frontend should not guess compatibility. The data engine and asset manifests should feed the frontend.

---

## What the frontend chat should do first

Given the frontend shell, inspect and map:

```text
1. Global layout
2. Header/navigation
3. Category pages
4. Product cards
5. Product detail pages
6. Image/gallery areas
7. Option selectors
8. Cart drawer/page
9. Checkout button flow
10. Product builder/configurator UI
11. Current hardcoded product data
12. Places where BigCommerce data should replace hardcoded data
13. Places where render manifest data should replace static images
```

Output should be a practical integration plan, not theory.

---

## BigCommerce role

Use BigCommerce as the commerce backend.

BigCommerce should handle:

```text
products
brands/categories
prices
sale prices
variants
modifiers
cart
checkout
orders
tax/shipping integrations as needed
customer accounts if needed
```

Your custom frontend should handle:

```text
visual layout
product browsing
custom builder UI
cloth rendering
image compositing
custom upload preview
content presentation
API calls to your backend and BigCommerce storefront endpoints
```

---

## Product modeling recommendation

### Product

Use one BigCommerce product for each sellable table model/size family unless size complexity forces separate products.

Examples:

```text
California House Origami Pool Table
California House Origami 8 ft Pool Table
California House District Shuffleboard Table
```

There is no universal perfect answer. The practical rule is:

```text
If size changes price/shipping/build logic heavily, separate size into product or variant carefully.
If size is a normal catalog option, use Size as a variant axis.
```

---

## Variants vs modifiers

### Use variants for choices that define the sellable build

Recommended variant axes:

```text
Size
Material / wood species
Wood finish
```

Why:

```text
- affects price
- affects build spec
- affects SKU/order details
- affects render overlay
- may affect compatibility
```

Example variant:

```text
8 ft / Maple / Auburn
```

### Use modifiers for customization choices that should not explode SKUs

Recommended modifiers:

```text
Cloth colour
Cloth grade
Custom cloth/logo request
Delivery/install preference
Accessory package
Dining top add-on, if not treated as separate add-on product
```

Why:

```text
- cloth should render dynamically on the frontend
- cloth should not multiply every table/finish variant
- most cloth options do not need unique inventory tracking
```

Variant explosion to avoid:

```text
3 sizes × 3 woods × 15 finishes × 30 cloths = 4,050 variants
```

Better:

```text
3 sizes × 3 woods × 15 finishes = 135 variants
30 cloths = modifier values
```

---

## Frontend renderer data model

The product page should receive two kinds of data:

```text
1. BigCommerce commerce data
2. Renderer asset manifest data
```

BigCommerce tells the frontend:

```text
product id
variant ids
option values
modifier values
price
availability
cart requirements
```

Renderer manifest tells the frontend:

```text
cloth mask URL
cloth shadow map URL
cloth geometry URL
finish overlay URL for selected material/finish/view
available view slugs
image dimensions
fallback image
```

---

## BigCommerce metafields

Use BigCommerce metafields to store short pointers, not huge renderer data.

Product metafield example:

```json
{
  "namespace": "hbc_renderer",
  "key": "renderer_config_v1",
  "permission_set": "read_and_sf_access",
  "value": "{\"asset_manifest_url\":\"https://assets.homebilliards.ca/render-assets/california-house/origami/8ft/renderer_config_manifest.json\",\"product_group_key\":\"california_house|origami|pool_table|8ft\",\"renderer_enabled\":true}"
}
```

Variant metafield example:

```json
{
  "namespace": "hbc_renderer",
  "key": "finish_overlay_key",
  "permission_set": "read_and_sf_access",
  "value": "california_house|origami|pool_table|8ft|front-3q|maple|auburn"
}
```

The frontend can use these to find the correct render asset.

---

## Renderer config manifest

The frontend should load an external file like:

```text
renderer_config_manifest.json
```

Example:

```json
{
  "schema_version": "hbc-renderer-config-v1",
  "vendor_slug": "california-house",
  "product_group_key": "california_house|origami|pool_table|8ft",
  "image_width": 2000,
  "image_height": 2000,
  "default_view_slug": "front-3q",
  "views": {
    "front-3q": {
      "cloth_mask_url": "https://assets.example.com/california-house/origami/8ft/front-3q/cloth-mask.png",
      "cloth_shadow_map_url": "https://assets.example.com/california-house/origami/8ft/front-3q/cloth-shadow-map.png",
      "cloth_geometry_url": "https://assets.example.com/california-house/origami/8ft/front-3q/cloth-geometry.json",
      "finish_overlays": {
        "maple|auburn": "https://assets.example.com/california-house/origami/8ft/front-3q/maple-auburn-overlay.png",
        "maple|honey": "https://assets.example.com/california-house/origami/8ft/front-3q/maple-honey-overlay.png",
        "maple|java": "https://assets.example.com/california-house/origami/8ft/front-3q/maple-java-overlay.png"
      }
    }
  },
  "cloths": {
    "red": {
      "display_name": "Red",
      "hex": "#a51622",
      "bigcommerce_modifier_value_id": 9001
    },
    "steel-grey": {
      "display_name": "Steel Grey",
      "hex": "#55585e",
      "bigcommerce_modifier_value_id": 9002
    }
  }
}
```

Do not put this entire manifest in BigCommerce if it becomes large. Put the URL in BigCommerce.

---

## Frontend image layer stack

For simple cloth colours:

```text
Layer 1: cloth colour clipped to cloth mask
Layer 2: cloth shadow map
Layer 3: selected wood-finish overlay PNG with transparent cloth area
```

For custom cloth/logo artwork:

```text
Layer 1: customer artwork warped using cloth_geometry.json
Layer 2: cloth shadow map
Layer 3: selected wood-finish overlay PNG
```

Start with solid colour cloth. Add artwork warping later.

---

## React component structure

Recommended components:

```text
<ProductPage>
  <ProductGalleryOrRenderer />
  <ProductInfo />
  <ProductOptionSelector />
  <PoolTableRenderer />
  <AddToCartPanel />
</ProductPage>
```

Renderer component props:

```ts
type PoolTableRendererProps = {
  rendererConfigUrl: string;
  selectedViewSlug: string;
  selectedMaterialSlug: string;
  selectedFinishSlug: string;
  selectedClothSlug: string;
};
```

Renderer lookup:

```ts
const overlayUrl =
  rendererConfig.views[selectedViewSlug]
    .finish_overlays[`${selectedMaterialSlug}|${selectedFinishSlug}`];

const clothMaskUrl =
  rendererConfig.views[selectedViewSlug].cloth_mask_url;

const clothShadowMapUrl =
  rendererConfig.views[selectedViewSlug].cloth_shadow_map_url;
```

---

## CSS mask prototype

For a simple proof:

```css
.table-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 2000 / 2000;
}

.table-stage > * {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.cloth-layer {
  background: var(--selected-cloth-hex);
  mask-image: url("/assets/cloth-mask.png");
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: url("/assets/cloth-mask.png");
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
}

.cloth-shadow {
  mix-blend-mode: multiply;
  opacity: 0.45;
  pointer-events: none;
}

.finish-overlay {
  pointer-events: none;
}
```

For custom uploaded art, move to Canvas/WebGL.

---

## BigCommerce data fetching

Use BigCommerce GraphQL Storefront API from the frontend/backend layer for storefront product data.

Fetch:

```text
product entityId
name
path
prices
product options
variant options
modifier options
product metafields with storefront access
variants
variant metafields with storefront access
```

The BigCommerce product docs describe Storefront GraphQL access to product option data and product metafields with storefront access. The variant docs describe variant option data and variant metafields with storefront access.

---

## Add to cart

When customer clicks add to cart, send BigCommerce:

```text
productEntityId
variantEntityId
quantity
selectedOptions for modifiers
```

Conceptual payload:

```json
{
  "lineItems": [
    {
      "quantity": 1,
      "productEntityId": 12345,
      "variantEntityId": 99801,
      "selectedOptions": {
        "multipleChoices": [
          {
            "optionEntityId": 701,
            "optionValueEntityId": 9001
          }
        ],
        "textFields": [
          {
            "optionEntityId": 702,
            "text": "Custom cloth design ID: hbc_custom_abc123"
          }
        ]
      }
    }
  ]
}
```

Use this pattern for:

```text
Variant = size/material/finish
Modifier = cloth colour
Text/file/custom metadata = custom cloth proofing reference, if needed
```

---

## Custom cloth upload flow

Do not rely only on BigCommerce to render or understand custom cloth files.

Recommended flow:

```text
1. Customer uploads design/logo through custom frontend.
2. Your app stores file in your own storage.
3. Your app generates preview using cloth_geometry.json.
4. Your app creates custom_design_id.
5. BigCommerce cart receives selected table variant + modifier + custom_design_id.
6. Staff reviews/proofs before production.
```

Use BigCommerce for order capture. Use your app for visual preview and production-proof metadata.

---

## Backend/security rules

```text
Storefront GraphQL token:
- can be exposed according to BigCommerce Storefront setup rules if intended for storefront use.

Admin API token:
- server-side only
- never expose in frontend
- used only for product import/update/metafields/import maps

Renderer asset publishing:
- server-side only
- only approved assets
```

---

## Suggested frontend integration steps

### Step 1: Parse current shell

Find:

```text
product card data structures
hardcoded product arrays
image URLs
option selectors
cart state
checkout link/button
gallery component
builder/configurator component
```

### Step 2: Create data adapter layer

Do not wire BigCommerce directly into every component.

Create:

```text
/lib/bigcommerce/productAdapter.ts
/lib/bigcommerce/cartAdapter.ts
/lib/renderer/renderManifestAdapter.ts
```

### Step 3: Replace hardcoded product data

Map BigCommerce product fields into the existing frontend shape.

Example adapter output:

```ts
type StorefrontProductViewModel = {
  productEntityId: number;
  name: string;
  path: string;
  brand?: string;
  priceLabel: string;
  defaultImageUrl: string;
  rendererEnabled: boolean;
  rendererConfigUrl?: string;
  options: ProductOptionViewModel[];
  variants: VariantViewModel[];
};
```

### Step 4: Add renderer component only where enabled

```ts
if (product.rendererEnabled && product.rendererConfigUrl) {
  return <PoolTableRenderer ... />;
}

return <StandardProductGallery ... />;
```

### Step 5: Wire variant/modifier selection

Frontend state should track:

```ts
selectedSizeSlug
selectedMaterialSlug
selectedFinishSlug
selectedClothSlug
selectedVariantEntityId
selectedModifierOptionValueIds
```

### Step 6: Add cart integration

Cart function should receive:

```ts
addConfiguredProductToCart({
  productEntityId,
  variantEntityId,
  quantity,
  selectedModifierValues,
  customDesignId
})
```

### Step 7: Review UX edge cases

Handle:

```text
missing render asset
selected finish has no overlay
selected cloth has no hex/texture
variant unavailable
BigCommerce price mismatch
custom design upload pending
mobile layout
slow image loading
```

---

## What the frontend chat should output

Ask the frontend chat/Codex to produce:

```text
1. Current shell audit
2. Component-to-data mapping
3. BigCommerce integration plan
4. Renderer component insertion points
5. Product page state model
6. Cart/add-to-cart plan
7. Files to create/change
8. Risks and blockers
9. MVP implementation steps
```

If coding, start with a fake `renderer_config_manifest.json` before connecting live BigCommerce. Do not debug BigCommerce and image compositing at the same time. That is how your afternoon goes missing.

---

## Important design opinion

Use BigCommerce for the transaction. Use your frontend for the experience.

Your advantage is not that BigCommerce can display an image. Your advantage is that your custom frontend can show a premium pool table builder that BigCommerce alone will never handle gracefully.

---

## Official implementation references

Verify current API details before coding.

- BigCommerce GraphQL Storefront products/options/metafields: https://docs.bigcommerce.com/developer/docs/storefront/guides/graphql-storefront-api/products-and-catalog/products
- BigCommerce GraphQL Storefront variants/metafields: https://docs.bigcommerce.com/developer/docs/storefront/guides/graphql-storefront-api/products-and-catalog/variants
- BigCommerce metafields: https://docs.bigcommerce.com/developer/docs/integrations/metafields
- BigCommerce GraphQL `addCartLineItems`: https://docs.bigcommerce.com/developer/api-reference/graphql/storefront/mutations/addCartLineItems
- BigCommerce API overview: https://docs.bigcommerce.com/developer/api-reference/about-our-apis
