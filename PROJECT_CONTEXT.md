# Project Context — Siddhivinayak Developers Website

Quick reference for any Claude session picking up this project.

---

## What this is

A real estate website for a family business in Bhopal, Madhya Pradesh.
Business: plots and farm house plots for sale, resale, and house construction.
Current flagship project: **Vatika Green Farm House** at Khuraniya, near Bilkisganj.

**Goal:** Rank #1 on Google for property searches in Bhopal and Madhya Pradesh. Get enquiries via call, WhatsApp and forms.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Astro 7.3.7 |
| Hosting (production) | Cloudflare Workers (adapter: `@astrojs/cloudflare 14.3.4`) |
| Hosting (staging) | GitHub Pages via GitHub Actions |
| CMS | Sanity (when SANITY_PROJECT_ID is set); JSON file locally |
| Fonts | Young Serif (headings) + Mukta (body, Devanagari-ready) via Fontsource |
| Node.js required | ≥22.12.0 |

---

## Key contacts / credentials

- **Phone / WhatsApp:** +91 78692 46638 (set in `src/config/site.ts`)
- **GitHub remote:** `git@github.com:pdshubham98/sidhi_vinayak_developers.git`
- **GitHub Pages URL:** `https://pdshubham98.github.io/sidhi_vinayak_developers/`
- **GitHub token:** stored in `.env` (git-ignored) as `GITHUB_TOKEN`
- **Sanity project ID:** empty for now — fill `SANITY_PROJECT_ID` in `.env` when created

---

## Environment variables

```
SANITY_PROJECT_ID=         # leave empty to use local JSON
SANITY_DATASET=production
GITHUB_TOKEN=...           # stored in .env, git-ignored
DEPLOY_TARGET=github       # set in CI only, switches to static build + /sidhi_vinayak_developers base
```

---

## How dual deployment works

`astro.config.mjs` reads `process.env.DEPLOY_TARGET`:
- `github` → no adapter (pure static), `base: '/sidhi_vinayak_developers'`
- anything else → Cloudflare adapter, no base

GitHub Actions sets `DEPLOY_TARGET=github` and deletes `src/actions/index.ts` before building (Actions require a server; static build can't have them).

---

## Forms

Forms use WhatsApp-based submission on GitHub Pages (`src/scripts/whatsapp-form.ts`):
- Intercepts form submit
- Reads URL params (`?need=`, `?property=`)
- Opens `wa.me/917869246638` with pre-filled message
- Redirects to `/thank-you/` after 400ms

On Cloudflare Workers with the real domain, `src/actions/index.ts` handles server-side submission properly (currently removed from CI, preserved in repo).

---

## Content

- `src/content/properties.json` — listings (JSON, used locally and as fallback)
- `src/config/site.ts` — all business details (name, phone, address, etc.) in one place
- Sample listings have `"sample": true` → shows "Sample listing" badge; **delete before going live**
- Placeholder images have `"placeholder": true` → shows "Photo coming soon"

---

## SEO status

- `site.indexable = false` → noindex while on github.io
- Base.astro: LocalBusiness + GeoCoordinates schema, geo meta tags for Bhopal/IN-MP
- When going live on real domain:
  1. Set `indexable: true` in `src/config/site.ts`
  2. Set `site: 'https://yourdomain.in'` in `astro.config.mjs`
  3. Install `@astrojs/sitemap` and add to integrations
  4. Create Google Business Profile (Siddhivinayak Developers, Neelbad Bhopal)
  5. Submit to Google Search Console
  6. Target keywords: "plots in Bhopal", "farm house plots Bhopal", "plots near Bilkisganj"

---

## File map

```
src/
  config/site.ts          ← all business details (edit here)
  content/properties.json ← listings (edit here or via Sanity)
  content.config.ts       ← switches between JSON and Sanity loader
  lib/
    properties.ts         ← type/status labels, formatPrice, getProperties()
    sanity.ts             ← Sanity client factory
    sanity-loader.ts      ← custom Astro loader for Sanity
  pages/
    index.astro           ← home page
    properties/
      index.astro         ← listings grid + filters
      [slug].astro        ← property detail
    requirement.astro     ← buyer enquiry form
    sell.astro            ← seller form
    contact.astro         ← contact form
    construction.astro    ← construction service page
    faq.astro
    privacy.astro
    thank-you.astro
    404.astro
    robots.txt.ts         ← auto noindex/allow based on site.indexable
  scripts/
    whatsapp-form.ts      ← WhatsApp form submission (static hosting)
  styles/global.css       ← design tokens + all CSS
  layouts/Base.astro      ← HTML shell, SEO meta, JSON-LD
  components/
    Header.astro
    Footer.astro
    MobileBar.astro       ← fixed bottom bar on mobile
    WhatsAppFloat.astro
    PropertyCard.astro
    PlotGrid.astro        ← hero SVG illustration
  sanity/schemaTypes/
    propertyType.ts       ← Sanity schema for listings
sanity.config.ts
.github/workflows/deploy.yml
WORK_LOG.md               ← append-only change log
PROJECT_CONTEXT.md        ← this file
CLAUDE.md                 ← detailed architecture reference
```

---

## Common commands

```bash
npm run dev        # http://localhost:4321
npm run build      # Cloudflare Workers build
DEPLOY_TARGET=github npm run build   # GitHub Pages build (static)
```

---

## Owner items still needed

- Real contact email (currently `info@siddhivinayak.in` — placeholder)
- Google Maps share links for office (Neelbad) and project site (Khuraniya)
- Vatika Green: real plot sizes, prices, site plan, photos
- Confirm: "Khuraniya" spelling, PIN 462044, "AM Point" building name
- Business office hours (currently "Mon to Sat, 10 am to 7 pm" — unconfirmed)
