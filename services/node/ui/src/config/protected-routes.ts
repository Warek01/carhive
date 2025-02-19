import { appRoute } from '@/config/app-route';

export const protectedRoutes: string[] = [
   appRoute.user(),
   appRoute.recommendation(),
   appRoute.dashboard(),
];
