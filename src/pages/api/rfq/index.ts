import { rfqSchema } from '../../../lib/rfq.ts';
import { db, requireLiveService, ServiceError } from '../../../server/config.ts';
import { endpoint, json, readJson } from '../../../server/http.ts';
import { sameOrigin, rateLimit, digest, trackingToken } from '../../../server/security.ts';
import { dispatchMail } from '../../../server/mail.ts';
export const prerender = false;
export const POST = endpoint(async ({ request }) => {
  sameOrigin(request);
  requireLiveService();
  await rateLimit(request, 'submit', 8);
  const input = rfqSchema.parse(await readJson(request));
  const { submissionKey, attachments, website: _, ...payload } = input;
  const { data, error } = await db().rpc('rfq_create', {
    p_owner_hash: digest(submissionKey),
    p_digest: digest(JSON.stringify({ payload, attachments })),
    p_payload: payload,
    p_upload_ids: attachments,
  });
  if (error) {
    if (error.message.includes('IDEMPOTENCY_CONFLICT'))
      throw new ServiceError(
        409,
        'This submission was already saved with different details. Contact the team to amend it.',
      );
    if (error.message.includes('INVALID_ATTACHMENTS'))
      throw new ServiceError(
        422,
        'One or more drawings have not finished uploading or no longer belong to this enquiry. Check the files and retry.',
      );
    throw new ServiceError(
      503,
      'We could not save your enquiry. Your form is still here; please try again.',
    );
  }
  // Saving is authoritative. A mail-provider failure never turns a saved enquiry into a failed submission.
  try {
    await dispatchMail(data.id);
  } catch {
    /* The transactional outbox is retried by the scheduler. */
  }
  return json(
    { reference: data.reference, trackingToken: trackingToken(data.id), reused: data.reused },
    data.reused ? 200 : 201,
  );
});
