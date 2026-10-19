import { z } from 'zod';
import { statuses } from '../../../../lib/rfq.ts';
import { endpoint, json, must } from '../../../../server/http.ts';
import { requireStaff } from '../../../../server/auth.ts';
import { db } from '../../../../server/config.ts';
import type { RfqRecord } from '../../../../server/types.ts';
export const prerender = false;
export const GET = endpoint(async (context) => {
  await requireStaff(context);
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(10000)
    .parse(context.url.searchParams.get('page') || 1);
  const status = z
    .enum(['All', ...statuses])
    .parse(context.url.searchParams.get('status') || 'All');
  const query = z
    .string()
    .max(100)
    .parse(context.url.searchParams.get('q') || '')
    .replace(/[\\%_]/g, '')
    .trim();
  let request = db()
    .from('rfq_requests')
    .select('id,reference,status,payload,created_at,updated_at,owner_id', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range((page - 1) * 20, page * 20 - 1);
  if (status !== 'All') request = request.eq('status', status);
  if (query) request = request.ilike('reference', `%${query}%`);
  const result = await request;
  const records = must(result) as RfqRecord[];
  return json({
    page,
    total: result.count,
    records: records.map((r) => ({
      id: r.id,
      reference: r.reference,
      status: r.status,
      company: r.payload.company,
      contact: r.payload.contactName,
      parts: r.payload.parts.length,
      updatedAt: r.updated_at,
      ownerId: r.owner_id,
    })),
  });
});
