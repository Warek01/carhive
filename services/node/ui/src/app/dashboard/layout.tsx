'use client';

import { TabNav } from '@radix-ui/themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { appRoute } from '@/config/app-route';
import { LayoutProps } from '@/types/next';

const paths = [
   {
      href: appRoute.dashboardListing(),
      text: 'Listing',
   },
   {
      href: appRoute.dashboardRecommendation(),
      text: 'Recommendation',
   },
   {
      href: appRoute.dashboardScraping(),
      text: 'Scraping',
   },
   {
      href: appRoute.dashboardUser(),
      text: 'User',
   },
];

export default function DashboardLayout({ children }: LayoutProps) {
   const pathname = usePathname();

   return (
      <main className="flex flex-col gap-3">
         <TabNav.Root>
            {paths.map(({ text, href }) => (
               <TabNav.Link key={href} active={pathname === href} asChild>
                  <Link href={href}>{text}</Link>
               </TabNav.Link>
            ))}
         </TabNav.Root>
         {children}
      </main>
   );
}
