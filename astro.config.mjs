import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { resolveSiteConfig } from './src/lib/site-config.ts';

// Astro's config runs before its .env loading. Existing platform variables win.
if (existsSync('.env')) loadEnvFile('.env');
const { siteUrl } = resolveSiteConfig(process.env);

export default defineConfig({
  site: siteUrl,
  devToolbar: { enabled: false },
  output: 'static',
  adapter: vercel({ maxDuration: 120 }),
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !['/404', '/admin/', '/track-enquiry/', '/api/'].some((part) => page.includes(part)),
    }),
  ],
  redirects: {
    '/quality/': '/how-we-work/',
    '/about-unit-alfa/': '/about/',
    '/unit-alfa-company-profile/': '/about/',
    '/unit-alfa-services/': '/capabilities/',
    '/contact-unit-alfa/': '/contact/',
  },
  build: { format: 'directory' },
});
