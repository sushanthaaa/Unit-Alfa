import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateRfq, composeRfq } from '../src/lib/rfq.ts';

const valid = {
  name: 'Procurement test',
  company: 'Test company',
  email: 'buyer@example.com',
  part: 'Battery box',
  quantity: '100 pieces / month',
};
test('complete enquiry preserves drawing and manufacturing requirements as plain text', () => {
  const draft = composeRfq(
    validateRfq({
      ...valid,
      material: 'IS 2062, 3 mm',
      notes: 'Review revision B. Hole Ø12 ±0.1 mm; finish to drawing.',
    }),
  );
  assert.match(draft.body, /100 pieces \/ month/);
  assert.match(draft.body, /IS 2062, 3 mm/);
  assert.match(draft.body, /Ø12 ±0.1 mm/);
  assert.match(draft.body, /attach the relevant drawing/);
  assert.equal(draft.subject, 'Component enquiry: Battery box');
});
test('missing contacts, malformed email, wrong types and oversized notes are rejected', () => {
  for (const input of [
    null,
    { ...valid, email: 'incorrect' },
    { ...valid, company: '  ' },
    { ...valid, quantity: 100 },
    { ...valid, notes: 'x'.repeat(2001) },
  ])
    assert.throws(() => validateRfq(input));
});
test('text is trimmed and header newlines cannot inject mailto parameters', () => {
  const draft = composeRfq(
    validateRfq({
      ...valid,
      name: '  Buyer  ',
      part: 'Box\r\nBcc: hidden@example.com',
      notes: '<script>alert(1)</script> & finish',
    }),
  );
  assert.doesNotMatch(draft.subject, /[\r\n]/);
  assert.match(draft.body, /Contact: Buyer\n/);
  assert.match(encodeURIComponent(draft.body), /%3Cscript%3E/);
});
