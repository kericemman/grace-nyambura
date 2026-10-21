require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDatabase } = require('../config/database');
const { User } = require('../models/User');

async function bootstrapAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!process.env.MONGO_URI || !email || !password || password.length < 12) {
    throw new Error('MONGO_URI, BOOTSTRAP_ADMIN_EMAIL, and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters are required');
  }

  await connectDatabase(process.env.MONGO_URI);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin account already exists; no changes made.');
    return;
  }

  await User.create({
    email,
    name: 'Grace Nyambura',
    passwordHash: await bcrypt.hash(password, 12),
    role: 'admin',
  });
  console.log('Admin account created.');
}

bootstrapAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  });
