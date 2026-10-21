const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    filename: { type: String, required: true, trim: true },
    altText: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'general', index: true },
    tags: [{ type: String, trim: true }],
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

mediaAssetSchema.index({ filename: 'text', altText: 'text', tags: 'text' });
const MediaAsset = mongoose.models.MediaAsset || mongoose.model('MediaAsset', mediaAssetSchema);
module.exports = { MediaAsset };
