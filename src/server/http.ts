import type { APIContext } from 'astro';
import { ZodError } from 'zod';
import { ServiceError } from './config.ts';
export const privateHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, private',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};
export function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: privateHeaders });
}
export async function readJson(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new ServiceError(415, 'Send this form as JSON.');
  if (Number(request.headers.get('content-length')) > 65536)
    throw new ServiceError(413, 'The form is too large. Shorten the notes and try again.');
  if (!request.body) throw new ServiceError(400, 'The form is empty.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 65536) {
      await reader.cancel();
      throw new ServiceError(413, 'The form is too large.');
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new ServiceError(400, 'The form could not be read. Reload and try again.');
  }
}
export function endpoint(handler: (context: APIContext) => Promise<Response>) {
  return async (context: APIContext) => {
    try {
      return await handler(context);
    } catch (error) {
      if (error instanceof ZodError)
        return json(
          {
            error: 'Check the highlighted information.',
            fields: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
          },
          422,
        );
      if (error instanceof ServiceError) return json({ error: error.message }, error.status);
      // Never log drawings, request bodies, email addresses, tokens or provider error payloads.
      console.error('RFQ request failed', {
        route: context.url.pathname,
        type: error instanceof Error ? error.name : 'unknown',
      });
      return json(
        { error: 'We could not complete that request. Please try again or contact the team.' },
        500,
      );
    }
  };
}
export function must<T>(result: { data: T; error: unknown }): T {
  if (result.error)
    throw new ServiceError(
      503,
      'The enquiry service is temporarily unavailable. Please try again.',
    );
  return result.data;
}
