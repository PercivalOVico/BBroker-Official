import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        currentProfile: 'user' | 'business';
        hasBusinessProfile: boolean;
      };
    }
  }
}

/**
 * Authentication Middleware
 * Checks if user is authenticated and attaches user data to request
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get userId from query (temporary for development) or from session/cookie
    const userId = req.query.userId as string || req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Fetch user from database
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        currentProfile: users.currentProfile,
        hasBusinessProfile: users.hasBusinessProfile,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user if authenticated, but doesn't require it
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.query.userId as string || req.headers['x-user-id'] as string;

    if (userId) {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          currentProfile: users.currentProfile,
          hasBusinessProfile: users.hasBusinessProfile,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}

/**
 * Verify user owns resource
 */
export function requireOwnership(resourceUserIdField: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];

    if (resourceUserId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
}

/**
 * Require business profile
 */
export function requireBusinessProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (!req.user.hasBusinessProfile) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Business profile required',
      needsSetup: true,
    });
  }

  next();
}

/**
 * Require specific profile mode (user or business)
 */
export function requireProfileMode(mode: 'user' | 'business') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (req.user.currentProfile !== mode) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Must be in ${mode} mode to access this resource`,
        currentMode: req.user.currentProfile,
      });
    }

    next();
  };
}
