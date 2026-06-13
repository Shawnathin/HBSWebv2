# Renderer Manifest Spec

Decision date: 2026-06-13

Scope: define the manifest format for pool-table renderer assets used by the future Next.js frontend. The Austin pool table is the MVP target. All BigCommerce IDs and asset hosts below are TODO placeholders unless otherwise confirmed.

## Purpose

Renderer manifests connect BigCommerce product/variant/modifier choices to frontend visual assets.

BigCommerce should answer:

- what product is being configured.
- which variants/modifiers are valid.
- what the price, inventory, and cart payload require.

The renderer manifest should answer:

- which image views exist.
- where cloth masks and shadow maps live.
- which finish overlay belongs to each material/finish/view.
- which cloth color/texture values can be previewed.
- which fallback image to show when renderer data is missing.

## File Format

- Format: JSON.
- Encoding: UTF-8.
- Naming: `renderer-manifest.v1.json`.
- Hosting: approved static asset host/CDN.
- Pointer: BigCommerce product metafield `hbc_renderer.renderer_config_v1`.
- The manifest should be cacheable and versioned.

## Top-Level Schema

```json
{
  "schema_version": "hbc-renderer-manifest-v1",
  "manifest_version": "TODO_VERSION",
  "product_group_key": "TODO_PRODUCT_GROUP_KEY",
  "vendor_slug": "TODO_VENDOR_SLUG",
  "product_slug": "TODO_PRODUCT_SLUG",
  "product_type": "pool-table",
  "bigcommerce": {
    "product_id": "TODO_BC_PRODUCT_ID",
    "variant_option_keys": ["size", "material", "finish"],
    "modifier_option_keys": ["cloth"]
  },
  "image": {
    "width": 2000,
    "height": 2000,
    "aspect_ratio": "1:1"
  },
  "default_view_slug": "front-3q",
  "default_finish_key": "TODO_MATERIAL_SLUG|TODO_FINISH_SLUG",
  "default_cloth_slug": "TODO_CLOTH_SLUG",
  "asset_base_url": "TODO_RENDER_ASSET_BASE_URL",
  "fallbacks": {
    "product_image_url": "TODO_FALLBACK_PRODUCT_IMAGE_URL",
    "missing_finish_overlay_url": "TODO_MISSING_FINISH_OVERLAY_URL",
    "missing_cloth_hex": "#1f5f4a"
  },
  "views": {},
  "finishes": {},
  "cloths": {}
}
```

Implementation note: actual BigCommerce IDs are numeric, but examples use TODO strings to avoid inventing IDs.

## View Schema

Each view should define the assets needed to render one angle.

```json
{
  "views": {
    "front-3q": {
      "display_name": "Front 3/4",
      "width": 2000,
      "height": 2000,
      "cloth_mask_url": "TODO_FRONT_3Q_CLOTH_MASK_URL",
      "cloth_shadow_map_url": "TODO_FRONT_3Q_CLOTH_SHADOW_MAP_URL",
      "cloth_geometry_url": "TODO_FRONT_3Q_CLOTH_GEOMETRY_URL",
      "base_shadow_url": "TODO_FRONT_3Q_BASE_SHADOW_URL",
      "finish_overlays": {
        "TODO_MATERIAL_SLUG|TODO_FINISH_SLUG": "TODO_FRONT_3Q_FINISH_OVERLAY_URL"
      }
    }
  }
}
```

Required for solid-color Austin MVP:

- `cloth_mask_url`
- `cloth_shadow_map_url`
- `finish_overlays`

Optional for later custom artwork:

- `cloth_geometry_url`
- `base_shadow_url`
- texture maps.

## Finish Schema

```json
{
  "finishes": {
    "TODO_MATERIAL_SLUG|TODO_FINISH_SLUG": {
      "material_slug": "TODO_MATERIAL_SLUG",
      "finish_slug": "TODO_FINISH_SLUG",
      "display_name": "TODO_FINISH_DISPLAY_NAME",
      "finish_family": "TODO_FINISH_FAMILY",
      "swatch_url": "TODO_FINISH_SWATCH_URL",
      "bigcommerce_variant_option_value_ids": {
        "material": "TODO_BC_MATERIAL_OPTION_VALUE_ID",
        "finish": "TODO_BC_FINISH_OPTION_VALUE_ID"
      },
      "status": "available"
    }
  }
}
```

Allowed `status` values:

- `available`
- `unavailable`
- `quote_only`
- `hidden`

## Cloth Schema

```json
{
  "cloths": {
    "TODO_CLOTH_SLUG": {
      "display_name": "TODO_CLOTH_DISPLAY_NAME",
      "family": "TODO_CLOTH_FAMILY",
      "hex": "#1f5f4a",
      "swatch_url": "TODO_CLOTH_SWATCH_URL",
      "texture_url": "TODO_CLOTH_TEXTURE_URL",
      "bigcommerce_modifier_option_id": "TODO_BC_MODIFIER_OPTION_ID_CLOTH",
      "bigcommerce_modifier_value_id": "TODO_BC_MODIFIER_VALUE_ID_CLOTH",
      "status": "available"
    }
  }
}
```

For MVP, `hex` is enough to preview solid-color cloth. Use `texture_url` later only after the rendering approach supports it cleanly.

## Asset Naming Convention

Use predictable lowercase slug paths:

```text
render-assets/
  california-house/
    austin/
      pool-table/
        TODO_SIZE_SCOPE/
          renderer-manifest.v1.json
          views/
            front-3q/
              cloth-mask.png
              cloth-shadow-map.png
              cloth-geometry.json
              overlays/
                maple-truffle.png
                maple-auburn.png
          swatches/
            finishes/
              maple-truffle.jpg
            cloths/
              tournament-green.jpg
```

