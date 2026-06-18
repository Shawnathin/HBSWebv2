import type { CategoryPageViewModel, ProductAvailability } from "@/src/lib/view-models/category";

const productCatalog = {
  "california-house": [
    "atherton-pool-table",
    "austin-pool-table",
    "basecamp-pool-table",
    "city-pool-table",
    "cypress-pool-table",
    "district-pool-table",
    "highland-pool-table",
    "menlo-pool-table",
    "origami-pool-table",
    "rincon-pool-table",
    "sutter-pool-table",
    "tahoe-pool-table",
    "vista-pool-table",
    "windansea-pool-table"
  ],
  "canada-billiard": [
    "aristocrat",
    "banff",
    "barn",
    "black-crown",
    "boulevard",
    "bridge",
    "canadiana",
    "canyon",
    "cloud",
    "colonial",
    "divine",
    "dream",
    "duchess",
    "elegance",
    "euro",
    "evolution",
    "heritage",
    "ideal",
    "industria",
    "invitation",
    "la-condo-stainless",
    "la-condo",
    "lacondo-duo",
    "laforge",
    "loft",
    "lotus",
    "lounge",
    "luxx",
    "majesty",
    "maze",
    "monarch",
    "mystere",
    "obsession",
    "onyx",
    "orlando",
    "pacific",
    "prestige",
    "queen-ann-ii",
    "ranch",
    "rebel-snooker",
    "regance",
    "revolution",
    "shack",
    "special-anniversary",
    "storm",
    "supreme",
    "tendance",
    "tentation",
    "touch",
    "track",
    "venus",
    "xtreme"
  ],
  olhausen: [
    "americana",
    "augusta",
    "belmont",
    "blackhawk",
    "breckenridge",
    "brentwood",
    "chicago",
    "classic",
    "durango",
    "encore",
    "hampton",
    "heritage",
    "laguna",
    "luxor",
    "madison",
    "metro",
    "monarch",
    "oceanside",
    "palazzo",
    "railyard",
    "regent",
    "remington",
    "reno",
    "riviera",
    "santa-ana",
    "seville",
    "sheraton-laminate",
    "sheraton",
    "southern",
    "st-andrews",
    "st-george",
    "st-leone",
    "timber-ridge",
    "townhouse",
    "tustin",
    "venetian",
    "waterfall",
    "west-end",
    "york",
    "youngstown"
  ]
};

const brandDetails = {
  "california-house": {
    name: "California House",
    basePrice: 18500,
    swatches: ["#4a382c", "#9d7340", "#302d2d", "#efe9df"],
    badge: "Custom build",
    meta: "California-made table - finish and cloth paths"
  },
  "canada-billiard": {
    name: "Canada Billiard",
    basePrice: 9400,
    swatches: ["#42352e", "#efe9df", "#6a4e32", "#111111"],
    badge: "Made in Canada",
    meta: "Canadian table - multiple room-ready styles"
  },
  olhausen: {
    name: "Olhausen",
    basePrice: 11200,
    swatches: ["#6a4e32", "#9b7b43", "#342824", "#efe9df"],
    badge: "Room review",
    meta: "Designer hardwood table - ordered through showroom"
  }
};

type BrandId = keyof typeof brandDetails;

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0
});

function titleFromSlug(slug: string) {
  return slug
    .replace(/-pool-table/g, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sizesFor(index: number, brandId: BrandId) {
  const sets = [
    ["7ft", "8ft"],
    ["8ft"],
    ["8ft", "9ft"],
    ["7ft", "8ft", "9ft"]
  ];

  return brandId === "california-house" ? sets[(index + 1) % sets.length] : sets[index % sets.length];
}

function availabilityFor(index: number, brandId: BrandId): ProductAvailability {
  if (brandId === "california-house") return index % 4 === 1 ? "stock" : "custom";
  if (brandId === "canada-billiard") return index % 5 === 0 ? "stock" : "custom";
  return index % 6 === 0 ? "stock" : "custom";
}

function priceFor(index: number, brand: (typeof brandDetails)[BrandId]) {
  return brand.basePrice + ((index * 1375) % 10800);
}

const products = Object.entries(productCatalog).flatMap(([brandId, slugs]) => {
  const typedBrandId = brandId as BrandId;
  const brand = brandDetails[typedBrandId];

  return slugs.map((slug, index) => {
    const availability = availabilityFor(index, typedBrandId);
    const sizes = sizesFor(index, typedBrandId);
    const price = priceFor(index, brand);
    const name = `${titleFromSlug(slug)} Pool Table`;
    const isAustin = slug === "austin-pool-table";

    return {
      id: `${brandId}-${slug}`,
      name,
      brand: brand.name,
      brandId,
      href: isAustin ? "/pool-tables/austin-pool-table" : "#",
      image: {
        src: `/assets/pool-table-products/${brandId}/${slug}.png`,
        alt: `${brand.name} ${name}`
      },
      priceLabel: `From ${money.format(price)}`,
      availability,
      sizes,
      meta: `${sizes.map((size) => size.replace("ft", " Foot")).join(", ")} - ${brand.meta}`,
      badges: [availability === "stock" ? "In stock" : brand.badge],
      // Prototype-only example of a backend-provided fulfillment field.
      // Future adapters must map this from product/category data, not default it globally.
      fulfillmentBadge: isAustin ? "Ships in 24 business hours" : undefined,
      actionLabel: isAustin ? "Customize" : "Preview card",
      featured: isAustin || slug === "menlo-pool-table" || slug === "la-condo" || slug === "encore",
      swatches: brand.swatches,
      prototypeOnly: true
    };
  });
});

export const mockPoolTablesCategory: CategoryPageViewModel = {
  id: "pool-tables",
  bigCommerceCategoryId: "TODO_BC_CATEGORY_ID_POOL_TABLES",
  title: "Pool Tables",
  eyebrow: "Billiards",
  description:
    "In-stock and custom pool tables arranged from the current prototype's brand, filter, and card structure.",
  heroImage: {
    src: "/assets/pool-table-room-hero.webp",
    alt: "Finished game room with a pool table"
  },
  resultLabel: `${products.length} prototype product cards`,
  topFilters: [
    { label: "All Pool Tables", value: "all" },
    { label: "In Stock", value: "stock" },
    { label: "Custom Order", value: "custom" },
    { label: "California House", value: "california-house" },
    { label: "Canada Billiard", value: "canada-billiard" },
    { label: "Olhausen", value: "olhausen" }
  ],
  facets: [
    {
      title: "Brand",
      options: [
        { label: "California House", value: "california-house" },
        { label: "Canada Billiard", value: "canada-billiard" },
        { label: "Olhausen", value: "olhausen" }
      ]
    },
    {
      title: "Availability",
      options: [
        { label: "In stock", value: "stock" },
        { label: "Custom order", value: "custom" }
      ]
    },
    {
      title: "Size",
      options: [
        { label: "7 Foot", value: "7ft" },
        { label: "8 Foot", value: "8ft" },
        { label: "9 Foot", value: "9ft" }
      ]
    }
  ],
  sortOptions: [
    { label: "Featured", value: "featured" },
    { label: "Price low to high", value: "price-low" },
    { label: "Price high to low", value: "price-high" },
    { label: "Fastest delivery", value: "delivery" }
  ],
  products,
  prototypeOnly: true
};
