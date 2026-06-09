import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { resolveRoleHomePath } from '../utils/navigation';

const AuthContext = createContext(null);

function AuthProviderInner({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authService.getStoredUser());

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login: async (credentials) => {
        const loggedIn = await authService.login(credentials);
        setUser(loggedIn);
        return loggedIn;
      },
      logout: () => {
        authService.logout();
        setUser(null);
        navigate('/');
      },
      updateUser: (updates) => {
        const updated = authService.updateStoredUser(updates);
        if (updated) setUser(updated);
        return updated;
      },
      homePath: user ? resolveRoleHomePath(user) : '/',
    }),
    [user, navigate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  return <AuthProviderInner>{children}</AuthProviderInner>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
