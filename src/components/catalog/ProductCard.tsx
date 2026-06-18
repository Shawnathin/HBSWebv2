import Link from "next/link";
import type { CSSProperties } from "react";

import type { ProductCardViewModel } from "@/src/lib/view-models/category";

type ProductCardProps = {
  product: ProductCardViewModel;
};

export function ProductCard({ product }: ProductCardProps) {
  const fulfillmentMessages = [
    product.fulfillmentBadge,
    product.availabilityMessage,
    product.leadTimeLabel,
    product.shippingPromise
  ].filter(Boolean);

  return (
    <Link
      aria-disabled={product.href === "#"}
      className={`product-card ${product.featured ? "featured" : ""}`}
      href={product.href}
    >
      <div className="product-badges">
        {product.badges.slice(0, 2).map((badge) => (
          <span className={product.availability === "stock" ? "badge dark" : "badge"} key={badge}>
            {badge}
          </span>
        ))}
      </div>
      <span aria-hidden="true" className="wishlist-button">
        Save
      </span>
      <div className="product-media">
        <img alt={product.image.alt} src={product.image.src} />
      </div>
      <div className="product-body">
        <div aria-label="Available finish examples" className="swatches">
          {product.swatches.map((swatch) => (
            <span className="swatch" key={swatch} style={{ "--swatch": swatch } as CSSProperties} />
          ))}
        </div>
        <div>
          <p className="product-brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>
        </div>
        <p className="product-meta">{product.meta}</p>
        {fulfillmentMessages.length ? (
          <div className="fulfillment-messages">
            {fulfillmentMessages.map((message) => (
              <span className="fulfillment-badge" key={message}>
                {message}
              </span>
            ))}
          </div>
        ) : null}
        <div className="product-foot">
          <p className="product-price">{product.priceLabel}</p>
          <span className="product-action">{product.actionLabel}</span>
        </div>
      </div>
    </Link>
  );
}
