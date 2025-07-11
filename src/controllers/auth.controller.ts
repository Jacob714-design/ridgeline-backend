import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      
      // Set session cookie
      res.cookie('sessionToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('sessionToken');
    res.json({ message: 'Logged out successfully' });
  }
}

export const authController = new AuthController();