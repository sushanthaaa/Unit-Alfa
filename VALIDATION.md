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

Deployment completion is recorded in the parent deliverables’ living TODO and DEPLOYMENT.md. This source snapshot is prepared before that publication.

## Original logo and motion revision

- Original logo verified byte-for-byte against the saved existing-site PNG (SHA-256 `d9b4d8d6a410d800ddee111894e2bed7625ed8adfc45c4bbd02bbb57ab860c6c`). Added 224,860 bytes; the same cached file serves header, footer and loader.
- Astro/TypeScript build: zero errors/warnings/hints. All nine-route static checks pass with the new logo and structured-data reference.
- Generated home-page inline JavaScript (including independent intro timeout) and emitted JavaScript bundles pass syntax checks.
- Motion code preserves native scrolling, hides the decorative loader from assistive technology and skips reduced motion. Those behaviours were source-reviewed; browser timing/interaction testing has not been performed.
