const bcrypt = require('bcryptjs');
const { SiteSetting } = require('../models/SiteSetting');
const { User } = require('../models/User');
const { passwordSchema, profileSchema, settingsSchema } = require('../validation/settings.validation');

async function getSettings(_request, response, next) {
  try {
    const settings = await SiteSetting.findOneAndUpdate({ key: 'primary' }, { $setOnInsert: { key: 'primary' } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return response.json({ data: settings });
  } catch (error) { return next(error); }
}

async function getPublicSettings(_request, response, next) {
  try {
    const settings = await SiteSetting.findOne({ key: 'primary' }).select('-key -updatedBy -createdAt -updatedAt -__v').lean();
    return response.json({ data: settings ?? {} });
  } catch (error) { return next(error); }
}

async function updateSettings(request, response, next) {
  try {
    const parsed = settingsSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    const settings = await SiteSetting.findOneAndUpdate({ key: 'primary' }, { ...parsed.data, updatedBy: request.user.id }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    return response.json({ data: settings });
  } catch (error) { return next(error); }
}

async function getProfile(request, response) {
  return response.json({ data: { id: request.user.id, name: request.user.name, email: request.user.email, role: request.user.role } });
}

async function updateProfile(request, response, next) {
  try {
    const parsed = profileSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    const duplicate = await User.findOne({ email: parsed.data.email, _id: { $ne: request.user.id } });
    if (duplicate) return response.status(409).json({ error: { code: 'EMAIL_IN_USE', message: 'That email address is already in use' } });
    const user = await User.findByIdAndUpdate(request.user.id, parsed.data, { new: true, runValidators: true });
    return response.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { return next(error); }
}

async function updatePassword(request, response, next) {
  try {
    const parsed = passwordSchema.safeParse(request.body);
    if (!parsed.success) return validationError(parsed, response);
    const user = await User.findById(request.user.id).select('+passwordHash +refreshTokenHash');
    if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) return response.status(400).json({ error: { code: 'PASSWORD_INCORRECT', message: 'The current password is incorrect' } });
    user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    user.refreshTokenHash = undefined;
    await user.save();
    return response.json({ data: { passwordUpdated: true } });
  } catch (error) { return next(error); }
}

function validationError(parsed, response) { return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message, details: parsed.error.issues } }); }
module.exports = { getProfile, getPublicSettings, getSettings, updatePassword, updateProfile, updateSettings };
