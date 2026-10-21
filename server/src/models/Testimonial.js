const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientRole: { type: String, trim: true, default: '' },
    company: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '', select: false },
    quote: { type: String, trim: true, default: '' },
    photo: { type: String, trim: true, default: '' },
    sourceUrl: { type: String, trim: true, default: '' },
    caseStudy: { type: mongoose.Schema.Types.ObjectId, ref: 'CaseStudy', default: null },
    permissionConfirmed: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['requested', 'submitted', 'published', 'archived'], default: 'requested', index: true },
    requestTokenHash: { type: String, select: false, index: true },
    requestExpiresAt: { type: Date, select: false },
    submittedAt: Date,
  },
  { timestamps: true },
);

testimonialSchema.index({ clientName: 'text', company: 'text', quote: 'text' });
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
module.exports = { Testimonial };
