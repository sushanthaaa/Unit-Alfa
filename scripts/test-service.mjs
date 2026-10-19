import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { POST as submit } from '../src/pages/api/rfq/index.ts';
import { POST as track } from '../src/pages/api/rfq/status.ts';
import { GET as staffDetail } from '../src/pages/api/admin/requests/[id]/index.ts';
import { trackingToken } from '../src/server/security.ts';
import { validEnquiry } from './fixtures/enquiry.mjs';

// The HTTP boundary is controlled: no test can send mail or contact a real project.
const originalFetch = globalThis.fetch;
const requestId = '249590df-7f2f-4aa8-9a03-28b570cd152d';
const staffId = '249590df-7f2f-4aa8-9a03-28b570cd152e';
const jobId = '249590df-7f2f-4aa8-9a03-28b570cd152f';
const { submissionKey, attachments, website, ...payload } = validEnquiry;
let calls, providerStatus, staffEnabled;
const record = {
  id: requestId,
  reference: 'UA-RFQ-2026-000123',
  payload,
  status: 'Received',
  created_at: '2026-10-19T00:00:00Z',
  updated_at: '2026-10-19T00:00:00Z',
  internal_note: 'PRIVATE COSTING',
  owner_hash: 'PRIVATE OWNER',
};
function context(path, body, authenticated = false) {
  const url = new URL(path, 'https://review.example');
  return {
    url,
    params: { id: requestId },
    request: new Request(url, {
      method: body ? 'POST' : 'GET',
      headers: { origin: url.origin, 'content-type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),
    cookies: {
      get(name) {
        return authenticated && name === 'ua_staff_access' ? { value: 'test-token' } : undefined;
      },
      set() {},
      delete() {},
    },
  };
}
function reply(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
beforeEach(() => {
  Object.assign(process.env, {
    SUPABASE_URL: 'https://supabase.example',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-only-not-a-real-key',
    SUPABASE_SECRET_KEY: 'sb_secret_test-only-not-a-real-key',
    RFQ_TOKEN_SECRET: 'test-only-signing-secret-not-for-deployment',
    RESEND_API_KEY: 'test-resend',
    RFQ_FROM_EMAIL: 'Test <sender@example.com>',
    RFQ_RECIPIENT_EMAIL: 'staff@example.com',
    RFQ_ENABLED: 'true',
    CRON_SECRET: 'test-only-cron-secret-not-for-deployment',
    SITE_URL: 'https://review.example',
    SITE_INDEXABLE: 'false',
  });
  calls = [];
  providerStatus = 503;
  staffEnabled = true;
  globalThis.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url || input.href);
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ path: url.pathname, method, body, headers: options.headers });
    if (url.origin === 'https://api.resend.com' && url.pathname === '/emails')
      return reply(
        providerStatus === 200 ? { id: 'provider-test-id' } : { message: 'Test outage' },
        providerStatus,
      );
    assert.equal(url.origin, 'https://supabase.example');
    if (url.pathname === '/auth/v1/user')
      return reply({
        id: staffId,
        email: 'staff@example.com',
        aud: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        created_at: record.created_at,
      });
    if (url.pathname === '/rest/v1/rpc/rfq_rate_limit') return reply(true);
    if (url.pathname === '/rest/v1/rpc/rfq_create')
      return reply({ id: requestId, reference: record.reference, reused: false });
    if (url.pathname === '/rest/v1/rpc/rfq_claim_mail')
      return reply([
        { id: jobId, rfq_id: requestId, event_id: null, kind: 'customer_received', attempts: 1 },
      ]);
    if (url.pathname === '/rest/v1/rfq_outbox' && method === 'PATCH') return reply(null);
    if (url.pathname === '/rest/v1/rfq_staff')
      return reply(staffEnabled ? [{ user_id: staffId, display_name: 'Test staff' }] : []);
    if (url.pathname === '/rest/v1/rfq_requests') {
      const headers = new Headers(options.headers);
      return reply(headers.get('accept')?.includes('vnd.pgrst.object') ? record : [record]);
    }
    if (url.pathname === '/rest/v1/rfq_events')
      return reply([
        {
          status: 'Received',
          message: 'Public update',
          created_at: record.created_at,
          internal_note: 'PRIVATE COSTING',
          actor_id: staffId,
        },
      ]);
    throw new Error(`Unexpected test HTTP request: ${method} ${url.pathname}`);
  };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('provider failure preserves the saved receipt and queues retry without leaking provider data', async () => {
  const response = await submit(context('/api/rfq/', validEnquiry));
  assert.equal(response.status, 201);
  const result = await response.json();
  assert.equal(result.reference, record.reference);
  assert.equal(result.trackingToken, trackingToken(requestId));
  assert.ok(
    calls.findIndex((c) => c.path.endsWith('/rfq_create')) <
      calls.findIndex((c) => c.path === '/emails'),
  );
  const savedRetry = calls.find((c) => c.path.endsWith('/rfq_outbox') && c.method === 'PATCH');
  assert.equal(savedRetry.body.state, 'pending');
  assert.ok(savedRetry.body.next_attempt_at);
  assert.doesNotMatch(JSON.stringify(result), /outage|PRIVATE|test-resend/);
});

test('accepted notifications retain the provider ID and use a job-specific idempotency key', async () => {
  providerStatus = 200;
  await submit(context('/api/rfq/', validEnquiry));
  const mail = calls.find((c) => c.path === '/emails');
  assert.equal(new Headers(mail.headers).get('Idempotency-Key'), `rfq-${jobId}`);
  const update = calls.find((c) => c.path.endsWith('/rfq_outbox') && c.method === 'PATCH');
  assert.equal(update.body.state, 'sent');
  assert.equal(update.body.provider_id, 'provider-test-id');
});

test('customer tracking returns only public status fields even when upstream data contains private fields', async () => {
  const response = await track(context('/api/rfq/status/', { token: trackingToken(requestId) }));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.reference, record.reference);
  assert.deepEqual(result.events, [
    { status: 'Received', message: 'Public update', created_at: record.created_at },
  ]);
  assert.doesNotMatch(
    JSON.stringify(result),
    /PRIVATE|payload|email|actor_id|owner_hash|internal_note/,
  );
});

test('an anonymous staff request never queries private records', async () => {
  const response = await staffDetail(context(`/api/admin/requests/${requestId}/`));
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});

test('a valid auth user without enabled staff membership cannot read enquiry details', async () => {
  staffEnabled = false;
  const response = await staffDetail(context(`/api/admin/requests/${requestId}/`, undefined, true));
  assert.equal(response.status, 403);
  assert.ok(calls.some((c) => c.path === '/auth/v1/user'));
  assert.equal(
    calls.some((c) => c.path.endsWith('/rfq_requests')),
    false,
  );
});
