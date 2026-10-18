import { createClient } from '@supabase/supabase-js';
import { resolveSiteConfig } from '../lib/site-config.ts';
export class ServiceError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export function config() {
  return {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '',
    secret: process.env.RFQ_TOKEN_SECRET || '',
    resendKey: process.env.RESEND_API_KEY || '',
    from: process.env.RFQ_FROM_EMAIL || '',
    recipient: process.env.RFQ_RECIPIENT_EMAIL || 'gmo@unitalfa.co.in',
    cronSecret: process.env.CRON_SECRET || '',
    origin: resolveSiteConfig(process.env).siteUrl,
  };
}
export function databaseReady() {
  const c = config();
  return Boolean(c.url && c.serviceKey && c.publishableKey && c.secret.length >= 32);
}
export function serviceReady() {
  const c = config();
  return (
    databaseReady() &&
    Boolean(c.resendKey && c.from && c.cronSecret.length >= 32) &&
    process.env.RFQ_ENABLED === 'true'
  );
}
export function db() {
  const c = config();
  if (!databaseReady())
    throw new ServiceError(
      503,
      'Online enquiries are being configured. Please contact gmo@unitalfa.co.in or call +91 94806 16429.',
    );
  return createClient(c.url, c.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
export function authClient() {
  const c = config();
  if (!databaseReady()) throw new ServiceError(503, 'Staff access is not configured yet.');
  return createClient(c.url, c.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
export function requireLiveService() {
  if (!serviceReady())
    throw new ServiceError(
      503,
      'Online enquiries are being configured. Please email gmo@unitalfa.co.in or call +91 94806 16429.',
    );
}
export const BUCKET = 'rfq-drawings';
