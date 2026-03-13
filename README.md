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


## Conflict-safe one-click push

Use this once per machine to reduce repeated conflict prompts:

```bash
git config pull.rebase true
git config rebase.autoStash true
git config rerere.enabled true
```

Then use a single command for daily sync + push to `main`:

```bash
./scripts/sync_push.sh origin main
```

What it does:
1. fetches latest remote changes,
2. rebases your current branch on remote `main`,
3. pushes your current branch to remote `main`.

> Note: if both sides changed the exact same lines, Git can still require a one-time manual resolution.
