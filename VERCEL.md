# Vercel deployment and client review

## Review site

1. Import `sushanthaaa/Unit-Alfa` into Vercel, or use the existing project. Select Astro, repository root `./`, Node.js 24.x and the committed install/build commands.
2. **Clear any old Output Directory override of `dist`.** The Astro Vercel adapter creates `.vercel/output/` with static pages and Functions. Keep the framework output setting automatic.
3. For an initial visual review, leave backend secrets unset and `RFQ_ENABLED=false`. Keep `SITE_INDEXABLE=false`. Vercel's deployment variables provide the preview origin; do not point a preview's canonical URLs at production.
4. Deploy a branch preview for review. Keep the existing company domain unchanged until the company approves the new site and live enquiry setup.
5. Check Deployment Protection before sharing. Test the review link while signed out or use Vercel's permitted share options. `noindex` prevents intentional indexing; it is not access control.

The committed cron runs daily so an unconfigured review deployment does not fail because of a plan-specific five-minute schedule. **Before activating live enquiries, configure the production retry schedule described below.** No paid account upgrade is performed by this repository.

## Backend activation

Complete [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md): Supabase migration and staff membership, Resend verified sender, private environment variables and a controlled end-to-end test.

For production with Vercel Pro/Enterprise, change the existing cron schedule in `vercel.json` to `*/5 * * * *`. Its path is `/api/jobs/notifications/`. Set `CRON_SECRET` to a separate random value of at least 32 characters; Vercel passes it as the Bearer authorization header. Cron jobs run against the production deployment, so a branch preview needs manual invocation or a separately configured test scheduler.

Vercel Hobby currently allows only daily cron jobs and rejects more frequent schedules. It is also restricted to personal, non-commercial use; the company launch needs a suitable commercial plan such as Pro or another approved hosting arrangement. An external scheduler does not resolve that use restriction. If using a different permitted hosting/scheduling arrangement, invoke the same endpoint every five minutes with the secret Bearer header. Remove the Vercel cron entry if an external scheduler becomes authoritative. Do not enable live submissions with only the review schedule and assume prompt automatic retries.

Functions have a configured maximum duration of 120 seconds. Files bypass Vercel's request-body limit through private direct uploads; the API accepts only small JSON metadata. Static marketing pages do not invoke a Function per visit.

## Acceptance checklist

- Review all public pages and product details on mobile and desktop; approve current company facts and photography.
- Verify `/quality/` redirects to `/how-we-work/`, plus the four older WordPress paths in `vercel.json`.
- Verify unknown URLs return the custom 404 with HTTP 404.
- Submit a synthetic enquiry with a small non-confidential drawing in the test environment. Confirm the reference, private file, staff notification and buyer acknowledgement.
- Sign in as authorised staff; make a customer-visible update and a separate internal note. Confirm the customer sees only the public update.
- Test retry and the protected scheduled job; check Supabase storage CORS and Resend provider logs. A provider-accepted message is not proof of inbox delivery.
- Confirm staff access revocation and that anonymous requests cannot retrieve drawings or dashboard data.
- Keep review pages noindex. Check canonical and email status-link origins on the deployed runtime.

## Approved website launch

The user approved `https://unitalfa.vercel.app` on 19 October 2026. This is a Vercel-provided website address, not ownership of `vercel.app` or an email-sending domain. The current project has no custom domain. Keep indexing disabled until production enquiry testing and the launch checklist are complete. See [the live setup record](docs/LIVE_SETUP_20261019.md).

1. Record existing DNS/hosting settings and keep a rollback path.
2. For the approved Vercel address, no custom-domain DNS change is needed. If a company-owned domain is chosen later, add it in Vercel using the DNS records Vercel supplies and choose one canonical origin.
3. Set `SITE_URL=https://unitalfa.vercel.app` and `SITE_INDEXABLE=true` in **Production only**, after the production acceptance checks. This host is explicitly allowlisted, alongside the historical company `.in` origins. Arbitrary deployment hosts remain excluded. If the company chooses another domain, intentionally update the allowed host list in `src/lib/site-config.ts` and its tests.
4. Redeploy. Verify HTTPS, redirects, public pages, contact details, live enquiries, private routes, sitemap and robots on the actual domain.
5. Submit `/sitemap-index.xml` through the company's search-console account. Confirm preview deployments still have noindex.

Build-time metadata changes require a rebuild; runtime secret changes also require the corresponding deployment. To roll back, promote a known-good deployment or revert the code change. A code rollback does not revert database migrations or delete stored enquiries. Restore DNS separately if necessary.

## Local checks

```sh
nvm use
npm ci
npm run format:check
npm test
npm run build
```

To test the preview indexing policy without publishing:

```sh
VERCEL_ENV=preview VERCEL_URL=unit-alfa-review.vercel.app npm run build
```

A Vercel preview is still required to verify routing, server cookies, platform headers, scheduled jobs and provider connectivity. Local checks do not claim deployment success.

## Official references

- [Astro Vercel integration](https://docs.astro.build/en/guides/integrations-guide/vercel/)
- [Vercel cron limits and pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- [Vercel Hobby plan and use restriction](https://vercel.com/docs/plans/hobby)
- [Vercel cron management and security](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- [Vercel Function limits](https://vercel.com/docs/functions/limitations)
- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
