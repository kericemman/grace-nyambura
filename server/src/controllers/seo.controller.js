const fs = require('node:fs/promises');
const path = require('node:path');
const { Article } = require('../models/Article');
const { CaseStudy } = require('../models/CaseStudy');

const distIndex = path.resolve(__dirname, '../../../client/dist/index.html');
const siteUrl = () => (process.env.PUBLIC_SITE_URL || 'https://gracenyambura.com').replace(/\/$/, '');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]);
}

function replaceMeta(html, selector, value) {
  const [attribute, key] = selector;
  const expression = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*("\\s*\\/?>)`);
  return html.replace(expression, `$1${escapeHtml(value)}$2`);
}

async function render(response, metadata, status = 200) {
  let html = await fs.readFile(distIndex, 'utf8');
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`);
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/, `$1${escapeHtml(metadata.url)}$2`);
  html = replaceMeta(html, ['name', 'description'], metadata.description);
  html = replaceMeta(html, ['name', 'robots'], metadata.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  html = replaceMeta(html, ['property', 'og:type'], 'article');
  html = replaceMeta(html, ['property', 'og:title'], metadata.title);
  html = replaceMeta(html, ['property', 'og:description'], metadata.description);
  html = replaceMeta(html, ['property', 'og:url'], metadata.url);
  html = replaceMeta(html, ['property', 'og:image'], metadata.image);
  html = replaceMeta(html, ['name', 'twitter:title'], metadata.title);
  html = replaceMeta(html, ['name', 'twitter:description'], metadata.description);
  html = replaceMeta(html, ['name', 'twitter:image'], metadata.image);
  const jsonLd = JSON.stringify(metadata.structuredData).replace(/</g, '\\u003c');
  html = html.replace('</head>', `<script type="application/ld+json">${jsonLd}</script></head>`);

  response.removeHeader('Content-Security-Policy');
  response.status(status).type('html').set('Cache-Control', 'public, max-age=300').send(html);
}

async function article(request, response, next) {
  try {
    const item = await Article.findOne({ slug: request.params.slug, status: 'published' }).lean();
    if (!item) return render(response, {
      title: 'Article not available | Grace Nyambura', description: 'This article is not available.',
      url: `${siteUrl()}/insights/${request.params.slug}`, image: '', noIndex: true, structuredData: {},
    }, 404);
    const url = item.canonicalUrl || `${siteUrl()}/insights/${item.slug}`;
    const title = item.seoTitle || `${item.title} | Grace Nyambura`;
    const description = item.seoDescription || item.excerpt;
    return render(response, {
      title, description, url, image: item.coverImage,
      structuredData: {
        '@context': 'https://schema.org', '@type': 'Article', headline: item.title,
        description, image: item.coverImage || undefined,
        datePublished: item.publishedAt || item.createdAt, dateModified: item.updatedAt,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: item.author || 'Grace Nyambura', url: `${siteUrl()}/about` },
      },
    });
  } catch (error) { return next(error); }
}

async function caseStudy(request, response, next) {
  try {
    const item = await CaseStudy.findOne({ slug: request.params.slug, status: 'published', publicationApproved: true }).lean();
    if (!item) return render(response, {
      title: 'Client story not available | Grace Nyambura', description: 'This client story is not available.',
      url: `${siteUrl()}/client-stories/${request.params.slug}`, image: '', noIndex: true, structuredData: {},
    }, 404);
    const url = `${siteUrl()}/client-stories/${item.slug}`;
    const title = item.seoTitle || `${item.projectTitle} | Grace Nyambura`;
    const description = item.seoDescription || item.summary;
    return render(response, {
      title, description, url, image: item.coverImage || item.clientLogo,
      structuredData: {
        '@context': 'https://schema.org', '@type': 'Article', headline: item.projectTitle,
        description, image: item.coverImage || item.clientLogo || undefined,
        datePublished: item.createdAt, dateModified: item.updatedAt, mainEntityOfPage: url,
        author: { '@type': 'Person', name: 'Grace Nyambura', url: `${siteUrl()}/about` },
      },
    });
  } catch (error) { return next(error); }
}

module.exports = { article, caseStudy };
