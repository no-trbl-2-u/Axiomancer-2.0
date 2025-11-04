/**
 * User model (server-side)
 * Note: Frontend User type does NOT include password field
 * Frontend uses string for dates (JSON serialization), backend uses Date
 */
export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User creation input payload
 * Note: Corresponds to RegisterData on frontend
 */
export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * User login input payload
 * Note: Corresponds to LoginCredentials on frontend
 */
export interface UserLoginInput {
  email: string;
  password: string;
}

/**
 * Authentication response
 * Note: This type is shared between frontend and backend - keep in sync!
 */
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

/**
 * JWT payload structure (backend only)
 */
export interface JwtPayload {
  userId: number;
  email: string;
}

/**
 * Standard API error response
 * Note: This type is shared between frontend and backend - keep in sync!
 */
export interface ApiError {
  message: string;
  statusCode: number;
  stack?: string;
}