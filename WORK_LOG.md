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

## 2026-11-01 (evening) — UX redesign on branch `improve/ux-redesign`

**Audit findings:**
- Name "Siddhivinayak" was used throughout code — corrected to "Sidhivinayak" everywhere
- Sample/demo listings showing publicly — removed from properties.json (only Vatika Green remains)
- No About page existed; Nav missing "Sell Property" and "About"
- Hero copy generic, tagline wrong, color tokens didn't match brand brief

**Done on this branch:**
- Corrected name throughout all affected source files
- New tagline: "Buy It. Build It. Sell It. We're With You."
- New color palette: forest-deep #173F2D, forest #20583F, gold #D3A14B
- Logo: SD monogram mark + Bhopal sub-label
- Hero: "Find Your Land. Build Your Dream." + gold primary CTA + 3 path cards
- Service section: 01 Buy / 02 Build / 03 Sell (featured middle)
- Why us section: 4 trust points + process steps (no fake stats)
- New About page (who we are, services, commitment, contact sidebar)
- Updated nav: Properties, Construction, Sell Property, About, FAQ, Contact + CTA
- FAQ and construction SEO titles improved
- Build verified: 12 pages, 0 errors

**To deploy:** Merge `improve/ux-redesign` into `main`

**Still needed:** real email, Google Maps links, real photos of Vatika Green

---
