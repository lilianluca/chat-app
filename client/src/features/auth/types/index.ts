import { type User } from '@/features/users/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (_credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
