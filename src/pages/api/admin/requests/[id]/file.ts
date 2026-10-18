import { z } from 'zod';
import { endpoint, must } from '../../../../../server/http.ts';
import { requireStaff } from '../../../../../server/auth.ts';
import { db, BUCKET, ServiceError } from '../../../../../server/config.ts';
export const prerender = false;
export const GET = endpoint(async (context) => {
  await requireStaff(context);
  const id = z.uuid().parse(context.params.id),
    file = z.uuid().parse(context.url.searchParams.get('file'));
  const client = db();
  const upload = must(
    await client
      .from('rfq_uploads')
      .select('path,name')
      .eq('rfq_id', id)
      .eq('id', file)
      .maybeSingle(),
  );
  if (!upload) throw new ServiceError(404, 'Drawing not found.');
  const data = must(
    await client.storage.from(BUCKET).createSignedUrl(upload.path, 60, { download: upload.name }),
  );
  if (!data) throw new ServiceError(503, 'The drawing link could not be created.');
  return new Response(null, {
    status: 303,
    headers: {
      Location: data.signedUrl,
      'Cache-Control': 'no-store, private',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
});
