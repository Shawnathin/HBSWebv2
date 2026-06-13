import { mockAustinProduct } from "@/src/data/mockAustinProduct";
import { mockPoolTablesCategory } from "@/src/data/mockPoolTablesCategory";
import type { AustinProductViewModel } from "@/src/lib/view-models/austin";
import type { CategoryPageViewModel } from "@/src/lib/view-models/category";

export type ProductAdapterMode = "mock" | "bigcommerce";

export type ProductAdapterOptions = {
  mode?: ProductAdapterMode;
};

function assertMockMode(options?: ProductAdapterOptions) {
  if (options?.mode === "bigcommerce") {
    throw new Error(
      "BigCommerce is not connected yet. Confirm catalog IDs, credentials, and server-side fetch strategy first."
    );
  }
}

export async function getPoolTablesCategory(
  options?: ProductAdapterOptions
): Promise<CategoryPageViewModel> {
  assertMockMode(options);
  return mockPoolTablesCategory;
}

export async function getAustinProduct(options?: ProductAdapterOptions): Promise<AustinProductViewModel> {
  assertMockMode(options);
  return mockAustinProduct;
}
