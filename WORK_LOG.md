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

## 2026-11-16 — Google indexing fixes (branch `seo-sitemap`)

**Why Google showed "No information is available for this page":** until 2026-11-15 `robots.txt` had `Disallow: /`, so Google could list the domain but not read it. That was fixed on 11-15; Google just has not re-crawled yet.

**Added / fixed:**
- `/sitemap.xml` (`src/seo/sitemap.ts`), rendered live from KV so listings added in /admin appear automatically; URLs use the exact form each page is served at (no redirects). `robots.txt` now points to it.
- Search Console verification file now served by the Worker (`src/seo/google-verification.ts`) with a direct 200; from `public/` Cloudflare redirected `.html` → extensionless (307), which can fail verification.
- Canonical URL for `/properties…` pages no longer depends on a trailing slash (both forms return 200).

**Verified:** `astro check` 0 errors; both build targets pass; E2E 153/153 locally.

**Owner to do:** in Search Console submit `sitemap.xml` and request indexing for the home page.

## 2026-11-22 — Google Tag Manager (branch `analytics`)

**Added:** GTM container `GTM-WFGDF9G9` in `src/layouts/Base.astro` — the standard async loader in `<head>` and the `<noscript>` iframe right after `<body>`, so every page that uses the layout is tracked. Both are gated on `site.indexable`, so the GitHub Pages staging build and local dev send no data; only production does.

`/admin` does not use `Base.astro` and is deliberately untracked.

**Verified:** production build has the pair on all 10 static pages, the server-rendered `/`, `/properties` and listing pages; staging build has none; smoke suite 58/58 against local `wrangler dev` (incl. sitemap, robots and the Search Console verification file still returning a direct 200).

**Still open:** the leads Google Sheet shows unnamed "Column 1…12" headers. That is set by the Google Apps Script receiving the form POST, not by this repo — needs the Apps Script source to fix.

## 2026-11-22 — Lead sheet repair and keyword targeting (branch `leads-and-seo`)

**Apps Script (`apps-script/leads.gs`, now tracked in this repo).** Two bugs:
- *Unnamed "Column 1…12" headers.* `getOrCreateTab` wrote the header row only inside the `if (!sheet)` branch, so a tab that already existed — made by an earlier version of the script, or renamed by hand — never got one. Row 1 is now rewritten whenever it is missing or stale, and `repairHeaders()` can be run once from the editor to fix the existing tabs immediately.
- *Silent data loss.* The site posts 15 fields; the script read 10. `preferredArea`, `budget`, `timeline`, `size`, `expectedPrice` and `property` were discarded on every lead — budget and timeline being the two a seller most wants. The sheet is now 16 columns and captures all of them. `propertyType`/`location`/`expectedPrice` sit behind `lookingFor`/`preferredArea`/`budget` as fallbacks, which is safe because the first three exist only on the sell form and the others only on the requirement form.
- The notification email is wrapped in try/catch: the row is already written, so a mail quota failure must not throw away the lead.

**Keyword targeting.** The owner reported not ranking for "plots in Bhopal" and "best contractor for house construction in bhopal".
- `/construction`: title and copy now use "contractor" as a self-description. The page previously used the word only to distance itself from contractors ("so you don't have to coordinate with multiple contractors"), which worked against the exact query. Added `Service` JSON-LD.
- `/properties`: title and h1 now lead with "Plots in Bhopal for sale" instead of the vaguer "Properties in Bhopal".
- Fixed a pre-existing double-escape: the literal `&amp;` in the `/properties` title rendered as a visible "&amp;" in the tab and in search results.
- `/about` title was "About Sidhivinayak Developers – Sidhivinayak Developers"; now "About us".

**Verified:** both build targets pass; smoke suite 58/58 against local `wrangler dev`; Apps Script logic suite 36/36 (column alignment, field coverage, fallbacks, routing); all three JSON-LD blocks on `/construction` parse.

**Owner to do:** ranking for these queries is not a code problem. Create the Google Business Profile — the map pack is most of the result for both searches, and the site cannot appear in it without one.

## 2026-11-22 — "property dealer" wording (branch `dealer-keyword`)

The owner searches "best property dealer in bhopal" and the phrase appeared nowhere on the site, so the pages could not match it however well they ranked otherwise. Added it where it reads naturally and is accurate — the about page intro and meta description, the shared `site.description` used for the home page and Open Graph, and the `LocalBusiness` schema keywords. Three placements, not stuffed.

**Verified:** smoke suite 58/58; phrase renders on `/` and `/about`.
