import { create } from 'zustand';
import { authAPI } from '../services/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const getUserFromToken = (): User | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      usuarioId: payload.nameid || payload.sub || '',
      username: payload.unique_name || payload.name || '',
      role: payload.role || '',
    };
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const user = getUserFromToken();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        authAPI.logout();
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials: LoginRequest) => {
    const response = await authAPI.login(credentials);
    const user: User = {
      usuarioId: response.usuarioId,
      username: response.username,
      role: response.role,
    };
    set({ user, isAuthenticated: true });
  },

  register: async (request: RegisterRequest) => {
    const response = await authAPI.register(request);
    const user: User = {
      usuarioId: response.usuarioId,
      username: response.username,
      role: response.role,
    };
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    authAPI.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

