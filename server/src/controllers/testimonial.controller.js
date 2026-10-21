const crypto = require('node:crypto');
const sanitizeHtml = require('sanitize-html');
const { Testimonial } = require('../models/Testimonial');
const { createAsset } = require('../services/media.service');
const { requestSchema, submissionSchema, testimonialSchema } = require('../validation/testimonial.validation');

const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
const cleanText = (value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();

async function list(request, response, next) {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 10, 1), 50);
    const filter = {};
    if (request.query.status) filter.status = request.query.status;
    if (request.query.search) filter.$text = { $search: request.query.search };
    const [items, total] = await Promise.all([
      Testimonial.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit),
      Testimonial.countDocuments(filter),
    ]);
    return response.json({ data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

async function get(request, response, next) {
  try {
    const item = await Testimonial.findById(request.params.id);
    if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Testimonial not found' } });
    return response.json({ data: item });
  } catch (error) { return next(error); }
}

async function create(request, response, next) {
  try {
    const parsed = testimonialSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    if (parsed.data.status === 'published' && !parsed.data.permissionConfirmed) return approvalError(response);
    parsed.data.quote = cleanText(parsed.data.quote);
    const item = await Testimonial.create(parsed.data);
    return response.status(201).json({ data: item });
  } catch (error) { return next(error); }
}

async function update(request, response, next) {
  try {
    const parsed = testimonialSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    if (parsed.data.status === 'published' && !parsed.data.permissionConfirmed) return approvalError(response);
    parsed.data.quote = cleanText(parsed.data.quote);
    const item = await Testimonial.findByIdAndUpdate(request.params.id, parsed.data, { new: true, runValidators: true });
    if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Testimonial not found' } });
    return response.json({ data: item });
  } catch (error) { return next(error); }
}

async function remove(request, response, next) {
  try {
    const item = await Testimonial.findByIdAndDelete(request.params.id);
    if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Testimonial not found' } });
    return response.json({ data: { deleted: true } });
  } catch (error) { return next(error); }
}

async function createRequest(request, response, next) {
  try {
    const parsed = requestSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    const token = crypto.randomBytes(32).toString('base64url');
    const item = await Testimonial.create({
      ...parsed.data,
      expiresInDays: undefined,
      status: 'requested',
      requestTokenHash: tokenHash(token),
      requestExpiresAt: new Date(Date.now() + parsed.data.expiresInDays * 24 * 60 * 60 * 1000),
    });
    return response.status(201).json({ data: { id: item.id, token, expiresAt: item.requestExpiresAt } });
  } catch (error) { return next(error); }
}

async function requestDetails(request, response, next) {
  try {
    const item = await findValidRequest(request.params.token);
    if (!item) return invalidRequest(response);
    return response.json({ data: { clientName: item.clientName, clientRole: item.clientRole, company: item.company, expiresAt: item.requestExpiresAt } });
  } catch (error) { return next(error); }
}

async function submitRequest(request, response, next) {
  try {
    const parsed = submissionSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    const item = await findValidRequest(request.params.token);
    if (!item) return invalidRequest(response);

    let photo = item.photo;
    if (request.file) {
      const asset = await createAsset(
        request.file,
        {
          altText: `${parsed.data.clientName} testimonial photo or logo`,
          category: 'testimonial',
          tags: ['client-submission'],
        },
      );
      photo = asset.url;
    }

    Object.assign(item, parsed.data, {
      photo,
      quote: cleanText(parsed.data.quote),
      status: 'submitted',
      submittedAt: new Date(),
      requestTokenHash: undefined,
      requestExpiresAt: undefined,
    });
    await item.save();
    return response.status(201).json({ data: { submitted: true } });
  } catch (error) { return next(error); }
}

async function published(_request, response, next) {
  try {
    const items = await Testimonial.find({
      status: 'published',
      permissionConfirmed: true,
    })
      .select('clientName clientRole company quote photo sourceUrl featured publishedAt updatedAt')
      .sort({ featured: -1, updatedAt: -1 })
      .limit(12);

    return response.json({ data: items });
  } catch (error) { return next(error); }
}

function findValidRequest(token) {
  return Testimonial.findOne({ requestTokenHash: tokenHash(token), status: 'requested', requestExpiresAt: { $gt: new Date() } }).select('+requestTokenHash +requestExpiresAt');
}
function validationError(parsed, response) { return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message, details: parsed.error.issues } }); }
function approvalError(response) { return response.status(400).json({ error: { code: 'PERMISSION_REQUIRED', message: 'Publication permission is required before publishing a testimonial' } }); }
function invalidRequest(response) { return response.status(404).json({ error: { code: 'REQUEST_INVALID', message: 'This testimonial request is invalid, expired, or already used' } }); }

module.exports = {
  create,
  createRequest,
  get,
  list,
  published,
  remove,
  requestDetails,
  submitRequest,
  update,
};
