import Link from "next/link";

import { CartLink } from "@/src/components/layout/CartLink";
import { MegaMenu } from "@/src/components/layout/MegaMenu";
import { SearchBar } from "@/src/components/layout/SearchBar";
import { mockCartSummary, mockHeader } from "@/src/data/mockNavigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-main">
        <Link aria-label="Home Billiards home" className="wordmark" href={mockHeader.brand.href}>
          Home<span>Billiards</span>
        </Link>
        <SearchBar />
        <div className="header-actions">
          <Link className="contact-button" href={mockHeader.contactHref}>
            Contact Us
          </Link>
          <CartLink cart={mockCartSummary} />
        </div>
      </div>
      <nav aria-label="Primary navigation" className="primary-nav">
        <ul>
          {mockHeader.navItems.map((item) => (
            <li className={item.groups?.length || item.feature ? "nav-item has-mega" : "nav-item"} key={item.label}>
              <Link href={item.href}>{item.label}</Link>
              <MegaMenu item={item} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
