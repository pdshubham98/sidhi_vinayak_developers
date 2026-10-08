# Siddhivinayak Developers website

Website for a family real estate business in Bhopal, Madhya Pradesh. The goal is to get enquiries (calls, WhatsApp messages and form leads) and show property listings.

## Owner requirements

- Non-technical family members must be able to update listings: add, edit, change availability, add offers. They must not have to touch code.
- Three forms:
  - **Share your requirement** (buyers and construction clients)
  - **Sell your property**
  - **Contact us**
- Footer shows all contact details. Call and WhatsApp buttons float at the bottom on mobile.
- Expected traffic: about 500 visitors/day at launch, growing.
- Budget is minimal. The target running cost is the domain only (about ₹1,000/year), with everything else on free tiers.
- Build and run locally first, then go live. No domain has been chosen yet. Launch on the free `*.workers.dev` address, keep it `noindex`, and add the domain later.
- Claude is the developer. The owner (a data engineer, comfortable with Git) does the one-time account and deploy setup.

## Confirmed business facts

- Working name: **Siddhivinayak Developers**. It is set in `src/config/site.ts` and can change in one place.
- Services:
  - Property sales: plots and farm house plots
  - Resale: buying and selling
  - House construction
- First project: **Vatika Green Farm House** at Vatika Green Parisar, Khuraniya, near Bilkisganj.
- Office: Plot No. 31, AM Point, Near Durga Mandir, Neelbad, Bhopal 462044.

## Waiting on the owner

- Confirm three readings from his handwritten note: the spelling "Khuraniya", PIN 462044, and the name "AM Point".
- Phone, WhatsApp, email and office hours. Fill these in `src/config/site.ts`. Empty fields are hidden on the site.
- Google Maps share links for the office and the site.
- Vatika Green details (plot sizes, prices, facilities) and real photos.

## Content rules

- Use only facts the owner has confirmed. Do not invent stats, testimonials, years in business or prices.
- Sample listings in `src/content/properties.json` carry `"sample": true` and must show a visible "Sample listing" tag. Delete them before going live.
- Illustration images carry `"placeholder": true` and must show a visible "Photo coming soon" tag.
- Reference for structure only: https://www.siddhivinayak-developers.com/. This is an unrelated Pune company. Do not copy its text, images or logo.
- Do better than the reference:
  - Allow pinch-zoom.
  - No loading screen.
  - No counters that render "0" before JavaScript runs.
  - No generic testimonials.

## Architecture

- **Astro 7.3.7** with **@astrojs/cloudflare 14.3.4**, deploying to Cloudflare Workers. **wrangler 4** is a dev dependency.
- Pages are prerendered at build time. Only the form pages use `export const prerender = false`.
- **Forms** use Astro Actions (`src/actions/index.ts`) with `accept: 'form'` and **zod 4**, imported from `astro/zod`:
  - Error messages use `{ error: '...' }`, not `message`.
  - Validation: Indian 10-digit mobile number, optional email, a required consent checkbox, and a honeypot field called `website`.
- **Leads** are delivered in one function, `src/lib/leads.ts`. Locally it logs to the terminal. At go-live it will save each lead to Sanity and send an email.
- **Listings** are an Astro content collection (`src/content.config.ts`) using the `file()` loader on `src/content/properties.json`. At go-live the loader is swapped for **Sanity** (free plan) with the same schema, so family members edit listings in Sanity Studio.
- Adapter config: `session: false` (not needed) and `imageService: 'passthrough'`.
- Fonts are self-hosted through Fontsource, already installed: `@fontsource/young-serif` and `@fontsource/mukta`. Mukta covers Devanagari, ready for Hindi pages later.

### Verified in a test run

- `astro build` succeeds.
- A form action returns 400 with field errors on invalid input, and a 302 redirect on success.
- The offline warning `Unable to fetch the Request.cf object` is harmless.

## Status

