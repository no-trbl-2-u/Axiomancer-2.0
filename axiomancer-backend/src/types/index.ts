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

/**
 * Database row type for character states
 */
export interface CharacterStateRow {
  id: number;
  user_id: number;
  character_data: string;
  current_location: string;
  current_node: string;
  story_data: string;
  inventory_data: string;
  locations_data: string;
  quest_log_data: string;
  map_energy: number;
  max_map_energy: number;
  game_phase: string;
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Database row type for users
 */
export interface UserRow {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Character state type
 */
export interface CharacterState {
  character: Record<string, unknown>;
  currentLocation: string;
  currentNode: string;
  story: Record<string, unknown>;
  inventory: Record<string, unknown>;
  locations: Record<string, unknown>;
  questLog: Record<string, unknown>;
  mapEnergy: number;
  maxMapEnergy: number;
  gamePhase: string;
  savedAt: number;
}