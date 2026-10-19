import { endpoint, json, must } from '../../../server/http.ts';
import { requireStaff } from '../../../server/auth.ts';
import { db } from '../../../server/config.ts';
export const prerender = false;
export const GET = endpoint(async (context) => {
  const staff = await requireStaff(context);
  const people = must(
    await db()
      .from('rfq_staff')
      .select('user_id,display_name')
      .eq('enabled', true)
      .order('display_name'),
  );
  return json({ id: staff.id, name: staff.name, people });
});
