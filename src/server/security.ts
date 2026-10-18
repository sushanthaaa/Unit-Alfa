import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { config, db, ServiceError } from './config.ts';
export function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
export function sign(value: string, secret = config().secret) {
  if (secret.length < 32) throw new ServiceError(503, 'The enquiry service is not configured.');
  return createHmac('sha256', secret).update(value).digest('base64url');
}
export function trackingToken(id: string, secret = config().secret) {
  return `${id}.${sign(`track:${id}`, secret)}`;
}
export function verifyTrackingToken(token: unknown, secret = config().secret) {
  if (typeof token !== 'string' || !/^([a-f0-9-]{36})\.([A-Za-z0-9_-]{43})$/.test(token))
    return null;
  const [id, mac] = token.split('.');
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id))
    return null;
  const expected = sign(`track:${id}`, secret);
  return timingSafeEqual(Buffer.from(mac), Buffer.from(expected)) ? id : null;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin)
    throw new ServiceError(403, 'Reload this page and try again.');
  if (request.headers.get('sec-fetch-site') === 'cross-site')
    throw new ServiceError(403, 'Cross-site requests are not accepted.');
}
export async function rateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowSeconds = 900,
) {
  // Vercel overwrites this header. Never trust a caller-supplied generic X-Forwarded-For.
  const address = process.env.VERCEL
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    : 'local';
  const key = sign(`rate:${scope}:${address}`);
  const { data, error } = await db().rpc('rfq_rate_limit', {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error)
    throw new ServiceError(
      503,
      'The enquiry service is temporarily unavailable. Please try again shortly.',
    );
  if (!data)
    throw new ServiceError(429, 'Too many requests. Please wait a few minutes and try again.');
}
