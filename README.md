# Puravigal Website

Scalable static architecture for the Puravigal company site and product sites (example: POS).

## Structure

- `css/common.css` → global design tokens, utilities and shared components.
- `js/common.js` → shared runtime (partials include loader, accessibility-safe animations, lazy media, reusable forms, geo utilities, schema injection).
- `partials/` → global site header/footer partials.
- `products.html`, `contact-us.html`, `about-us.html`, etc. → root company pages.
- `pos/` → product-level pages and partials.
- `css/product-pos.css`, `js/pos.js` → product-specific extensions.

## SEO + Sitemap automation

Generate sitemap automatically whenever new pages are added:

```bash
python3 scripts/generate_sitemap.py
```

This scans site HTML pages and rebuilds `sitemap.xml`.
