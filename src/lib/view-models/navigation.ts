export type NavigationLink = {
  label: string;
  href: string;
  prototypeOnly?: boolean;
};

export type MegaMenuGroupViewModel = {
  title: string;
  href?: string;
  links: NavigationLink[];
};

export type MegaMenuFeatureViewModel = {
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  image?: {
    src: string;
    alt: string;
  };
};

export type MegaNavItemViewModel = NavigationLink & {
  groups?: MegaMenuGroupViewModel[];
  feature?: MegaMenuFeatureViewModel;
};

export type HeaderViewModel = {
  brand: {
    name: string;
    href: string;
  };
  contactHref: string;
  navItems: MegaNavItemViewModel[];
};

export type FooterColumnViewModel = {
  title: string;
  links: NavigationLink[];
};

export type FooterViewModel = {
  brandSummary: string;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  columns: FooterColumnViewModel[];
  socialLinks: NavigationLink[];
};

export type CartSummaryViewModel = {
  href: string;
  label: string;
  itemCount: number;
};
