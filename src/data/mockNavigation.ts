import type {
  CartSummaryViewModel,
  FooterViewModel,
  HeaderViewModel,
  MegaNavItemViewModel
} from "@/src/lib/view-models/navigation";

const billiardsGroups: MegaNavItemViewModel["groups"] = [
  {
    title: "Pool Tables",
    href: "/pool-tables",
    links: [
      { label: "In-Stock Pool Tables", href: "/pool-tables" },
      { label: "Canada Billiards", href: "#", prototypeOnly: true },
      { label: "California House", href: "#", prototypeOnly: true },
      { label: "Olhausen Billiards", href: "#", prototypeOnly: true },
      { label: "Legacy Billiards", href: "#", prototypeOnly: true },
      { label: "Custom Pool Tables", href: "#", prototypeOnly: true }
    ]
  },
  {
    title: "Accessories",
    links: [
      { label: "Pool Table Felt", href: "#", prototypeOnly: true },
      { label: "Pool Table Covers", href: "#", prototypeOnly: true },
      { label: "Pool Table Lights", href: "#", prototypeOnly: true },
      { label: "Dining Tops", href: "#", prototypeOnly: true },
      { label: "Benches and Storage", href: "#", prototypeOnly: true }
    ]
  },
  {
    title: "Billiards Gear",
    links: [
      { label: "Pool Cues", href: "/cues", prototypeOnly: true },
      { label: "Pool Cue Cases", href: "#", prototypeOnly: true },
      { label: "Balls", href: "#", prototypeOnly: true },
      { label: "Pool Cue Racks and Holders", href: "#", prototypeOnly: true },
      { label: "Billiard Accessories", href: "#", prototypeOnly: true }
    ]
  },
  {
    title: "Planning",
    links: [
      { label: "Pool Table Design Center", href: "#", prototypeOnly: true },
      { label: "Room Size Guide", href: "#", prototypeOnly: true },
      { label: "Delivery and Installation", href: "#", prototypeOnly: true },
      { label: "Moving and Recovering", href: "#", prototypeOnly: true },
      { label: "Commercial Projects", href: "#", prototypeOnly: true }
    ]
  }
];

export const mockHeader: HeaderViewModel = {
  brand: {
    name: "Home Billiards",
    href: "/"
  },
  contactHref: "/contact-us",
  navItems: [
    {
      label: "Billiards",
      href: "/pool-tables",
      groups: billiardsGroups,
      feature: {
        title: "Build a luxury pool table",
        body: "Choose size, finish, cloth, and room upgrades.",
        href: "/pool-tables/austin-pool-table",
        ctaLabel: "Customize the Austin",
        image: {
          src: "/assets/california-house-austin-renders/truffle.png",
          alt: "California House Austin pool table"
        }
      }
    },
    {
      label: "Ping Pong",
      href: "/ping-pong-tables",
      prototypeOnly: true,
      groups: [
        {
          title: "Ping Pong Tables",
          href: "/ping-pong-tables",
          links: [
            { label: "Indoor Tables", href: "/ping-pong-tables", prototypeOnly: true },
            { label: "Outdoor Tables", href: "#", prototypeOnly: true },
            { label: "Competition Tables", href: "#", prototypeOnly: true },
            { label: "Foldable Tables", href: "#", prototypeOnly: true }
          ]
        },
        {
          title: "Accessories",
          links: [
            { label: "Ping Pong Paddles", href: "#", prototypeOnly: true },
            { label: "Ping Pong Balls", href: "#", prototypeOnly: true },
            { label: "Nets and Posts", href: "#", prototypeOnly: true },
            { label: "Ping Pong Robots", href: "#", prototypeOnly: true }
          ]
        },
        {
          title: "Care",
          links: [
            { label: "Table Covers", href: "#", prototypeOnly: true },
            { label: "Replacement Nets", href: "#", prototypeOnly: true },
            { label: "Storage and Care", href: "#", prototypeOnly: true },
            { label: "Training Accessories", href: "#", prototypeOnly: true }
          ]
        },
        {
          title: "Shop by Need",
          links: [
            { label: "Family Play", href: "#", prototypeOnly: true },
            { label: "Club Practice", href: "#", prototypeOnly: true },
            { label: "Commercial Use", href: "#", prototypeOnly: true },
            { label: "Made in Germany", href: "#", prototypeOnly: true }
          ]
        }
      ],
      feature: {
        title: "Whistler Indoor Table Tennis Table",
        body: "A reference PDP exists in the static prototype for later migration.",
        href: "/ping-pong-tables",
        ctaLabel: "Shop ping pong tables"
      }
    },
    {
      label: "BBQ",
      href: "/traeger-smokers",
      prototypeOnly: true,
      groups: [
        {
          title: "Grills and Smokers",
          links: [
            { label: "Traeger Smokers", href: "/traeger-smokers", prototypeOnly: true },
            { label: "Pellet Grills", href: "#", prototypeOnly: true },
            { label: "Pizza Ovens", href: "#", prototypeOnly: true },
            { label: "Portable Grills", href: "#", prototypeOnly: true }
          ]
        },
        {
          title: "Fuel and Flavour",
          links: [
            { label: "Wood Pellets", href: "#", prototypeOnly: true },
            { label: "Sauces and Spices", href: "#", prototypeOnly: true },
            { label: "Rubs", href: "#", prototypeOnly: true },
            { label: "Cooking Pellets", href: "#", prototypeOnly: true }
          ]
        }
      ],
      feature: {
        title: "Build the backyard setup",
        body: "Smokers, pellets, covers, tools, and outdoor cooking accessories.",
        href: "/traeger-smokers",
        ctaLabel: "Shop BBQ essentials"
      }
    },
    { label: "Foosball", href: "#", prototypeOnly: true },
    { label: "Darts", href: "/dartboards", prototypeOnly: true },
    { label: "Games", href: "#", prototypeOnly: true },
    { label: "Commercial", href: "#", prototypeOnly: true },
    { label: "New Arrivals", href: "#", prototypeOnly: true },
    { label: "Sale", href: "#", prototypeOnly: true },
    { label: "Made in Canada", href: "#", prototypeOnly: true }
  ]
};

