import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

export const authRoutes = Router();

// Public routes
authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);

// Protected routes
authRoutes.get('/profile', authenticateToken, AuthController.profile);