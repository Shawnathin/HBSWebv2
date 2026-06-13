import type {
  AustinAddOnOption,
  AustinClothOption,
  AustinFinishOption,
  AustinProductViewModel
} from "@/src/lib/view-models/austin";

function todoId(prefix: string, slug: string) {
  return `${prefix}_${slug.toUpperCase().replaceAll("-", "_")}`;
}

const finishAssetPath = "/assets/california-house-finishes";
const renderAssetPath = "/assets/california-house-austin-renders";

const finishes: AustinFinishOption[] = [
  {
    id: "auburn-distressed-glazed",
    name: "Auburn Distressed Glazed",
    group: "Maple",
    tone: "Warm distressed maple",
    image: `${finishAssetPath}/auburn-distressed-glazed.jpg`,
    renderImage: `${renderAssetPath}/auburn-distressed-glazed.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#6b3f28",
    grain: "#9a6747",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "auburn-distressed-glazed")
  },
  {
    id: "auburn",
    name: "Auburn",
    group: "Maple",
    tone: "Classic warm maple",
    image: `${finishAssetPath}/auburn.jpg`,
    renderImage: `${renderAssetPath}/auburn.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#6a4e32",
    grain: "#8d6d45",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "auburn")
  },
  {
    id: "coastal-grey-glazed",
    name: "Coastal Grey Glazed",
    group: "Maple",
    tone: "Layered grey maple",
    image: `${finishAssetPath}/coastal-grey-glazed.jpg`,
    renderImage: `${renderAssetPath}/coastal-grey-glazed.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#777c7c",
    grain: "#a0a4a0",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "coastal-grey-glazed")
  },
  {
    id: "coastal-grey",
    name: "Coastal Grey",
    group: "Maple",
    tone: "Soft grey maple",
    image: `${finishAssetPath}/coastal-grey.jpg`,
    renderImage: `${renderAssetPath}/coastal-grey.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#a9a398",
    grain: "#c9c0ae",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "coastal-grey")
  },
  {
    id: "dusk",
    name: "Dusk",
    group: "Maple",
    tone: "Deep modern maple",
    image: `${finishAssetPath}/dusk.jpg`,
    renderImage: `${renderAssetPath}/dusk.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#302d2d",
    grain: "#4b4643",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "dusk")
  },
  {
    id: "frost",
    name: "Frost",
    group: "Maple",
    tone: "Light painted maple",
    image: `${finishAssetPath}/frost.jpg`,
    renderImage: `${renderAssetPath}/frost.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#efe9df",
    grain: "#f7f2e8",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "frost")
  },
  {
    id: "honey-distressed-glazed",
    name: "Honey Distressed Glazed",
    group: "Maple",
    tone: "Golden distressed maple",
    image: `${finishAssetPath}/honey-distressed-glazed.jpg`,
    renderImage: `${renderAssetPath}/honey-distressed-glazed.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#9d7340",
    grain: "#c09a60",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "honey-distressed-glazed")
  },
  {
    id: "honey",
    name: "Honey",
    group: "Maple",
    tone: "Golden maple",
    image: `${finishAssetPath}/honey.jpg`,
    renderImage: `${renderAssetPath}/honey.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#9b7b43",
    grain: "#c4a460",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "honey")
  },
  {
    id: "java",
    name: "Java",
    group: "Maple",
    tone: "Dark espresso maple",
    image: `${finishAssetPath}/java.jpg`,
    renderImage: `${renderAssetPath}/java.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#342824",
    grain: "#4d3d34",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "java")
  },
  {
    id: "midnight",
    name: "Midnight",
    group: "Maple",
    tone: "Black painted maple",
    image: `${finishAssetPath}/midnight.jpg`,
    renderImage: `${renderAssetPath}/midnight.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#111111",
    grain: "#232323",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "midnight")
  },
  {
    id: "sand",
    name: "Sand",
    group: "Maple",
    tone: "Light neutral maple",
    image: `${finishAssetPath}/sand.jpg`,
    renderImage: `${renderAssetPath}/sand.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#d9c28b",
    grain: "#ead7a7",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "sand")
  },
  {
    id: "toast",
    name: "Toast",
    group: "Maple",
    tone: "Medium brown maple",
    image: `${finishAssetPath}/toast.jpg`,
    renderImage: `${renderAssetPath}/toast.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#5c4638",
    grain: "#7b604b",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "toast")
  },
  {
    id: "copper-oak",
    name: "Copper Oak",
    group: "Oak",
    tone: "Warm textured oak",
    image: `${finishAssetPath}/copper-oak.jpg`,
    renderImage: `${renderAssetPath}/copper-oak.png`,
    upcharge: 2000,
    msrpUpcharge: 2000,
    rail: "#8b5526",
    grain: "#b06c31",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "copper-oak")
  },
  {
    id: "graphite-oak",
    name: "Graphite Oak",
    group: "Oak",
    tone: "Dark textured oak",
    image: `${finishAssetPath}/graphite-oak.jpg`,
    renderImage: `${renderAssetPath}/graphite-oak.png`,
    upcharge: 2000,
    msrpUpcharge: 2000,
    rail: "#42352e",
    grain: "#5c4a3d",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "graphite-oak")
  },
  {
    id: "rustic-white-oak",
    name: "Rustic White Oak",
    group: "Oak",
    tone: "Natural rustic oak",
    image: `${finishAssetPath}/rustic-white-oak.jpg`,
    renderImage: `${renderAssetPath}/rustic-white-oak.png`,
    upcharge: 2000,
    msrpUpcharge: 2000,
    rail: "#b8995c",
    grain: "#d9ba77",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "rustic-white-oak")
  },
  {
    id: "truffle",
    name: "Truffle",
    group: "Maple",
    tone: "Rich dark maple",
    image: `${finishAssetPath}/truffle.jpg`,
    renderImage: `${renderAssetPath}/truffle.png`,
    upcharge: 0,
    msrpUpcharge: 0,
    rail: "#4a382c",
    grain: "#644b3a",
    bigCommerceVariantOptionValueId: todoId("TODO_BC_FINISH_OPTION_VALUE_ID", "truffle")
  }
];

