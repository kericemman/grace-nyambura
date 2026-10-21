const express = require('express');
const { rateLimit } = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const { requireCsrf } = require('../middleware/requireCsrf');

const authRouter = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'LOGIN_RATE_LIMITED', message: 'Too many sign-in attempts. Try again later.' } },
});

authRouter.post('/login', loginLimiter, authController.login);
authRouter.get('/session', authController.session);
authRouter.post('/refresh', requireCsrf, authController.refresh);
authRouter.post('/logout', requireCsrf, authController.logout);

module.exports = { authRouter };
