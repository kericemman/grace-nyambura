const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

function requireSecrets() {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    const error = new Error('Authentication is not configured');
    error.status = 503;
    error.code = 'AUTH_NOT_CONFIGURED';
    throw error;
  }

  return { accessSecret, refreshSecret };
}

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function createTokens(user, accessSecret, refreshSecret) {
  const payload = { sub: user.id, role: user.role };
  return {
    accessToken: jwt.sign(payload, accessSecret, { expiresIn: '15m' }),
    refreshToken: jwt.sign({ ...payload, nonce: crypto.randomUUID() }, refreshSecret, { expiresIn: '7d' }),
  };
}

async function login({ email, password }) {
  const { accessSecret, refreshSecret } = requireSecrets();
  const user = await User.findOne({ email }).select('+passwordHash +refreshTokenHash');
  const validPassword = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !validPassword || !user.isActive) {
    const error = new Error('The email or password is incorrect');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const { accessToken, refreshToken } = createTokens(user, accessSecret, refreshSecret);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  user.lastLoginAt = new Date();
  await user.save();

  return { accessToken, refreshToken, user: publicUser(user) };
}

async function refresh(refreshToken) {
  if (!refreshToken) return null;
  const { accessSecret, refreshSecret } = requireSecrets();

  try {
    const payload = jwt.verify(refreshToken, refreshSecret);
    const user = await User.findOne({ _id: payload.sub, isActive: true }).select('+refreshTokenHash');
    if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) return null;

    const tokens = createTokens(user, accessSecret, refreshSecret);
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
    await user.save();
    return { ...tokens, user: publicUser(user) };
  } catch {
    return null;
  }
}

async function getSession(accessToken) {
  if (!accessToken) return null;
  const { accessSecret } = requireSecrets();

  try {
    const payload = jwt.verify(accessToken, accessSecret);
    const user = await User.findOne({ _id: payload.sub, isActive: true });
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}

async function logout(userId) {
  if (userId) await User.updateOne({ _id: userId }, { $unset: { refreshTokenHash: 1 } });
}

module.exports = { getSession, login, logout, refresh };
