const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    author: { type: String, required: true, default: 'Grace Nyambura' },
    authorImage: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String, trim: true, default: '' },
    seoDescription: { type: String, trim: true, default: '' },
    canonicalUrl: { type: String, trim: true, default: '' },
    publishedAt: Date,
  },
  { timestamps: true },
);

articleSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
module.exports = { Article };
