function requireCsrf(request, response, next) {
  const cookieToken = request.cookies.grace_csrf;
  const headerToken = request.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return response.status(403).json({ error: { code: 'CSRF_INVALID', message: 'The security token is invalid' } });
  }

  return next();
}

module.exports = { requireCsrf };
