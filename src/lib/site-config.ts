type SiteEnvironment = Record<string, string | undefined>;

const companyHosts = new Set(['unitalfa.in', 'www.unitalfa.in']);

/** Resolve build-time URLs without letting preview builds inherit production SEO. */
export function resolveSiteConfig(env: SiteEnvironment) {
  const isVercelReview = env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development';
  const vercelHost = isVercelReview
    ? env.VERCEL_URL || env.VERCEL_BRANCH_URL
    : env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  const configuredUrl =
    (!isVercelReview && env.SITE_URL) ||
    (vercelHost && `https://${vercelHost}`) ||
    'http://localhost:4321';
  const url = new URL(configuredUrl);
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

  if (
    (url.protocol !== 'https:' && !(isLocal && url.protocol === 'http:')) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('SITE_URL must be an HTTPS origin without a path, credentials, query or hash.');
  }

  return {
    siteUrl: url.origin,
    indexable:
      env.SITE_INDEXABLE === 'true' &&
      (!env.VERCEL_ENV || env.VERCEL_ENV === 'production') &&
      url.protocol === 'https:' &&
      companyHosts.has(url.hostname),
  };
}
