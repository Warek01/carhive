'use client';

import {
   ArrowLeftEndOnRectangleIcon,
   ArrowLeftStartOnRectangleIcon,
   Bars3Icon,
   UserCircleIcon,
} from '@heroicons/react/24/solid';
import { DropdownMenu, IconButton } from '@radix-ui/themes';
import Link from 'next/link';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/hooks/use-auth';

export default function MenuButton() {
   const { unsetUser, isAuthorized, user, isAdmin } = useAuth();

   return (
      <DropdownMenu.Root>
         <DropdownMenu.Trigger>
            <IconButton variant="ghost">
               <Bars3Icon width={24} height={24} />
            </IconButton>
         </DropdownMenu.Trigger>
         <DropdownMenu.Content>
            <DropdownMenu.Item
               disabled={!isAuthorized}
               className="overflow-hidden text-nowrap text-ellipsis"
               asChild
            >
               <Link href={appRoute.user()}>
                  <UserCircleIcon width={24} height={24} />
                  {user?.username}
               </Link>
            </DropdownMenu.Item>

            {isAdmin && (
               <DropdownMenu.Item asChild>
                  <Link href={appRoute.dashboard()}>Dashboard</Link>
               </DropdownMenu.Item>
            )}

            <DropdownMenu.Separator />

            {isAuthorized ? (
               <DropdownMenu.Item
                  onClick={() => unsetUser()}
                  className="text-nowrap"
               >
                  <ArrowLeftStartOnRectangleIcon width={24} height={24} />
                  Log out
               </DropdownMenu.Item>
            ) : (
               <DropdownMenu.Item asChild>
                  <Link href={appRoute.login()} className="text-nowrap">
                     <ArrowLeftEndOnRectangleIcon width={24} height={24} />
                     Log in
                  </Link>
               </DropdownMenu.Item>
            )}
         </DropdownMenu.Content>
      </DropdownMenu.Root>
   );
}
