# Contributing

Use Node.js 24.x and npm 11+. Install with `npm ci`; preserve the lockfile. Make focused changes on a branch and open a pull request against `main`.

Before submitting:

```sh
npm run format
npm test
npm run build
```

GitHub Actions checks formatting, tests and the static build. Run `npm run dev` for local development and `npm run preview` to inspect a production build. Keep required checks green; repository branch-protection rules can require the **Format, test and build** job once enabled by the owner.

## Code and content conventions

- Keep shared company facts, products and machinery in `src/data/`. Reuse Astro components and the common layout. Keep domain and indexing decisions in `src/lib/site-config.ts`.
- Prefer static HTML and small browser modules. Preserve native scrolling, keyboard access, readable focus states, no-JavaScript content and reduced-motion support.
- Use the existing industrial typography, colors and spacing. Avoid changing the original company logo or introducing unsupported customer, capability or certification claims.
- Keep RFQ text validation shared between the visible form and optional draft tool. Never report that an email was sent when only a draft was prepared.
- Record every changed image's source and usage in `PHOTO_LOG.md`. Identify generated illustrations visibly. Preserve source and font notices; the MIT code license does not license company photographs or trademarks for unrelated use.
- Do not commit secrets, local `.env` files, `.vercel/`, build output or dependencies. Add meaningful tests for changed validation or deployment behavior; do not add tests that simply duplicate static copy.
- Update README, VERCEL.md or TODO.md when behavior, deployment or outstanding client decisions change. Describe what was checked and what still needs browser/client verification in the pull request.
