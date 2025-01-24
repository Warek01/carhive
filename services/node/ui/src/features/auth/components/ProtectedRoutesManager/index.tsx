'use client';

import { FC, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { appRoute } from '@/config/app-route';
import { LocalStorageItem } from '@/config/local-storage-item';

const PROTECTED_ROUTES = [appRoute.listing()];
const PUBLIC_ROUTES = [appRoute.login(), appRoute.register()];

// TODO: implement cookie jwt route protection
export const ProtectedRoutesManager: FC = () => {
   const router = useRouter();
   const pathname = usePathname();

   useEffect(() => {
      const token = localStorage.getItem(LocalStorageItem.AccessToken);

      window.addEventListener('popstate', () => {
         console.log('popstate');
      });

      for (const route of PROTECTED_ROUTES) {
         if (pathname.startsWith(route) && !token) {
            router.push(appRoute.login());
         }
      }

      for (const route of PUBLIC_ROUTES) {
         if (pathname.startsWith(route) && token) {
            router.push(appRoute.home());
         }
      }
   }, [pathname]);

   return null;
};

export default ProtectedRoutesManager;
