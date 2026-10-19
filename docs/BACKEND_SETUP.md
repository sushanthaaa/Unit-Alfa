# Supabase and Resend setup

The review environment was configured and tested on 19 October 2026; see [the live setup record](LIVE_SETUP_20261019.md) for completed checks and remaining production requirements. Keep production `RFQ_ENABLED=false` until its checklist is complete. Use separate test and production projects/keys. Enter secrets directly in Vercel or a local ignored `.env`; do not paste them into chat or Git.

## 1. Create the database and private storage

1. Create a company-controlled Supabase project in a suitable region. Keep project ownership and recovery details with the company.
2. Run `supabase/migrations/202610190001_enquiries.sql` once in the SQL editor, or apply it through the Supabase CLI migration workflow. Do not repeatedly paste an already-applied migration. Keep later schema changes as new migrations.
3. Confirm the six `rfq_*` tables have row-level security enabled and no anonymous/authenticated access grants. The migration creates the private `rfq-drawings` bucket with a 20 MB per-object cap and allowed MIME types. Do **not** make it public or add anonymous read/write policies.
4. Open the project's **Connect** dialog for its URL. Under **Settings → API Keys → Publishable and secret API keys**, copy the publishable key (`sb_publishable_…`) and create a secret key (`sb_secret_…`) for the website. The secret key bypasses RLS and belongs only in server environment variables. The publishable key is used by server-side staff sign-in; it does not grant application-table access. The code also accepts the old `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` names for existing configurations, but new projects should use the current keys below.
5. Keep database backups enabled according to the company's chosen plan. Test recovery separately; storage objects and database backups are separate concerns.

## 2. Provision authorised staff

Disable public email sign-ups in Supabase Auth. Create the intended staff account through the company-controlled Auth admin interface, using an existing approved staff email and a securely delivered password. This site does not offer public registration or self-service password recovery. A company administrator manages invitations/password resets through Supabase.

After the Auth user exists, copy its UUID and add membership:

```sql
insert into public.rfq_staff (user_id, display_name)
values ('REPLACE_WITH_AUTH_USER_UUID'::uuid, 'Jaisurya Govindan');
```

Provision another named member only when authorised. To remove application access immediately, set that membership's `enabled` to `false`; also revoke the Auth user's sessions if appropriate. Membership is checked on every staff API request.

Staff sign in at `/admin/`. Credentials are exchanged server-side; HTTP-only, SameSite=Strict cookies are scoped to `/api/admin/`. HTTPS deployments use Secure cookies. Refresh cookies expire after eight hours without renewal; Supabase controls access-token expiry. There are no staff tokens in localStorage. Use individual staff accounts for attributable updates.

## 3. Verify a Resend sender

1. Create a company-controlled Resend account and add a domain/subdomain the company can verify.
2. Add the DNS records Resend displays and wait for verified status. Do not guess DNS values or treat the old public website domain as proof of email-domain ownership.
3. Create an API key with sending access for the required domain. Set `RFQ_FROM_EMAIL` to an approved sender on that verified domain, such as a company-agreed website-notifications address. This is a configuration example, not an assertion that a new mailbox exists.
4. Keep `RFQ_RECIPIENT_EMAIL=gmo@unitalfa.co.in` for production. In the separate test environment, use a monitored test recipient. Company notifications use the buyer email as Reply-To; customer messages use the company recipient as Reply-To.
5. Check sender authentication and test inbox delivery. Review bounces/complaints in Resend. The current implementation records API acceptance and provider IDs; it does not implement bounce/delivery webhooks.

## 4. Configure environment variables

Copy `.env.example` only for local testing. In Vercel, configure the values in the intended environment. None of these names should receive a `PUBLIC_` prefix.

| Variable                   | Purpose                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| `SUPABASE_URL`             | Dedicated Supabase project URL                                      |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key for staff sign-in                                   |
| `SUPABASE_SECRET_KEY`      | Server-only secret key for database/storage access                  |
| `RFQ_TOKEN_SECRET`         | Random signing secret, at least 32 characters                       |
| `RESEND_API_KEY`           | Transactional email sending key                                     |
| `RFQ_FROM_EMAIL`           | Approved Resend-verified sender                                     |
| `RFQ_RECIPIENT_EMAIL`      | Company enquiry recipient; defaults to gmo@unitalfa.co.in           |
| `CRON_SECRET`              | Independent random secret, at least 32 characters                   |
| `RFQ_ENABLED`              | Set `true` only after configuration and scheduled retry are ready   |
| `SITE_URL`                 | Approved production origin; use localhost only for local test links |
| `SITE_INDEXABLE`           | Leave `false` during review                                         |

Generate each signing secret independently in a trusted terminal, for example with `openssl rand -hex 32`. Save it directly in the company's secret store and hosting settings. Rotating `RFQ_TOKEN_SECRET` invalidates existing customer tracking links and resets the keyed rate-limit identity; plan that change deliberately. Service/API key rotation does not require changing the tracking secret.

