import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { rfqSchema, uploadSchema, MAX_FILE_BYTES, annualQuantityLabel } from '../src/lib/rfq.ts';
import { trackingToken, verifyTrackingToken, sameOrigin } from '../src/server/security.ts';
import { emailText } from '../src/server/mail.ts';
import { escapeHtml } from '../src/lib/client.ts';
import { validEnquiry } from './fixtures/enquiry.mjs';
const secret = 'test-secret-only-not-a-live-credential-123456789';

test('multiple parts preserve annual quantities, unknown demand and technical notation', () => {
  const result = rfqSchema.parse({
    ...validEnquiry,
    parts: [
      ...validEnquiry.parts,
      { ...validEnquiry.parts[0], name: 'Latch', annualQuantity: null },
    ],
  });
  assert.equal(result.parts[0].annualQuantity, 240);
  assert.equal(result.parts[1].annualQuantity, null);
  assert.match(result.notes, /Ø12 ±0.1 mm/);
  assert.equal(annualQuantityLabel(null), 'Not yet known');
});
test('bad quantities, missing consent, oversized content and header injection are rejected', () => {
  for (const input of [
    null,
    { ...validEnquiry, consent: false },
    { ...validEnquiry, email: 'bad' },
    { ...validEnquiry, company: 'x\r\nBcc: bad@example.com' },
    { ...validEnquiry, notes: 'x'.repeat(4001) },
    { ...validEnquiry, parts: [{ ...validEnquiry.parts[0], annualQuantity: 0 }] },
    { ...validEnquiry, parts: [{ ...validEnquiry.parts[0], annualQuantity: 1.5 }] },
    { ...validEnquiry, parts: Array(11).fill(validEnquiry.parts[0]) },
    { ...validEnquiry, website: 'spam.example' },
  ])
    assert.throws(() => rfqSchema.parse(input));
});
test('file types, limits, paths and duplicate attachment IDs are enforced', () => {
  const file = {
    submissionKey: validEnquiry.submissionKey,
    name: 'part-rev-b.pdf',
    size: 2000,
    type: 'application/pdf',
  };
  assert.equal(uploadSchema.parse(file).name, file.name);
  for (const change of [
    { name: 'payload.html', type: 'text/html' },
    { name: '../part.pdf' },
    { size: MAX_FILE_BYTES + 1 },
    { size: 0 },
    { type: 'text/html' },
  ])
    assert.throws(() => uploadSchema.parse({ ...file, ...change }));
  const id = randomUUID();
  assert.throws(() => rfqSchema.parse({ ...validEnquiry, attachments: [id, id] }));
});
test('status links require a valid signature and cannot be substituted between enquiries', () => {
  const id = randomUUID(),
    other = randomUUID(),
    token = trackingToken(id, secret);
  assert.equal(verifyTrackingToken(token, secret), id);
  for (const value of [
    id,
    token.replace(id, other),
    token.slice(0, -1) + '!',
    null,
    'UA-RFQ-2026-000001',
  ])
    assert.equal(verifyTrackingToken(value, secret), null);
  assert.equal(verifyTrackingToken(token, secret + 'different'), null);
});
test('cross-origin and origin-less browser mutations are rejected', () => {
  assert.doesNotThrow(() =>
    sameOrigin(
      new Request('https://www.unitalfa.in/api/rfq/', {
        headers: { origin: 'https://www.unitalfa.in' },
      }),
    ),
  );
  for (const origin of [undefined, 'https://evil.example', 'null'])
    assert.throws(() =>
      sameOrigin(
        new Request('https://www.unitalfa.in/api/rfq/', { headers: origin ? { origin } : {} }),
      ),
    );
});
test('customer emails never include internal notes or staff-only file links', () => {
  const { submissionKey, attachments, website, ...payload } = validEnquiry;
  const r = {
    id: randomUUID(),
    reference: 'UA-RFQ-2026-000001',
    payload,
    status: 'Under technical review',
  };
  const event = {
    status: r.status,
    message: 'Please confirm the material grade.',
    internal_note: 'PRIVATE COSTING NOTE',
  };
  for (const kind of ['customer_received', 'customer_update']) {
    const text = emailText(r, kind, event, 'https://www.unitalfa.in', 'private-link');
    assert.doesNotMatch(text, /PRIVATE COSTING NOTE|\/admin\/|service_role/);
    assert.match(text, /UA-RFQ-2026-000001/);
    assert.match(text, /#token=private-link/);
  }
  const staff = emailText(r, 'staff_received', event, 'https://www.unitalfa.in', 'private-link');
  assert.match(staff, /240 pieces \/ year/);
  assert.match(staff, /Ø12 ±0.1 mm/);
  assert.match(staff, /\/admin\//);
});
test('customer-supplied content is escaped before rendering dashboard and review HTML', () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)">'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
  );
});
