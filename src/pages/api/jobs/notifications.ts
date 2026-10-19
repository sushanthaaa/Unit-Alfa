import { timingSafeEqual } from 'node:crypto';
import { endpoint, json } from '../../../server/http.ts';
import { config, ServiceError } from '../../../server/config.ts';
import { dispatchMail } from '../../../server/mail.ts';
import { cleanup } from '../../../server/cleanup.ts';
export const prerender = false;
export const GET = endpoint(async ({ request }) => {
  const expected = Buffer.from(`Bearer ${config().cronSecret}`),
    actual = Buffer.from(request.headers.get('authorization') || '');
  if (
    config().cronSecret.length < 32 ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    throw new ServiceError(401, 'Not authorised.');
  const deliveries = await dispatchMail();
  const removed = await cleanup();
  return json({ ...deliveries, ...removed });
});
