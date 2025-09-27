import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../types';
import { 
  pipe, 
  ifElse, 
  isNil, 
  prop, 
  tryCatch,
  head,
  compose
} from '../utilities/functional.utils';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Functional token extraction and validation
const extractTokenFromHeader = (req: AuthenticatedRequest): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  return parts[1] || null;
};

const validateAndDecodeToken = (token: string): JwtPayload | null =>
  tryCatch(
    () => AuthService.verifyToken(token),
    () => null
  );

const sendUnauthorizedResponse = (res: Response): void => {
  res.status(401).json({ error: 'Access token required' });
};

const sendForbiddenResponse = (res: Response): void => {
  res.status(403).json({ error: 'Invalid or expired token' });
};

const attachUserToRequest = (user: JwtPayload, req: AuthenticatedRequest): void => {
  req.user = user;
};

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = extractTokenFromHeader(req);
  
  if (!token) {
    sendUnauthorizedResponse(res);
    return;
  }

  const decoded = validateAndDecodeToken(token);
  if (decoded) {
    attachUserToRequest(decoded, req);
    next();
  } else {
    sendForbiddenResponse(res);
  }
};