import { endpoint, json } from '../../../server/http.ts';
import { sameOrigin } from '../../../server/security.ts';
import { clearAuth } from '../../../server/auth.ts';
import { db } from '../../../server/config.ts';
export const prerender = false;
export const POST = endpoint(async (context) => {
  sameOrigin(context.request);
  const access = context.cookies.get('ua_staff_access')?.value;
  clearAuth(context);
  if (access) {
    try {
      await db().auth.admin.signOut(access, 'local');
    } catch {
      /* Local cookies are cleared even if the provider is unavailable. */
    }
  }
  return json({ signedOut: true });
});
