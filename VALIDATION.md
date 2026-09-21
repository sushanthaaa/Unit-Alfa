# Validation record — 21 September 2026

- Runtime used: Node.js 24.19.0. npm 11.19.1. Astro 7.3.3 with TypeScript 6.
- Final Astro/TypeScript diagnostics: 25 files, zero errors, zero warnings, zero hints.
- Static build: nine main pages, 404, four legacy redirects, sitemap and robots generated successfully.
- Static HTML audit: all nine main routes have unique metadata, one h1, valid internal route/asset references, image dimensions/alt attributes, labelled form fields and parseable JSON-LD.
- RFQ tests: 3 passed. Manufacturing details survive formatting; missing/malformed/oversized input is rejected; header newlines are removed and URL encoding preserves plain text safely.
- Emitted client JavaScript syntax: checked with Node.
- Total emitted client JavaScript: 4,124 bytes (uncompressed).
- Thirteen deployed WebP images: 406,096 bytes combined. Real source images were not enlarged.
- Contrast calculations: graphite/orange 4.56:1; muted text/paper 5.38:1; rust/paper 5.34:1; large grey number/paper 3.69:1; footer grey/graphite 8.80:1.
- Local preview responded HTTP 200 before handoff. Browser opening was queued by the app.

## Limits

No browser screenshots, viewport interaction testing, assistive-technology checks or Lighthouse/field-performance measurement was performed. Responsive layouts, keyboard/focus behaviour and reduced motion are implemented but are not claimed as browser-tested. No supported live WebMCP test context was available; the optional draft tool is unverified in a browser. No email was sent and recipient delivery is not claimed. The actual company domain and DNS have not been altered.

Deployment completion is recorded in the parent deliverables’ living TODO and DEPLOYMENT.md. This source snapshot is prepared before that publication.
