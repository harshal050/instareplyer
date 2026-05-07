import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { JWTPayload, UserRole } from '@instareplyer/types';
import { env } from '../../../config/env.js';

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret as Secret, {
    expiresIn: env.jwt.accessExpiresIn as SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.refreshSecret as Secret, {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, env.jwt.accessSecret) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as JWTPayload;
}

export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
