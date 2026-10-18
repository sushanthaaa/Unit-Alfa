import { z } from 'zod';
import { endpoint, json, readJson } from '../../../server/http.ts';
import { authClient, db, ServiceError } from '../../../server/config.ts';
import { sameOrigin, rateLimit } from '../../../server/security.ts';
import { setAuth, clearAuth } from '../../../server/auth.ts';
export const prerender = false;
export const POST = endpoint(async (context) => {
  sameOrigin(context.request);
  await rateLimit(context.request, 'login', 5);
  const body = z
    .object({ email: z.email().max(254), password: z.string().min(1).max(256) })
    .parse(await readJson(context.request));
  const client = authClient();
  const { data, error } = await client.auth.signInWithPassword(body);
  if (error || !data.session) {
    clearAuth(context);
    throw new ServiceError(401, 'The email or password was not accepted.');
  }
  const result = await db()
    .from('rfq_staff')
    .select('display_name')
    .eq('user_id', data.user.id)
    .eq('enabled', true)
    .maybeSingle();
  if (result.error || !result.data) {
    await client.auth.signOut({ scope: 'local' });
    clearAuth(context);
    throw new ServiceError(403, 'This account does not have staff access.');
  }
  setAuth(context, data.session);
  return json({ name: result.data.display_name });
});
