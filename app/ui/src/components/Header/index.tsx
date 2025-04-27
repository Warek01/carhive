'use client';

import { Badge } from '@radix-ui/themes';
import Link from 'next/link';
import qs from 'qs';

import { ThemeSwitcher } from '@/components';
import { appRoute } from '@/config/app-route';
import { useComparison } from '@/hooks/use-comparison';
import { cn } from '@/utils/cn';

import MenuButton from './MenuButton';

export default function Header() {
   const cmp = useComparison();

   const navLinks = [
      {
         href: appRoute.listing(),
         label: 'Browse',
         active: true,
      },
      {
         href: appRoute.recommendation(),
         label: 'Recommendations',
         active: true,
      },
      {
         href: appRoute.createListing(),
         label: 'Create',
         active: true,
      },
      {
         href: appRoute.compare() + `?${qs.stringify({ ids: cmp.ids })}`,
         label: cmp.ids.length ? (
            <span>
               Compare <Badge>{cmp.ids.length}</Badge>
            </span>
         ) : (
            <span className="text-gray-500">Compare</span>
         ),
         active: !!cmp.ids.length,
      },
   ];

   return (
      <header className="flex h-16 items-center justify-between border-b border-b-black/10 px-10 py-2 dark:border-b-white/10">
         <nav className="flex items-center gap-12">
            <Link href={appRoute.home()} className="text-2xl font-semibold">
               Carhive
            </Link>

            <div className="flex gap-5 text-sm">
               {navLinks.map(({ label, href, active }) => (
                  <Link
                     key={href}
                     href={href}
                     className={cn(!active && 'pointer-events-none')}
                  >
                     {label}
                  </Link>
               ))}
            </div>
         </nav>
         <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <MenuButton />
         </div>
      </header>
   );
}
