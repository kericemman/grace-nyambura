const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    websiteUrl: { type: String, trim: true, default: '' },
    professionalRole: { type: String, required: true, trim: true },
    primaryChallenge: { type: String, required: true, trim: true },
    projectDescription: { type: String, required: true, trim: true },
    preferredContactMethod: { type: String, enum: ['email', 'phone', 'linkedin'], required: true },
    consent: { type: Boolean, required: true },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'closed'], default: 'new', index: true },
    internalNotes: { type: String, trim: true, default: '' },
    notificationStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  },
  { timestamps: true },
);

enquirySchema.index({ fullName: 'text', email: 'text', company: 'text', primaryChallenge: 'text' });

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
module.exports = { Enquiry };
