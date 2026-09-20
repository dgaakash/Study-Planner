const mongoose = require('mongoose');

let mongoMemoryServerInstance = null;
let usingInMemory = false;

const connectDB = async () => {
  const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studybloom';

  // 1. Try connecting to the configured MongoDB URI (local or Atlas)
  try {
    const conn = await mongoose.connect(defaultUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`🌸 MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (localErr) {
    // If user specified a remote Atlas URI, don't fallback — show the real error
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('127.0.0.1') && !process.env.MONGODB_URI.includes('localhost')) {
      throw localErr;
    }
    console.log('⚠️  Local MongoDB not detected on port 27017.');
  }

  // 2. Fallback to In-Memory MongoDB for zero-setup demo
  console.log('🚀 Starting built-in In-Memory MongoDB for instant demo...');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoMemoryServerInstance = await MongoMemoryServer.create();
  const memoryUri = mongoMemoryServerInstance.getUri();

  await mongoose.connect(memoryUri);
  usingInMemory = true;
  console.log('🌸 MongoDB Connected (In-Memory Demo Mode)');
};

const isUsingInMemory = () => usingInMemory;

module.exports = { connectDB, isUsingInMemory };
