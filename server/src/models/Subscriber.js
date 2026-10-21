const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active', index: true },
    source: { type: String, trim: true, default: 'website' },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

subscriberSchema.index({ name: 'text', email: 'text' });

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
module.exports = { Subscriber };
