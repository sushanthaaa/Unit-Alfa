import type { APIContext } from 'astro';
import type { Session } from '@supabase/supabase-js';
import { authClient, db, ServiceError } from './config.ts';
const accessName = 'ua_staff_access',
  refreshName = 'ua_staff_refresh';
export function clearAuth(context: APIContext) {
  for (const name of [accessName, refreshName])
    context.cookies.delete(name, { path: '/api/admin/' });
}
export function setAuth(context: APIContext, session: Session) {
  const options = {
    httpOnly: true,
    secure: context.url.protocol === 'https:',
    sameSite: 'strict' as const,
    path: '/api/admin/',
  };
  context.cookies.set(accessName, session.access_token, { ...options, maxAge: session.expires_in });
  context.cookies.set(refreshName, session.refresh_token, { ...options, maxAge: 60 * 60 * 8 });
}
export async function requireStaff(context: APIContext) {
  const client = authClient();
  let token = context.cookies.get(accessName)?.value;
  let user = token ? (await client.auth.getUser(token)).data.user : null;
  if (!user) {
    const refresh = context.cookies.get(refreshName)?.value;
    if (refresh) {
      const { data, error } = await client.auth.refreshSession({ refresh_token: refresh });
      if (!error && data.session) {
        token = data.session.access_token;
        user = (await client.auth.getUser(token)).data.user;
        if (user) setAuth(context, data.session);
      }
    }
  }
  if (!user) {
    clearAuth(context);
    throw new ServiceError(401, 'Sign in to the staff dashboard.');
  }
  const { data, error } = await db()
    .from('rfq_staff')
    .select('user_id,display_name')
    .eq('user_id', user.id)
    .eq('enabled', true)
    .maybeSingle();
  if (error) throw new ServiceError(503, 'Staff access is temporarily unavailable.');
  if (!data) {
    clearAuth(context);
    throw new ServiceError(403, 'This account does not have staff access.');
  }
  return { id: user.id, name: data.display_name, token: token! };
}
