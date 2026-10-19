import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GET as availability } from '../src/pages/api/rfq/availability.ts';
import { POST as submit } from '../src/pages/api/rfq/index.ts';
import { POST as login } from '../src/pages/api/admin/login.ts';
import { GET as cron } from '../src/pages/api/jobs/notifications.ts';
import { readJson } from '../src/server/http.ts';
for (const key of [
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RFQ_TOKEN_SECRET',
  'RESEND_API_KEY',
  'RFQ_ENABLED',
  'CRON_SECRET',
])
  delete process.env[key];
function context(path, body = {}, headers = {}) {
  const url = new URL(path, 'http://localhost:4321');
  return {
    url,
    request: new Request(url, {
      method: 'POST',
      headers: { origin: url.origin, 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }),
    cookies: { get() {}, set() {}, delete() {} },
    params: {},
  };
}
test('unconfigured online submission is unavailable and never gives a receipt', async () => {
  const ready = await availability(context('/api/rfq/availability/'));
  assert.deepEqual(await ready.json(), { available: false });
  const result = await submit(context('/api/rfq/'));
  assert.equal(result.status, 503);
  assert.doesNotMatch(await result.text(), /trackingToken|reference/);
  assert.equal(result.headers.get('cache-control'), 'no-store, private');
});
test('mutation rejects foreign origins before processing data', async () => {
  const result = await submit(context('/api/rfq/', {}, { origin: 'https://evil.example' }));
  assert.equal(result.status, 403);
});
test('staff login does not open a session without configured authentication', async () => {
  const result = await login(
    context('/api/admin/login/', { email: 'test@example.com', password: 'test' }),
  );
  assert.equal(result.status, 503);
  assert.equal(result.headers.has('set-cookie'), false);
});
test('scheduled jobs reject absent credentials even if no cron secret is configured', async () => {
  const result = await cron(context('/api/jobs/notifications/'));
  assert.equal(result.status, 401);
});
test('streamed request limits reject large bodies even without Content-Length', async () => {
  const request = new Request('http://localhost', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ notes: 'x'.repeat(70000) }),
  });
  await assert.rejects(
    () => readJson(request),
    (error) => error.status === 413,
  );
});
