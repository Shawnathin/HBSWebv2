export type ProductAvailability = "stock" | "custom" | "quote" | "unknown";

export type ProductCardViewModel = {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
  priceLabel: string;
  availability: ProductAvailability;
  sizes: string[];
  meta: string;
  badges: string[];
  fulfillmentBadge?: string;
  availabilityMessage?: string;
  leadTimeLabel?: string;
  shippingPromise?: string;
  swatches: string[];
  actionLabel: string;
  featured: boolean;
  prototypeOnly?: boolean;
};

export type CategoryFacetOptionViewModel = {
  label: string;
  value: string;
};

export type CategoryFacetViewModel = {
  title: string;
  options: CategoryFacetOptionViewModel[];
};

export type CategoryPageViewModel = {
  id: string;
  bigCommerceCategoryId: string;
  title: string;
  eyebrow: string;
  description: string;
  heroImage: {
    src: string;
    alt: string;
  };
  resultLabel: string;
  topFilters: CategoryFacetOptionViewModel[];
  facets: CategoryFacetViewModel[];
  sortOptions: CategoryFacetOptionViewModel[];
  products: ProductCardViewModel[];
  prototypeOnly?: boolean;
};
