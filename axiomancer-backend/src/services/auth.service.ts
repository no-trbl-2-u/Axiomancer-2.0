import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './database.service';
import { User, UserCreateInput, UserLoginInput, AuthResponse, JwtPayload } from '../types';
import { 
  pipe, 
  pipeAsync, 
  tryCatchAsync, 
  ifElse,
  isNil,
  omit,
  curry,
  prop,
  when,
  compose
} from '../utilities/functional.utils';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  // Functional helpers for auth operations
  private static hashPassword = async (password: string): Promise<string> =>
    bcrypt.hash(password, 10);

  private static comparePasswords = curry(
    async (plainPassword: string, hashedPassword: string): Promise<boolean> =>
      bcrypt.compare(plainPassword, hashedPassword)
  );

  private static createJwtPayload = (user: User): JwtPayload => ({
    userId: user.id,
    email: user.email
  });

  private static sanitizeUser = omit(['password']);

  private static buildAuthResponse = curry(
    (user: User, token: string): AuthResponse => ({
      user: this.sanitizeUser(user),
      token
    })
  );

  private static throwUserExistsError = (): never => {
    throw new Error('User already exists with this email');
  };

  private static throwInvalidCredentialsError = (): never => {
    throw new Error('Invalid credentials');
  };

  static async register(userData: UserCreateInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await DatabaseService.getUserByEmail(userData.email);
      if (existingUser) {
        this.throwUserExistsError();
      }

      // Hash password and create user
      const hashedPassword = await this.hashPassword(userData.password);
      const user = await DatabaseService.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate token and build response
      const token = this.generateToken(this.createJwtPayload(user));
      const { password, ...sanitizedUser } = user;
      return {
        user: sanitizedUser,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials: UserLoginInput): Promise<AuthResponse> {
    try {
      // Find user
      const user = await DatabaseService.getUserByEmail(credentials.email);
      if (!user) {
        this.throwInvalidCredentialsError();
      }

      // Verify password (user is guaranteed to be non-null here)
      const isPasswordValid = await this.comparePasswords(credentials.password, user!.password);
      if (!isPasswordValid) {
        this.throwInvalidCredentialsError();
      }

      // Generate token and build response
      const token = this.generateToken(this.createJwtPayload(user!));
      const { password, ...sanitizedUser } = user!;
      return {
        user: sanitizedUser,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static generateToken = pipe(
    (payload: JwtPayload) => jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions)
  );

  static verifyToken = pipe(
    (token: string) => jwt.verify(token, this.JWT_SECRET) as JwtPayload
  );
}