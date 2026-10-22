const express = require('express');
const multer = require('multer');
const { rateLimit } = require('express-rate-limit');
const {
  articleBySlug,
  articleList,
  caseStudyBySlug,
  caseStudyList,
  sitemap,
} = require('../controllers/publicContent.controller');
const testimonials = require('../controllers/testimonial.controller');
const { getPublicSettings } = require('../controllers/settings.controller');
const enquiries = require('../controllers/enquiry.controller');
const partnershipApplications = require('../controllers/partnershipApplication.controller');
const subscribers = require('../controllers/subscriber.controller');
const seo = require('../controllers/seo.controller');

const publicContentRouter = express.Router();
const submissionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false });
const enquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
const partnershipLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
const subscriptionLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false });
const testimonialImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.mimetype)) {
      const error = new Error('Upload a JPEG, PNG, or WebP image');
      error.status = 400;
      error.code = 'INVALID_IMAGE_TYPE';
      return callback(error);
    }
    return callback(null, true);
  },
});
publicContentRouter.get('/articles', articleList);
publicContentRouter.get('/articles/:slug', articleBySlug);
publicContentRouter.get('/case-studies', caseStudyList);
publicContentRouter.get('/case-studies/:slug', caseStudyBySlug);
publicContentRouter.get('/sitemap.xml', sitemap);
publicContentRouter.get('/seo/articles/:slug', seo.article);
publicContentRouter.get('/seo/case-studies/:slug', seo.caseStudy);
publicContentRouter.get('/testimonials', testimonials.published);
publicContentRouter.get('/testimonial-requests/:token', submissionLimiter, testimonials.requestDetails);
publicContentRouter.post(
  '/testimonial-requests/:token',
  submissionLimiter,
  testimonialImageUpload.single('photo'),
  testimonials.submitRequest,
);
publicContentRouter.get('/settings', getPublicSettings);
publicContentRouter.post('/enquiries', enquiryLimiter, enquiries.submit);
publicContentRouter.post(
  '/partnership-applications',
  partnershipLimiter,
  partnershipApplications.submit,
);
publicContentRouter.post('/subscribers', subscriptionLimiter, subscribers.subscribe);
publicContentRouter.post('/subscribers/unsubscribe', subscriptionLimiter, subscribers.unsubscribe);

module.exports = { publicContentRouter };
