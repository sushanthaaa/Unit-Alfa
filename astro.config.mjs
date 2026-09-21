import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { resolveSiteConfig } from './src/lib/site-config.ts';

// Astro's config runs before its .env loading. Existing platform variables win.
if (existsSync('.env')) loadEnvFile('.env');
const { siteUrl } = resolveSiteConfig(process.env);

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  redirects: {
    '/about-unit-alfa/': '/about/',
    '/unit-alfa-company-profile/': '/about/',
    '/unit-alfa-services/': '/capabilities/',
    '/contact-unit-alfa/': '/contact/',
  },
  build: { format: 'directory' },
});
