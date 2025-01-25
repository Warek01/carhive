'use client';

import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

import { AppCookie } from '@/config/app-cookie';
import { AppLocalStorageItem } from '@/config/app-local-storage-item';

export function useDetectSessionExpired() {
   useEffect(() => {
      // if no auth cookie but user saved to localStorage then the jwt token was invalidated
      if (
         !Cookies.get(AppCookie.Authenticated) &&
         localStorage.getItem(AppLocalStorageItem.AuthenticatedUser)
      ) {
         localStorage.removeItem(AppLocalStorageItem.AuthenticatedUser);
         toast.error('Session expired');
      }
   }, []);
}
