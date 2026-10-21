const sanitizeHtml = require('sanitize-html');
const { Article } = require('../models/Article');
const { CaseStudy } = require('../models/CaseStudy');
const { articleSchema, caseStudySchema } = require('../validation/content.validation');

const allowedHtml = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'title', 'frameborder'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'],
  allowedSchemes: ['http', 'https', 'mailto'],
};
const clean = (value) => sanitizeHtml(value, allowedHtml);

function contentController({ Model, schema, titleField, htmlFields = [], requireApproval = false }) {
  return {
    async list(request, response, next) {
      try {
        const page = Math.max(Number(request.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(request.query.limit) || 10, 1), 50);
        const filter = {};
        if (request.query.status) filter.status = request.query.status;
        if (request.query.search) filter.$text = { $search: request.query.search };
        const [items, total] = await Promise.all([
          Model.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit),
          Model.countDocuments(filter),
        ]);
        return response.json({ data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
      } catch (error) { return next(error); }
    },
    async get(request, response, next) {
      try {
        const item = await Model.findById(request.params.id);
        if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Content not found' } });
        return response.json({ data: item });
      } catch (error) { return next(error); }
    },
    async create(request, response, next) {
      try {
        const parsed = schema.safeParse(request.body);
        if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message, details: parsed.error.issues } });
        if (requireApproval && parsed.data.status === 'published' && !parsed.data.publicationApproved) return response.status(400).json({ error: { code: 'APPROVAL_REQUIRED', message: 'Publication approval is required before publishing a case study' } });
        for (const field of htmlFields) parsed.data[field] = clean(parsed.data[field]);
        if (parsed.data.status === 'published' && Model === Article) parsed.data.publishedAt = new Date();
        const item = await Model.create(parsed.data);
        return response.status(201).json({ data: item });
      } catch (error) { return handleWriteError(error, response, next, titleField); }
    },
    async update(request, response, next) {
      try {
        const parsed = schema.safeParse(request.body);
        if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message, details: parsed.error.issues } });
        if (requireApproval && parsed.data.status === 'published' && !parsed.data.publicationApproved) return response.status(400).json({ error: { code: 'APPROVAL_REQUIRED', message: 'Publication approval is required before publishing a case study' } });
        for (const field of htmlFields) parsed.data[field] = clean(parsed.data[field]);
        if (parsed.data.status === 'published' && Model === Article) parsed.data.publishedAt = new Date();
        const item = await Model.findByIdAndUpdate(request.params.id, parsed.data, { new: true, runValidators: true });
        if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Content not found' } });
        return response.json({ data: item });
      } catch (error) { return handleWriteError(error, response, next, titleField); }
    },
    async remove(request, response, next) {
      try {
        const item = await Model.findByIdAndDelete(request.params.id);
        if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Content not found' } });
        return response.json({ data: { deleted: true } });
      } catch (error) { return next(error); }
    },
  };
}

function handleWriteError(error, response, next, titleField) {
  if (error?.code === 11000) return response.status(409).json({ error: { code: 'SLUG_CONFLICT', message: `Another ${titleField} already uses this slug` } });
  return next(error);
}

const articles = contentController({ Model: Article, schema: articleSchema, titleField: 'article', htmlFields: ['content'] });
const caseStudies = contentController({ Model: CaseStudy, schema: caseStudySchema, titleField: 'case study', htmlFields: ['challenge', 'objectives', 'approach', 'contribution', 'results', 'testimonial'], requireApproval: true });

module.exports = { articles, caseStudies };