For local testing use `SITE_URL=http://127.0.0.1:4321`, `SITE_INDEXABLE=false` and an isolated Supabase project. Vercel preview links derive from platform deployment variables. Avoid inheriting production backend secrets into every preview: use an explicitly configured test environment, test files and test email addresses. Never send review traffic to the live company inbox unintentionally.

## 5. Enable scheduled retry and retention

Configure a five-minute production schedule for `GET /api/jobs/notifications/` using [VERCEL.md](../VERCEL.md). Vercel passes `Authorization: Bearer <CRON_SECRET>`. An external scheduler must send the same header and respect any deployment protection. Never put the secret in the URL.

The repository's default daily schedule is for review compatibility, not prompt production retries. Vercel Pro/Enterprise supports the recommended five-minute schedule; Hobby does not. Select an appropriate company hosting plan or approved external scheduler before enabling the live service.

Each invocation claims up to ten due notifications with non-overlapping database leases, then performs cleanup. Retry delays grow up to one hour, with at most eight attempts before staff intervention. A process that dies during the final attempt becomes a visible failed job after its lease expires. Monitor job failures and notification backlog in Vercel/Supabase, particularly at volumes exceeding ten due messages per interval.

Retention removes unsubmitted drawing uploads older than 24 hours, rate-limit buckets older than two days, and enquiries closed for more than 365 days. Files are removed before their database records. A retention claim prevents a closed request from being reopened during deletion. Cleanup depends on a functioning scheduler. Mailboxes, provider records and backups follow the respective company/provider retention policies and are not erased by this job.

## 6. Controlled activation test

Use a synthetic company/contact and a harmless test drawing in the test project.

1. Deploy with all settings and `RFQ_ENABLED=true`; confirm the online form becomes available.
2. Submit two parts, including one unknown annual quantity, and attach a small PDF. Check one saved reference, both part records, private object and two notification jobs.
3. Confirm both mail recipients receive the intended messages. Repeating the same request must reuse its reference. Refreshing the page starts a new form; use the existing reference for amendments.
4. Sign in as staff; inspect the file, assign an owner and publish a status update. Verify the private customer link shows the new status. Add a separate internal note and confirm it is absent from customer responses/emails.
5. Try an anonymous staff API/file request and a modified tracking token. Both must fail. Disable the test staff membership and confirm access is revoked.
6. In the isolated environment, temporarily use an invalid mail key and submit a synthetic request. Confirm the reference is still saved and email jobs remain pending. Restore the key and invoke the scheduled endpoint or use staff retry. Do not perform failure injection on production.
7. Verify authenticated cron invocation, retry timing, provider logs and cleanup with disposable test records. Record the deployed URL, migration version and results in VALIDATION.md.
8. Switch to the approved production configuration and verify with the company before opening real submissions and enabling search indexing.

The initial implementation used controlled provider test doubles. Subsequent live preview results are recorded separately in [LIVE_SETUP_20261019.md](LIVE_SETUP_20261019.md); they do not establish production readiness.

## Staff operating guide

- **Received:** saved by the website, awaiting review.
- **Under technical review:** team is reviewing feasibility and requirements.
- **Information required:** send a specific question in the customer-visible message.
- **Quotation sent:** staff has actually issued the quotation through the company's agreed channel. The website does not generate prices or quotations.
- **Closed:** discussion closed; record enters the retention period.

Changing status requires a public message. Internal notes and owner-only changes can be saved without emailing the buyer. Concurrent changes use a version check; a stale update is rejected rather than overwriting another person's work. Reload before retrying and retain any unsaved text you need.

Drawing downloads require authorised staff access and use a one-minute signed URL. Customer tracking links are bearer links: anyone receiving the complete link can see the status and public messages, but not drawings/contact details/internal notes. Forward them only as intended. Additional or amended drawings can be sent to the team with the reference; the website does not currently offer customer file amendments or a customer account portal.

Notifications marked `sent` have been accepted by Resend, not necessarily delivered to an inbox. Check Resend logs before manually retrying an ambiguous timeout. The same job uses a Resend idempotency key, whose documented retention is 24 hours; a late manual retry can duplicate an already accepted message. The system does not promise exactly-once email delivery.

Allowed extensions, declared MIME types, actual stored size/MIME, upload ownership, count and aggregate submitted size are checked. No malware-scanning service is integrated. Staff should handle downloaded technical files using company-approved tools. Request-body size, honeypot, keyed IP rate limits and storage caps provide baseline abuse controls; configure hosting-level protection and usage alerts appropriate to real traffic.

## References

- [Supabase current API keys and dashboard locations](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase migration from legacy API keys](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)
- [Supabase staff sign-in configuration](https://supabase.com/docs/guides/auth/general-configuration)
- [Resend verified sender domains](https://resend.com/docs/dashboard/domains/introduction)
- [Supabase signed upload URLs](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl)
- [Supabase server-verified users](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
