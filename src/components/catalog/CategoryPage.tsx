import { ProductCard } from "@/src/components/catalog/ProductCard";
import type { CategoryPageViewModel } from "@/src/lib/view-models/category";

type CategoryPageProps = {
  category: CategoryPageViewModel;
};

export function CategoryPage({ category }: CategoryPageProps) {
  const featuredProducts = [...category.products].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  return (
    <main>
      <section className="category-hero">
        <div className="category-hero-copy">
          <p className="eyebrow">{category.eyebrow}</p>
          <h1>{category.title}</h1>
          <p className="lead">{category.description}</p>
          <div className="hero-actions">
            {category.topFilters.slice(0, 4).map((filter) => (
              <span className="chip" key={filter.value}>
                {filter.label}
              </span>
            ))}
          </div>
        </div>
        <div className="category-hero-media">
          <img alt={category.heroImage.alt} src={category.heroImage.src} />
        </div>
      </section>

      <section className="listing-layout">
        <aside aria-label="Filters" className="facet-panel">
          <div className="facet-head">
            <strong>Filters</strong>
            <span>{category.resultLabel}</span>
          </div>
          <div className="facet-group">
            <h3>Price</h3>
            <div className="price-range">
              <div className="price-track" />
              <div className="price-range-row">
                <span>$8,000</span>
                <strong>Up to $32,000</strong>
              </div>
            </div>
          </div>
          {category.facets.map((facet) => (
            <div className="facet-group" key={facet.title}>
              <h3>{facet.title}</h3>
              <div className="facet-options">
                {facet.options.map((option) => (
                  <label className="facet-option" key={option.value}>
                    <input disabled type="checkbox" />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section aria-label={`${category.title} results`} className="category-results">
          <div className="results-head">
            <div>
              <p className="eyebrow">Shop pool tables</p>
              <h2>All Pool Tables</h2>
            </div>
            <div className="results-tools">
              <span>{category.products.length} tables</span>
              <select aria-label="Sort products" defaultValue="featured">
                {category.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </section>

      <section className="help-band">
        <div>
          <p className="eyebrow">Showroom support</p>
          <h2>Not sure which table fits the room?</h2>
          <p>
            Home Billiards can review room dimensions, delivery access, cloth, finish samples, and
            add-ons before the customer commits.
          </p>
        </div>
        <a className="btn primary" href="/contact-us">
          Request help choosing
        </a>
      </section>
    </main>
  );
}
