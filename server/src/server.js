require('dotenv').config();
const { createApp } = require('./app');
const { getEnv } = require('./config/env');
const { connectDatabase } = require('./config/database');

async function start() {
  const env = getEnv();
  await connectDatabase(env.MONGO_URI);
  const app = createApp({ clientOrigin: env.CLIENT_ORIGIN });
  const server = app.listen(env.PORT, env.HOST, () => {
    console.log(`API listening on ${env.HOST}:${env.PORT}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received; shutting down`);
    server.close(async () => {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  }

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

start().catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exit(1);
});

