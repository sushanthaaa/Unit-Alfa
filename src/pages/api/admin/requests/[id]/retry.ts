import { z } from 'zod';
import { endpoint, json, must } from '../../../../../server/http.ts';
import { requireStaff } from '../../../../../server/auth.ts';
import { sameOrigin } from '../../../../../server/security.ts';
import { db } from '../../../../../server/config.ts';
import { dispatchMail } from '../../../../../server/mail.ts';
export const prerender = false;
export const POST = endpoint(async (context) => {
  sameOrigin(context.request);
  await requireStaff(context);
  const id = z.uuid().parse(context.params.id);
  must(
    await db()
      .from('rfq_outbox')
      .update({
        state: 'pending',
        attempts: 0,
        next_attempt_at: new Date().toISOString(),
        locked_until: null,
      })
      .eq('rfq_id', id)
      .in('state', ['pending', 'failed']),
  );
  return json(await dispatchMail(id));
});
