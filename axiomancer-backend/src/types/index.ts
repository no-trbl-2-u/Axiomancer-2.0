export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  stack?: string;
}