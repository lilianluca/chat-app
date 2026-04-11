import { useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '@/lib';
import type { LoginCredentials, AuthContextType } from '@/features/auth/types';
import type { User } from '@/features/users/types';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/axios';
import { AuthContext } from './AuthContext';

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (token) {
        try {
          // If we have a token, fetch the user profile.
          // Note: If the token is expired, our Axios interceptor will automatically
          // pause this, refresh the token, and try again!
          const { data } = await apiClient.get<User>('/users/me/');
          setUser(data);
        } catch (_error) {
          // If the interceptor failed to refresh, it handles clearing the storage.
          // We just need to make sure our UI state reflects that there is no user.
          setUser(null);
        }
      }
      setIsLoading(false); // Done checking
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Get the tokens from the backend
    const { data } = await apiClient.post('/auth/token/', credentials);

    // Save them to local storage (so the interceptor can use them)
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);

    // Fetch the actual user data
    const userRes = await apiClient.get<User>('/users/me/');
    setUser(userRes.data);
  };

  const logout = () => {
    // Clear storage and reset state
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);

    // Redirect to login page
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
