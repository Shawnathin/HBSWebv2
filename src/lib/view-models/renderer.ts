export type RendererStatus = "available" | "unavailable" | "quote_only" | "hidden";

export type RendererViewModel = {
  displayName: string;
  width: number;
  height: number;
  clothMaskUrl: string;
  clothShadowMapUrl?: string;
  finishOverlays: Record<string, string>;
};

export type RendererFinishViewModel = {
  materialSlug: string;
  finishSlug: string;
  displayName: string;
  finishFamily: string;
  swatchUrl: string;
  status: RendererStatus;
  bigCommerceVariantOptionValueIds: {
    material: string;
    finish: string;
  };
};

export type RendererClothViewModel = {
  displayName: string;
  family: string;
  hex: string;
  status: RendererStatus;
  bigCommerceModifierOptionId: string;
  bigCommerceModifierValueId: string;
};

export type RendererManifestViewModel = {
  schemaVersion: "hbc-renderer-manifest-v1";
  manifestVersion: string;
  productGroupKey: string;
  vendorSlug: string;
  productSlug: string;
  productType: "pool-table";
  bigCommerce: {
    productId: string;
    variantOptionKeys: string[];
    modifierOptionKeys: string[];
  };
  image: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  defaultViewSlug: string;
  defaultFinishKey: string;
  defaultClothSlug: string;
  assetBaseUrl: string;
  fallbacks: {
    productImageUrl: string;
    missingFinishOverlayUrl: string;
    missingClothHex: string;
  };
  views: Record<string, RendererViewModel>;
  finishes: Record<string, RendererFinishViewModel>;
  cloths: Record<string, RendererClothViewModel>;
  prototypeOnly?: boolean;
};