export const mockFooter: FooterViewModel = {
  brandSummary:
    "Canada's destination for luxury game rooms, billiards, outdoor living, and commercial play spaces.",
  contact: {
    address: "1644 S.E. Marine Drive, Vancouver, BC V5P 2R6",
    phone: "604 321 5553",
    email: "info@homebilliards.ca"
  },
  columns: [
    {
      title: "Navigate",
      links: [
        { label: "Privacy Policy", href: "#", prototypeOnly: true },
        { label: "Terms and Conditions", href: "#", prototypeOnly: true },
        { label: "About Us", href: "#", prototypeOnly: true },
        { label: "Pool Table Design Center", href: "#", prototypeOnly: true },
        { label: "Services We Provide", href: "#", prototypeOnly: true },
        { label: "Shipping and Returns", href: "#", prototypeOnly: true },
        { label: "Resources", href: "#", prototypeOnly: true }
      ]
    },
    {
      title: "Categories",
      links: [
        { label: "Billiards", href: "/pool-tables" },
        { label: "Ping Pong", href: "/ping-pong-tables", prototypeOnly: true },
        { label: "BBQ", href: "/traeger-smokers", prototypeOnly: true },
        { label: "Foosball", href: "#", prototypeOnly: true },
        { label: "Darts", href: "/dartboards", prototypeOnly: true },
        { label: "Games", href: "#", prototypeOnly: true },
        { label: "Commercial", href: "#", prototypeOnly: true },
        { label: "New Arrivals", href: "#", prototypeOnly: true },
        { label: "Sale", href: "#", prototypeOnly: true },
        { label: "Made in Canada", href: "#", prototypeOnly: true }
      ]
    },
    {
      title: "Popular Brands",
      links: [
        { label: "Canada Billiards", href: "#", prototypeOnly: true },
        { label: "Legacy Billiards", href: "#", prototypeOnly: true },
        { label: "Olhausen Billiards", href: "#", prototypeOnly: true },
        { label: "Traeger", href: "#", prototypeOnly: true },
        { label: "California House", href: "#", prototypeOnly: true },
        { label: "Predator", href: "#", prototypeOnly: true },
        { label: "Winmau", href: "#", prototypeOnly: true },
        { label: "Championship Shuffleboard", href: "#", prototypeOnly: true },
        { label: "Dynamo", href: "#", prototypeOnly: true },
        { label: "Harrow", href: "#", prototypeOnly: true }
      ]
    }
  ],
  socialLinks: [
    { label: "Facebook", href: "#", prototypeOnly: true },
    { label: "Twitter", href: "#", prototypeOnly: true },
    { label: "YouTube", href: "#", prototypeOnly: true },
    { label: "Instagram", href: "#", prototypeOnly: true }
  ]
};

export const mockCartSummary: CartSummaryViewModel = {
  href: "/cart",
  label: "My Cart",
  itemCount: 0
};
