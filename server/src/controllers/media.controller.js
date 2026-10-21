const { configureCloudinary } = require('../config/cloudinary');
const { MediaAsset } = require('../models/MediaAsset');
const { createAsset, findReferences, replaceAsset } = require('../services/media.service');

async function uploadInlineImage(request, response, next) {
  try {
    if (!request.file) return response.status(400).json({ error: { code: 'IMAGE_REQUIRED', message: 'Choose an image to upload' } });
    const category = ['article', 'case-study', 'testimonial'].includes(request.body.category) ? request.body.category : 'article';
    const image = await createAsset(request.file, { altText: request.body.altText ?? '', category, tags: ['editor-upload'] }, request.user.id);
    return response.status(201).json({ data: image });
  } catch (error) {
    error.status = error.status ?? 502;
    error.code = error.code ?? 'IMAGE_UPLOAD_FAILED';
    return next(error);
  }
}

async function list(request, response, next) {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 24, 1), 60);
    const filter = {};
    if (request.query.category) filter.category = request.query.category;
    if (request.query.search) filter.$text = { $search: request.query.search };
    const [items, total] = await Promise.all([MediaAsset.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), MediaAsset.countDocuments(filter)]);
    return response.json({ data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

async function upload(request, response, next) {
  try {
    if (!request.files?.length) return response.status(400).json({ error: { code: 'IMAGE_REQUIRED', message: 'Choose at least one image' } });
    const tags = String(request.body.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);
    const items = [];
    for (const file of request.files) items.push(await createAsset(file, { altText: request.body.altText, category: request.body.category, tags }, request.user.id));
    return response.status(201).json({ data: items });
  } catch (error) { return next(error); }
}

async function update(request, response, next) {
  try {
    const asset = await MediaAsset.findByIdAndUpdate(request.params.id, { altText: String(request.body.altText ?? '').trim(), category: String(request.body.category ?? 'general').trim(), tags: Array.isArray(request.body.tags) ? request.body.tags.map((tag) => String(tag).trim()).filter(Boolean) : [] }, { new: true, runValidators: true });
    if (!asset) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Media asset not found' } });
    return response.json({ data: asset });
  } catch (error) { return next(error); }
}

async function replace(request, response, next) {
  try {
    if (!request.file) return response.status(400).json({ error: { code: 'IMAGE_REQUIRED', message: 'Choose a replacement image' } });
    const asset = await MediaAsset.findById(request.params.id);
    if (!asset) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Media asset not found' } });
    return response.json({ data: await replaceAsset(asset, request.file) });
  } catch (error) { return next(error); }
}

async function remove(request, response, next) {
  try {
    const asset = await MediaAsset.findById(request.params.id);
    if (!asset) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Media asset not found' } });
    const references = await findReferences(asset.url);
    if (references.total) return response.status(409).json({ error: { code: 'MEDIA_IN_USE', message: 'This image is used by published content and cannot be deleted', details: references } });
    await configureCloudinary().uploader.destroy(asset.publicId);
    await asset.deleteOne();
    return response.json({ data: { deleted: true } });
  } catch (error) { return next(error); }
}

module.exports = { list, remove, replace, update, upload, uploadInlineImage };
