# UNIT ALFA — implementation checklist

Revision approved 19 October 2026. Source: company profile, direct company feedback and user confirmation. Existing public-site research is retained in docs/research as historical evidence.

## Confirmed decisions

- [x] Preserve 1991, proprietor, Bommasandra address and GSTIN.
- [x] Keep Jaisurya Govindan, General Manager, +91 94806 16429, gmo@unitalfa.co.in.
- [x] Use the new supplied purple logo intact.
- [x] Extract actual component, factory and packing photographs from the supplied profile.
- [x] Record 16,600 sq ft covered premises and current profile equipment.
- [x] Confirm FLIS and packing system are in regular use; FLIS records production progress.
- [x] User selects Supabase and Resend with setup instructions.
- [x] Finish updated evidence register and photo provenance.

## Content and design

- [x] Home and shared navigation, footer, logo and introduction.
- [x] About and approved customer references.
- [x] Capabilities, machinery, tooling and materials.
- [x] Product catalogue and seven substantive product detail pages.
- [x] How We Work, planning, FLIS, inspection and packing; Quality redirect.
- [x] Capability-fit Enquiry page.
- [x] Request a Quote with annual quantities and multiple parts.
- [x] Contact, Privacy, Terms, 404 and legacy links.
- [x] Responsive visual system, process interaction, product zoom/filtering, page and scroll motion.
- [x] Keyboard, focus, no-JS content and reduced-motion support.

## Enquiry service

- [x] Server validation and durable, atomic enquiry creation with unique IDs.
- [x] Private direct-to-storage drawing uploads and ownership verification.
- [x] Supabase schema, restricted access and staff authentication.
- [x] Customer status links and public/internal note separation.
- [x] Staff dashboard, status updates and notification retry.
- [x] Resend email templates, transactional outbox and scheduled retry.
- [x] Request rate limits, upload constraints, duplicate-submit protection and cleanup.
- [x] Clear unavailable-service state without a false success or email claim.

## SEO, verification and handover

- [x] Metadata, structured data, sitemap, robots, canonical URLs and redirects.
- [x] Vercel adapter/configuration; preserve preview noindex.
- [x] Meaningful validation, database and API tests.
- [x] Build, formatting, dependency and generated-HTML checks.
- [x] Browser checks on desktop/mobile; reduced-motion styles and preference handling inspected.
- [x] README, VERCEL guide, backend setup, operating instructions and validation record.
- [x] Prepare reviewable Git changes and local preview.

## Live setup and production requirements

- [x] Test Supabase project, migration, private bucket and staff user.
- [x] Preview-only Vercel environment variables and successful deployed enquiry with a real private upload/download.
- [x] Resend test sending key and monitored test recipient; acknowledgement, staff notification and customer update delivered.
- [x] Live staff-access revocation and tampered customer-link checks; internal-note separation.
- [x] Live preview email failure/recovery: saved update, pending notification, restored sender and delivered staff retry.
- [x] Support the approved `https://unitalfa.vercel.app` origin without enabling indexing.
- [ ] Resend company-controlled verified sender domain and production recipients.
- [ ] Five-minute production retry scheduler, authenticated live job and retention verification.
- [ ] Separate production credentials, staff provisioning, backup/recovery and final production acceptance.
- [ ] Company approval of preview and production-domain cutover/indexing.
- [ ] Current certificate document/scope/validity.
- [ ] Tank facility and inspection-equipment completion status; tank-facility area discrepancy.
- [ ] Meaning of 1,200 × 1,250 mm; confirmed press-brake ratings.
- [ ] Internal/vendor split for other finishing processes.
- [ ] Confirm working hours and factory entrance.

Unconfirmed specifications stay unpublished. Customer enquiry tracking is separate from FLIS; no live FLIS integration is claimed or implemented.

See `docs/LIVE_SETUP_20261019.md` for the exact live results and launch blockers. No merge or indexing change has been performed.

- [ ] Final assistive-technology and OS reduced-motion checks on the deployed preview.
