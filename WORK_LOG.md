# Siddhivinayak Developers — Work Log

Append-only log. Each entry records date, time, what changed, and what is next.
Do not edit past entries. Add new entries at the bottom.

---

## 2026-10-08 — Initial setup

**Done:**
- Created Astro 7 project with Cloudflare Workers adapter
- Set up design system: tokens, typography (Young Serif + Mukta), global CSS
- Content collection for properties (JSON file, switchable to Sanity)
- All pages: home, /properties, /properties/[slug], /construction, /requirement, /sell, /contact, /thank-you, /faq, /privacy, 404
- Components: Header, Footer, MobileBar, WhatsAppFloat, PropertyCard, PlotGrid, form parts
- Contact: +91 78692 46638 (phone + WhatsApp)
- Sample listings in properties.json with "Sample listing" badge
- Sanity CMS integration (src/lib/sanity.ts, src/lib/sanity-loader.ts, sanity schema)
- GitHub Actions deploy workflow for GitHub Pages

**Next:**
- Replace sample listings with real data from owner
- Set up Sanity project and add SANITY_PROJECT_ID to GitHub secrets
- Add real photos

---

## 2026-11-01 — UX overhaul + SEO foundation

**Done:**
- Replaced all emoji icons with inline Lucide-style SVGs (MobileBar, PropertyCard, hero paths, service cards)
- Removed ochre contact strip from homepage
- Fixed duplicate CTA buttons on featured property card (added showCta={false} prop)
- properties/index.astro: filters now only show types/statuses present in actual data, show count per type
- Rewrote index.astro: clean sections, proper featured layout, SVG icons throughout
- global.css: fixed service-card__icon from font-size (emoji) to line-height:0 (SVG)
- Base.astro: auto-canonical URL, geo meta tags (IN-MP / Bhopal), richer LocalBusiness schema with GeoCoordinates and keywords
- Added robots.txt API route (disallows crawl while indexable:false, allows when live)
- properties.json: fixed placeholder text, realistic sample highlights
- Set site: 'indexable: false' (correct for github.io temporary URL)

**SEO notes (for when going live on real domain):**
- Set `indexable: true` in src/config/site.ts
- Set `site:` in astro.config.mjs to the real domain URL
- Install @astrojs/sitemap and add to integrations array
- Create Google Business Profile for "Siddhivinayak Developers, Neelbad, Bhopal"
- Submit to Google Search Console
- Target keywords: "plots in Bhopal", "farm house plots Bhopal", "property Neelbad Bhopal", "plots near Bilkisganj"

**Next:**
- Add FAQ schema markup to /faq page
- Add property detail page SEO (title/description per listing)
- Replace sample listings with real data
- Set up real domain and flip indexable: true

---
