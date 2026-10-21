const mongoose = require('mongoose');

async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGO_URI is required to start the application');
  await mongoose.connect(uri);
}

module.exports = { connectDatabase };

