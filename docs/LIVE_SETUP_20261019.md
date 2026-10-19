# Live review environment — 19 October 2026

This is a test setup, not approval to accept real customer enquiries. All test messages go to the user-authorised Gmail inbox. No company inbox, DNS record or production backend setting was changed.

## Configured

- Vercel project: `unitalfa`, team `sushanth-ps-projects`; Hobby plan.
- Review branch: `codex/company-profile-enquiry-revision`.
- Stable review URL: <https://unitalfa-git-codex-company-profile-792053-sushanth-ps-projects.vercel.app>.
- Supabase test project: `mkgrvzwjsfwfcntghlwf`, Singapore. Applied `202610190001_enquiries.sql` once.
- All six application tables have RLS enabled. Anonymous and ordinary authenticated roles cannot read enquiry records; the server role has the required function/table privileges.
- `rfq-drawings` is private with a 20 MB object limit. No anonymous storage policy was added.
- Public and anonymous sign-ups are disabled. A confirmed, named test staff user has an enabled `rfq_staff` membership.
- All eleven backend/site environment variables are restricted to this Preview branch. Secret values are not stored in Git or this document.
- Review sender: `Unit Alfa test <onboarding@resend.dev>`. Recipient and buyer test address use the same authorised Resend-account Gmail inbox.
- `RFQ_ENABLED=true` for this controlled review; `SITE_INDEXABLE=false`.

## Live checks passed

- Deployed the branch with its environment variables; marketing pages and server endpoints run on Vercel.
- Corrected the preview server-key configuration after the first attempt returned a database function permission error. That failed attempt created no enquiry and sent no mail. Database access controls were preserved.
- Submitted synthetic request **UA-RFQ-2026-000001** with two parts: 120 pieces/year for one and an unknown forecast for the other.
- Uploaded a harmless DXF through the real signed-upload flow. Authorised staff downloaded it; the downloaded bytes match the original file.
- Both the staff notification and buyer acknowledgement were marked **delivered** in Resend. Provider acceptance alone was not treated as delivery.
- Staff sign-in, enquiry listing/detail, owner assignment and a status change to **Under technical review** worked.
- Customer tracking showed the published update. The corresponding update email was delivered. A unique internal-note marker appeared in staff history and was absent from the customer page and delivered email.
- Disabling the test user's membership immediately denied its existing session and cleared its access. The original membership was then restored and sign-in worked again.
- A modified tracking token was rejected.
- Temporarily configured an intentionally invalid sender for this Preview branch and saved another test update. The update remained saved and its notification became pending after provider rejection. Restored `Unit Alfa test <onboarding@resend.dev>`, redeployed, used **Retry pending notifications**, and confirmed **delivered** in Resend. All four notification jobs for the test enquiry then showed `sent`; the recovery email also excluded the internal-note marker.

The successful recovery deployment was <https://unitalfa-13o89t48f-sushanth-ps-projects.vercel.app>. Subsequent documentation/approved-origin changes deploy from the stable branch URL above. The intentionally invalid sender is no longer the branch's active configuration. Staff was signed out after verification; the test account remains enabled.

The direct signed-out drawing navigation was blocked by the browser client, so that particular live HTTP denial was not independently verified. Automated tests cover anonymous staff access and server-side authorization; the file handler uses the same authorization guard. No claim of a complete external security assessment is made.

## Launch requirements still open

1. **Verify an email-sending domain.** `unitalfa.vercel.app` hosts the website but does not grant DNS control of `vercel.app`. Gmail is a recipient, not a domain the user can verify in Resend. Obtain the company's DNS access for a domain it controls, or arrange an approved domain. Preserve existing mailbox records. Resend currently has no verified domain; its test sender can only send to the account owner's email.
2. **Configure the production retry schedule.** The committed daily cron is for review compatibility. The intended five-minute schedule needs a suitable hosting plan or approved external scheduler. Preview cron does not run. Authenticated scheduled execution and real-service retention cleanup remain unverified.
3. **Provision production separately.** Use company-controlled credentials, a verified sender, the company recipient `gmo@unitalfa.co.in`, authorised company staff and appropriate backup/recovery arrangements. Keep synthetic test records out of production.
4. **Repeat acceptance on production before launch.** Verify real-recipient mail, private uploads/downloads, staff controls, retries and the scheduler, then merge/promote as agreed. Complete accessibility/cross-browser acceptance listed in `VALIDATION.md`.
5. **Enable indexing last.** The approved website address is `https://unitalfa.vercel.app`. It is now explicitly supported by the indexing policy, but requires production mode and `SITE_INDEXABLE=true`. Preview and private routes remain noindex. No indexing switch was enabled during setup.

The review PR remains unmerged while these production requirements are unresolved. Test credentials were saved in a local file outside the repository with owner-only permissions; move them to the appropriate password manager. They are not reproduced here.

## Provider references

- [Resend test-sender restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
- [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
- [Vercel cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- [Supabase API key types](https://supabase.com/docs/guides/getting-started/api-keys)