const clothSeeds = [
  ["invitational-red", "Red", "Championship Invitational", 0, "#B90610"],
  ["invitational-burgundy", "Burgundy", "Championship Invitational", 0, "#8E1013"],
  ["invitational-titanium", "Titanium", "Championship Invitational", 0, "#2E3945"],
  ["invitational-charcoal", "Charcoal", "Championship Invitational", 0, "#353634"],
  ["invitational-steel-grey", "Steel Grey", "Championship Invitational", 0, "#5D6C60"],
  ["invitational-black", "Black", "Championship Invitational", 0, "#1A1918"],
  ["invitational-purple", "Purple", "Championship Invitational", 0, "#1A1173"],
  ["invitational-olive", "Olive", "Championship Invitational", 0, "#525132"],
  ["invitational-taupe", "Taupe", "Championship Invitational", 0, "#6E582F"],
  ["invitational-golden", "Golden", "Championship Invitational", 0, "#B48824"],
  ["invitational-khaki", "Khaki", "Championship Invitational", 0, "#8D7B52"],
  ["invitational-camel", "Camel", "Championship Invitational", 0, "#936B3C"],
  ["invitational-brown", "Brown", "Championship Invitational", 0, "#5A3216"],
  ["invitational-basic-green", "Basic Green", "Championship Invitational", 0, "#025F65"],
  ["invitational-championship-green", "Championship Green", "Championship Invitational", 0, "#026E4B"],
  ["invitational-dark-green", "Dark Green", "Championship Invitational", 0, "#04392D"],
  ["invitational-bottle-green", "Bottle Green", "Championship Invitational", 0, "#113028"],
  ["invitational-english-green", "English Green", "Championship Invitational", 0, "#035012"],
  ["invitational-aztec", "Aztec", "Championship Invitational", 0, "#AB5108"],
  ["invitational-brick", "Brick", "Championship Invitational", 0, "#752F0B"],
  ["invitational-navy", "Navy", "Championship Invitational", 0, "#162133"],
  ["invitational-wine", "Wine", "Championship Invitational", 0, "#48161A"],
  ["invitational-academy-blue", "Academy Blue", "Championship Invitational", 0, "#314A74"],
  ["invitational-championship-blue", "Championship Blue", "Championship Invitational", 0, "#0362B6"],
  ["invitational-euro-blue", "Euro Blue", "Championship Invitational", 0, "#022EA3"],
  ["invitational-electric-blue", "Electric Blue", "Championship Invitational", 0, "#054CBC"],
  ["tour-championship-green", "Championship Green", "Championship Tour Edition", 249, "#026E4B"],
  ["tour-dark-green", "Dark Green", "Championship Tour Edition", 249, "#04392D"],
  ["tour-red", "Red", "Championship Tour Edition", 249, "#B90610"],
  ["tour-olive", "Olive", "Championship Tour Edition", 249, "#525132"],
  ["tour-bottle-green", "Bottle Green", "Championship Tour Edition", 249, "#113028"],
  ["tour-electric-blue", "Electric Blue", "Championship Tour Edition", 249, "#054CBC"],
  ["tour-camel", "Camel", "Championship Tour Edition", 249, "#936B3C"],
  ["tour-euro-blue", "Euro Blue", "Championship Tour Edition", 249, "#022EA3"],
  ["tour-navy", "Navy", "Championship Tour Edition", 249, "#162133"],
  ["tour-burgundy", "Burgundy", "Championship Tour Edition", 249, "#8E1013"],
  ["tour-merlot", "Merlot", "Championship Tour Edition", 249, "#5B1424"],
  ["tour-wine", "Wine", "Championship Tour Edition", 249, "#48161A"],
  ["tour-steel-grey", "Steel Grey", "Championship Tour Edition", 249, "#5D6C60"],
  ["tour-charcoal", "Charcoal", "Championship Tour Edition", 249, "#353634"],
  ["tour-black", "Black", "Championship Tour Edition", 249, "#1A1918"],
  ["tour-championship-blue", "Championship Blue", "Championship Tour Edition", 249, "#0362B6"],
  ["tour-lilac", "Lilac", "Championship Tour Edition", 249, "#9B82B8"]
] as const;

