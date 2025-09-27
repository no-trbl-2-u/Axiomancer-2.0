import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCreateInput, UserLoginInput, JwtPayload } from '../types';
import { 
  pipe, 
  pipeAsync, 
  tryCatchAsync, 
  ifElse,
  prop,
  curry,
  when
} from '../utilities/functional.utils';
import { validateRegistrationData, validateLoginData } from '../utilities/validation.utils';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export class AuthController {
  // Functional helper for response handling
  private static sendResponse = curry(
    (statusCode: number, data: any, res: Response): void => {
      res.status(statusCode).json(data);
    }
  );

  private static sendSuccess = this.sendResponse(201);
  private static sendError = (error: Error, res: Response): void => {
    const statusCode = error.message === 'User already exists with this email' ? 409 : 400;
    res.status(statusCode).json({ error: error.message });
  };

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const processRegistration = pipeAsync(
      () => Promise.resolve(prop('body', req) as UserCreateInput),
      (userData: UserCreateInput) => Promise.resolve(validateRegistrationData(userData)),
      AuthService.register,
      (result) => Promise.resolve(AuthController.sendSuccess(result, res))
    );

    await tryCatchAsync(
      () => processRegistration(),
      async (error: Error) => {
        if (error.message.includes('Validation failed') || 
            error.message === 'User already exists with this email') {
          AuthController.sendError(error, res);
        } else {
          next(error);
        }
        return Promise.resolve();
      }
    );
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const processLogin = pipeAsync(
      () => Promise.resolve(prop('body', req) as UserLoginInput),
      (credentials: UserLoginInput) => Promise.resolve(validateLoginData(credentials)),
      AuthService.login,
      (result) => Promise.resolve(res.status(200).json(result))
    );

    await tryCatchAsync(
      () => processLogin(),
      async (error: Error) => {
        if (error.message.includes('Validation failed')) {
          res.status(400).json({ error: error.message });
        } else if (error.message === 'Invalid credentials') {
          res.status(401).json({ error: error.message });
        } else {
          next(error);
        }
        return Promise.resolve();
      }
    );
  }

  static async profile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = prop('user', req);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}