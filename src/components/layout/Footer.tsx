import Link from "next/link";

import { mockFooter } from "@/src/data/mockNavigation";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <div className="site-footer-logo">
            Home<span>Billiards</span>
          </div>
          <p>{mockFooter.brandSummary}</p>
          <div className="site-footer-contact">
            <p>{mockFooter.contact.address}</p>
            <p>{mockFooter.contact.phone}</p>
            <p>{mockFooter.contact.email}</p>
          </div>
        </div>

        {mockFooter.columns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link aria-disabled={link.href === "#"} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner">
          <span>(c) 2026 Home Billiards. All rights reserved.</span>
          <div className="site-footer-social" aria-label="Social links">
            {mockFooter.socialLinks.map((link) => (
              <Link aria-disabled={link.href === "#"} href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
