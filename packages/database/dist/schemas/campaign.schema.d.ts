import mongoose, { Document, Types } from 'mongoose';
import type { Campaign } from '@instareplyer/types';
export interface CampaignDocument extends Omit<Campaign, '_id' | 'userId' | 'instagramAccountId'>, Document {
    userId: Types.ObjectId;
    instagramAccountId: Types.ObjectId;
}
export declare const CampaignModel: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=campaign.schema.d.ts.map