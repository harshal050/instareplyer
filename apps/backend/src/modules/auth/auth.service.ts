import bcrypt from 'bcryptjs';
import { UserModel } from '@instareplyer/database';
import type { AuthTokens, User } from '@instareplyer/types';
import { PASSWORD_CONFIG, OTP_CONFIG } from '../../config/constants.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../utils/errors.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
  generateResetToken,
  hashToken,
  verifyRefreshToken,
} from './utils/token.utils.js';
import type {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.validation.js';

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user exists
    const existingUser = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, PASSWORD_CONFIG.saltRounds);

    // Generate OTP for email verification
    const otp = generateOTP(OTP_CONFIG.length);
    const otpExpiry = new Date(Date.now() + OTP_CONFIG.expiresIn);

    // Create user
    const user = await UserModel.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
      verificationOtp: otp,
      verificationOtpExpiry: otpExpiry,
    });

    // TODO: Send verification email with OTP
    // await emailService.sendVerificationEmail(user.email, otp);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Return user without sensitive fields
    const userResponse = this.sanitizeUser(user);

    return { user: userResponse, tokens };
  }

  async login(data: LoginInput): Promise<{ user: User; tokens: AuthTokens }> {
    // Find user with password field
    const user = await UserModel.findOne({ email: data.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Return user without sensitive fields
    const userResponse = this.sanitizeUser(user);

    return { user: userResponse, tokens };
  }

  async verifyEmail(data: VerifyEmailInput): Promise<User> {
    const user = await UserModel.findOne({
      email: data.email.toLowerCase(),
    }).select('+verificationOtp +verificationOtpExpiry');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestError('Email is already verified');
    }

    if (!user.verificationOtp || !user.verificationOtpExpiry) {
      throw new BadRequestError('No verification OTP found. Please request a new one.');
    }

    if (new Date() > user.verificationOtpExpiry) {
      throw new BadRequestError('OTP has expired. Please request a new one.');
    }

    if (user.verificationOtp !== data.otp) {
      throw new BadRequestError('Invalid OTP');
    }

    // Update user
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiry = undefined;
    await user.save();

    return this.sanitizeUser(user);
  }

  async resendVerificationOtp(email: string): Promise<void> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    if (user.isVerified) {
      throw new BadRequestError('Email is already verified');
    }

    // Generate new OTP
    const otp = generateOTP(OTP_CONFIG.length);
    const otpExpiry = new Date(Date.now() + OTP_CONFIG.expiresIn);

    user.verificationOtp = otp;
    user.verificationOtpExpiry = otpExpiry;
    await user.save();

    // TODO: Send verification email
    // await emailService.sendVerificationEmail(user.email, otp);
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = hashedToken;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // TODO: Send password reset email
    // await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(data: ResetPasswordInput): Promise<void> {
    const hashedToken = hashToken(data.token);

    const user = await UserModel.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.password, PASSWORD_CONFIG.saltRounds);

    // Update user
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = verifyRefreshToken(refreshToken);

      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  private generateTokens(user: { _id: unknown; email: string; role: string }): AuthTokens {
    const payload = {
      userId: String(user._id),
      email: user.email,
      role: user.role as 'user' | 'admin' | 'super_admin',
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
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

export const authService = new AuthService();
