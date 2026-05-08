import mongoose, { Document, Types } from 'mongoose';
import type { ActivityLog } from '@instareplyer/types';
export interface ActivityLogDocument extends Omit<ActivityLog, '_id' | 'userId' | 'campaignId'>, Document {
    userId: Types.ObjectId;
    campaignId?: Types.ObjectId;
}
export declare const ActivityLogModel: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=activity-log.schema.d.ts.map