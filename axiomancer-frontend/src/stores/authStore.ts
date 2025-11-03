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
  initAuth: () => void;
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
        isLoading: true,

        // Actions
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        initAuth: () => {
          const token = localStorage.getItem('axiomancer_token');
          const userStr = localStorage.getItem('axiomancer_user');

          if (token && userStr) {
            try {
              const user = JSON.parse(userStr) as User;
              set({ 
                user, 
                token, 
                isAuthenticated: true, 
                isLoading: false 
              });
            } catch (error) {
              localStorage.removeItem('axiomancer_token');
              localStorage.removeItem('axiomancer_user');
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        },

        login: async (credentials: LoginCredentials) => {
          try {
            set({ isLoading: true });
            const response = await authService.login(credentials);

            localStorage.setItem('axiomancer_token', response.token);
            localStorage.setItem('axiomancer_user', JSON.stringify(response.user));

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

            localStorage.setItem('axiomancer_token', response.token);
            localStorage.setItem('axiomancer_user', JSON.stringify(response.user));

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
          localStorage.removeItem('axiomancer_token');
          localStorage.removeItem('axiomancer_user');
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
