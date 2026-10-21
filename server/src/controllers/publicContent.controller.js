const { Article } = require('../models/Article');
const { CaseStudy } = require('../models/CaseStudy');

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

    const [items, total, industries] = await Promise.all([
      CaseStudy.find(filter)
        .select('-challenge -objectives -approach -contribution -results -testimonial')
        .sort({ featured: -1, createdAt: -1 })
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

module.exports = { articleBySlug, articleList, caseStudyBySlug, caseStudyList };
