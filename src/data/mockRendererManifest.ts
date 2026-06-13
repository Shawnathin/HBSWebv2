import { mockAustinProduct } from "@/src/data/mockAustinProduct";
import type { RendererManifestViewModel } from "@/src/lib/view-models/renderer";

const finishEntries = mockAustinProduct.finishes.map((finish) => {
  const key = `${finish.group.toLowerCase()}|${finish.id}`;

  return [
    key,
    {
      materialSlug: finish.group.toLowerCase(),
      finishSlug: finish.id,
      displayName: finish.name,
      finishFamily: finish.group,
      swatchUrl: finish.image,
      bigCommerceVariantOptionValueIds: {
        material: `TODO_BC_MATERIAL_OPTION_VALUE_ID_${finish.group.toUpperCase()}`,
        finish: finish.bigCommerceVariantOptionValueId
      },
      status: "available"
    }
  ] as const;
});

const clothEntries = mockAustinProduct.cloths.map((cloth) => {
  return [
    cloth.id,
    {
      displayName: cloth.name,
      family: cloth.family,
      hex: cloth.hex,
      bigCommerceModifierOptionId: cloth.bigCommerceModifierOptionId,
      bigCommerceModifierValueId: cloth.bigCommerceModifierValueId,
      status: "available"
    }
  ] as const;
});

export const mockRendererManifest: RendererManifestViewModel = {
  schemaVersion: "hbc-renderer-manifest-v1",
  manifestVersion: "2026-06-13-austin-mvp-TODO",
  productGroupKey: mockAustinProduct.rendererManifestProductGroupKey,
  vendorSlug: "california-house",
  productSlug: "austin-pool-table",
  productType: "pool-table",
  bigCommerce: {
    productId: "TODO_BC_PRODUCT_ID_AUSTIN",
    variantOptionKeys: ["size", "material", "finish"],
    modifierOptionKeys: ["cloth"]
  },
  image: {
    width: 2000,
    height: 2000,
    aspectRatio: "1:1"
  },
  defaultViewSlug: "front-3q",
  defaultFinishKey: "maple|truffle",
  defaultClothSlug: "invitational-charcoal",
  assetBaseUrl: "/assets",
  fallbacks: {
    productImageUrl: "/assets/california-house-austin-renders/truffle.png",
    missingFinishOverlayUrl: "/assets/california-house-austin-renders/truffle.png",
    missingClothHex: "#353634"
  },
  views: {
    "front-3q": {
      displayName: "Front 3/4",
      width: 2000,
      height: 2000,
      clothMaskUrl: "/assets/austin-pool-table-cloth-alpha-mask.png",
      clothShadowMapUrl: "/assets/austin-pool-table-cloth-mask.png",
      finishOverlays: Object.fromEntries(
        mockAustinProduct.finishes.map((finish) => [
          `${finish.group.toLowerCase()}|${finish.id}`,
          finish.renderImage
        ])
      )
    }
  },
  finishes: Object.fromEntries(finishEntries),
  cloths: Object.fromEntries(clothEntries),
  prototypeOnly: true
};
