import type { APIRoute } from 'astro';
import { resolveSiteConfig } from '../lib/site-config';
export const GET: APIRoute = ({ site }) => {
  const { indexable } = resolveSiteConfig(process.env);
  return new Response(
    `User-agent: *\n${indexable ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
