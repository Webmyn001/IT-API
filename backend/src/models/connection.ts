import mongoose from 'mongoose';
import logger from '../utils/logger';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_api';

  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error: any) {
    logger.error('MongoDB connection error', { message: error.message });
    throw error;
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime error', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
