const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'primary', immutable: true },
    businessEmail: { type: String, trim: true, default: 'hello@gracenyambura.com' },
    phone: { type: String, trim: true, default: '+254724345650' },
    linkedInUrl: { type: String, trim: true, default: 'https://www.linkedin.com/in/gracenyamburamuturi/' },
    instagramUrl: { type: String, trim: true, default: 'https://www.instagram.com/gra_cenyambura/' },
    facebookUrl: { type: String, trim: true, default: 'https://www.facebook.com/grace.nyambura.698879' },
    calendlyUrl: { type: String, trim: true, default: '' },
    homepageCta: { type: String, trim: true, default: 'Book a Discovery Call' },
    serviceStartingPrice: { type: String, trim: true, default: '$400/month' },
    minimumEngagement: { type: String, trim: true, default: 'Three months' },
    footerText: { type: String, trim: true, default: 'Writing in your voice.' },
    defaultMetaDescription: { type: String, trim: true, default: '' },
    openGraphImage: { type: String, trim: true, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
module.exports = { SiteSetting };
