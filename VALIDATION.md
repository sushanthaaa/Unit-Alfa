# Validation record — 19 October 2026

## Environment and automated checks

Node.js 24.19.0, npm 11.19.1, Astro 7.3.3, TypeScript 6 and the Astro Vercel adapter. Dependencies and the lockfile were updated with npm 11. The Vercel routing utility's transitive path-to-regexp is pinned to its patched 6.3.0 release through an npm override.

- `npm test`: **37 tests passed**, including the approved Vercel launch-origin boundary added during setup.
- PostgreSQL migration tests run against PGlite with stand-in Supabase Auth/Storage tables. They cover atomic request/event/outbox creation, duplicate submission, attachment ownership/completion/MIME/size, upload limits, staff membership, stale updates, public/internal message separation, non-overlapping mail claims, expired final attempts, RLS/grants, reference growth and safe retention claims.
- API/service tests cover unavailable configuration, origin checks, body limits, anonymous/revoked staff access, signed tracking links, explicit customer response projection, email-provider failure, accepted provider IDs and idempotency headers. Provider HTTP calls are controlled test doubles; no real email or Supabase project is used.
- Shared validation tests preserve manufacturing notation and annual quantities while rejecting malformed input, header injection, invalid files and duplicate attachment IDs. Deployment-policy tests cover local/review/production origins and indexing boundaries.
- Astro/TypeScript diagnostics: zero errors, warnings or hints.
- Vercel build and generated-HTML audit: **19 page routes passed**, with 17 public sitemap entries, 404, robots, metadata, canonical/OG URLs, headings, internal links/anchors, local image assets/dimensions, labels, JSON-LD and legacy redirects.
- Prettier and `git diff --check`: passed.
- Full `npm audit`: zero reported vulnerabilities at the time checked. This is not a comprehensive security assessment.

The final build uses the Vercel adapter and produces static output plus server Functions. A preview-environment build verifies inherited production indexing settings cannot make a review deployment indexable.

## Browser checks performed

The local site was inspected in the Codex in-app browser with 320, 390, 768, 847 and 1440 pixel viewport widths. Representative screenshots were visually inspected. Mobile home-page and tablet capabilities checks found no page-level horizontal overflow.

- New logo and real hero image loaded correctly; responsive logo selection uses the smaller derivative.
- Mobile menu opens, exposes links and responds to Escape.
- Product filtering changes visible groups; a real photograph opens in the native dialog, Escape closes it and focus returns to its originating link.
- The RFQ prefills a selected product, stops on a required missing annual quantity, supports an unknown forecast, adds a second part and retains both requirements and technical notation in the review step.
- The unconfigured form clearly states its state and keeps submission disabled. No fake receipt or sent-email confirmation is displayed.
- The capabilities process disclosures expand. The packing-photo control updates selection, caption and image reference.
- Staff and tracking pages provide the correct unconfigured/no-private-link guidance without exposing records.

The CSS and motion code were inspected for reduced-motion overrides, native scrolling, focus visibility, keyboard-triggered reveals and the introduction's independent timeout/dismissal. OS-level reduced-motion emulation, a screen-reader pass, comprehensive cross-browser checks and measured Lighthouse/field Core Web Vitals were not performed. They remain deployment acceptance checks, not claimed passes.

## Asset and content checks

- Original supplied logo retained under `assets/brand/`. Full-size lossless WebP decoded RGBA pixels match the PNG; responsive logo derivatives reduce payload (360 px: 27,540 bytes; 640 px: 60,844 bytes).
- Profile product/factory/packing photographs are compressed WebP derivatives. No generated component image is referenced or deployed. The complete PDF and internal/customer drawing pages are not public assets.
- Current facts and withheld specifications are documented in `docs/CONTENT_NOTES.md`; every asset is logged in PHOTO_LOG.md.
- FLIS and packing are presented as operational following the user's latest confirmation. Website enquiry tracking makes no claim to integrate with FLIS.

## Subsequent live preview verification

After the user supplied signed-in provider sessions, Supabase and Resend were configured for the review branch. The live preview saved a two-part enquiry, uploaded/downloaded a private DXF, delivered staff/customer emails and a status update, and enforced staff revocation and tracking-token validation. A deliberate preview sender failure preserved a pending notification; restoring the sender and using staff retry delivered it. Internal notes stayed out of customer-visible content. See [the detailed setup record](docs/LIVE_SETUP_20261019.md) for scope, limitations and remaining production checks.

A local production-mode build with `SITE_URL=https://unitalfa.vercel.app` and indexing explicitly enabled passed the 19-page audit. This only validates the build policy; it did not change the hosted environment or enable indexing. Preview policy remains independently covered by tests and CI.

The company-controlled email-sending domain, five-minute scheduler, authenticated job/retention test and production credentials/acceptance remain outstanding. The existing `vercel.app` address does not provide DNS ownership for email verification. Indexing remains disabled and the review PR remains unmerged. No DNS cutover or client message was sent.

Historical September checks, earlier GitHub work and the retired mail-draft workflow are archived in `docs/research/VALIDATION_20260921.md`; they do not validate this new backend.
