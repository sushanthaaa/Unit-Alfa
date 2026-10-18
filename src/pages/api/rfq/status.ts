import { endpoint, json, readJson, must } from '../../../server/http.ts';
import { db, ServiceError } from '../../../server/config.ts';
import { sameOrigin, rateLimit, verifyTrackingToken } from '../../../server/security.ts';
import type { RfqRecord } from '../../../server/types.ts';
export const prerender = false;
export const POST = endpoint(async ({ request }) => {
  sameOrigin(request);
  await rateLimit(request, 'tracking', 20);
  const body = await readJson(request);
  const id = verifyTrackingToken(body?.token);
  if (!id)
    throw new ServiceError(
      404,
      'That status link is not valid. Use the private link in your acknowledgement email.',
    );
  const client = db();
  const record = must(
    await client
      .from('rfq_requests')
      .select('id,reference,status,created_at,updated_at')
      .eq('id', id)
      .maybeSingle(),
  ) as RfqRecord | null;
  if (!record)
    throw new ServiceError(
      404,
      'This enquiry is not available. Contact the team with your reference.',
    );
  const events = must(
    await client
      .from('rfq_events')
      .select('status,message,created_at')
      .eq('rfq_id', id)
      .neq('message', '')
      .order('created_at', { ascending: false }),
  );
  // Explicit allowlist: never return the payload, staff names, internal notes, file paths or email state.
  return json({
    reference: record.reference,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    events: (events || []).map((event) => ({
      status: event.status,
      message: event.message,
      created_at: event.created_at,
    })),
  });
});
