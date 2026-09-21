/** Inspect generated HTML without a browser or requests to external services. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { loadEnvFile } from 'node:process';
import { parse } from 'parse5';
import { resolveSiteConfig } from '../src/lib/site-config.ts';

if (existsSync('.env')) loadEnvFile('.env');
const { siteUrl, indexable } = resolveSiteConfig(process.env);
const root = resolve('dist');
const routes = [
  '/',
  '/about/',
  '/capabilities/',
  '/products/',
  '/quality/',
  '/enquiry/',
  '/contact/',
  '/privacy/',
  '/terms/',
];
const errors = [];
const pages = new Map();
const titles = new Set();
const descriptions = new Set();

function check(condition, message) {
  if (!condition) errors.push(message);
}

function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes || []) walk(child, visit);
}

function textContent(node) {
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes || []).map(textContent).join('');
}

function localFile(pathname) {
  const file = resolve(root, `.${decodeURIComponent(pathname)}`);
  if (relative(root, file).startsWith('..')) return null;
  if (!existsSync(file)) return null;
  return statSync(file).isDirectory() ? resolve(file, 'index.html') : file;
}

for (const route of routes) {
  const file = localFile(route);
  check(file && existsSync(file), `${route}: missing HTML`);
  if (!file || !existsSync(file)) continue;
  const nodes = [];
  walk(parse(readFileSync(file, 'utf8')), (node) => {
    if (node.tagName) {
      nodes.push({
        tag: node.tagName,
        attrs: Object.fromEntries(node.attrs.map(({ name, value }) => [name, value])),
        text: textContent(node),
      });
    }
  });
  const select = (tag, attribute, value) =>
    nodes.filter((node) => node.tag === tag && (!attribute || node.attrs[attribute] === value));
  const ids = new Set();
  const references = [];
  for (const { tag, attrs } of nodes) {
    if (attrs.id) {
      check(!ids.has(attrs.id), `${route}: duplicate ID ${attrs.id}`);
      ids.add(attrs.id);
    }
    if (tag === 'a' && attrs.href) references.push(attrs.href);
    if (['img', 'script', 'source'].includes(tag) && attrs.src) references.push(attrs.src);
    if (tag === 'link' && ['stylesheet', 'icon', 'preload', 'modulepreload'].includes(attrs.rel)) {
      references.push(attrs.href);
    }
    if ((tag === 'img' || tag === 'source') && attrs.srcset) {
      references.push(...attrs.srcset.split(',').map((item) => item.trim().split(/\s+/)[0]));
    }
    if (tag === 'img') {
      check('alt' in attrs, `${route}: image without alt (${attrs.src})`);
      check(
        Number(attrs.width) > 0 && Number(attrs.height) > 0,
        `${route}: missing image dimensions`,
      );
    }
    if (['input', 'select', 'textarea'].includes(tag) && attrs.type !== 'hidden') {
      const hasLabel = select('label', 'for', attrs.id).some((label) => label.text.trim());
      check(hasLabel || attrs['aria-label'], `${route}: unlabelled form field ${attrs.id}`);
    }
  }
  const title = select('title')[0]?.text.trim();
  const description = select('meta', 'name', 'description')[0]?.attrs.content;
  check(title && !titles.has(title), `${route}: missing or duplicate title`);
  check(
    description && !descriptions.has(description),
    `${route}: missing or duplicate description`,
  );
  titles.add(title);
  descriptions.add(description);
  check(select('h1').length === 1, `${route}: expected exactly one h1`);
  const canonical = new URL(route, siteUrl).href;
  check(
    select('link', 'rel', 'canonical')[0]?.attrs.href === canonical,
    `${route}: incorrect canonical`,
  );
  check(
    select('meta', 'property', 'og:url')[0]?.attrs.content === canonical,
    `${route}: incorrect OG URL`,
  );
  const noindex = select('meta', 'name', 'robots').some((node) =>
    node.attrs.content.includes('noindex'),
  );
  check(noindex === !indexable, `${route}: indexing does not match deployment policy`);
  const schemas = select('script', 'type', 'application/ld+json');
  check(schemas.length > 0, `${route}: missing JSON-LD`);
  for (const schema of schemas) {
    try {
      JSON.parse(schema.text);
    } catch {
      errors.push(`${route}: invalid JSON-LD`);
    }
  }
  pages.set(route, { ids, references });
}

for (const [route, { references }] of pages) {
  for (const reference of references) {
    const url = new URL(reference, new URL(route, siteUrl));
    if (url.origin !== siteUrl) continue;
    const file = localFile(url.pathname);
    check(file && existsSync(file), `${route}: missing local link or asset ${reference}`);
    const target = pages.get(url.pathname);
    if (url.hash && target) {
      check(
        target.ids.has(decodeURIComponent(url.hash.slice(1))),
        `${route}: missing anchor ${reference}`,
      );
    }
  }
}

for (const required of ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', '404.html']) {
  check(existsSync(resolve(root, required)), `Missing ${required}`);
}
if (existsSync(resolve(root, 'robots.txt'))) {
  const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
  check(robots.includes(indexable ? '\nAllow: /\n' : '\nDisallow: /\n'), 'Incorrect robots policy');
  check(
    robots.includes(`Sitemap: ${siteUrl}/sitemap-index.xml`),
    'Incorrect robots sitemap origin',
  );
}
if (existsSync(resolve(root, 'sitemap-0.xml'))) {
  const xml = readFileSync(resolve(root, 'sitemap-0.xml'), 'utf8');
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  check(locations.length === routes.length, 'Sitemap must contain only the nine canonical pages');
  for (const route of routes)
    check(locations.includes(`${siteUrl}${route}`), `Sitemap missing ${route}`);
}
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
for (const { source, destination, permanent } of config.redirects) {
  const file = localFile(source);
  check(file && existsSync(file), `Missing static redirect fallback: ${source}`);
  check(routes.includes(destination) && permanent === true, `Invalid Vercel redirect: ${source}`);
}

assert.equal(errors.length, 0, `Static audit failed:\n${errors.join('\n')}`);
console.log(
  `PASS: ${routes.length} pages; metadata and indexing; links and assets; image dimensions; labels; JSON-LD; sitemap; robots; redirects.`,
);
