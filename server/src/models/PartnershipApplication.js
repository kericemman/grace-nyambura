const mongoose = require('mongoose');

const partnershipApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    professionalRole: { type: String, required: true, trim: true },
    linkedInUrl: { type: String, trim: true, default: '' },
    primaryGoal: { type: String, required: true, trim: true },
    currentPostingRhythm: { type: String, required: true, trim: true },
    desiredStart: { type: String, required: true, trim: true },
    additionalContext: { type: String, trim: true, default: '' },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'qualified', 'accepted', 'declined'],
      default: 'new',
      index: true,
    },
    internalNotes: { type: String, trim: true, default: '' },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

partnershipApplicationSchema.index({
  fullName: 'text',
  email: 'text',
  company: 'text',
  primaryGoal: 'text',
});

const PartnershipApplication =
  mongoose.models.PartnershipApplication
  || mongoose.model('PartnershipApplication', partnershipApplicationSchema);

module.exports = { PartnershipApplication };