Naming rules:

- use lowercase slugs.
- use hyphens in file and folder names.
- avoid spaces.
- include size scope if assets are size-specific.
- use stable material/finish keys.
- do not include BigCommerce numeric IDs in asset filenames.
- use manifest versioning when asset structure changes.

## Austin MVP Example

This example is intentionally incomplete and uses placeholders.

```json
{
  "schema_version": "hbc-renderer-manifest-v1",
  "manifest_version": "2026-06-13-austin-mvp-TODO",
  "product_group_key": "california_house|austin|pool_table|TODO_SIZE_SCOPE",
  "vendor_slug": "california-house",
  "product_slug": "austin-pool-table",
  "product_type": "pool-table",
  "bigcommerce": {
    "product_id": "TODO_BC_PRODUCT_ID_AUSTIN",
    "variant_option_keys": ["size", "material", "finish"],
    "modifier_option_keys": ["cloth"]
  },
  "image": {
    "width": 2000,
    "height": 2000,
    "aspect_ratio": "1:1"
  },
  "default_view_slug": "front-3q",
  "default_finish_key": "TODO_MATERIAL_SLUG|TODO_FINISH_SLUG",
  "default_cloth_slug": "TODO_CLOTH_SLUG",
  "asset_base_url": "TODO_RENDER_ASSET_BASE_URL",
  "fallbacks": {
    "product_image_url": "TODO_AUSTIN_FALLBACK_PRODUCT_IMAGE_URL",
    "missing_finish_overlay_url": "TODO_AUSTIN_MISSING_FINISH_OVERLAY_URL",
    "missing_cloth_hex": "#1f5f4a"
  },
  "views": {
    "front-3q": {
      "display_name": "Front 3/4",
      "width": 2000,
      "height": 2000,
      "cloth_mask_url": "TODO_AUSTIN_FRONT_3Q_CLOTH_MASK_URL",
      "cloth_shadow_map_url": "TODO_AUSTIN_FRONT_3Q_CLOTH_SHADOW_MAP_URL",
      "cloth_geometry_url": "TODO_AUSTIN_FRONT_3Q_CLOTH_GEOMETRY_URL",
      "finish_overlays": {
        "TODO_MATERIAL_SLUG|TODO_FINISH_SLUG": "TODO_AUSTIN_FRONT_3Q_FINISH_OVERLAY_URL"
      }
    }
  },
  "finishes": {
    "TODO_MATERIAL_SLUG|TODO_FINISH_SLUG": {
      "material_slug": "TODO_MATERIAL_SLUG",
      "finish_slug": "TODO_FINISH_SLUG",
      "display_name": "TODO_FINISH_DISPLAY_NAME",
      "finish_family": "TODO_FINISH_FAMILY",
      "swatch_url": "TODO_AUSTIN_FINISH_SWATCH_URL",
      "bigcommerce_variant_option_value_ids": {
        "material": "TODO_BC_MATERIAL_OPTION_VALUE_ID",
        "finish": "TODO_BC_FINISH_OPTION_VALUE_ID"
      },
      "status": "available"
    }
  },
  "cloths": {
    "TODO_CLOTH_SLUG": {
      "display_name": "TODO_CLOTH_DISPLAY_NAME",
      "family": "TODO_CLOTH_FAMILY",
      "hex": "#1f5f4a",
      "swatch_url": "TODO_AUSTIN_CLOTH_SWATCH_URL",
      "texture_url": "TODO_AUSTIN_CLOTH_TEXTURE_URL",
      "bigcommerce_modifier_option_id": "TODO_BC_MODIFIER_OPTION_ID_CLOTH",
      "bigcommerce_modifier_value_id": "TODO_BC_MODIFIER_VALUE_ID_CLOTH",
      "status": "available"
    }
  }
}
```

## Frontend Layer Order

Solid-color cloth MVP:

```text
1. cloth color layer clipped by cloth mask
2. cloth shadow map
3. selected finish overlay PNG
```

Custom logo/artwork later:

```text
1. customer artwork transformed by cloth geometry
2. cloth shadow map
3. selected finish overlay PNG
```

## Fallback Behavior

The renderer must fail softly.

| Failure | Frontend behavior |
| --- | --- |
| Product has no renderer metafield | Show standard `ProductGallery`; hide renderer-specific controls. |
| Manifest URL missing or request fails | Show fallback product image; keep option selection available; log server/client diagnostic without customer data. |
| Selected view missing | Use `default_view_slug`; if unavailable, use fallback product image. |
| Selected finish overlay missing | Use `missing_finish_overlay_url` if present; otherwise fallback product image. |
| Selected cloth missing | Use `missing_cloth_hex`; keep submitted BigCommerce modifier validation server-side. |
| Image dimensions missing | Use manifest top-level dimensions; otherwise use a stable square aspect ratio. |
| BigCommerce option no longer valid | Disable add-to-cart; show quote/contact path. |
| Price mismatch | Trust BigCommerce/server response and update displayed summary. |

## Validation Checklist

Before publishing a manifest:

- JSON parses successfully.
- `schema_version` is supported by the frontend.
- every enabled finish has an overlay for the default view.
- every cloth has a hex value for MVP preview.
- all URLs resolve on the asset host.
- image dimensions match the manifest dimensions.
- fallback image resolves.
- BigCommerce TODO IDs have been replaced only after catalog confirmation.
- no private asset tooling paths or local machine paths are present.
