# HBS Website 2.0 Handoff

Use this handoff for the Home Billiards website. The `pool-table-project-handoff-2026-05-23-v2/` folder is a separate older image/render tool project, not the active website handoff.

This project is a local static website mockup for Home Billiards. It lives at:

`/Users/admin/Documents/HBS Website 2.0`

Open pages directly in the browser with `file:///Users/admin/Documents/HBS%20Website%202.0/<page>.html`.

## Current Pages

- `index.html` - finalized modern home page with hero, department cards, featured Austin builder, services, resources/blog preview, design-center CTA, and footer.
- `pool-tables.html` - pool table category page with hero, Austin featured promo, category strip, filters, and product grid.
- `austin-pool-table.html` - premium California House Austin pool table builder/configurator.
  - Gallery thumbnails now include local Austin photos pulled from the California House Austin product page in `assets/austin-gallery/`.
  - Clicking gallery thumbnails swaps the main preview; clicking anywhere in the builder returns the preview to the editable table render.
- `ping-pong-tables.html` - table tennis category page.
- `whistler-indoor-table-tennis-table.html` - regular product page using the same lighter configurator style as the pool table builder.
- `traeger-smokers.html` - Traeger smokers category page with hero, category strip, filters, and product grid.
- `cues.html` - cue category page with scraped cue product cards, filters, hero, and Little Monster featured cue card.
- `dartboards.html` - dartboard category page with scraped dartboard product cards, filters, and Blade X banner hero.
- `bull-carbon-black-with-6-purple-abalone-points.html` - cue product page with weight selection.
- `contact-us.html` - contact/showroom page.

## Recent State

The latest work finalized the home page and cleaned up the new image assets. The recent category pages still use local scraped product-card assets.

Current major home page state:

- `index.html`
  - Home page is considered finalized in its current direction.
  - Hero uses `assets/home-hero-luxury-game-room.jpg`.
  - Hero headline: `Canada's Destination for Luxury Game Rooms & Outdoor Living`.
  - Hero subline: `Curated for How You Live`.
  - Shop Departments section headline: `Everything for the home, not just the table.`
  - Shop Departments currently includes Pool Tables, Ping Pong, Traeger Grills, Darts, and Cues. Design Help was intentionally removed from this section.
  - Featured Austin builder section remains below Shop Departments and uses `assets/austin-lifestyle-promo.png`.
  - The former Popular Paths row is now a Services section with Design Help, Table Moving Service, Table Recovering Service, and Commercial Game Rooms.
  - Services images use optimized JPGs:
    - `assets/service-design-help.jpg`
    - `assets/service-table-moving.jpg`
    - `assets/service-table-recovering.jpg`
    - `assets/service-commercial-game-rooms.jpg`
  - Resources row uses optimized JPGs:
    - `assets/resource-pool-table-style-guide.jpg`
    - `assets/resource-pool-table-buying-guide.jpg`
    - `assets/resource-cue-comparison-guide.jpg`
  - The large generated PNG copies for these new home assets were removed from `assets/` after converting to JPG.
  - The home page has no remote image dependencies and all referenced assets resolve locally.

Current major category state:

- `pool-tables.html`
  - Uses a built-out mock catalog of 106 pool table cards from normalized local assets.
  - Category strip has lifestyle/product images for All, In Stock, Custom Build, California House, Canada Billiard, and Olhausen.
  - Category strip now uses local assets only, including contained product images for the brand chips.
  - Filtering, sorting, price slider, and desktop "Load more" are wired.
  - Legacy was removed from the visible pool table category surface.
  - The featured configurator promo uses `assets/austin-lifestyle-promo.png`.
  - The Austin product card now links to `austin-pool-table.html`; other mock cards remain non-navigating.
  - Pool-table sizing/help CTAs point to `contact-us.html`.
- `ping-pong-tables.html`
  - Uses product card data from `Product card assets/ping-pong-tables`.
  - Has 7 mock product cards, working filters/sort, and a hero image at `assets/ping-pong-hero.png`.
  - Germany tab was removed; category strip matches pool page proportions.
