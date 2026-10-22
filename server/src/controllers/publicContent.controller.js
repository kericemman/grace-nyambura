const { Article } = require('../models/Article');
const { CaseStudy } = require('../models/CaseStudy');

const xmlEscape = (value) => String(value).replace(/[<>&'\"]/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
})[character]);

function pagination(request) {
  const page = Math.max(Number(request.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(request.query.limit) || 9, 1), 24);
  return { page, limit };
}

async function articleList(request, response, next) {
  try {
    const { page, limit } = pagination(request);
    const filter = { status: 'published' };
    if (request.query.category) filter.category = request.query.category;
    if (request.query.search) filter.$text = { $search: request.query.search };
    const sort = request.query.sort === 'latest'
      ? { publishedAt: -1, createdAt: -1 }
      : { featured: -1, publishedAt: -1, createdAt: -1 };

    const [items, total, categories] = await Promise.all([
      Article.find(filter)
        .select('-content')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Article.countDocuments(filter),
      Article.distinct('category', { status: 'published' }),
    ]);

    return response.json({
      data: items,
      categories: categories.filter(Boolean).sort(),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { return next(error); }
}

async function caseStudyList(request, response, next) {
  try {
    const { page, limit } = pagination(request);
    const filter = { status: 'published', publicationApproved: true };
    if (request.query.industry) filter.industry = request.query.industry;
    const sort = request.query.sort === 'latest'
      ? { createdAt: -1 }
      : { featured: -1, createdAt: -1 };

    const [items, total, industries] = await Promise.all([
      CaseStudy.find(filter)
        .select('-challenge -objectives -approach -contribution -results -testimonial')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      CaseStudy.countDocuments(filter),
      CaseStudy.distinct('industry', filter),
    ]);

    return response.json({
      data: items,
      industries: industries.filter(Boolean).sort(),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { return next(error); }
}

async function articleBySlug(request, response, next) {
  try {
    const article = await Article.findOne({ slug: request.params.slug, status: 'published' });
    if (!article) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Article not found' } });
    return response.json({ data: article });
  } catch (error) { return next(error); }
}

async function caseStudyBySlug(request, response, next) {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: request.params.slug, status: 'published', publicationApproved: true });
    if (!caseStudy) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Case study not found' } });
    return response.json({ data: caseStudy });
  } catch (error) { return next(error); }
}

async function sitemap(_request, response, next) {
  try {
    const siteUrl = (process.env.PUBLIC_SITE_URL || process.env.CLIENT_ORIGIN || 'https://gracenyambura.com').replace(/\/$/, '');
    const [articles, caseStudies] = await Promise.all([
      Article.find({ status: 'published' }).select('slug updatedAt publishedAt').lean(),
      CaseStudy.find({ status: 'published', publicationApproved: true }).select('slug updatedAt').lean(),
    ]);
    const staticPages = [
      ['', '1.0'], ['/about', '0.8'], ['/insights', '0.9'], ['/client-stories', '0.8'],
      ['/linkedin-partnership', '0.9'], ['/contact', '0.7'], ['/privacy-policy', '0.3'], ['/terms', '0.3'],
    ];
    const urls = [
      ...staticPages.map(([path, priority]) => ({ loc: `${siteUrl}${path || '/'}`, priority })),
      ...articles.map((article) => ({ loc: `${siteUrl}/insights/${article.slug}`, lastmod: article.updatedAt || article.publishedAt, priority: '0.8' })),
      ...caseStudies.map((study) => ({ loc: `${siteUrl}/client-stories/${study.slug}`, lastmod: study.updatedAt, priority: '0.7' })),
    ];
    const body = urls.map(({ loc, lastmod, priority }) => [
      '  <url>', `    <loc>${xmlEscape(loc)}</loc>`,
      lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
      '    <changefreq>weekly</changefreq>', `    <priority>${priority}</priority>`, '  </url>',
    ].filter(Boolean).join('\n')).join('\n');

    response.set('Content-Type', 'application/xml; charset=utf-8');
    response.set('Cache-Control', 'public, max-age=3600');
    return response.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
  } catch (error) { return next(error); }
}

module.exports = { articleBySlug, articleList, caseStudyBySlug, caseStudyList, sitemap };
