# UNIT ALFA — replacement website

A complete multi-page Astro website for the sheet-metal and excavator-component manufacturer in Bommasandra, Bengaluru. The existing [Unit Alfa website](https://www.unitalfa.in/) is the approved factual baseline. This repository contains the replacement prepared for Vercel and client review. The existing company domain and DNS have not been changed.

## Run and build

Use **Node.js 24.x** and **npm 11+**. With nvm installed, run `nvm use` in this repository. The committed lockfile is the dependency baseline.

```sh
git clone https://github.com/sushanthaaa/Unit-Alfa.git
cd Unit-Alfa
npm ci
npm run dev
npm run build
npm run preview
npm test
npm run format:check
```

Development and preview use http://127.0.0.1:4321. Astro 7 may retain its development server as a background process; use `npx astro dev stop` to stop it. The build runs Astro/TypeScript diagnostics, generates static HTML in `dist/`, and audits the generated pages. No Python installation is needed. No application server, database, paid font service or API key is required. `npm run format` formats source and documentation. `npm run audit:static` reruns the output audit; its environment must match the build. GitHub Actions runs installation, formatting, tests and a Vercel-preview build for pushes to `main` and pull requests.

## Pages and interactions

Home, About, Capabilities / Plant, Products, Quality, Enquiry / RFQ, Contact, Privacy and Website Terms, plus a 404 page. Every page has a clean URL and usable static HTML. The catalogue contains ten component families, category filtering, image enlargement and product-prefilled quote links. The plant page has an accessible native process disclosure sequence and click-to-load company video. Contact has a click-to-load map. Shared CSS supplies sequenced headline arrival, staggered scroll reveals, photographic reveals, manufacturing-process line motion, hover states, a mobile navigation menu and sticky enquiry access. A slim header line follows actual reading progress. Reduced-motion preferences disable motion.

## Content locations

| Change                                                  | File                                           |
| ------------------------------------------------------- | ---------------------------------------------- |
| Phone, email, address, proprietor, GSTIN and map        | `src/data/company.ts`                          |
| Product copy, photos, generation labels and quote names | `src/data/products.ts`                         |
| Published machinery and process text                    | `src/data/machines.ts`                         |
| Colours, type, layouts, breakpoints and motion          | `src/styles/global.css`                        |
| Shared navigation, footer and metadata                  | `src/layouts/Layout.astro`                     |
| Individual page text                                    | `src/pages/`                                   |
| Enquiry validation / email draft                        | `src/lib/rfq.ts`, `src/scripts/enquiry.ts`     |
| Photo sources, prompts and usage                        | `PHOTO_LOG.md`, `generated-image-prompts.json` |

## Original logo and motion

The original script logo from the existing website is used unchanged in the header, footer and opening loader. Its PNG is also the Organization JSON-LD logo. Change it in `src/components/BrandLogo.astro` and `src/components/WelcomeLoader.astro` only if approved replacement artwork is supplied; do not retype or redraw it.

The first homepage visit per tab gets a brief introduction: the original logo and a moving industrial rule. It starts dismissing after the logo decodes and at least 580 ms have elapsed; an independent inline 1,400 ms deadline closes it even if assets or page modules fail. Any keyboard, pointer, wheel or touch interaction dismisses it. It never locks scrolling or takes focus. It is skipped on other routes, hash deep links, back/forward visits, reduced-motion preference and unavailable session storage. `unit-alfa-intro-seen` stores only a tab-session boolean; enquiry data is not persisted. Privacy text describes this flag.

Intro logic lives in `Layout.astro`; page motion is in `src/scripts/motion.ts` and `src/styles/motion.css`. Native scroll remains in control. Below-fold reveals use IntersectionObserver and bounded stagger; keyboard focus reveals content immediately. Live reduced-motion changes reveal all content. The reading line uses a passive scroll listener with requestAnimationFrame and responds to changed document height.

## Contact values and missing information

The primary enquiry contact is **Jaisurya Govindan, General Manager**, phone **+91 94806 16429**, email **gmo@unitalfa.co.in**, as supplied for the replacement website. These details appear on Contact, Enquiry and the shared footer; phone/email links, RFQ drafts and structured data use the same central record in `src/data/company.ts`. The proprietor remains Sashidhar K. G.; the enquiry contact is a separate role. Address, GSTIN and Google map are carried over from the existing website. Phone/email receipt and the map's last-mile accuracy have not been independently tested.

`[WORKING_HOURS]` is the only remaining data placeholder, in `company.ts`. It is deliberately not printed as a claim or placed in structured data; Contact says to call ahead. To publish actual hours, replace that field and add the confirmed schedule to the Contact page and, if useful, JSON-LD.

The company profile lists **6,000 sq ft shop floor + 4,000 sq ft open area**, while Home/About elsewhere give **16,600 sq ft**. The replacement uses the explicitly attributed profile figures and does not combine them. Verify before removing that qualification. All machines are identified as published capabilities, not a live capacity guarantee. Finishing and inspection scope are enquiry requirements rather than invented in-house processes.

**ISO 9001:2008 is historical.** There is no current certification badge, certificate image or invented ISO year. A current certificate, scope and expiry would be needed to change this. No customer/OEM logos, testimonials, production counts or unsupported tolerances are used.

## Enquiry delivery and drawings

This is an honest email-draft workflow. The form validates required details, prepares a visible draft, and provides **Open email app**, **Copy draft** and **Download .txt**. Nothing is sent automatically. Buyers attach drawings in their own email app. The file field is a clearly disabled upload placeholder; no uploaded drawings or RFQ database are exposed.

If mailto links are unsupported or a draft is too long for the email client, copy/download is the fallback. There is no fake success message, server endpoint or delivery receipt. No test email was sent to the company. To add direct submission later, implement an authenticated mail provider on a server, validation, rate limiting, attachment limits/private storage, error handling and an updated privacy notice. Never embed mail provider secrets in this static site.

An optional, feature-detected imperative WebMCP tool, `prepare_rfq_draft`, uses the same visible form state and validator. It stages an unsent draft only. Unsupported browsers keep the normal form. A supported live WebMCP validation context was unavailable, so registration and live tool execution are not claimed as verified.

## Vercel deployment and SEO

See [VERCEL.md](VERCEL.md) for import, review sharing and domain cutover instructions.

| Vercel setting    | Value                   |
| ----------------- | ----------------------- |
| Repository        | `sushanthaaa/Unit-Alfa` |
| Production branch | `main`                  |
| Root directory    | `./` (repository root)  |
| Framework preset  | Astro                   |
| Node.js           | 24.x                    |
| Install command   | `npm ci`                |
| Build command     | `npm run build`         |
| Output directory  | `dist`                  |

This is a static Astro build. It requires no Vercel adapter, server functions, database or API keys. `vercel.json` supplies permanent legacy redirects, consistent trailing slashes and basic response headers. Astro supplies the `404.html` page. There is no SPA catch-all rewrite.

`src/lib/site-config.ts` is the shared source of truth for canonical URLs and indexing. Vercel review builds use their deployment URL; production uses `SITE_URL` when supplied, otherwise Vercel's project production URL. Local development defaults to `http://localhost:4321`. Both HTML and robots stay non-indexable by default, including the initial main-branch `vercel.app` deployment.

After client approval and company-domain setup, set `SITE_URL=https://www.unitalfa.in` and `SITE_INDEXABLE=true` in Vercel's **Production** environment and redeploy. Preview deployments remain non-indexable even if they inherit production settings. Local overrides can be placed in `.env` copied from `.env.example`; platform/shell values take precedence. Environment values are applied at build time, so any change requires a rebuild.

The four known legacy paths have permanent Vercel redirects and static redirect fallbacks. `public/_redirects` is retained for hosts supporting that format. Confirm remaining legacy paths before domain cutover. Keep one www/non-www origin and redirect the other in Vercel's domain settings. Sitemap: `/sitemap-index.xml`.

Organization and LocalBusiness JSON-LD share one identity. Product records reference that identity through `manufacturer`; `Manufacturer` is not a schema.org type. No fake offers, ratings, unknown coordinates/hours or illustrative images masquerading as product evidence are added. Open Graph text/URL metadata is unique per page; no unrequested generated social card is used.

## Photography, fonts and licenses

Ten real company/Weldtables photographs and three clearly labelled generated component illustrations are used. The repository includes all deployed derivatives and the original logo. Larger source photographs remain in the separate research archive; they are not required to build. PHOTO_LOG.md retains their public source URLs and archive identifiers. Site WebP derivatives preserve small catalogue images at 345 × 260; factory images are not enlarged into fictitious high-resolution photographs. Every asset is recorded in PHOTO_LOG.md. No generative retouching was applied to real photographs. All body/display fonts are self-hosted with OFL notices in `licenses/`.

The source-code license is MIT. Company assets and third-party images/fonts retain their own rights. See THIRD_PARTY_NOTICES.md.

## Validation and remaining launch checks

`npm run build` covers Astro and TypeScript. `npm test` exercises required RFQ validation, manufacturing detail retention, mailto header safety, URL validation and the preview/production indexing boundary. `npm run audit:static` checks generated routes, unique metadata, canonical/OG origins, indexing policy, headings, internal links and anchors, image references/dimensions, form labels, JSON-LD parsing, sitemap, robots and redirect fallbacks.

Responsive breakpoints, visible focus, menu Escape behaviour, native dialog focus return, field labels and reduced-motion CSS are implemented. Browser screenshots, viewport interaction tests, screen-reader checks and field performance measurements were not performed. Do not describe these as tested. See TODO.md for the remaining verification and domain-cutover work.

## Repository structure and contribution

```text
src/
  components/  Reusable Astro components
  data/        Company facts, products and machine specifications
  layouts/     Shared document shell, navigation, footer and metadata
  lib/         RFQ validation and build-time deployment policy
  pages/       One static route per page, plus robots.txt
  scripts/     Browser interactions and motion
  styles/      Owned responsive styles and motion
public/        Deployed images, favicon and host-neutral redirects
scripts/       Node tests and generated-HTML audit
licenses/      Font license notices
docs/research/ Original research, competitor review and design specification
.github/       Automated checks
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the change workflow, [PHOTO_LOG.md](PHOTO_LOG.md) for asset sources, [VALIDATION.md](VALIDATION.md) for check results and limits, and [TODO.md](TODO.md) for client/launch follow-ups. The `.openai/hosting.json` file identifies the earlier Sites preview; Vercel does not use it and it contains no credentials.
