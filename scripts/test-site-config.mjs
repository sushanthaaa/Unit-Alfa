import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveSiteConfig } from '../src/lib/site-config.ts';

test('local development and unconfigured builds are not indexable', () => {
  assert.deepEqual(resolveSiteConfig({}), { siteUrl: 'http://localhost:4321', indexable: false });
});

test('Vercel previews ignore inherited production URL and indexing settings', () => {
  assert.deepEqual(
    resolveSiteConfig({
      VERCEL_ENV: 'preview',
      VERCEL_URL: 'unit-alfa-review.vercel.app',
      VERCEL_PROJECT_PRODUCTION_URL: 'www.unitalfa.in',
      SITE_URL: 'https://www.unitalfa.in',
      SITE_INDEXABLE: 'true',
    }),
    { siteUrl: 'https://unit-alfa-review.vercel.app', indexable: false },
  );
});

test('branch URLs provide a fallback when a generated deployment URL is unavailable', () => {
  assert.equal(
    resolveSiteConfig({ VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'unit-alfa-branch.vercel.app' })
      .siteUrl,
    'https://unit-alfa-branch.vercel.app',
  );
});

test('initial Vercel main-branch deployment stays out of search even with opt-in', () => {
  assert.deepEqual(
    resolveSiteConfig({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'unit-alfa.vercel.app',
      SITE_INDEXABLE: 'true',
    }),
    { siteUrl: 'https://unit-alfa.vercel.app', indexable: false },
  );
});

test('company-domain production requires explicit indexing opt-in', () => {
  const env = { VERCEL_ENV: 'production', SITE_URL: 'https://www.unitalfa.in/' };
  assert.equal(resolveSiteConfig(env).indexable, false);
  assert.deepEqual(resolveSiteConfig({ ...env, SITE_INDEXABLE: 'true' }), {
    siteUrl: 'https://www.unitalfa.in',
    indexable: true,
  });
  assert.equal(
    resolveSiteConfig({ ...env, SITE_INDEXABLE: 'true', VERCEL_ENV: 'development' }).indexable,
    false,
  );
});

test('malformed, insecure and non-origin URLs fail the build instead of producing bad metadata', () => {
  for (const SITE_URL of [
    'not a URL',
    'http://www.unitalfa.in',
    'https://www.unitalfa.in/products/',
    'https://www.unitalfa.in?tracking=1',
    'https://www.unitalfa.in#home',
    'https://username:password@www.unitalfa.in',
    'file:///tmp/site',
  ]) {
    assert.throws(() => resolveSiteConfig({ SITE_URL }));
  }
});
