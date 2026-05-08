import mongoose, { Document } from 'mongoose';
import type { User } from '@instareplyer/types';
export interface UserDocument extends Omit<User, '_id'>, Document {
    password: string;
    verificationOtp?: string;
    verificationOtpExpiry?: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
}
export declare const UserModel: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=user.schema.d.ts.map