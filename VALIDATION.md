# Validation record — 21 September 2026

- Runtime used: Node.js 24.19.0. npm 11.19.1. Astro 7.3.3 with TypeScript 6.
- Final Astro/TypeScript diagnostics: 28 files, zero errors, zero warnings, zero hints.
- Static build: nine main pages, 404, four legacy redirects, sitemap and robots generated successfully.
- Static HTML audit: all nine main routes have unique metadata, one h1, valid internal route/asset references, image dimensions/alt attributes, labelled form fields and parseable JSON-LD.
- RFQ tests: 3 passed. Manufacturing details survive formatting; missing/malformed/oversized input is rejected; header newlines are removed and URL encoding preserves plain text safely.
- Emitted client JavaScript syntax: checked with Node.
- Current JavaScript per page, counting inline and external scripts: Home 5,124 bytes; Enquiry 8,546 bytes (uncompressed). The external RFQ bundle is 4,124 bytes. Earlier bundle-only totals excluded inline scripts.
- Thirteen deployed WebP images: 406,096 bytes combined. Real source images were not enlarged.
- Contrast calculations: graphite/orange 4.56:1; muted text/paper 5.38:1; rust/paper 5.34:1; large grey number/paper 3.69:1; footer grey/graphite 8.80:1.
- Local preview responded HTTP 200 before handoff. Browser opening was queued by the app.

## Limits

No browser screenshots, viewport interaction testing, assistive-technology checks or Lighthouse/field-performance measurement was performed. Responsive layouts, keyboard/focus behaviour and reduced motion are implemented but are not claimed as browser-tested. No supported live WebMCP test context was available; the optional draft tool is unverified in a browser. No email was sent and recipient delivery is not claimed. The actual company domain and DNS have not been altered.

The initial replacement and the original-logo/motion revision were published to the private Sites preview. The GitHub/Vercel handoff below is a later source revision; Vercel publication and company-domain cutover are separate pending steps.

## Original logo and motion revision

- Original logo verified byte-for-byte against the saved existing-site PNG (SHA-256 `d9b4d8d6a410d800ddee111894e2bed7625ed8adfc45c4bbd02bbb57ab860c6c`). Added 224,860 bytes; the same cached file serves header, footer and loader.
- Astro/TypeScript build: zero errors/warnings/hints. All nine-route static checks pass with the new logo and structured-data reference.
- Generated home-page inline JavaScript (including independent intro timeout) and emitted JavaScript bundles pass syntax checks.
- Motion code preserves native scrolling, hides the decorative loader from assistive technology and skips reduced motion. Those behaviours were source-reviewed; browser timing/interaction testing has not been performed.

## GitHub / Vercel preparation

- Clean `npm ci` completed with Node.js 24.19.0 and npm 11.19.1 using the committed lockfile.
- Dependency audit: zero known vulnerabilities at the time of this check (including the new build-only HTML parser).
- Prettier formatting check passed.
- Nine Node tests passed: three RFQ tests and six deployment-configuration tests, including preview isolation when production variables are inherited.
- Astro/TypeScript diagnostics: 31 files, zero errors, warnings or hints.
- Full static builds and Node output audits passed for both Vercel-preview settings and approved company-domain production settings. These were local build checks, not remote Vercel deployments.
- Preview output uses the review origin and remains non-indexable even with an inherited production indexing flag. Approved-domain production output uses the company origin and allows indexing only with explicit opt-in.
- The output audit checks all nine page routes, canonical and Open Graph origins, metadata, indexing, local links/anchors/assets, image dimensions, form labels, JSON-LD, robots, sitemap and redirect fallbacks.
- Git-tracked content excludes dependencies, build output, local environment files and Vercel project state. A common-secret pattern scan of working files and the existing two-commit history found no matches. This is not a comprehensive security audit.
- Original logo, photography, layout, motion and browser interactions are unchanged in this handoff.

Live Vercel routing, deployment access, browser interaction/accessibility, email receipt and company-domain DNS remain to be verified after import. See VERCEL.md and TODO.md.
