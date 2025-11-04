import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/auth.service';

/**
 * Auth Store State Interface
 * All authentication mechanics are UI-agnostic and live here
 */
interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Auth Store Implementation using Zustand
 * All authentication mechanics are UI-agnostic and contained in this store
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false, // Changed to false - Zustand persist will handle hydration

        // Actions
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        login: async (credentials: LoginCredentials) => {
          try {
            set({ isLoading: true });
            const response = await authService.login(credentials);

            // Zustand persist middleware will automatically save to localStorage
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        register: async (data: RegisterData) => {
          try {
            set({ isLoading: true });
            const response = await authService.register(data);

            // Zustand persist middleware will automatically save to localStorage
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          // Zustand persist middleware will automatically clear localStorage
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        },
      }),
      {
        name: 'axiomancer-auth-store',
        // Only persist essential auth data
        partialize: (store) => ({
          user: store.user,
          token: store.token,
          isAuthenticated: store.isAuthenticated,
        }),
      }
    ),
    {
      name: 'axiomancer-auth-store',
    }
  )
);
