# AGENTS.md — HBS Website 2.0

This repository is a prototype shell for the future Home Billiards custom website.

Do not treat the current HTML files as final production architecture.

Primary goal:
Reverse-engineer the existing static/mockup website into a clean, maintainable, headless ecommerce frontend connected to BigCommerce.

The current files preserve:
- desired page flow
- visual direction
- product/category structure
- product-builder ideas
- navigation concepts
- copy/layout references
- business logic hints

Do not delete or rewrite large parts without first auditing and documenting what exists.

Before making major changes:
1. Inspect the current file structure.
2. Identify all routes/pages.
3. Identify hardcoded product/category data.
4. Identify reusable components implied by the HTML.
5. Identify BigCommerce data needed to power each page.
6. Create a migration/refactor plan.

Preferred direction:
- Custom frontend
- BigCommerce as commerce/catalog backend
- Server-side API adapter layer
- Render deployment
- GitHub as source of truth

Important:
- Do not expose API keys in frontend code.
- Do not commit `.env` files.
- Do not invent product facts.
- Preserve current UX flow unless intentionally improved.
- Use branches for major refactors.