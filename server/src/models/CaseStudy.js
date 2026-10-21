const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema(
  {
    clientName: { type: String, trim: true, default: '' },
    company: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    projectTitle: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, required: true, trim: true },
    challenge: { type: String, required: true },
    objectives: { type: String, default: '' },
    approach: { type: String, required: true },
    contribution: { type: String, default: '' },
    results: { type: String, default: '' },
    metrics: [{ label: String, value: String, evidenceUrl: String }],
    evidenceLinks: [{ label: String, url: String }],
    testimonial: { type: String, default: '' },
    clientLogo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    gallery: [{ type: String }],
    publicationApproved: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true },
);

caseStudySchema.index({ projectTitle: 'text', company: 'text', summary: 'text' });
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', caseStudySchema);
module.exports = { CaseStudy };