const cloths: AustinClothOption[] = clothSeeds.map(([id, name, family, upcharge, hex]) => ({
  id,
  name,
  family,
  upcharge,
  msrpUpcharge: upcharge,
  hex,
  note: upcharge > 0 ? "Tournament cloth upgrade." : "Included cloth colour.",
  bigCommerceModifierOptionId: "TODO_BC_MODIFIER_OPTION_ID_CLOTH",
  bigCommerceModifierValueId: todoId("TODO_BC_MODIFIER_VALUE_ID_CLOTH", id)
}));

const addOns: AustinAddOnOption[] = [
  {
    id: "dining-top",
    name: "Matching Dining Top",
    price: 2900,
    msrp: 3600,
    description: "Converts the table into a dining or boardroom surface.",
    badge: "Most requested",
    bigCommerceProductId: "TODO_BC_PRODUCT_ID_AUSTIN_DINING_TOP"
  },
  {
    id: "bench",
    name: "Matching Bench Set",
    price: 1800,
    msrp: 2300,
    description: "Designed to match the table finish and tuck cleanly away.",
    bigCommerceProductId: "TODO_BC_PRODUCT_ID_AUSTIN_BENCH_SET"
  },
  {
    id: "lighting",
    name: "Premium Table Lighting",
    price: 1200,
    msrp: 1600,
    description: "Recommended for dedicated rooms or darker interiors.",
    bigCommerceProductId: "TODO_BC_PRODUCT_ID_PREMIUM_TABLE_LIGHTING"
  },
  {
    id: "designer-review",
    name: "Designer Finish Review",
    price: 0,
    msrp: 0,
    quoteOnly: true,
    description: "Send room photos, finish samples, and plans for a more precise recommendation.",
    badge: "Quote required",
    bigCommerceProductId: "TODO_QUOTE_SERVICE_ID_DESIGNER_FINISH_REVIEW"
  }
];

