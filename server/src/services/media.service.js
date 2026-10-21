const { configureCloudinary } = require('../config/cloudinary');
const { MediaAsset } = require('../models/MediaAsset');
const { Article } = require('../models/Article');
const { CaseStudy } = require('../models/CaseStudy');
const { Testimonial } = require('../models/Testimonial');

function uploadImage(file, folder = 'grace/media') {
  const cloudinary = configureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ width: 1800, height: 1800, crop: 'limit' }], quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        return resolve({ publicId: result.public_id, url: result.secure_url, width: result.width, height: result.height, format: result.format, bytes: result.bytes });
      },
    );
    stream.end(file.buffer);
  });
}

async function createAsset(file, metadata, userId) {
  const image = await uploadImage(file);
  try {
    return await MediaAsset.create({ ...image, filename: file.originalname, altText: metadata.altText ?? '', category: metadata.category ?? 'general', tags: metadata.tags ?? [], uploadedBy: userId });
  } catch (error) {
    await configureCloudinary().uploader.destroy(image.publicId);
    throw error;
  }
}

async function replaceAsset(asset, file) {
  const previousPublicId = asset.publicId;
  const image = await uploadImage(file);
  Object.assign(asset, image, { filename: file.originalname });
  await asset.save();
  await configureCloudinary().uploader.destroy(previousPublicId);
  return asset;
}

async function findReferences(url) {
  const [articles, caseStudies, testimonials] = await Promise.all([
    Article.countDocuments({ status: 'published', $or: [{ coverImage: url }, { authorImage: url }, { content: { $regex: escapeRegex(url) } }] }),
    CaseStudy.countDocuments({ status: 'published', $or: [{ coverImage: url }, { clientLogo: url }, { gallery: url }, { challenge: { $regex: escapeRegex(url) } }, { approach: { $regex: escapeRegex(url) } }, { results: { $regex: escapeRegex(url) } }] }),
    Testimonial.countDocuments({ status: 'published', photo: url }),
  ]);
  return { articles, caseStudies, testimonials, total: articles + caseStudies + testimonials };
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { createAsset, findReferences, replaceAsset, uploadImage };
