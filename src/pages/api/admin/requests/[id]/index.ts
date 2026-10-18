import { z } from 'zod';
import { updateSchema } from '../../../../../lib/rfq.ts';
import { endpoint, json, must, readJson } from '../../../../../server/http.ts';
import { requireStaff } from '../../../../../server/auth.ts';
import { db, ServiceError } from '../../../../../server/config.ts';
import { sameOrigin } from '../../../../../server/security.ts';
import { dispatchMail } from '../../../../../server/mail.ts';
export const prerender = false;
export const GET = endpoint(async (context) => {
  await requireStaff(context);
  const id = z.uuid().parse(context.params.id);
  const client = db();
  const record = must(
    await client
      .from('rfq_requests')
      .select('id,reference,payload,status,version,owner_id,created_at,updated_at')
      .eq('id', id)
      .maybeSingle(),
  );
  if (!record) throw new ServiceError(404, 'Enquiry not found.');
  const files = must(await client.from('rfq_uploads').select('id,name,size').eq('rfq_id', id));
  const events = must(
    await client
      .from('rfq_events')
      .select('id,status,message,internal_note,actor_id,created_at')
      .eq('rfq_id', id)
      .order('created_at', { ascending: false }),
  );
  const notifications = must(
    await client
      .from('rfq_outbox')
      .select('id,kind,state,attempts,last_error,created_at,sent_at')
      .eq('rfq_id', id)
      .order('created_at', { ascending: false }),
  );
  return json({ record, files, events, notifications });
});
export const PATCH = endpoint(async (context) => {
  sameOrigin(context.request);
  const staff = await requireStaff(context);
  const id = z.uuid().parse(context.params.id);
  const input = updateSchema.parse(await readJson(context.request));
  const { error } = await db().rpc('rfq_update', {
    p_id: id,
    p_version: input.version,
    p_status: input.status,
    p_message: input.message,
    p_internal_note: input.internalNote,
    p_owner_id: input.ownerId,
    p_actor: staff.id,
  });
  if (error) {
    if (error.message.includes('RETENTION_EXPIRED'))
      throw new ServiceError(
        409,
        'This closed enquiry has reached its retention limit and is being removed.',
      );
    if (error.message.includes('VERSION_CONFLICT'))
      throw new ServiceError(
        409,
        'Another update was saved. Reload this enquiry before making your change.',
      );
    if (error.message.includes('PUBLIC_MESSAGE_REQUIRED'))
      throw new ServiceError(422, 'Add a customer-visible message when changing the status.');
    if (error.message.includes('NO_CHANGE'))
      throw new ServiceError(422, 'Add an update or change the assigned owner.');
    if (error.message.includes('NOT_FOUND')) throw new ServiceError(404, 'Enquiry not found.');
    throw new ServiceError(503, 'The update could not be saved. Please try again.');
  }
  try {
    await dispatchMail(id);
  } catch {
    /* Saved updates remain available; notifications are retried. */
  }
  return json({ saved: true });
});
