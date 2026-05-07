import app from './app.js';
import { env } from './config/env.js';
import { connectMongoDB } from '@instareplyer/database';
import { instagramService } from './modules/instagram/instagram.service.js';
import logger from './utils/logger.js';

async function startServer() {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectMongoDB();

    // Start the server
    const server = app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
    });

    instagramService.startCommentPolling();

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      instagramService.stopCommentPolling();
      
      server.close(async () => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force close after 30s
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
