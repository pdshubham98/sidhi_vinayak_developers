# Sidhivinayak Developers — Work Log

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
- Create Google Business Profile for "Sidhivinayak Developers, Neelbad, Bhopal"
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

## 2026-11-01 (night) — Product enhancement on branch `feature/product-enhancement`

**Scope:** Full implementation of the Master Project Prompt brief. Confirmed business model: hybrid (own inventory + brokerage/assisted listings + construction).

**Audit findings acted on:**
- Hardcoded `#4a6054` color used in 12+ places instead of `var(--muted)` token
- Property schema missing business-model fields: `ownershipType`, `published`, `updatedAt`
- No disclosure of whether a listing is company-owned or assisted (brokerage)
- Unpublished listings had no schema-level guard — could accidentally appear
- Sell page had form only; no explanation of the selling process
- Construction page lacked detail on what is actually handled and what the steps are

**Done on this branch:**
- Added `ownershipType` (own/assisted), `published`, `updatedAt` to property schema
- `getProperties()` now filters out unpublished listings
- Added `ownershipLabels` export for display in UI
- "Our project" gold badge on owned listings in property cards + detail pages
- Ownership disclosure notice on property detail page (gold for own, sage for assisted)
- Updated/listed date shown in sidebar of property detail page
- Enhanced Vatika Green listing: confirmed as `ownershipType: "own"`, updated highlights
- Replaced all hardcoded `#4a6054` → `var(--muted)` across all pages and components
- Added `.badge-own` and `.badge-type` to global badge system
- Sell page: added 4-step process explanation + honest disclaimer before the form
- Construction page: rebuilt with what-we-handle grid, dark-bg step flow, notes grid
- Build: 12 pages, 0 errors

**Next:** Merge to main and deploy. Real email, Google Maps, Vatika Green photos still needed.

---

## 2026-11-15 — Full-site audit, admin rebuild, E2E verification

**Bugs fixed:**
- robots.txt blocked all crawlers (`Disallow: /`) while the site was set to indexable → now `Allow: /`, `Disallow: /admin`
- Home page was prerendered from JSON with Vatika text hardcoded → now live from KV; a second "featured" listing is no longer hidden
- `/properties` 404 root cause: non-literal `export const prerender` is read as `true` → prerender now set per route in `astro.config.mjs`; GitHub Pages build fixed (admin excluded, KV stubbed, image paths respect base URL)
- Admin: duplicate names overwrote existing listings; editing dropped fields not on the form; no validation of status/type/price; `%` in flash message crashed the page; cookie was the base64 password (now SHA-256 token scoped to /admin); saves reported success with no storage
- Data: missing `listedOn` produced an Invalid Date that crashed every later save
- Forms: name/phone never validated (`novalidate`), honeypot ignored, quote in `?need=` broke the script, navigation could cancel the lead request (now `keepalive`)
- Unknown property returned a 302 to /404 → now a real HTTP 404
- Layout plans cropped by `object-fit: cover`; thumbnails could not be opened

**Added:** photo upload/remove/reorder in admin (stored in KV, auto-shrunk on the phone), Google Maps link field + button, "View" link per listing.

**Consolidated:** `kv-properties.ts` + content loader → `src/lib/properties.ts`; labels/badge classes/types → `src/lib/property-meta.ts`; lead sending + phone check → `src/scripts/lead.ts`; detail page uses `whatsappHref`/`telHref`. Removed unused Astro Actions (`src/actions`, `leads.ts`, `enhance-form.ts`).

**Verified:** `astro check` 0 errors/0 warnings; Cloudflare and GitHub Pages builds pass; Playwright E2E 130/130 locally (incl. full admin CRUD with cleanup) and 96/96 read-only against production. Deployed version e2c94706.

## 2026-11-15 — UX audit fixes (branch `ux-improvements`, not deployed)

**Fixed:** header "Book a site visit" button had dark text on green (nav-link colour overrode `.btn-primary`); hero path rows showed two arrows; sold project was listed under "Available for sale"; Kanha showed a "Photo coming soon" thumbnail next to its real plan (placeholders are now hidden once a listing has a real photo); consent text read "ourprivacy policy".

**Changed:**
- Home: 9 sections → 4 (hero with one CTA + Buy/Build/Sell rows, "Our projects" with featured project + ongoing + completed, why us + how it works, one combined sell/partner banner). Phone height 8,818px → ~5,800px.
- Removed all-caps eyebrow labels (home, construction, about, popup, footer headings) per the design plan; sentence-case buttons everywhere.
- Property cards: no "Our project" badge, no price divider, summary capped at 2 lines.
- Property page: swipeable photo strip with thumbnails; price + "Book a site visit" + WhatsApp/Call row + map link sits right under the photos on phones; shorter ownership note; site-visit link carries the property name into the lead.
- Enquiry form: only name, phone, "looking for" and consent required; email/area/budget/timeline/call time/message in an optional "Tell us more" section; seller/broker role removed (sent as `userRole=buyer`).
- Popup: name + phone only; never shown on the requirement/contact/sell/thank-you pages.
- Footer: outdated "Vatika Green site" column replaced by an "Explore" link list; compact on phones.
- Header uses the cropped icon `public/images/logo-mark.png` next to the typed name.
- Tighter section spacing on phones.

**Verified:** `astro check` 0 errors; Playwright E2E 148/148 against local `wrangler dev` (new checks for every item above, incl. admin CRUD on local KV); screenshots at 390px and 1440px reviewed.
