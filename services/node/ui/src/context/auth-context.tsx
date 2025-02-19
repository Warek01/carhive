'use client';

import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, createContext } from 'react';
import { useQuery } from 'react-query';

import { AuthApi } from '@/api/auth-api';
import { appRoute } from '@/config/app-route';
import { AppQueryKey } from '@/enums/app-query-key';
import { UserRole } from '@/enums/auth';
import { User } from '@/types/user';

export interface AuthContextProps {
   isAuthorized: boolean;
   isAdmin: boolean;
   isSuperAdmin: boolean;
   user: User | null;
   unsetUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(null!);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const router = useRouter();
   const authApi = AuthApi.getSingleton();

   const userQuery = useQuery({
      queryFn: () => authApi.getSelf(),
      queryKey: [AppQueryKey.User],
      placeholderData: null,
   });

   const user = !userQuery.isSuccess || !userQuery.data ? null : userQuery.data;
   const isAuthorized = !!userQuery.data;

   const isAdmin =
      userQuery.data?.role === UserRole.Admin ||
      userQuery.data?.role === UserRole.SuperAdmin;

   const isSuperAdmin = userQuery.data?.role === UserRole.SuperAdmin;

   const unsetUser: AuthContextProps['unsetUser'] = async () => {
      await authApi.logout();
      router.push(appRoute.login());
   };

   const contextValue: AuthContextProps = {
      isAuthorized,
      user,
      isAdmin,
      isSuperAdmin,
      unsetUser,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
};
