'use client';

import { DropdownMenu, IconButton } from '@radix-ui/themes';
import {
   LayoutDashboardIcon,
   LogInIcon,
   LogOutIcon,
   MenuIcon,
   UserRoundCogIcon,
} from 'lucide-react';
import Link from 'next/link';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/hooks/use-auth';

export default function MenuButton() {
   const { logOut, isAuthorized, user, isAdmin } = useAuth();

   return (
      <DropdownMenu.Root>
         <DropdownMenu.Trigger>
            <IconButton variant="ghost">
               <MenuIcon width={24} height={24} />
            </IconButton>
         </DropdownMenu.Trigger>
         <DropdownMenu.Content>
            <DropdownMenu.Item
               disabled={!isAuthorized}
               className="overflow-hidden text-nowrap text-ellipsis"
               asChild
            >
               <Link href={appRoute.user()}>
                  <UserRoundCogIcon size={16} />
                  {user?.username}
               </Link>
            </DropdownMenu.Item>

            {isAdmin && (
               <DropdownMenu.Item asChild>
                  <Link
                     href={appRoute.dashboard()}
                     className="flex items-center gap-1"
                  >
                     <LayoutDashboardIcon size={16} /> Dashboard
                  </Link>
               </DropdownMenu.Item>
            )}

            <DropdownMenu.Separator />

            {isAuthorized ? (
               <DropdownMenu.Item
                  onClick={() => logOut()}
                  className="text-nowrap"
               >
                  <LogOutIcon size={16} />
                  Log out
               </DropdownMenu.Item>
            ) : (
               <DropdownMenu.Item asChild>
                  <Link href={appRoute.login()} className="text-nowrap">
                     <LogInIcon size={16} />
                     Log in
                  </Link>
               </DropdownMenu.Item>
            )}
         </DropdownMenu.Content>
      </DropdownMenu.Root>
   );
}
