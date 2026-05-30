import app from './app';
import logger from './utils/logger';
import { connectDB, User } from './models';
import { aiCollector } from './services/ai-collector';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function start() {
  try {
    await connectDB();

    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        email: 'admin@internshipapi.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
      });
      logger.info('Default admin created: admin@internshipapi.com / admin123');
    }
  } catch (error: any) {
    logger.warn('Database setup warning', { message: error.message });
  }

  if (process.env.NODE_ENV !== 'test') {
    aiCollector.startScheduler().catch((err) =>
      logger.error('Failed to start AI collector scheduler', { error: err.message })
    );
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`API available at http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
  });

  const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    aiCollector.stop();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start();

export default app;
