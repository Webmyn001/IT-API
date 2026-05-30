import mongoose from 'mongoose';
import logger from '../utils/logger';

let cachedClient: typeof mongoose | null = null;

export async function connectDB(): Promise<void> {
  if (cachedClient) return;
  if (mongoose.connection.readyState >= 1) {
    cachedClient = mongoose;
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_api';

  try {
    cachedClient = await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error: any) {
    logger.error('MongoDB connection error', { message: error.message });
    throw error;
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime error', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    cachedClient = null;
    logger.warn('MongoDB disconnected');
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
