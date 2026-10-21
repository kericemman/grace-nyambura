const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const { Subscriber } = require('../models/Subscriber');
const { sendSubscriberEmails } = require('../services/email.service');
const { subscriberSchema } = require('../validation/subscriber.validation');

const clean = (value) => sanitizeHtml(value, {
  allowedTags: [],
  allowedAttributes: {},
}).trim();

async function subscribe(request, response, next) {
  try {
    const parsed = subscriberSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0].message,
          details: parsed.error.issues,
        },
      });
    }
    if (Date.now() - parsed.data.startedAt < 1500) {
      return response.status(400).json({
        error: {
          code: 'SUBMISSION_REJECTED',
          message: 'Please review the form and try again',
        },
      });
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await Subscriber.findOne({ email });
    let subscriber;
    let shouldNotify = false;
    if (existing) {
      shouldNotify = existing.status !== 'active';
      existing.name = clean(parsed.data.name);
      existing.status = 'active';
      existing.unsubscribedAt = undefined;
      if (!existing.subscribedAt) existing.subscribedAt = new Date();
      subscriber = await existing.save();
    } else {
      subscriber = await Subscriber.create({
        name: clean(parsed.data.name),
        email,
        source: 'website',
      });
      shouldNotify = true;
    }

    if (shouldNotify) {
      try {
        await sendSubscriberEmails(subscriber);
        subscriber.notificationStatus = 'sent';
      } catch (emailError) {
        subscriber.notificationStatus = 'failed';
        if (process.env.NODE_ENV !== 'test') {
          console.error('Subscriber email failed:', emailError.message);
        }
      }
      await subscriber.save();
    }

    return response.status(201).json({
      data: {
        subscribed: true,
        message: 'You are on the mailing list.',
      },
    });
  } catch (error) { return next(error); }
}

async function unsubscribe(request, response, next) {
  try {
    const token = String(request.body?.token || '');
    const secret = process.env.UNSUBSCRIBE_SECRET || process.env.JWT_ACCESS_SECRET;
    if (!token || !secret) {
      return response.status(400).json({
        error: { code: 'INVALID_UNSUBSCRIBE_LINK', message: 'This unsubscribe link is invalid.' },
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      return response.status(400).json({
        error: { code: 'INVALID_UNSUBSCRIBE_LINK', message: 'This unsubscribe link is invalid or has expired.' },
      });
    }

    if (payload.purpose !== 'unsubscribe' || !payload.sub || !payload.email) {
      return response.status(400).json({
        error: { code: 'INVALID_UNSUBSCRIBE_LINK', message: 'This unsubscribe link is invalid.' },
      });
    }

    const subscriber = await Subscriber.findOne({ _id: payload.sub, email: payload.email });
    if (subscriber) {
      subscriber.status = 'unsubscribed';
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();
    }

    return response.json({
      data: {
        unsubscribed: true,
        message: 'You have been unsubscribed from the mailing list.',
      },
    });
  } catch (error) { return next(error); }
}

async function list(request, response, next) {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 30, 1), 100);
    const filter = {};
    if (request.query.status) filter.status = request.query.status;
    if (request.query.search) filter.$text = { $search: request.query.search };

    const [items, total] = await Promise.all([
      Subscriber.find(filter)
        .sort({ subscribedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Subscriber.countDocuments(filter),
    ]);

    return response.json({
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { return next(error); }
}

module.exports = { list, subscribe, unsubscribe };
