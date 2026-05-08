import mongoose, { Document, Types } from 'mongoose';
import type { InstagramAccount } from '@instareplyer/types';
export interface InstagramAccountDocument extends Omit<InstagramAccount, '_id' | 'userId'>, Document {
    userId: Types.ObjectId;
}
export declare const InstagramAccountModel: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=instagram-account.schema.d.ts.map