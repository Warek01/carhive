'use client';

import { useRouter } from 'next/navigation';
import {
   FC,
   PropsWithChildren,
   createContext,
   useEffect,
   useState,
} from 'react';

import { AppLocalStorageItem } from '@/config/app-local-storage-item';
import { appRoute } from '@/config/app-route';
import { AuthApi } from '@/features/auth/api/auth-api';
import { User } from '@/features/user/types/user';

export interface AuthContextProps {
   authorized: boolean;
   user: User | null;
   setUser: (user: User) => void;
   unsetUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(null!);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const router = useRouter();
   const authApi = AuthApi.getSingleton();

   const [user, _setUser] = useState<AuthContextProps['user']>(null);

   const authorized = !!user;

   const setUser: AuthContextProps['setUser'] = (user) => {
      _setUser(user);
      localStorage.setItem(
         AppLocalStorageItem.AuthenticatedUser,
         JSON.stringify(user),
      );
   };

   const unsetUser: AuthContextProps['unsetUser'] = async () => {
      await authApi.logout();
      localStorage.removeItem(AppLocalStorageItem.AuthenticatedUser);
      _setUser(null);
      router.push(appRoute.login());
   };

   const contextValue: AuthContextProps = {
      authorized,
      user,
      setUser,
      unsetUser,
   };

   useEffect(() => {
      const storedUser = localStorage.getItem(
         AppLocalStorageItem.AuthenticatedUser,
      );
      if (storedUser) {
         _setUser(JSON.parse(storedUser));
      }
   }, []);

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
};
