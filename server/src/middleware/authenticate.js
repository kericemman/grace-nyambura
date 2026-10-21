const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

async function authenticate(request, response, next) {
  const token = request.cookies.grace_access;
  if (!token || !process.env.JWT_ACCESS_SECRET) {
    return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to continue' } });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findOne({ _id: payload.sub, isActive: true }).select('email name role');
    if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to continue' } });
    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Your session has expired' } });
  }
}

function authorize(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' } });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