- `cues.html`
  - Uses product card data from `Product card assets/cues`.
  - Product images were copied to `assets/cue-products/`.
  - Has 15 mock cue cards with working filters/sort.
  - Hero background uses `assets/cues-hero-fusion-series.webp`.
  - The right hero card features `assets/little-monster-cue.webp`.
  - Cue category strip uses cropped product detail photos because no true cue lifestyle images are available yet.
- `dartboards.html`
  - New page built from `cues.html` category structure, adapted for Darts.
  - Uses product card data from `Product card assets/dartboards`.
  - Product images were copied to `assets/dartboard-products/`.
  - Has 8 mock dartboard cards with working category chips, brand/type/availability/price filters, and sort.
  - Hero background uses `assets/dartboards-hero-bladex.jpg`.
  - The dartboard page intentionally has no right-side featured product card.
  - Shared Darts nav links across static pages now point to `dartboards.html`.

Important: product cards on the newly built category pages are intentionally mock/non-navigating unless a real product page already exists. The user has been asking to make category pages feel full without building individual product pages.

## Design Direction

The site should feel modern, premium, warm, and clean. The user does not want heavy boxes, clutter, or too much beige. The preferred look is:

- Minimal product-page layout inspired by modern furniture ecommerce.
- Wide product imagery with restrained typography.
- Interactive/configuration side should feel like a light floating glass panel, not a hard boxed sidebar.
- Product cards should use clean light-grey/off-white image wells, not strong beige blocks.
- Buttons should match the finalized pool table builder style: large, confident, rounded/pill-like, black primary button, pale outlined secondary.
- Keep text lean. Avoid overexplaining in UI.

## Header / Navigation

The header is shared visually across pages:

- Logo on left.
- Search and Contact Us centered over the navigation.
- Navigation categories: Billiards, Ping Pong, BBQ, Foosball, Darts, Games, Commercial, New Arrivals, Sale, Made in Canada.
- Contact Us button should link to `contact-us.html`.
- Dropdown menus were built to look clean and centered, with Billiards/Pool Tables links connected.
- Darts / All Darts / Dartboards / "Set up a proper dart wall" / "Shop dart gear" links now point to `dartboards.html` across the static pages.

If you edit the header, update all relevant static pages so the experience stays consistent.

## Pool Table Builder Notes

Main file:

`austin-pool-table.html`

Important behavior/design:

- Product is California House Austin Pool Table.
- The title block uses the product description:
  “The Austin Pool Table is one of the finest pool tables made today and many of our customers design their billiard room around the clean design.”
- “Your table at a glance” should be personalized as “Your Austin Pool Table at a Glance.”
- In-stock option should skip size/finish selection and start at cloth, then add-ons.
- Build-your-table mode should show all steps.
- California House finish options are split into Maple and Oak.
- Oak is shown as an upgrade, currently mocked as `+ $2,000`, but this will eventually come from BigCommerce.
- Wood samples should behave like compact clickable swatches, similar to cloth pills.
- Do not auto-advance when clicking wood or cloth samples. Let customers try options.
- The Austin render changes by wood finish using images in `assets/california-house-austin-renders/`.
- Cloth color visual replacement was attempted but not fully solved; leave it unless specifically revisited.

Important asset folders:

- `assets/california-house-finishes/`
- `assets/california-house-austin-renders/`
- `assets/austin-gallery/`
- `assets/austin-pool-table-cloth-mask.png`
- `assets/austin-pool-table-cloth-alpha-mask.png`

## Cloth Options

Championship Invitational is included with each table. Championship Tour Edition is an upgrade.

Invitational colors and hex values:

- Red `#B90610`
- Burgundy `#8E1013`
- Titanium `#2E3945`
- Charcoal `#353634`
- Steel Grey `#5D6C60`
- Black `#1A1918`
- Purple `#1A1173`
- Olive `#525132`
- Taupe `#6E582F`
- Golden `#B48824`
- Khaki `#8D7B52`
- Camel `#936B3C`
- Brown `#5A3216`
- Basic Green `#025F65`
- Championship Green `#026E4B`
- Dark Green `#04392D`
- Bottle Green `#113028`
- English Green `#035012`
- Aztec `#AB5108`
- Brick `#752F0B`
- Navy `#162133`
- Wine `#48161A`
- Academy Blue `#314A74`
- Championship Blue `#0362B6`
- Euro Blue `#022EA3`
- Electric Blue `#054CBC`

