import bcrypt from 'bcryptjs';
import { UserModel } from '@instareplyer/database';
import type { User } from '@instareplyer/types';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { PASSWORD_CONFIG } from '../../config/constants.js';

export class UserService {
  async getById(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(
    userId: string,
    data: { name?: string; avatar?: string }
  ): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateSettings(
    userId: string,
    settings: Partial<User['settings']>
  ): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.settings = { ...user.settings, ...settings };
    await user.save();

    return this.sanitizeUser(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_CONFIG.saltRounds);
    user.password = hashedPassword;
    await user.save();
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Soft delete
    user.deletedAt = new Date();
    await user.save();
  }

  private sanitizeUser(user: Record<string, unknown>): User {
    const obj = typeof user.toObject === 'function' ? user.toObject() : user;
    const { password, verificationOtp, verificationOtpExpiry, resetToken, resetTokenExpiry, __v, ...sanitized } = obj;
    return {
      ...sanitized,
      _id: String(sanitized._id),
    } as User;
  }
}

export const userService = new UserService();
