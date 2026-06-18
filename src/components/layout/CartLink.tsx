import Link from "next/link";

import type { CartSummaryViewModel } from "@/src/lib/view-models/navigation";

type CartLinkProps = {
  cart: CartSummaryViewModel;
};

export function CartLink({ cart }: CartLinkProps) {
  return (
    <Link className="cart-link" href={cart.href}>
      <span>{cart.label}</span>
      <strong>{cart.itemCount}</strong>
    </Link>
  );
}
