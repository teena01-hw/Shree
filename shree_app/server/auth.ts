import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { loadDatabaseConfig } from './config.ts';
import { findUserById, UserRecord } from './db.ts';

export interface JwtTokenPayload {
  sub: number;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
  tokenPayload?: JwtTokenPayload;
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const config = loadDatabaseConfig();
  const saltRounds = config.security.bcryptSaltRounds || 12;
  return bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

export function generateJwtToken(user: UserRecord): string {
  const config = loadDatabaseConfig();
  const payload: JwtTokenPayload = {
    sub: user.id,
    username: user.username,
    email: user.email,
  };

  const secret = config.jwt.secret;
  const expiresIn = config.jwt.expiresIn || '24h';

  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    algorithm: (config.jwt.algorithm as jwt.Algorithm) || 'HS256',
  });
}

export function verifyJwtToken(token: string): JwtTokenPayload {
  const config = loadDatabaseConfig();
  const secret = config.jwt.secret;
  return jwt.verify(token, secret) as unknown as JwtTokenPayload;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header. Expected Bearer token format.',
    });
    return;
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = verifyJwtToken(token);
    req.tokenPayload = payload;

    // Fetch user from PostgreSQL
    const user = await findUserById(payload.sub);
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'The user belonging to this token no longer exists in PostgreSQL database.',
      });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'This user account has been deactivated.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({
      error: 'Unauthorized',
      message: `Invalid or expired session token: ${err.message}`,
    });
    return;
  }
}

export function sanitizeUser(user: UserRecord) {
  return {
    id: user.id,
    tenant_id: user.tenant_id,
    username: user.username,
    email: user.email,
    contact_email: user.contact_email || user.email,
    designation: user.designation || 'Business Owner',
    phone: user.phone || null,
    full_name: user.full_name,
    role: user.role || 'admin',
    schema_name: user.schema_name,
    tenant_name: user.tenant_name,
    tenant_slug: user.tenant_slug,
    tenant_plan: user.tenant_plan || 'Starter',
    tenant_plan_status: user.tenant_plan_status || 'active',
    is_active: user.is_active,
    created_at: user.created_at,
    last_login: user.last_login,
  };
}
