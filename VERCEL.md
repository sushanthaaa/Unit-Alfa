# Deploy UNIT ALFA on Vercel

## Client review deployment

1. In Vercel, create a new project and import `sushanthaaa/Unit-Alfa` from GitHub. Grant Vercel access to this repository if requested.
2. Select **Astro**, repository root **`./`**, production branch **`main`**, and **Node.js 24.x**. The repository pins Node and provides the remaining settings in `vercel.json`: `npm ci`, `npm run build`, output `dist`.
3. Leave `SITE_URL` unset for the first review deployment. Leave `SITE_INDEXABLE` unset or `false`. No API key or other secret is needed. Keep Vercel's automatically exposed system environment variables enabled, so generated URLs are available during the build.
4. Deploy. Vercel should serve the nine pages, `404.html`, sitemap, robots, local fonts and image assets directly from the static output.
5. Use the generated Vercel URL for client review. Check the project's **Deployment Protection** setting and test access while signed out before sharing; if protected, use Vercel's permitted sharing/access options. A `noindex` tag does not make a deployment private.

The first deployment from `main` is called Production by Vercel even during client review. This repository deliberately keeps that `vercel.app` deployment non-indexable. Every branch/PR preview also stays non-indexable. Subsequent pushes to the connected branch trigger Vercel builds; pull requests receive preview deployments according to the integration settings.

## Review acceptance

- Confirm the current enquiry contact, phone, email, map entrance, working hours, plant figures and certification wording with the client. The source claims are qualified and the original company logo is preserved.
- Review Home, About, Capabilities, Products, Quality, Enquiry, Contact, Privacy and Terms on phone and desktop. Check keyboard navigation, the product lightbox and reduced-motion preference.
- The enquiry form prepares an **unsent email draft**. Drawings are attached in the buyer's email app. It is not a hosted upload or automatic email service; approve that workflow before launch.
- Check `/about-unit-alfa/`, `/unit-alfa-company-profile/`, `/unit-alfa-services/` and `/contact-unit-alfa/` redirect to their replacements. Vercel's `permanent` redirects use HTTP 308. Astro also emits static fallbacks for other hosts.
- Check an unknown URL returns the custom 404 with a 404 status. No blanket rewrite to the home page is configured.

## Approved company-domain launch

1. Back up the existing site and record its DNS/hosting settings. Keep a rollback path before changing DNS.
2. Add the agreed company domain to the Vercel project and follow the domain-specific DNS records Vercel provides. Choose one canonical origin; the existing site's `https://www.unitalfa.in` is the current default recommendation. Redirect the other www/non-www variant in domain settings.
3. Set these values in Vercel's **Production environment only**:

   ```dotenv
   SITE_URL=https://www.unitalfa.in
   SITE_INDEXABLE=true
   ```

4. Redeploy Production. The flag takes effect only on the recognized company domain and only outside Vercel previews. If the client chooses a different domain, update the allowed company hosts in `src/lib/site-config.ts` deliberately and update its tests.
5. Verify HTTPS, redirects, contact links, forms, canonical and Open Graph URLs, structured data, `/robots.txt` and `/sitemap-index.xml` on the actual domain. Production robots should allow crawling; previews should continue to disallow it.
6. Submit the sitemap in the company's search-console account after approval. Keep the old host until DNS migration and rollback checks are complete.

Environment changes do not alter already-built HTML; always rebuild/redeploy. To roll back, redeploy a known-good Vercel deployment or revert the Git commit and let the integration rebuild. Restore the recorded DNS if a domain migration must be reversed.

## Local reproduction

```sh
nvm use
npm ci
npm run format:check
npm test
npm run build
npm run preview
```

Run an equivalent review build with Vercel's build-time variables:

```sh
VERCEL_ENV=preview VERCEL_URL=unit-alfa-review.vercel.app npm run build
```

Run an approved-domain build locally without publishing it:

```sh
SITE_URL=https://www.unitalfa.in SITE_INDEXABLE=true npm run build
```

The build includes the generated-HTML audit. Keep local `.env` files, `.vercel/`, dependencies and build output out of Git. The committed `.env.example` documents the two optional settings.

## References

- [Astro's Vercel deployment guide](https://docs.astro.build/en/guides/deploy/vercel/) — static output requires no adapter.
- [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json) — build settings, redirects and headers.
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables) — deployment and production URLs.
- [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) — supported runtime selection.

This guide prepares the repository for Vercel; it does not claim a Vercel deployment, domain migration or client email has already occurred.