export const mockAustinProduct: AustinProductViewModel = {
  id: "austin-pool-table",
  bigCommerceProductId: "TODO_BC_PRODUCT_ID_AUSTIN",
  slug: "austin-pool-table",
  name: "Austin Pool Table",
  brand: "California House",
  breadcrumbs: [
    { label: "Billiards", href: "/pool-tables" },
    { label: "Pool Tables", href: "/pool-tables" },
    { label: "California House", href: "#" },
    { label: "Austin Pool Table", href: "/pool-tables/austin-pool-table" }
  ],
  description:
    "The Austin Pool Table is one of the finest pool tables made today and many of our customers design their billiard room around the clean design.",
  badges: ["In stock", "Ready for Install"],
  includedItems: [
    "Delivery and installation in the Greater Vancouver area.",
    "Cues, balls, rack, chalk, brush, and bridge cue included.",
    "Configuration is saved with your quote or cart request."
  ],
  sizes: [
    {
      id: "7ft",
      name: "7 Foot",
      subtitle: "Best for tighter rooms",
      recommendedRoom: "13' x 16' minimum",
      playFeel: "Bar size / casual",
      basePrice: 13995,
      msrp: 15995,
      note: "Easy fit for condos and multi-use rooms.",
      bigCommerceVariantId: "TODO_BC_VARIANT_ID_AUSTIN_7FT"
    },
    {
      id: "8ft",
      name: "8 Foot",
      subtitle: "Most popular home size",
      recommendedRoom: "13' 6\" x 17' minimum",
      playFeel: "Balanced home play",
      basePrice: 16995,
      msrp: 18995,
      note: "The easiest size to play up or down from.",
      bigCommerceVariantId: "TODO_BC_VARIANT_ID_AUSTIN_8FT"
    },
    {
      id: "9ft",
      name: "9 Foot",
      subtitle: "Tournament presence",
      recommendedRoom: "14' x 18' minimum",
      playFeel: "Full competitive layout",
      basePrice: 19995,
      msrp: 22995,
      note: "Best for dedicated billiard rooms.",
      bigCommerceVariantId: "TODO_BC_VARIANT_ID_AUSTIN_9FT"
    },
    {
      id: "custom",
      name: "Custom Size",
      subtitle: "Designer / project quote",
      recommendedRoom: "Reviewed by specialist",
      playFeel: "Built around the space",
      basePrice: 0,
      msrp: 0,
      quoteOnly: true,
      note: "For exact dimensions or project requirements.",
      bigCommerceVariantId: "TODO_BC_VARIANT_ID_AUSTIN_CUSTOM_QUOTE"
    }
  ],
  finishes,
  cloths,
  addOns,
  stockPackages: [
    {
      id: "truffle-8ft-ready",
      name: "California House Austin",
      subtitle: "In-stock option - fastest delivery",
      sizeId: "8ft",
      finishId: "truffle",
      note:
        "Size and finish are already set. Choose your cloth and any add-ons, then request delivery timing.",
      bigCommerceVariantId: "TODO_BC_VARIANT_ID_AUSTIN_8FT_TRUFFLE_READY"
    }
  ],
  galleryImages: [
    {
      id: "build",
      label: "Editable table render",
      alt: "California House Austin pool table configurable render"
    },
    {
      id: "auburn-khaki",
      label: "Auburn with khaki cloth",
      src: "/assets/austin-gallery/austin-auburn-khaki.jpg",
      alt: "California House Austin pool table in Auburn finish with Khaki cloth"
    },
    {
      id: "room-wide",
      label: "Room scene",
      src: "/assets/austin-gallery/austin-roomscene-wide.jpg",
      alt: "Austin pool table in a furnished game room"
    },
    {
      id: "room",
      label: "Alternate room scene",
      src: "/assets/austin-gallery/austin-roomscene.jpg",
      alt: "Austin pool table room scene from California House"
    },
    {
      id: "end-view",
      label: "End view",
      src: "/assets/austin-gallery/austin-end-view.jpg",
      alt: "End view detail of the Austin pool table"
    },
    {
      id: "internal-pockets",
      label: "Internal pockets",
      src: "/assets/austin-gallery/austin-internal-pockets.jpg",
      alt: "Austin pool table internal pocket detail"
    },
    {
      id: "honey-steel-grey",
      label: "Honey with steel grey cloth",
      src: "/assets/austin-gallery/austin-honey-steel-grey-room.jpg",
      alt: "Austin pool table in Honey finish with Steel Grey cloth"
    },
    {
      id: "chassis",
      label: "Chassis detail",
      src: "/assets/austin-gallery/austin-chassis.jpg",
      alt: "Austin pool table chassis detail"
    }
  ],
  relatedProducts: [
    {
      id: "austin-pool-table",
      name: "Austin Pool Table",
      brand: "California House",
      brandId: "california-house",
      href: "/pool-tables/austin-pool-table",
      image: {
        src: "/assets/california-house-austin-renders/truffle.png",
        alt: "Austin Pool Table"
      },
      priceLabel: "From $20,545",
      availability: "custom",
      sizes: ["7ft", "8ft", "9ft"],
      meta: "Shown in Truffle with custom cloth options",
      badges: ["Custom build"],
      swatches: ["#4a382c", "#9d7340", "#302d2d", "#efe9df"],
      actionLabel: "Customize",
      featured: true,
      prototypeOnly: true
    },
    {
      id: "austin-shuffleboard-table",
      name: "Austin Shuffleboard Table",
      brand: "California House",
      brandId: "california-house",
      href: "#",
      image: {
        src: "/assets/california-house-austin-renders/auburn.png",
        alt: "Austin Shuffleboard Table reference image"
      },
      priceLabel: "Request quote",
      availability: "quote",
      sizes: [],
      meta: "Matching Austin profile, available by order",
      badges: ["Quote"],
      swatches: ["#6a4e32", "#8d6d45"],
      actionLabel: "Preview card",
      featured: false,
      prototypeOnly: true
    },
    {
      id: "austin-game-table",
      name: "Austin Reversible Top Game Table",
      brand: "California House",
      brandId: "california-house",
      href: "#",
      image: {
        src: "/assets/california-house-austin-renders/honey.png",
        alt: "Austin Reversible Top Game Table reference image"
      },
      priceLabel: "Request quote",
      availability: "quote",
      sizes: [],
      meta: "Dining and game table companion piece",
      badges: ["Quote"],
      swatches: ["#9b7b43", "#c4a460"],
      actionLabel: "Preview card",
      featured: false,
      prototypeOnly: true
    }
  ],
  defaultBuild: {
    mode: "stock",
    selectedSizeSlug: "8ft",
    selectedFinishSlug: "truffle",
    selectedClothSlug: "invitational-charcoal",
    selectedAddOnSlugs: [],
    selectedVariantId: "TODO_BC_VARIANT_ID_AUSTIN_SELECTED_BUILD",
    quoteRequired: false
  },
  rendererManifestProductGroupKey: "california_house|austin|pool_table|TODO_SIZE_SCOPE",
  prototypeOnly: true
};
