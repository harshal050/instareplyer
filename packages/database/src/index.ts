// Database connections
export { connectMongoDB, disconnectMongoDB, mongoose } from './mongodb';
export {
  getRedisClient,
  disconnectRedis,
  setCache,
  getCache,
  deleteCache,
  clearCachePattern,
} from './redis';

// Schemas
export { UserModel, type UserDocument } from './schemas/user.schema';
export { CampaignModel, type CampaignDocument } from './schemas/campaign.schema';
export {
  InstagramAccountModel,
  type InstagramAccountDocument,
} from './schemas/instagram-account.schema';
export { ActivityLogModel, type ActivityLogDocument } from './schemas/activity-log.schema';
