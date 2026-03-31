# Puravigal

Structured SaaS website foundation for Puravigal.

## Project Overview

This version rebuilds the site into a scalable static architecture with:

- a shared global CSS layer in `css/common.css`
- node-based page CSS files
- shared global JavaScript in `js/puravi-lazy.js` and `js/puravi-common.js`
- node-based page JavaScript files
- real HTML pages for every required route
- shared header and footer across the site
- reusable form injection containers instead of hardcoded forms

The goal is a clean, minimal, professional SaaS website base that can be extended safely without breaking structure.

## Folder Structure

```text
puravigal/
|-- about.html
|-- contact.html
|-- index.html
|-- privacy-policy.html
|-- signup.html
|-- terms-of-service.html
|-- css/
|   |-- common.css
|   |-- 1000.css
|   |-- 1001.css
|   |-- 1002.css
|   |-- 1003.css
|   |-- 1004.css
|   |-- 1005.css
|   `-- 2000.css
|-- images/
|-- js/
|   |-- puravi-common.js
|   |-- puravi-lazy.js
|   |-- 1000.js
|   |-- 1001.js
|   |-- 1002.js
|   |-- 1003.js
|   |-- 1004.js
|   |-- 1005.js
|   `-- 2000.js
`-- pos/
    `-- index.html
```

## CSS Architecture

Mandatory CSS rules:

- `css/common.css` is the only shared stylesheet.
- Every page must have exactly one node CSS file.
- Page CSS filenames must follow the node number.
- Page CSS files must contain only page-specific styles.
- Old layered CSS files such as `layout.css` and `responsive.css` are not used in this version.

### Node CSS Map

- `1000.css` -> Home page
- `1001.css` -> About page
- `1002.css` -> Contact page
- `1003.css` -> Privacy policy page
- `1004.css` -> Terms of service page
- `1005.css` -> Signup page
- `2000.css` -> POS index page

## JavaScript Architecture

Shared global JavaScript:

- `js/puravi-lazy.js`
- `js/puravi-common.js`

Node page JavaScript rules:

- each page has one node JS file
- page logic must stay in the page node file
- `puravi-common.js` must remain reusable and page-agnostic

### Node JS Map

- `1000.js` -> Home page
- `1001.js` -> About page
- `1002.js` -> Contact page
- `1003.js` -> Privacy policy page
- `1004.js` -> Terms of service page
- `1005.js` -> Signup page
- `2000.js` -> POS index page

## Page List

Required HTML pages in this version:

- `index.html`
- `about.html`
- `contact.html`
- `signup.html`
- `privacy-policy.html`
- `terms-of-service.html`
- `pos/index.html`

## Shared Navigation

Header requirements:

- logo
- Home
- Products dropdown
- About
- Contact
- Signup

Products dropdown:

- POS -> `/pos/index.html`

Footer requirements:

- Company -> About, Contact
- Product -> POS
- Legal -> Privacy Policy, Terms of Service
- Social -> Twitter, Instagram, YouTube

## Form Injection Architecture

Forms must not be hardcoded across pages.

Containers are added to HTML and rendered by JavaScript.

Supported reusable containers:

- `.puravi-form-contact` / `.form-contact`
- `.puravi-form-signup` / `.form-signup`
- `.puravi-form-demo` / `.form-demo`
- `.puravi-form-callback` / `.form-callback`

Supported form types:

- Contact form
- Signup form
- Request demo
- Callback request

## Development Rules

- use semantic HTML
- include `title` and `meta description` on every page
- preserve accessibility and keyboard support
- prefer `IntersectionObserver`, debounced work, and `requestAnimationFrame`
- avoid unnecessary scripts and page logic inside shared files
- keep the design modern, minimal, and professional

## Development Order

The build order for this version is:

1. README
2. Header
3. Footer
4. Homepage
5. Base pages
6. Form containers
7. Node CSS and JS integration

## Current Status

This README defines the architecture and page map for the current Puravigal build.

Current implementation includes:

- shared `common.css` plus node CSS files for all live pages
- shared `puravi-common.js` and `puravi-lazy.js`
- node JS files for all live pages
- real HTML pages for home, about, contact, signup, privacy policy, terms of service, and POS
- shared header and footer across every page
- reusable JavaScript-based form injection for contact, signup, demo, and callback forms

## Latest Updates

- Removed the old layered CSS structure and replaced it with `common.css` plus node page CSS files.
- Added all required HTML pages and the `/pos/index.html` product route.
- Added node JavaScript files for every implemented page.
- Added reusable form injection containers and shared form rendering support.
- Added shared navigation, product dropdown behavior, and footer link structure.
- Restored the earlier root-level Puravigal structure after an unwanted folder-layout change.
- Applied the dark theme pass only on the restored structure, without changing page architecture.
- Updated shared branding assets to the dark-theme logo set and corrected footer copyright encoding.

## Change Log

### 2026-03-17

- Replaced the old layered CSS plan with node-based page CSS architecture.
- Defined the required page list, numbering system, and shared layout rules.
- Locked the shared JS and node JS structure for the next build.
- Built the full homepage structure with SaaS landing sections and CTA flow.
- Added `about.html`, `contact.html`, `signup.html`, `privacy-policy.html`, `terms-of-service.html`, and `pos/index.html`.
- Added reusable form injection support for contact, signup, request demo, and callback request flows.
- Removed `layout.css` and `responsive.css` from the active architecture.

### 2026-03-30

- Restored the previous Puravigal folder and page structure from backup.
- Preserved the earlier header, footer, product menu, and root-level route layout.
- Limited the new changes to dark-theme styling, logo swaps, and footer encoding cleanup.