Tour Edition upgrade colors, all currently `+ $249`:

- Championship Green `#026E4B`
- Dark Green `#04392D`
- Red `#B90610`
- Olive `#525132`
- Bottle Green `#113028`
- Electric Blue `#054CBC`
- Camel `#936B3C`
- Euro Blue `#022EA3`
- Navy `#162133`
- Burgundy `#8E1013`
- Merlot `#5B1424`
- Wine `#48161A`
- Steel Grey `#5D6C60`
- Charcoal `#353634`
- Black `#1A1918`
- Championship Blue `#0362B6`
- Lilac `#9B82B8`

## Category Pages

The category strip style should be consistent across all category pages:

- Horizontal strip near top.
- Image tile with label below.
- Active item has a black underline.
- “View X items” link beside the category title.
- Sort select on the right.

Filters:

- Use the pool tables filter style everywhere.
- No grey box around the filters.
- Include price slider style.

Product cards:

- Recent preferred style came from Traeger card cleanup.
- Product image wells should be clean, light, and less beige.
- Avoid white product backgrounds looking like separate boxes when possible; use subtle image-well color and multiply/contrast treatment where it helps.
- When category strip images are product cutouts instead of lifestyle photos, keep the strip consistent with tight crops or clean contained images rather than mixed thumbnail styles.

Current category asset folders:

- `assets/pool-table-categories/`
- `assets/pool-table-products/`
- `assets/ping-pong-categories/`
- `assets/ping-pong-products/`
- `assets/cue-products/`
- `assets/dartboard-products/`
- `assets/traeger-categories/`

## Traeger Page

Main file:

`traeger-smokers.html`

Current hero background:

`assets/traeger-page-hero.jpg`

Traeger category assets:

`assets/traeger-categories/`

User asked to only change product cards when working on Traeger card styling, unless specifically saying otherwise.

## Contact Page

Main file:

`contact-us.html`

Hero image:

`assets/home-billiards-storefront.jpg`

The page should feel warmer than stark white. The storefront image is used as a faded hero background with the text remaining the priority.

Core contact details:

- Phone: `(604) 321-5553`
- Email: `info@homebilliards.ca`
- Location: `1644 SE Marine Drive, Vancouver, BC V5P 2R6`

## Scraped Products

Scraped product source data lives under:

`scraped-products/`

Newer product-card scrape folders live under:

`Product card assets/`

Currently used:

- `Product card assets/ping-pong-tables`
- `Product card assets/cues`
- `Product card assets/dartboards`

Examples already used:

- `scraped-products/ping-pong-table/whistler-indoor-table-tennis-table/`
- `scraped-products/pool-tables/legacy-baylor-nutmeg/`

Use these local files first before scraping again.

## BigCommerce Intent

This is a visual/interaction mockup. Eventually, product data, pricing, variants, inventory, option modifiers, and collection links should come from BigCommerce.

Keep mockup code structured so a developer can map:

- Products
- Brands/vendors
- Categories
- Variant options
- Upgrade prices
- In-stock/custom-order logic
- Related collection products
- Quote-required state

## Working Rules For Next Chat

- Keep edits scoped. The user often wants one area changed without affecting the rest.
- When the user says “only change X,” do exactly that.
- Use local assets whenever possible.
- If external source info is needed, browse/scrape only when asked or when current info could be stale.
- After changes, briefly state what changed and what was intentionally left alone.
- The user prefers visual progress over technical detail.
- The user said not to worry about mobile for now; desktop-first is acceptable. Do a mobile optimization pass later.
- The project is not currently a Git repository.
- Local `file://` pages are the normal way the user previews. Browser automation may not be able to inspect `file://` pages in some sessions; static checks are acceptable if live preview is blocked.

## Good Starting Prompt For The Next Chat

Paste this into a fresh conversation:

“We are working in `/Users/admin/Documents/HBS Website 2.0`. Please read `WEBSITE_HANDOFF.md` first. Continue from the current static mockup. The main pages are `index.html`, `pool-tables.html`, `austin-pool-table.html`, `ping-pong-tables.html`, `traeger-smokers.html`, `whistler-indoor-table-tennis-table.html`, `cues.html`, `dartboards.html`, and `contact-us.html`. Keep edits scoped and preserve the premium, clean Home Billiards style.”
