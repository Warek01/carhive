import Link from 'next/link';

import { ThemeSwitcher } from '@/components';
import { appRoute } from '@/config/app-route';

import MenuButton from './MenuButton';

const navLinks = [
   {
      href: appRoute.listing(),
      text: 'Browse',
   },
   {
      href: appRoute.recommendation(),
      text: 'Recommendations',
   },
   {
      href: appRoute.newListings(),
      text: 'New',
   },
   {
      href: appRoute.createListing(),
      text: 'Create',
   },
];

export default async function Header() {
   return (
      <header className="flex h-16 items-center justify-between border-b border-b-black/10 px-10 py-2 dark:border-b-white/10">
         <nav className="flex items-center gap-12">
            <Link href={appRoute.home()} className="text-2xl font-semibold">
               Carhive
            </Link>

            <div className="flex gap-3 text-sm">
               {navLinks.map(({ text, href }) => (
                  <Link key={href} href={href}>
                     {text}
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
