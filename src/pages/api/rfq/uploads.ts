import { randomUUID } from 'node:crypto';
import { uploadSchema } from '../../../lib/rfq.ts';
import { db, BUCKET, requireLiveService, ServiceError } from '../../../server/config.ts';
import { endpoint, json, readJson } from '../../../server/http.ts';
import { sameOrigin, rateLimit, digest } from '../../../server/security.ts';
export const prerender = false;
export const POST = endpoint(async ({ request }) => {
  sameOrigin(request);
  requireLiveService();
  await rateLimit(request, 'upload', 24);
  const input = uploadSchema.parse(await readJson(request));
  const client = db();
  const id = randomUUID();
  const path = `${id}/${randomUUID()}.${input.name.split('.').pop()!.toLowerCase()}`;
  const { error } = await client.rpc('rfq_reserve_upload', {
    p_id: id,
    p_owner_hash: digest(input.submissionKey),
    p_path: path,
    p_name: input.name,
    p_size: input.size,
    p_mime: input.type,
  });
  if (error) {
    if (error.message.includes('UPLOAD_LIMIT'))
      throw new ServiceError(
        422,
        'This enquiry has reached its drawing upload limit. Contact the team if you need to share more files.',
      );
    if (error.message.includes('ALREADY_SUBMITTED'))
      throw new ServiceError(409, 'This enquiry has already been submitted.');
    throw new ServiceError(503, 'Could not prepare the drawing upload. Please try again.');
  }
  const { data, error: signError } = await client.storage
    .from(BUCKET)
    .createSignedUploadUrl(path, { upsert: false });
  if (signError) {
    await client.from('rfq_uploads').delete().eq('id', id);
    throw new ServiceError(503, 'Drawing storage is temporarily unavailable. Please try again.');
  }
  return json({ id, url: data.signedUrl }, 201);
});