**Done:**
- `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- `src/config/site.ts`: business details plus `telHref` and `whatsappHref` helpers
- `src/content.config.ts` and `src/content/properties.json`: Vatika Green plus 2 sample listings
- `src/lib/properties.ts`: type and status labels, sorting, and `formatPrice` in Lakh/Cr
- `src/lib/form-options.ts`: shared select options
- `src/lib/leads.ts`
- `src/actions/index.ts`: the `requirement`, `sell` and `contact` actions

**To build next:**

1. **Styles and layout:** `src/styles/global.css`, `src/layouts/Base.astro`. Base.astro covers meta tags, `noindex` while `site.indexable` is false, RealEstateAgent JSON-LD, a skip link, Header, Footer and MobileBar.
2. **Components:**
   - Header, with a mobile menu toggle that uses `aria-expanded`
   - Footer, with office, site, contact details, links and the year
   - MobileBar, with Call, WhatsApp and Enquire buttons, each hidden when its value is empty
   - PropertyCard
   - PlotGrid, the hero SVG
   - Form parts: Field, ChoiceGroup, Consent, Honeypot
3. **Pages:**
   - `/`
   - `/properties`, with client-side filters by type and status, using `aria-pressed` and an empty state
   - `/properties/[slug]`
   - `/construction`
   - `/requirement`, which reads `?need=` to preselect an option
   - `/sell`
   - `/contact`, which reads `?property=` to fill a hidden field
   - `/thank-you`, `/privacy`, and a 404 page
4. **Progressive enhancement:** `src/scripts/enhance-form.ts` calls the action from the browser, shows field errors inline without a reload, and redirects to `/thank-you` on success. Without JavaScript, forms fall back to a normal POST with server-rendered errors.
5. **Placeholder illustrations** in `public/images/`: `vatika-green.svg`, `plot.svg`, `house.svg`, plus `public/favicon.svg`.
6. A `README.md` covering how to run the site and how to edit the business details.

## Design plan

- **Palette:**

  | Name | Hex |
  |---|---|
  | Paper | `#F3F6F1` |
  | Ink | `#17261D` |
  | Forest (primary, white text on it) | `#24533B` |
  | Forest deep | `#183B29` |
  | Sage | `#D9E5D3` |
  | Line | `#C9D6C3` |
  | Ochre (accent) | `#C8862E` |

  Ochre is for fills and highlights only. Put dark text on ochre, never white.
- **Status badges:**
  - Available: forest on sage
  - Booked: dark text on `#F3E3C8`
  - Sold: grey
  - Coming soon: `#2D5F7A` on `#DCE8EE`
- **Type:**
  - Young Serif for h1, h2 and property titles.
  - Mukta for everything else, with a 17px body size and 1.6 line-height.
  - Use sentence case. No all-caps labels and no eyebrow labels.
- **Signature element:** a hero illustration of a plot layout plan in SVG: plots on either side of an internal road, with trees, and one plot highlighted in ochre. It is the only animated moment, and it respects `prefers-reduced-motion`.
- **Hero:**
  - Headline about land and homes around Bhopal.
  - Three large path rows: "I want to buy" (to `/properties`), "I want to build a house" (to `/construction`) and "I want to sell" (to `/sell`).
- **Home page order:**
  1. Hero
  2. Featured Vatika Green section
  3. Latest 3 properties
  4. What we do (the 3 services)
  5. How a purchase works (4 numbered steps; numbers are fine because it is a real sequence)
  6. Sell banner
  7. Footer
- **Layout:** left-aligned, with a container up to 1200px.
- **Avoid:**
  - Identical card grids with the same shadow on everything
  - Gradient washes
  - An arrow character appended to button text
  - Scroll-in animations on every section
- **Accessibility:** visible focus styles, 48px tap targets, labels on every field, `aria-describedby` linking errors to fields, `aria-invalid` on invalid fields.

## Go-live checklist

1. Fill in contact details, delete the sample listings, and add real photos.
2. Create a Sanity project, add the schemas, swap the loader, and add a deploy hook so publishing a listing rebuilds the site.
3. Implement lead delivery: save to Sanity and send an email notification. Add Cloudflare Turnstile to the forms.
4. Deploy with `npx wrangler deploy` (or connect the Git repo in Cloudflare) to `*.workers.dev`, still `noindex`.
5. Buy the domain, add it to Cloudflare, set `site` in `astro.config.mjs`, and set `indexable: true`.
6. Set up Google Search Console and Google Business Profile, and add the RERA number to the footer if applicable.
7. Have a lawyer review the privacy policy. Forms collect personal data, which falls under India's DPDP Act, 2023.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321 ; form leads print in this terminal
npm run build
npm run preview
```
