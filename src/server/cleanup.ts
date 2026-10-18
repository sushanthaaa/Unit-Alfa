import { db, BUCKET } from './config.ts';
import { must } from './http.ts';
export async function cleanup() {
  const client = db();
  let filesRemoved = 0,
    requestsRemoved = 0;
  const expired = must(await client.rpc('rfq_claim_orphan_uploads')) as {
    id: string;
    path: string;
  }[];
  if (expired.length) {
    must(await client.storage.from(BUCKET).remove(expired.map((f) => f.path)));
    must(
      await client
        .from('rfq_uploads')
        .delete()
        .in(
          'id',
          expired.map((f) => f.id),
        ),
    );
    filesRemoved += expired.length;
  }
  const closed = must(await client.rpc('rfq_claim_retention')) as { id: string }[];
  for (const request of closed) {
    const files =
      must(await client.from('rfq_uploads').select('path').eq('rfq_id', request.id)) ?? [];
    if (files.length) must(await client.storage.from(BUCKET).remove(files.map((f) => f.path)));
    must(await client.from('rfq_requests').delete().eq('id', request.id).eq('status', 'Closed'));
    filesRemoved += files.length;
    requestsRemoved++;
  }
  must(
    await client
      .from('rfq_rate_limits')
      .delete()
      .lt('window_start', new Date(Date.now() - 2 * 86400000).toISOString()),
  );
  return { filesRemoved, requestsRemoved };
}
