import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './database.service';
import { User, UserCreateInput, UserLoginInput, AuthResponse, JwtPayload } from '../types';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  static async register(userData: UserCreateInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await DatabaseService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user
    const user = await DatabaseService.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken({ userId: user.id, email: user.email });

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  static async login(credentials: UserLoginInput): Promise<AuthResponse> {
    // Find user
    const user = await DatabaseService.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken({ userId: user.id, email: user.email });

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
  }

  private static sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}