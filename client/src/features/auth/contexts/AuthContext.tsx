import { createContext } from 'react';
import type { AuthContextType } from '@/features/auth/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
