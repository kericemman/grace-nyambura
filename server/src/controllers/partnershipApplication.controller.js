const sanitizeHtml = require('sanitize-html');
const { parsePhoneNumber } = require('libphonenumber-js');
const { PartnershipApplication } = require('../models/PartnershipApplication');
const { sendPartnershipEmails } = require('../services/email.service');
const {
  adminPartnershipApplicationSchema,
  publicPartnershipApplicationSchema,
} = require('../validation/partnershipApplication.validation');

const clean = (value) => sanitizeHtml(value, {
  allowedTags: [],
  allowedAttributes: {},
}).trim();

function validationError(parsed, response) {
  return response.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: parsed.error.issues[0].message,
      details: parsed.error.issues,
    },
  });
}

async function submit(request, response, next) {
  try {
    const parsed = publicPartnershipApplicationSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    if (Date.now() - parsed.data.startedAt < 2500) {
      return response.status(400).json({
        error: {
          code: 'SUBMISSION_REJECTED',
          message: 'Please review the form and try again',
        },
      });
    }

    const { website: _website, startedAt: _startedAt, ...data } = parsed.data;
    const application = await PartnershipApplication.create({
      ...data,
      fullName: clean(data.fullName),
      phone: parsePhoneNumber(data.phone).number,
      company: clean(data.company),
      professionalRole: clean(data.professionalRole),
      primaryGoal: clean(data.primaryGoal),
      currentPostingRhythm: clean(data.currentPostingRhythm),
      desiredStart: clean(data.desiredStart),
      additionalContext: clean(data.additionalContext),
    });

    try {
      await sendPartnershipEmails(application);
      application.notificationStatus = 'sent';
    } catch (emailError) {
      application.notificationStatus = 'failed';
      if (process.env.NODE_ENV !== 'test') {
        console.error('Partnership application email failed:', emailError.message);
      }
    }
    await application.save();

    return response.status(201).json({
      data: {
        submitted: true,
        message: 'Your application has been received. I will be in touch soon.',
      },
    });
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
      PartnershipApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      PartnershipApplication.countDocuments(filter),
    ]);

    return response.json({
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { return next(error); }
}

async function update(request, response, next) {
  try {
    const parsed = adminPartnershipApplicationSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);

    const item = await PartnershipApplication.findByIdAndUpdate(
      request.params.id,
      parsed.data,
      { new: true, runValidators: true },
    );
    if (!item) {
      return response.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Partnership application not found' },
      });
    }

    return response.json({ data: item });
  } catch (error) { return next(error); }
}

module.exports = { list, submit, update };
