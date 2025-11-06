import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

export const authRoutes = Router();

// Public routes
authRoutes.post('/register', (req, res, next) => void AuthController.register(req, res, next));
authRoutes.post('/login', (req, res, next) => void AuthController.login(req, res, next));

// Protected routes
authRoutes.get('/profile', authenticateToken, (req, res, next) => AuthController.profile(req, res, next));