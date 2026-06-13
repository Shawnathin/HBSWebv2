export type ConfiguredCartLineItem = {
  productId: string;
  variantId: string;
  quantity: number;
  modifierSelections: {
    optionId: string;
    valueId: string;
    label: string;
  }[];
  addOnProductIds: string[];
  buildSummary: Record<string, string | string[] | boolean>;
};

export type CartAdapterResult = {
  status: "adapter_stub";
  checkoutUrl: null;
  message: string;
};

export async function addConfiguredProductToCart(
  lineItem: ConfiguredCartLineItem
): Promise<CartAdapterResult> {
  void lineItem;

  return {
    status: "adapter_stub",
    checkoutUrl: null,
    message:
      "Cart adapter stub only. Wire BigCommerce cart creation after product, variant, and modifier IDs are confirmed."
  };
}
