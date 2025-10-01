import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { useAuthStore } from '../stores/authStore';

/**
 * DEPRECATED: This context is now a wrapper around the Zustand store
 * Use useAuthStore() directly in new code
 */

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider now uses Zustand store internally
 * This maintains backward compatibility while migrating to Zustand
 */
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  // Get all state and actions from Zustand store
  const store = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    store.initAuth();
  }, []);

  // Context value that wraps the Zustand store
  const value: AuthContextType = {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use the auth context
 * @deprecated Use useAuthStore() directly for better performance
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
