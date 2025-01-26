'use client';

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { AppCookie } from '@/config/app-cookie';
import { AppLocalStorageItem } from '@/config/app-local-storage-item';

import { useAuth } from './use-auth';

export function useDetectSessionExpired() {
   const { unsetUser, authorized } = useAuth();

   useEffect(() => {
      // if no auth cookie but user saved to localStorage then the jwt token was invalidated
      if (
         !Cookies.get(AppCookie.Authenticated) &&
         localStorage.getItem(AppLocalStorageItem.AuthenticatedUser)
      ) {
         unsetUser();
         toast.error('Session expired');
      }
   }, []);
}
