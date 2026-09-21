# UNIT ALFA — replacement website

A complete multi-page Astro website for the sheet-metal and excavator-component manufacturer in Bommasandra, Bengaluru. The existing [Unit Alfa website](https://www.unitalfa.in/) is the approved factual baseline. This replacement does not change the existing domain or its hosting.

## Run and build

Use Node.js 22.18+ (Node 24 recommended) and npm 9.6.5+.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm test
npm run audit:static
```

Development and preview use http://127.0.0.1:4321. Astro 7 may retain its development server as a background process; use `npx astro dev stop` to stop it. The build runs Astro/TypeScript diagnostics before generating static HTML in `dist/`. No application server, database, paid font service or API key is required. `npm run format` formats the owned source.

## Pages and interactions

Home, About, Capabilities / Plant, Products, Quality, Enquiry / RFQ, Contact, Privacy and Website Terms, plus a 404 page. Every page has a clean URL and usable static HTML. The catalogue contains ten component families, category filtering, image enlargement and product-prefilled quote links. The plant page has an accessible native process disclosure sequence and click-to-load company video. Contact has a click-to-load map. Shared CSS supplies sequenced headline arrival, staggered scroll reveals, photographic reveals, manufacturing-process line motion, hover states, a mobile navigation menu and sticky enquiry access. A slim header line follows actual reading progress. Reduced-motion preferences disable motion.

## Content locations

| Change | File |
|---|---|
| Phone, email, address, proprietor, GSTIN and map | `src/data/company.ts` |
| Product copy, photos, generation labels and quote names | `src/data/products.ts` |
| Published machinery and process text | `src/data/machines.ts` |
| Colours, type, layouts, breakpoints and motion | `src/styles/global.css` |
| Shared navigation, footer and metadata | `src/layouts/Layout.astro` |
| Individual page text | `src/pages/` |
| Enquiry validation / email draft | `src/lib/rfq.ts`, `src/scripts/enquiry.ts` |
| Photo sources, prompts and usage | `PHOTO_LOG.md`, `generated-image-prompts.json` |

## Original logo and motion

The original script logo from the existing website is used unchanged in the header, footer and opening loader. Its PNG is also the Organization JSON-LD logo. Change it in `src/components/BrandLogo.astro` and `src/components/WelcomeLoader.astro` only if approved replacement artwork is supplied; do not retype or redraw it.

The first homepage visit per tab gets a brief introduction: the original logo and a moving industrial rule. It starts dismissing after the logo decodes and at least 580 ms have elapsed; an independent inline 1,400 ms deadline closes it even if assets or page modules fail. Any keyboard, pointer, wheel or touch interaction dismisses it. It never locks scrolling or takes focus. It is skipped on other routes, hash deep links, back/forward visits, reduced-motion preference and unavailable session storage. `unit-alfa-intro-seen` stores only a tab-session boolean; enquiry data is not persisted. Privacy text describes this flag.

Intro logic lives in `Layout.astro`; page motion is in `src/scripts/motion.ts` and `src/styles/motion.css`. Native scroll remains in control. Below-fold reveals use IntersectionObserver and bounded stagger; keyboard focus reveals content immediately. Live reduced-motion changes reveal all content. The reading line uses a passive scroll listener with requestAnimationFrame and responds to changed document height.

## Contact values and missing information

The user authorised reuse of the existing website. Phone **+91 87929 04185**, email **enquiry@unitalfa.com**, address, GSTIN and Google map are carried over from that baseline. `[PHONE]`, `[EMAIL]` and `[MAP_EMBED]` are therefore replaced with real existing-site values. Their operational receipt/last-mile accuracy has not been independently tested.

`[WORKING_HOURS]` is the only remaining data placeholder, in `company.ts`. It is deliberately not printed as a claim or placed in structured data; Contact says to call ahead. To publish actual hours, replace that field and add the confirmed schedule to the Contact page and, if useful, JSON-LD.

The company profile lists **6,000 sq ft shop floor + 4,000 sq ft open area**, while Home/About elsewhere give **16,600 sq ft**. The replacement uses the explicitly attributed profile figures and does not combine them. Verify before removing that qualification. All machines are identified as published capabilities, not a live capacity guarantee. Finishing and inspection scope are enquiry requirements rather than invented in-house processes.

**ISO 9001:2008 is historical.** There is no current certification badge, certificate image or invented ISO year. A current certificate, scope and expiry would be needed to change this. No customer/OEM logos, testimonials, production counts or unsupported tolerances are used.

## Enquiry delivery and drawings

This is an honest email-draft workflow. The form validates required details, prepares a visible draft, and provides **Open email app**, **Copy draft** and **Download .txt**. Nothing is sent automatically. Buyers attach drawings in their own email app. The file field is a clearly disabled upload placeholder; no uploaded drawings or RFQ database are exposed.

If mailto links are unsupported or a draft is too long for the email client, copy/download is the fallback. There is no fake success message, server endpoint or delivery receipt. No test email was sent to the company. To add direct submission later, implement an authenticated mail provider on a server, validation, rate limiting, attachment limits/private storage, error handling and an updated privacy notice. Never embed mail provider secrets in this static site.

An optional, feature-detected imperative WebMCP tool, `prepare_rfq_draft`, uses the same visible form state and validator. It stages an unsent draft only. Unsupported browsers keep the normal form. A supported live WebMCP validation context was unavailable, so registration and live tool execution are not claimed as verified.

## SEO and domain migration

`SITE_URL` controls canonical links, Open Graph URLs, sitemap and structured-data IDs. The default is the private Sites preview. Preview builds use `noindex,follow` and a disallowing robots file. For the existing production domain:

```sh
SITE_URL=https://www.unitalfa.in npm run build
```

Deploy the resulting `dist/` to the chosen host with HTTPS and route fallback to `404.html`. Production-domain builds enable crawling. Keep one consistent www/non-www origin, and configure the other to redirect. Sitemap: `/sitemap-index.xml`.

The old `/about-unit-alfa/`, `/unit-alfa-company-profile/`, `/unit-alfa-services/` and `/contact-unit-alfa/` paths have static redirect pages. `public/_redirects` also supplies 301 mappings for hosts that support that format; configure equivalent HTTP 301 rules on other hosts. Confirm remaining legacy URL paths from a production crawl before cutover. Do not overwrite the current site without its hosting access and a rollback backup.

Organization and LocalBusiness JSON-LD share one identity. Product records reference that identity through `manufacturer`; `Manufacturer` is not a schema.org type. No fake offers, ratings, unknown coordinates/hours or illustrative images masquerading as product evidence are added. Open Graph text/URL metadata is unique per page; no unrequested generated social card is used.

## Photography, fonts and licenses

Ten real company/Weldtables photographs and three clearly labelled generated component illustrations are used. Real originals remain in the sibling research `photos/` folder. Site WebP derivatives preserve small catalogue images at 345 × 260; factory images are not enlarged into fictitious high-resolution photographs. Every asset is recorded in PHOTO_LOG.md. No generative retouching was applied to real photographs. All body/display fonts are self-hosted with OFL notices in `licenses/`.

The source-code license is MIT. Company assets and third-party images/fonts retain their own rights. See THIRD_PARTY_NOTICES.md.

## Validation and remaining launch checks

`npm run build` covers Astro and TypeScript. `npm test` exercises required RFQ validation, manufacturing detail retention and mailto header safety. `npm run audit:static` checks generated routes, titles/descriptions, headings, internal links, image references/dimensions, form labels and JSON-LD parsing.

Responsive breakpoints, visible focus, menu Escape behaviour, native dialog focus return, field labels and reduced-motion CSS are implemented. Browser screenshots, viewport interaction tests, screen-reader checks and field performance measurements were not performed. Do not describe these as tested. See TODO.md for the remaining verification and domain-cutover work.
