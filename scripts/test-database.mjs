import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { validEnquiry } from './fixtures/enquiry.mjs';
const db = new PGlite();
let staffId;
const { submissionKey, website, attachments, ...payload } = validEnquiry;
async function create(owner = randomUUID(), digest = 'digest', files = []) {
  return (
    await db.query('select public.rfq_create($1,$2,$3,$4::uuid[]) result', [
      owner,
      digest,
      JSON.stringify(payload),
      files,
    ])
  ).rows[0].result;
}
async function reserve(owner, name = 'test.pdf', size = 1000, mime = 'application/pdf') {
  const id = randomUUID(),
    path = `${id}/${name}`;
  await db.query('select public.rfq_reserve_upload($1,$2,$3,$4,$5,$6)', [
    id,
    owner,
    path,
    name,
    size,
    mime,
  ]);
  return { id, path, size, mime };
}
async function uploaded(file) {
  await db.query('insert into storage.objects(bucket_id,name,metadata) values($1,$2,$3)', [
    'rfq-drawings',
    file.path,
    JSON.stringify({ size: file.size, mimetype: file.mime }),
  ]);
}
before(async () => {
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(bucket_id text,name text,metadata jsonb);`,
  );
  await db.exec(
    readFileSync(
      new URL('../supabase/migrations/202610190001_enquiries.sql', import.meta.url),
      'utf8',
    ),
  );
  staffId = randomUUID();
  await db.query('insert into auth.users(id) values($1)', [staffId]);
  await db.query('insert into public.rfq_staff(user_id,display_name) values($1,$2)', [
    staffId,
    'Test staff',
  ]);
});
after(() => db.close());
test('request, initial status and both email jobs are saved together', async () => {
  const r = await create();
  assert.match(r.reference, /^UA-RFQ-\d{4}-\d{6,}$/);
  assert.equal(
    (await db.query('select count(*)::int n from rfq_events where rfq_id=$1', [r.id])).rows[0].n,
    1,
  );
  assert.equal(
    (await db.query('select count(*)::int n from rfq_outbox where rfq_id=$1', [r.id])).rows[0].n,
    2,
  );
});
test('duplicate submission returns the same reference and never adds another mail job', async () => {
  const owner = randomUUID();
  const first = await create(owner);
  const second = await create(owner);
  assert.equal(first.id, second.id);
  assert.equal(second.reused, true);
  assert.equal(
    (await db.query('select count(*)::int n from rfq_outbox where rfq_id=$1', [first.id])).rows[0]
      .n,
    2,
  );
  await assert.rejects(() => create(owner, 'different'), /IDEMPOTENCY_CONFLICT/);
});
test('upload attachment ownership, completion, MIME and size are checked before committing', async () => {
  const owner = randomUUID(),
    file = await reserve(owner);
  await assert.rejects(() => create(owner, 'd', [file.id]), /INVALID_ATTACHMENTS/);
  assert.equal(
    (await db.query('select count(*)::int n from rfq_requests where owner_hash=$1', [owner]))
      .rows[0].n,
    0,
  );
  await uploaded(file);
  await assert.rejects(() => create(randomUUID(), 'd', [file.id]), /INVALID_ATTACHMENTS/);
  await db.query("update storage.objects set metadata='{}' where name=$1", [file.path]);
  await assert.rejects(() => create(owner, 'd', [file.id]), /INVALID_ATTACHMENTS/);
  await db.query('update storage.objects set metadata=$1 where name=$2', [
    JSON.stringify({ size: file.size, mimetype: file.mime }),
    file.path,
  ]);
  const r = await create(owner, 'd', [file.id]);
  assert.equal(
    (await db.query('select rfq_id from rfq_uploads where id=$1', [file.id])).rows[0].rfq_id,
    r.id,
  );
  await assert.rejects(() => reserve(owner), /ALREADY_SUBMITTED/);
});
test('upload reservations enforce aggregate bytes and six-file limit', async () => {
  const a = randomUUID();
  for (let i = 0; i < 6; i++) await reserve(a);
  await assert.rejects(() => reserve(a), /UPLOAD_LIMIT/);
  const b = randomUUID();
  await reserve(b, 'a.pdf', 20971520);
  await reserve(b, 'b.pdf', 20971520);
  await assert.rejects(() => reserve(b), /UPLOAD_LIMIT/);
});
test('stale staff updates cannot overwrite newer changes; public updates queue an email', async () => {
  const r = await create();
  const update = (version, message = '', note = '', status = 'Under technical review') =>
    db.query('select public.rfq_update($1,$2,$3,$4,$5,$6,$7)', [
      r.id,
      version,
      status,
      message,
      note,
      staffId,
      staffId,
    ]);
  await assert.rejects(() => update(0), /PUBLIC_MESSAGE_REQUIRED/);
  await update(0, 'Please confirm grade.', 'Private costing');
  await assert.rejects(() => update(0, 'Stale update'), /VERSION_CONFLICT/);
  assert.equal(
    (
      await db.query(
        "select count(*)::int n from rfq_outbox where rfq_id=$1 and kind='customer_update'",
        [r.id],
      )
    ).rows[0].n,
    1,
  );
  await update(1, '', 'Internal only');
  assert.equal(
    (
      await db.query(
        "select count(*)::int n from rfq_outbox where rfq_id=$1 and kind='customer_update'",
        [r.id],
      )
    ).rows[0].n,
    1,
  );
});
test('a non-staff actor cannot mutate an enquiry', async () => {
  const r = await create();
  await assert.rejects(
    () =>
      db.query('select public.rfq_update($1,0,$2,$3,$4,null,$5)', [
        r.id,
        'Closed',
        'Done',
        '',
        randomUUID(),
      ]),
    /NOT_STAFF/,
  );
});
test('notification claims do not overlap and expired leases can retry', async () => {
  const r = await create();
  const first = (await db.query('select * from rfq_claim_mail($1,10)', [r.id])).rows;
  assert.equal(first.length, 2);
  assert.equal((await db.query('select * from rfq_claim_mail($1,10)', [r.id])).rows.length, 0);
  await db.query("update rfq_outbox set locked_until=now()-interval '1 minute' where rfq_id=$1", [
    r.id,
  ]);
  const retry = (await db.query('select * from rfq_claim_mail($1,10)', [r.id])).rows;
  assert.equal(retry.length, 2);
  assert.ok(retry.every((j) => j.attempts === 2));
});
test('rate limits count atomically and reset expired windows', async () => {
  const key = randomUUID();
  for (let i = 0; i < 3; i++)
    assert.equal((await db.query('select rfq_rate_limit($1,3,900) ok', [key])).rows[0].ok, true);
  assert.equal((await db.query('select rfq_rate_limit($1,3,900) ok', [key])).rows[0].ok, false);
  await db.query("update rfq_rate_limits set window_start=now()-interval '1 hour' where key=$1", [
    key,
  ]);
  assert.equal((await db.query('select rfq_rate_limit($1,3,900) ok', [key])).rows[0].ok, true);
});
test('anonymous and ordinary authenticated users cannot read records or execute privileged functions', async () => {
  for (const role of ['anon', 'authenticated']) {
    const permissions = (
      await db.query(
        `select has_table_privilege($1,'public.rfq_requests','select') can_read,has_function_privilege($1,'public.rfq_create(text,text,jsonb,uuid[])','execute') can_create,has_function_privilege($1,'public.rfq_reserve_upload(uuid,text,text,text,bigint,text)','execute') can_upload`,
        [role],
      )
    ).rows[0];
    assert.deepEqual(permissions, { can_read: false, can_create: false, can_upload: false });
  }
  assert.equal(
    (await db.query("select public from storage.buckets where id='rfq-drawings'")).rows[0].public,
    false,
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::int n from pg_tables where tablename like 'rfq_%' and not rowsecurity",
      )
    ).rows[0].n,
    0,
  );
});
test('retention claims only expired closed requests and prevents reopening during deletion', async () => {
  const r = await create(),
    active = await create();
  await db.query(
    "update rfq_requests set status='Closed',closed_at=now()-interval '366 days' where id=$1",
    [r.id],
  );
  const ids = (await db.query('select * from rfq_claim_retention()')).rows.map((r) => r.id);
  assert.ok(ids.includes(r.id));
  assert.ok(!ids.includes(active.id));
  await assert.rejects(
    () =>
      db.query('select rfq_update($1,0,$2,$3,$4,null,$5)', [
        r.id,
        'Received',
        'Reopen',
        '',
        staffId,
      ]),
    /RETENTION_EXPIRED/,
  );
});

test('a timed-out final mail attempt becomes visible as failed instead of remaining stuck', async () => {
  const r = await create();
  await db.query(
    "update rfq_outbox set state='sending',attempts=8,locked_until=now()-interval '1 minute' where rfq_id=$1",
    [r.id],
  );
  assert.equal((await db.query('select * from rfq_claim_mail($1,10)', [r.id])).rows.length, 0);
  assert.ok(
    (
      await db.query('select state,locked_until from rfq_outbox where rfq_id=$1', [r.id])
    ).rows.every((j) => j.state === 'failed' && j.locked_until === null),
  );
});
test('reference numbers keep the full sequence after six digits', async () => {
  await db.query("select setval('public.rfq_reference_seq',999999,true)");
  const a = await create(),
    b = await create();
  assert.match(a.reference, /-1000000$/);
  assert.match(b.reference, /-1000001$/);
});

test('retention claims exclude attached drawings and prevent an abandoned upload from being attached', async () => {
  const owner = randomUUID(),
    file = await reserve(owner);
  await uploaded(file);
  await db.query("update rfq_uploads set created_at=now()-interval '25 hours' where id=$1", [
    file.id,
  ]);
  const claims = (await db.query('select * from rfq_claim_orphan_uploads()')).rows;
  assert.ok(claims.some((row) => row.id === file.id));
  // Even a corrected timestamp cannot make an already claimed object attachable.
  await db.query('update rfq_uploads set created_at=now() where id=$1', [file.id]);
  await assert.rejects(() => create(owner, 'd', [file.id]), /INVALID_ATTACHMENTS/);
  const activeOwner = randomUUID(),
    activeFile = await reserve(activeOwner);
  await uploaded(activeFile);
  await create(activeOwner, 'd', [activeFile.id]);
  await db.query("update rfq_uploads set created_at=now()-interval '25 hours' where id=$1", [
    activeFile.id,
  ]);
  assert.equal(
    (await db.query('select * from rfq_claim_orphan_uploads()')).rows.some(
      (row) => row.id === activeFile.id,
    ),
    false,
  );
});
