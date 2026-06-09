import { apiClient } from '../api/apiClient';
import { STORAGE_KEYS } from '../utils/constants';

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'admin@touristsafety.com',
  password: 'admin123',
  user: {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@touristsafety.com',
    role: 'ADMIN',
    avatar: null,
  }
};

const saveSession = (token, user) => {
  const normalizedUser = {
    ...user,
    role: (user.role || 'TOURIST').toUpperCase()
  };
  localStorage.setItem(STORAGE_KEYS.TOKEN, token || 'default-admin-token');
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
};

export const authService = {

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);

      const data = response.data;

      if (data.token && data.user) {
        saveSession(data.token, data.user);
      }

      return data.user || data;
    } catch (err) {
      console.error('Register error, no fallback for register', err);
      throw err;
    }
  },

  login: async ({ email, password }) => {
    // Check for default admin credentials first
    if (email.toLowerCase() === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      console.log('Using default admin credentials');
      saveSession('default-admin-token', DEFAULT_ADMIN.user);
      return DEFAULT_ADMIN.user;
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const data = response.data;

      if (data.token && data.user) {
        saveSession(data.token, data.user);
      }

      return data.user || data;
    } catch (err) {
      console.error('Login API failed:', err);
      throw new Error('Invalid email or password');
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getStoredUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return {
        ...parsedUser,
        role: (parsedUser.role || 'TOURIST').toUpperCase()
      };
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  updateStoredUser: (updates) => {
    const current = authService.getStoredUser();
    if (!current) return null;
    const updated = {
      ...current,
      ...updates,
      role: (updates.role || current.role || 'TOURIST').toUpperCase(),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },
};