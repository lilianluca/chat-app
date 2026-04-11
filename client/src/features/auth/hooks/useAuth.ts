import type { AuthContextType } from '@/features/auth/types';
import { useContext } from 'react';
import { AuthContext } from '../contexts';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
