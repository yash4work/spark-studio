import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { BLOG_POSTS } from '../src/data/blogData.js';

const base = 'https://www.thesparkstudio.digital';
const shell = await readFile('dist/index.html', 'utf8');
const languages = ['en', 'de', 'es', 'fr'];
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (const lang of languages) {
  const copy = JSON.parse(await readFile(`src/i18n/locales/${lang}.json`, 'utf8'));
  const pages = [
    ['', copy.hero.title, copy.hero.subtitle],
    ['/blog', copy.blog.title, copy.blog.subtitle],
    ...BLOG_POSTS.map(post => {
      const article = copy.blogPosts[post.slug];
      return ['/blog/' + post.slug, article.title, article.excerpt, post.featuredImage];
    }),
    ...Object.entries(copy.templateDetails).map(([slug, item]) => ['/templates/' + slug, item.name, item.headline])
  ];
  for (const [path, heading, description, image] of pages) {
    if (!path && lang === 'en') continue;
    const localized = code => (code === 'en' ? '' : '/' + code) + path || '/';
    const route = localized(lang);
    const title = escape(heading + ' — The Spark Studio');
    const summary = escape(description || heading);
    const tags = {
      description: summary, 'og:description': summary, 'twitter:description': summary,
      'og:title': title, 'twitter:title': title, 'og:url': base + route, 'twitter:url': base + route,
      'og:locale': {en:'en_US',de:'de_DE',es:'es_ES',fr:'fr_FR'}[lang]
    };
    if (image) tags['og:image'] = tags['twitter:image'] = escape(new URL(image, base).href);
    const html = shell.replace(/<html lang="en"/, '<html lang="' + lang + '"')
      .replace(/<title>.*?<\/title>/, () => '<title>' + title + '</title>')
      .replace(/(<meta (?:name|property)="([^"]+)" content=")[^"]*/g, (all, lead, key) => key in tags ? lead + tags[key] : all)
      .replace(/(<link rel="canonical" href=")[^"]*/, '$1' + base + route)
      .replace(/(<link rel="alternate" hreflang="([^"]+)" href=")[^"]*/g, (_, lead, code) => lead + base + localized(code === 'x-default' ? 'en' : code))
      .replace(/<header\b[\s\S]*?<\/header>/, () => '<header><h1>' + escape(heading) + '</h1><p>' + summary + '</p></header>');
    const file = join('dist', route.slice(1) + '.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);

    // If this is a template route, also generate the legacy alias HTML file with canonical template tags
    if (path.startsWith('/templates/')) {
      const slug = path.replace('/templates/', '');
      const aliasRoute = (lang === 'en' ? '' : '/' + lang) + '/' + slug;
      const aliasFile = join('dist', aliasRoute.slice(1) + '.html');
      await mkdir(dirname(aliasFile), { recursive: true });
      await writeFile(aliasFile, html);
    }
  }
}

// Generate dist/404.html
const notFoundTitle = '404 - Page Not Found — The Spark Studio';
const notFoundDesc = 'The page you are looking for does not exist or has been moved.';
const notFoundTags = {
  description: notFoundDesc,
  'og:description': notFoundDesc,
  'twitter:description': notFoundDesc,
  'og:title': notFoundTitle,
  'twitter:title': notFoundTitle,
  'og:url': base + '/404',
  'twitter:url': base + '/404',
};
const notFoundHtml = shell
  .replace(/<title>.*?<\/title>/, () => '<title>' + notFoundTitle + '</title>')
  .replace(/(<meta (?:name|property)="([^"]+)" content=")[^"]*/g, (all, lead, key) => key in notFoundTags ? lead + notFoundTags[key] : all)
  .replace(/(<link rel="canonical" href=")[^"]*/, '$1' + base + '/404')
  .replace(/<link rel="alternate"[^>]*>\s*/g, '')
  .replace(/<head>/, '<head>\n    <meta name="robots" content="noindex, nofollow" />')
  .replace(/<header\b[\s\S]*?<\/header>/, () => '<header><h1>404 - Page Not Found</h1><p>' + notFoundDesc + '</p><p><a href="/" style="color:#8e97f7;text-decoration:underline;">Return to Studio Home</a></p></header>');

await writeFile(join('dist', '404.html'), notFoundHtml);
