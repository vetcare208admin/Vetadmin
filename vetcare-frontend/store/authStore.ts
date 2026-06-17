import { create } from 'zustand';
import { authApi } from '../lib/authApi';

interface User {
  id: string;
  email: string;
  role: string;
  branchId?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// Initialize state from localStorage if available
const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getInitialToken = (key: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  accessToken: getInitialToken('accessToken'),
  refreshToken: getInitialToken('refreshToken'),
  isAuthenticated: !!getInitialUser(),
  isLoading: false,
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user, isAuthenticated: !!user });
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Set cookie for middleware (7 days expiry)
    document.cookie = `session_token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    set({ accessToken, refreshToken });
  },
  logout: async () => {
    const refreshToken = get().refreshToken;
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (error) {
        console.error('Failed to logout from server:', error);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Clear cookie
    document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));
