import type { RequestHandler } from 'express';
import { connectMongoDB } from '@instareplyer/database';
import app from '../src/app.js';
import logger from '../src/utils/logger.js';

let mongoConnection: Promise<void> | null = null;

const ensureMongoDB = async () => {
  mongoConnection ??= connectMongoDB().catch((error) => {
    mongoConnection = null;
    throw error;
  });

  await mongoConnection;
};

const handler: RequestHandler = async (req, res, next) => {
  try {
    await ensureMongoDB();
    app(req, res, next);
  } catch (error) {
    logger.error('Failed to initialize backend request', error);
    next(error);
  }
};

export default handler;
