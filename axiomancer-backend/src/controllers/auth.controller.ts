import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCreateInput, UserLoginInput, JwtPayload } from '../types';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: UserCreateInput = req.body;
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const result = await AuthService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists with this email') {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: UserLoginInput = req.body;
      
      // Basic validation
      if (!credentials.email || !credentials.password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await AuthService.login(credentials);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  static async profile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // This would typically fetch the full user profile
      // For now, we'll just return the authenticated user info
      res.status(200).json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
}