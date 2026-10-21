const express = require('express');
const multer = require('multer');
const { overview } = require('../controllers/adminOverview.controller');
const { authenticate, authorize } = require('../middleware/authenticate');
const { requireCsrf } = require('../middleware/requireCsrf');
const { articles, caseStudies } = require('../controllers/content.controller');
const media = require('../controllers/media.controller');
const testimonials = require('../controllers/testimonial.controller');
const settings = require('../controllers/settings.controller');
const enquiries = require('../controllers/enquiry.controller');
const partnershipApplications = require('../controllers/partnershipApplication.controller');
const subscribers = require('../controllers/subscriber.controller');

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
  fileFilter: (_request, file, callback) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!allowed.has(file.mimetype)) {
      const error = new Error('Upload a JPEG, PNG, WebP, or GIF image');
      error.status = 400;
      error.code = 'INVALID_IMAGE_TYPE';
      return callback(error);
    }
    return callback(null, true);
  },
});

const adminRouter = express.Router();

adminRouter.use(authenticate, authorize('admin', 'editor'));
adminRouter.get('/overview', overview);
adminRouter.get('/enquiries', enquiries.list);
adminRouter.get('/enquiries/:id', enquiries.get);
adminRouter.put('/enquiries/:id', requireCsrf, enquiries.update);
adminRouter.get('/partnership-applications', partnershipApplications.list);
adminRouter.put(
  '/partnership-applications/:id',
  requireCsrf,
  partnershipApplications.update,
);
adminRouter.get('/subscribers', subscribers.list);
adminRouter.get('/media', media.list);
adminRouter.post('/media', requireCsrf, imageUpload.array('images', 10), media.upload);
adminRouter.post('/media/editor-image', requireCsrf, imageUpload.single('image'), media.uploadInlineImage);
adminRouter.put('/media/:id', requireCsrf, media.update);
adminRouter.post('/media/:id/replace', requireCsrf, imageUpload.single('image'), media.replace);
adminRouter.delete('/media/:id', requireCsrf, media.remove);
adminRouter.get('/articles', articles.list);
adminRouter.get('/articles/:id', articles.get);
adminRouter.post('/articles', requireCsrf, articles.create);
adminRouter.put('/articles/:id', requireCsrf, articles.update);
adminRouter.delete('/articles/:id', requireCsrf, articles.remove);
adminRouter.get('/case-studies', caseStudies.list);
adminRouter.get('/case-studies/:id', caseStudies.get);
adminRouter.post('/case-studies', requireCsrf, caseStudies.create);
adminRouter.put('/case-studies/:id', requireCsrf, caseStudies.update);
adminRouter.delete('/case-studies/:id', requireCsrf, caseStudies.remove);
adminRouter.get('/testimonials', testimonials.list);
adminRouter.get('/testimonials/:id', testimonials.get);
adminRouter.post('/testimonials', requireCsrf, testimonials.create);
adminRouter.put('/testimonials/:id', requireCsrf, testimonials.update);
adminRouter.delete('/testimonials/:id', requireCsrf, testimonials.remove);
adminRouter.post('/testimonial-requests', requireCsrf, testimonials.createRequest);
adminRouter.get('/settings', settings.getSettings);
adminRouter.put('/settings', requireCsrf, authorize('admin'), settings.updateSettings);
adminRouter.get('/profile', settings.getProfile);
adminRouter.put('/profile', requireCsrf, settings.updateProfile);
adminRouter.put('/profile/password', requireCsrf, settings.updatePassword);

module.exports = { adminRouter };
