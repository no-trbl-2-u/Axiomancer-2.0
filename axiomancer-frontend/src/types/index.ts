/**
 * User information (client-side)
 * Note: This type is shared between frontend and backend
 * Backend includes 'password' field which is never sent to frontend
 * Backend uses Date types which are serialized to string in JSON
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Frontend authentication state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Login credentials payload
 * Note: Corresponds to UserLoginInput on backend
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data payload
 * Note: Corresponds to UserCreateInput on backend
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Authentication response from server
 * Note: This type is shared between frontend and backend - keep in sync!
 */
export interface AuthResponse {
  user: User;
  token: string;
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