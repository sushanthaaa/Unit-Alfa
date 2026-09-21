"""Check generated HTML without browser interaction or external requests."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

root = Path(__file__).resolve().parent.parent / 'dist'
routes = ['/', '/about/', '/capabilities/', '/products/', '/quality/', '/enquiry/', '/contact/', '/privacy/', '/terms/']
errors, titles, descriptions = [], set(), set()

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.h1=0; self.title=''; self.in_title=False; self.description=''; self.canonical=''; self.links=[]; self.images=[]; self.ids=set(); self.labels=set(); self.inputs=[]; self.json=[]; self.in_json=False; self.json_text=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'):
            if a['id'] in self.ids: errors.append('Duplicate ID: '+a['id'])
            self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='title': self.in_title=True
        if tag=='meta' and a.get('name')=='description': self.description=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href','')
        if tag=='a': self.links.append(a.get('href',''))
        if tag in ('img','script','link'):
            asset=a.get('src') or (a.get('href') if tag=='link' and a.get('rel') in ('stylesheet','icon','preload') else None)
            if asset and asset.startswith('/') and not (root/unquote(asset.split('?')[0]).lstrip('/')).is_file(): errors.append('Missing asset: '+asset)
        if tag=='img':
            if 'alt' not in a: errors.append('Image without alt')
            if not a.get('width') or not a.get('height'): errors.append('Image without dimensions')
            self.images.append(a)
        if tag=='label': self.labels.add(a.get('for'))
        if tag in ('input','select','textarea') and a.get('type')!='hidden': self.inputs.append(a)
        if tag=='script' and a.get('type')=='application/ld+json': self.in_json=True; self.json_text=''
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
        if tag=='script' and self.in_json:
            self.in_json=False
            try: self.json.append(json.loads(self.json_text))
            except ValueError: errors.append('Invalid JSON-LD')
    def handle_data(self,data):
        if self.in_title:self.title+=data
        if self.in_json:self.json_text+=data

pages={}
for route in routes:
    p=Page(); p.feed((root/route.lstrip('/')/'index.html').read_text()); pages[route]=p
    if p.h1!=1:errors.append(f'{route}: expected one h1, got {p.h1}')
    if not p.title or p.title in titles: errors.append(f'{route}: missing/duplicate title')
    if not p.description or p.description in descriptions:errors.append(f'{route}: missing/duplicate description')
    if not p.canonical.endswith(route):errors.append(f'{route}: incorrect canonical')
    if not p.json:errors.append(f'{route}: missing structured data')
    for field in p.inputs:
        if field.get('id') not in p.labels and not field.get('aria-label'):errors.append(f'{route}: unlabelled field {field.get("id")}')
    titles.add(p.title);descriptions.add(p.description)
for route,p in pages.items():
    for href in p.links:
        u=urlsplit(href)
        if u.scheme or u.netloc or not u.path.startswith('/'):continue
        target=root/unquote(u.path).lstrip('/')
        if not target.is_file() and not (target/'index.html').is_file():errors.append(f'{route}: broken link {href}')
        if u.fragment and u.path in pages and u.fragment not in pages[u.path].ids:errors.append(f'{route}: missing anchor {href}')
for required in ['robots.txt','sitemap-index.xml','sitemap-0.xml','404.html']:
    if not (root/required).is_file():errors.append('Missing '+required)
if errors:
    print('\n'.join(errors));raise SystemExit(1)
print(f'PASS: {len(routes)} clean routes; unique metadata; headings; internal links; image references; dimensions; labels; JSON-LD; sitemap and robots.')
