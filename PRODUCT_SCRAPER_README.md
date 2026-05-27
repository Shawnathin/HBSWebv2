# Product Scraper

Run the local scraper app by double-clicking `START_PRODUCT_SCRAPER.command`, or run:

```sh
node product-scraper/server.mjs
```

Open:

```txt
http://127.0.0.1:4177
```

If `npm` is available on your machine, `npm run scraper` also works.

Saved products go into `scraped-products`:

- `scraped-products/catalog.json` is the full product index.
- Each product folder includes `product.json`, `product.md`, and downloaded images.
- Product folders are grouped by product line.

The app works best with direct product detail page URLs. If a page hides the description, add a simple selector like `.product-description`, `#description`, `main`, or `meta[name=description]`.
