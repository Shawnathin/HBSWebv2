import { CategoryPage } from "@/src/components/catalog/CategoryPage";
import { getPoolTablesCategory } from "@/src/lib/bigcommerce/productAdapter";

export default async function PoolTablesPage() {
  const category = await getPoolTablesCategory();

  return <CategoryPage category={category} />;
}
