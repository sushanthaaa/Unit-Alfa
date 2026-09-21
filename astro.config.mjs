import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://unit-alfa-manufacturing.sushanthp48.chatgpt.site',
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
