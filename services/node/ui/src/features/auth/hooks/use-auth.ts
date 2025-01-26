'use client';

import { useContext } from 'react';

import { AuthContext } from '@/features/auth/context/auth-context';

export function useAuth() {
   return useContext(AuthContext);
}
