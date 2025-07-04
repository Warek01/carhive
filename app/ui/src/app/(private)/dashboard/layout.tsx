'use client';

import { TabNav } from '@radix-ui/themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { appRoute } from '@/config/app-route';
import { LayoutProps } from '@/types/next';

const paths = [
   {
      href: appRoute.dashboardListing(),
      label: 'Listing',
   },
   {
      href: appRoute.dashboardRecommendation(),
      label: 'Recommendation',
   },
   {
      href: appRoute.dashboardScraping(),
      label: 'Scraping',
   },
   {
      href: appRoute.dashboardUser(),
      label: 'User',
   },
];

export default function DashboardLayout({ children }: LayoutProps) {
   const pathname = usePathname();

   return (
      <main>
         <nav className="flex items-center gap-6 pt-3 pb-6">
            <p className="text-lg">Admin dashboard</p>
            <TabNav.Root>
               {paths.map(({ label, href }) => (
                  <TabNav.Link key={href} active={pathname === href} asChild>
                     <Link href={href}>{label}</Link>
                  </TabNav.Link>
               ))}
            </TabNav.Root>
         </nav>
         {children}
      </main>
   );
}
