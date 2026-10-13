const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exammap';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[ExamMap] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[ExamMap] Local/Remote MongoDB at ${uri} was unreachable (${err.message}).`);
    console.log('[ExamMap] Launching embedded MongoDB Memory Server for seamless college demo...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 60000,
        },
      });
      const memoryUri = memoryServerInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[ExamMap] Embedded In-Memory MongoDB Connected successfully at: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('[ExamMap] Embedded MongoMemoryServer launch failed:', memErr.message);
      // Re-throw so server or fallback can respond
      throw memErr;
    }
  }
};

module.exports = connectDB;
