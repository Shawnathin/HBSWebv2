import Link from "next/link";

import { PoolTableBuilder } from "@/src/components/builder/PoolTableBuilder";
import { ProductCard } from "@/src/components/catalog/ProductCard";
import { getAustinProduct } from "@/src/lib/bigcommerce/productAdapter";
import { getAustinRendererManifest } from "@/src/lib/renderer/renderManifestAdapter";

export default async function AustinPoolTablePage() {
  const [product, rendererManifest] = await Promise.all([
    getAustinProduct(),
    getAustinRendererManifest()
  ]);

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        {product.breadcrumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            <Link href={crumb.href}>{crumb.label}</Link>
          </span>
        ))}
      </nav>
      <PoolTableBuilder product={product} rendererManifest={rendererManifest} />
      <section aria-labelledby="collection-title" className="collection-section">
        <div className="collection-headline">
          <h2 id="collection-title">Part of the Austin Collection</h2>
          <Link href="/pool-tables">Shop all</Link>
        </div>
        <div className="collection-products">
          {product.relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </>
  );
}
