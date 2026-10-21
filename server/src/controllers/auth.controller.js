const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
const { loginSchema } = require('../validation/auth.validation');

const isProduction = () => process.env.NODE_ENV === 'production';
const baseCookie = () => ({ httpOnly: true, secure: isProduction(), sameSite: 'strict', path: '/' });
const csrfCookie = () => ({
  secure: isProduction(),
  sameSite: 'strict',
  path: '/',
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
});

function setAuthCookies(response, accessToken, refreshToken) {
  response.cookie('grace_access', accessToken, { ...baseCookie(), maxAge: 15 * 60 * 1000 });
  response.cookie('grace_refresh', refreshToken, { ...baseCookie(), path: '/api/v1/auth', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

async function login(request, response, next) {
  try {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enter a valid email and password' } });
    }

    const result = await authService.login(parsed.data);
    const csrfToken = crypto.randomBytes(32).toString('hex');
    setAuthCookies(response, result.accessToken, result.refreshToken);
    response.cookie('grace_csrf', csrfToken, csrfCookie());
    return response.json({ data: { user: result.user, csrfToken } });
  } catch (error) {
    return next(error);
  }
}

async function refresh(request, response, next) {
  try {
    const result = await authService.refresh(request.cookies.grace_refresh);
    if (!result) {
      return response.status(401).json({ error: { code: 'REFRESH_INVALID', message: 'Sign in again to continue' } });
    }
    setAuthCookies(response, result.accessToken, result.refreshToken);
    return response.json({ data: { user: result.user } });
  } catch (error) {
    return next(error);
  }
}

async function session(request, response, next) {
  try {
    const user = await authService.getSession(request.cookies.grace_access);
    if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Your session has expired' } });
    return response.json({ data: { user } });
  } catch (error) {
    return next(error);
  }
}

async function logout(request, response, next) {
  try {
    const token = request.cookies.grace_access;
    let userId;
    if (token && process.env.JWT_ACCESS_SECRET) {
      try { userId = jwt.verify(token, process.env.JWT_ACCESS_SECRET).sub; } catch { userId = undefined; }
    }
    await authService.logout(userId);
    response.clearCookie('grace_access', baseCookie());
    response.clearCookie('grace_refresh', { ...baseCookie(), path: '/api/v1/auth' });
    response.clearCookie('grace_csrf', csrfCookie());
    return response.json({ data: { signedOut: true } });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, logout, refresh, session };
