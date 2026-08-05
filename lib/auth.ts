import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-only';
export const SALT_ROUNDS = 10;

export type AuthRole = 'user' | 'master' | 'super_admin';

export interface JwtPayload {
  userId: string;
  phone: string;
  role: AuthRole;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateRefreshToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const REFRESH_COOKIE_NAME = 'aisahl_refresh_token';
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth',
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

export const ACCESS_COOKIE_NAME = 'aisahl_access_token';
export const ACCESS_TOKEN_MAX_AGE = 15 * 60;

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: ACCESS_TOKEN_MAX_AGE,
};
