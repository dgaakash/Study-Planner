const app = require('../server/server');
const { connectDB } = require('../server/config/db');

// Cache the DB connection promise across warm invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  // Let Express handle the request
  return app(req, res);
};
