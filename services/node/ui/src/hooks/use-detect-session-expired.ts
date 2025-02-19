'use client';

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { AppCookie } from '@/enums/app-cookie';
import { AppLocalStorageItem } from '@/enums/app-local-storage-item';

import { useAuth } from './use-auth';

export function useDetectSessionExpired() {
   const { unsetUser } = useAuth();

   useEffect(() => {
      // if no auth cookie but user saved to localStorage then the jwt token was invalidated
      if (
         !Cookies.get(AppCookie.Authenticated) &&
         localStorage.getItem(AppLocalStorageItem.AuthenticatedUser)
      ) {
         unsetUser();
         toast.error('Session expired', { id: 'session-expired' });
      }
   }, []);
}
