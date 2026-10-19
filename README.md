# UNIT ALFA — manufacturing website

A multi-page Astro website for the Bommasandra manufacturer of press components, fabricated parts and assemblies for hydraulic excavators. The October revision uses the supplied company profile, new logo and direct company confirmations. Unconfirmed specifications remain unpublished; see [content notes](docs/CONTENT_NOTES.md).

Marketing pages are pre-rendered HTML. A small Vercel API handles enquiries, private drawings, staff access and notifications with **Supabase and Resend**. The code works as a review site without credentials: online submission clearly stays unavailable and the approved phone/email remain accessible. No request is falsely reported as received.

## Local development

Use **Node.js 24.x and npm 11+** (`nvm use` reads `.nvmrc`).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. Astro 7 can retain a background dev server; stop it with `npx astro dev stop`. Restart the dev server after installing dependencies or building if Vite reports an outdated optimized dependency.

```sh
npm run format:check
npm test
npm run build
npm audit
```

`build` runs Astro/TypeScript diagnostics, creates the Vercel Build Output API artifact in `.vercel/output/`, then audits the generated HTML. Marketing output is in `.vercel/output/static/`; API code is in `.vercel/output/functions/`. Use `npm run dev` for a complete local app. `astro preview` is not the deployment emulator for this Vercel integration; use a Vercel preview to validate the production runtime.

No external database or email account is needed for the test suite. Database tests execute the actual migration in embedded PostgreSQL through PGlite, using stand-in Supabase auth/storage tables. This does not replace an activation test on a real Supabase project.

## Pages and interactions

- Home, About, Capabilities, Products and seven product detail pages.
- How We Work replaces Quality: tooling, Delfoi planning, operational FLIS, inspection and packing.
- Enquiry explains capability fit; Request a Quote collects multiple parts and estimated **annual quantities**, including unknown forecasts.
- Contact, Privacy, Terms and 404; private status-link and authorised-staff pages.
- Category filtering, photograph lightbox, native process disclosures, packing-photo comparison, page and scroll reveals, reading progress and a short, dismissible first-visit logo introduction.

The site preserves native scrolling and provides reduced-motion styles, visible focus, labelled fields and contact fallbacks. Most content is static HTML. The RFQ, staff desk and private status service require JavaScript.

## Enquiry workflow

1. A buyer enters contact details and up to ten part requirements. Optional drawings go directly to a private Supabase bucket using signed upload URLs.
2. One database transaction creates the reference, initial status, attachments and notification jobs. Retrying the same submission returns the same reference.
3. Resend sends a company notification and buyer acknowledgement. Provider failure leaves the enquiry saved and mail queued for retry.
4. Staff sign in at `/admin/`, inspect drawings, assign an owner and record updates. Internal notes never appear in customer notifications or status responses.
5. Buyers use an unguessable private link to view enquiry updates. This service is separate from FLIS and is not a live production portal.

**Live activation requires account setup.** Follow [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md), then [VERCEL.md](VERCEL.md). Never put service keys in browser code, `PUBLIC_` variables, Git or chat. Use a separate test database and recipient for preview testing.

## Content and implementation locations

| Change                                                | Location                                                  |
| ----------------------------------------------------- | --------------------------------------------------------- |
| Company contact, address and shared facts             | `src/data/company.ts`                                     |
| Product copy, photo references and detail pages       | `src/data/products.ts`, `src/pages/products/[slug].astro` |
| Machinery and processes                               | `src/data/machines.ts`                                    |
| Page copy                                             | `src/pages/*.astro`                                       |
| Typography, colours, layout and motion                | `src/styles/global.css`, `src/styles/motion.css`          |
| Header, footer, logo and common metadata              | `src/layouts/Layout.astro`, `src/components/`             |
| Form validation and browser API helpers               | `src/lib/rfq.ts`, `src/lib/client.ts`                     |
| Browser interactions                                  | `src/scripts/`                                            |
| Authentication, notifications and server helpers      | `src/server/`                                             |
| Vercel API endpoints                                  | `src/pages/api/`                                          |
| Database schema, transactions and access restrictions | `supabase/migrations/`                                    |
| Canonical origin and preview indexing policy          | `src/lib/site-config.ts`                                  |
| Tests and generated-HTML audit                        | `scripts/`                                                |

## SEO and content integrity

Each public page has its own title, description, canonical URL and Open Graph metadata. Organization/LocalBusiness identity, product manufacturer references, breadcrumbs, internal links, sitemap and robots support discovery. `Manufacturer` is not a schema.org type; the implementation uses the valid `manufacturer` property on Product records. No invented ratings, offers, testimonials or certification dates are included.

Review deployments stay non-indexable. `/admin/`, `/track-enquiry/` and API responses remain non-indexable even after production launch. After domain approval, `SITE_URL` and `SITE_INDEXABLE=true` enable the recognised company origin. See [docs/SEO_HANDOVER.md](docs/SEO_HANDOVER.md) for search-console and local-discovery work. Search or AI-answer placement cannot be guaranteed by website code.

The approved launch address is currently `https://unitalfa.vercel.app`; indexing is still disabled pending production acceptance. The configured Supabase/Resend test environment, live results and remaining launch requirements are recorded in [docs/LIVE_SETUP_20261019.md](docs/LIVE_SETUP_20261019.md).

## Photographs and logo

All currently deployed photographs are real company/profile or Weldtables images. The new supplied purple logo is preserved intact in `assets/brand/`; its deployed WebP has identical decoded pixels and a smaller payload. Purple is used sparingly for brand details alongside graphite, drawing-paper white and amber. No generated component image is used in this revision. Every source and derivative is recorded in [PHOTO_LOG.md](PHOTO_LOG.md). The complete profile PDF is not deployed because it includes customer drawings and internal information that do not need to be public.

The code is MIT-licensed. Company trademarks, photographs and other content retain their owners' rights; the code license does not grant unrelated reuse. Self-hosted Barlow Condensed and Source Sans 3 have OFL notices under `licenses/`. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

See [TODO.md](TODO.md) for completion and account/company follow-ups, [VALIDATION.md](VALIDATION.md) for tested scope and limits, and [CONTRIBUTING.md](CONTRIBUTING.md) for the change workflow. Historical research remains in `docs/research/`; current content notes take precedence. The old `.openai/hosting.json` records an earlier Sites preview and is not used by Vercel.
