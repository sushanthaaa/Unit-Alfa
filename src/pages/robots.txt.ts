import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => {
  const production = site?.hostname === 'www.unitalfa.in' || site?.hostname === 'unitalfa.in';
  return new Response(
    `User-agent: *\n${production ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
