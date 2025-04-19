import { appRoute } from '@/config/app-route';

export const protectedRoutes: string[] = [
   appRoute.compare(),
   appRoute.createListing(),
   appRoute.dashboard(),
   appRoute.listing(),
   appRoute.user(),
   appRoute.newListings(),
   appRoute.recommendation(),
];
