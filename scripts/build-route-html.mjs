import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { render } from '../node_modules/.cache/spark-render/render.js';

const base = 'https://www.thesparkstudio.digital';
const shell = await readFile('dist/index.html', 'utf8');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (const route of [...routes, '/404']) {
  const lang = route.match(/^\/(de|es|fr)(?:\/|$)/)?.[1] || 'en';
  const { head, body } = await render(route, lang);
  const canonical = head.canonicalUrl || base + route;
  const bare = lang === 'en' ? route : route.slice(3);
  const tags = {
    description: head.description, 'og:description': head.description, 'twitter:description': head.description,
    'og:title': head.title, 'twitter:title': head.title, 'og:url': canonical, 'twitter:url': canonical,
    'og:image': new URL(head.image, base).href, 'twitter:image': new URL(head.image, base).href,
    'og:type': head.type, 'og:locale': {en:'en_US',de:'de_DE',es:'es_ES',fr:'fr_FR'}[lang],
    robots: head.noindex ? 'noindex, nofollow' : 'index, follow'
  };
  const html = shell.replace('<html lang="en"', '<html lang="' + lang + '"')
    .replace(/<title>.*?<\/title>/, () => '<title>' + escape(head.title) + '</title>')
    .replace(/(<meta (?:name|property)="([^"]+)" content=")[^"]*/g, (all, lead, key) => key in tags ? lead + escape(tags[key]) : all)
    .replace(/(<link rel="canonical" href=")[^"]*/, '$1' + canonical)
    .replace(/<link rel="alternate" hreflang="([^"]+)"[^>]*>/g, (_, code) => {
      if (head.noindex || (bare.startsWith('/blog/') && !['en','x-default'].includes(code))) return '';
      const prefix = ['en','x-default'].includes(code) ? '' : '/' + code;
      return `<link rel="alternate" hreflang="${code}" href="${base}${(prefix + (bare === '/' ? '' : bare)) || '/'}" />`;
    })
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => head.jsonLd ? '<script id="custom-jsonld" type="application/ld+json">' + JSON.stringify(head.jsonLd).replaceAll('<', '\\u003c') + '</script>' : '')
    .replace(/<div id="root">[\s\S]*?<\/div>(?=\s*(?:<script|<\/body>))/, () => '<div id="root" data-rendered="' + route + '">' + body + '</div>');
  if (!html.includes('data-rendered="' + route + '"') || (body.match(/<h1\b/g) || []).length !== 1) throw Error('Invalid rendered page ' + route);
  const file = join('dist', (route.slice(1) || 'index') + '.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
