import type { ProductCardViewModel } from "./category";

export type AustinBuildMode = "stock" | "custom";

export type AustinSizeOption = {
  id: string;
  name: string;
  subtitle: string;
  recommendedRoom: string;
  playFeel: string;
  basePrice: number;
  msrp: number;
  note: string;
  quoteOnly?: boolean;
  bigCommerceVariantId: string;
};

export type AustinFinishOption = {
  id: string;
  name: string;
  group: "Maple" | "Oak";
  tone: string;
  image: string;
  renderImage: string;
  upcharge: number;
  msrpUpcharge: number;
  rail: string;
  grain: string;
  bigCommerceVariantOptionValueId: string;
};

export type AustinClothOption = {
  id: string;
  name: string;
  family: "Championship Invitational" | "Championship Tour Edition";
  upcharge: number;
  msrpUpcharge: number;
  hex: string;
  note: string;
  bigCommerceModifierOptionId: string;
  bigCommerceModifierValueId: string;
};

export type AustinAddOnOption = {
  id: string;
  name: string;
  price: number;
  msrp: number;
  description: string;
  badge?: string;
  quoteOnly?: boolean;
  bigCommerceProductId: string;
};

export type AustinGalleryImage = {
  id: string;
  label: string;
  alt: string;
  src?: string;
};

export type AustinStockPackage = {
  id: string;
  name: string;
  subtitle: string;
  sizeId: string;
  finishId: string;
  note: string;
  bigCommerceVariantId: string;
};

export type AustinBuildState = {
  mode: AustinBuildMode;
  selectedSizeSlug: string;
  selectedFinishSlug: string;
  selectedClothSlug: string;
  selectedAddOnSlugs: string[];
  selectedVariantId: string;
  quoteRequired: boolean;
};

export type AustinProductViewModel = {
  id: string;
  bigCommerceProductId: string;
  slug: string;
  name: string;
  brand: string;
  breadcrumbs: { label: string; href: string }[];
  description: string;
  badges: string[];
  includedItems: string[];
  sizes: AustinSizeOption[];
  finishes: AustinFinishOption[];
  cloths: AustinClothOption[];
  addOns: AustinAddOnOption[];
  stockPackages: AustinStockPackage[];
  galleryImages: AustinGalleryImage[];
  relatedProducts: ProductCardViewModel[];
  defaultBuild: AustinBuildState;
  rendererManifestProductGroupKey: string;
  prototypeOnly?: boolean;
};
