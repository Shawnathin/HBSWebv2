import Link from "next/link";

import type { MegaNavItemViewModel } from "@/src/lib/view-models/navigation";

type MegaMenuProps = {
  item: MegaNavItemViewModel;
};

export function MegaMenu({ item }: MegaMenuProps) {
  if (!item.groups?.length && !item.feature) {
    return null;
  }

  return (
    <div className="mega-menu">
      <div className="mega-inner">
        <div className="mega-columns">
          {item.groups?.map((group) => (
            <section className="mega-group" key={group.title}>
              {group.href ? (
                <h3>
                  <Link href={group.href}>{group.title}</Link>
                </h3>
              ) : (
                <h3>{group.title}</h3>
              )}
              <ul>
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link aria-disabled={link.href === "#"} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {item.feature ? (
          <aside className="mega-feature">
            {item.feature.image ? (
              <img alt={item.feature.image.alt} src={item.feature.image.src} />
            ) : null}
            <div>
              <h3>{item.feature.title}</h3>
              <p>{item.feature.body}</p>
              <Link href={item.feature.href}>{item.feature.ctaLabel}</Link>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
