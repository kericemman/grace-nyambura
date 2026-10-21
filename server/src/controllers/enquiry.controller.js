const sanitizeHtml = require('sanitize-html');
const { parsePhoneNumber } = require('libphonenumber-js');
const { Enquiry } = require('../models/Enquiry');
const { sendEnquiryEmails } = require('../services/email.service');
const { adminEnquirySchema, publicEnquirySchema } = require('../validation/enquiry.validation');

const clean = (value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();

function validationError(parsed, response) {
  return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message, details: parsed.error.issues } });
}

async function submit(request, response, next) {
  try {
    const parsed = publicEnquirySchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    if (Date.now() - parsed.data.startedAt < 2500) return response.status(400).json({ error: { code: 'SUBMISSION_REJECTED', message: 'Please review the form and try again' } });

    const { website: _honeypot, startedAt: _startedAt, ...data } = parsed.data;
    const enquiry = await Enquiry.create({
      ...data,
      fullName: clean(data.fullName),
      company: clean(data.company),
      phone: parsePhoneNumber(data.phone).number,
      professionalRole: clean(data.professionalRole),
      primaryChallenge: clean(data.primaryChallenge),
      projectDescription: clean(data.projectDescription),
    });

    try {
      await sendEnquiryEmails(enquiry);
      enquiry.notificationStatus = 'sent';
    } catch (emailError) {
      enquiry.notificationStatus = 'failed';
      if (process.env.NODE_ENV !== 'test') console.error('Enquiry email failed:', emailError.message);
    }
    await enquiry.save();

    return response.status(201).json({ data: { submitted: true, message: 'Thank you. I will be in touch soon.' } });
  } catch (error) { return next(error); }
}

async function list(request, response, next) {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 50);
    const filter = {};
    if (request.query.status) filter.status = request.query.status;
    if (request.query.search) filter.$text = { $search: request.query.search };
    const [items, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Enquiry.countDocuments(filter),
    ]);
    return response.json({ data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

async function get(request, response, next) {
  try {
    const item = await Enquiry.findById(request.params.id);
    if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enquiry not found' } });
    return response.json({ data: item });
  } catch (error) { return next(error); }
}

async function update(request, response, next) {
  try {
    const parsed = adminEnquirySchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    const item = await Enquiry.findByIdAndUpdate(request.params.id, parsed.data, { new: true, runValidators: true });
    if (!item) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enquiry not found' } });
    return response.json({ data: item });
  } catch (error) { return next(error); }
}

module.exports = { get, list, submit, update };
