'use client';

import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import {
   FC,
   PropsWithChildren,
   createContext,
   useEffect,
   useState,
} from 'react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

import { AuthApi } from '@/api/auth-api';
import { appRoute } from '@/config/app-route';
import { AppCookie } from '@/enums/app-cookie';
import { AppLocalStorageItem } from '@/enums/app-local-storage-item';
import { AppQueryKey } from '@/enums/app-query-key';
import { UserRole } from '@/enums/auth';
import { LoginDto, RegisterDto } from '@/types/auth';
import { User } from '@/types/user';

export interface AuthContextProps {
   isAuthorized: boolean;
   isAdmin: boolean;
   isSuperAdmin: boolean;
   user: User | null;
   logOut: () => Promise<void>;
   logIn: (values: LoginDto) => Promise<void>;
   register: (values: RegisterDto) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(null!);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const router = useRouter();
   const authApi = AuthApi.getSingleton();
   const pathname = usePathname();
   const queryClient = useQueryClient();

   const [isAuthorized, setIsAuthorized] = useState(
      Cookies.get(AppCookie.IsAuthenticated) === 'true',
   );

   const userQuery = useQuery({
      queryFn: () => authApi.getSelf(),
      queryKey: [AppQueryKey.User],
      initialData: null,
      enabled: isAuthorized,
   });

   const isAdmin =
      userQuery.data?.role === UserRole.Admin ||
      userQuery.data?.role === UserRole.SuperAdmin;

   const isSuperAdmin = userQuery.data?.role === UserRole.SuperAdmin;

   const logOut = async () => {
      setIsAuthorized(false);
      await authApi.logout();
      await queryClient.invalidateQueries([AppQueryKey.User]);
      queryClient.setQueryData([AppQueryKey.User], null);
      router.push(appRoute.login());
   };

   const signIn = async () => {
      setIsAuthorized(true);
      await queryClient.invalidateQueries([AppQueryKey.User]);
      await userQuery.refetch();
   };

   const logIn = async (values: LoginDto) => {
      await AuthApi.getSingleton().login(values);
      await signIn();
   };

   const register = async (values: RegisterDto) => {
      await AuthApi.getSingleton().register(values);
      await signIn();
   };

   const contextValue: AuthContextProps = {
      isAuthorized,
      isAdmin,
      isSuperAdmin,
      logOut,
      logIn,
      register,
      user: userQuery.data ?? null,
   };

   useEffect(() => {
      if (
         !Cookies.get(AppCookie.IsAuthenticated) &&
         localStorage.getItem(AppLocalStorageItem.AuthenticatedUser)
      ) {
         logOut();
         toast.error('Session expired', { id: 'session-expired' });
      }
   }, [pathname]);

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
};
