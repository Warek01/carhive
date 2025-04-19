import { JwtPayload, decode } from 'jsonwebtoken';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { appRoute } from '@/config/app-route';
import { protectedRoutes } from '@/config/protected-routes';
import { AppCookie } from '@/enums/app-cookie';

export async function middleware(request: NextRequest): Promise<NextResponse> {
   const token = request.cookies.get(AppCookie.AccessToken);

   if (token) {
      const decoded = decode(token.value) as JwtPayload;
      if (Date.now() / 1000 > decoded.exp!) {
         const redirectUrl = new URL(appRoute.login(), request.nextUrl.origin);
         redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);

         const response = NextResponse.redirect(redirectUrl);
         response.cookies.delete(AppCookie.AccessToken);
         response.cookies.delete(AppCookie.IsAuthenticated);
         return response;
      }
   }

   if (!token) {
      for (const route of protectedRoutes) {
         if (request.nextUrl.pathname.startsWith(route)) {
            const redirectUrl = new URL(
               appRoute.login(),
               request.nextUrl.origin,
            );
            redirectUrl.searchParams.set(
               'redirectTo',
               request.nextUrl.pathname,
            );
            return NextResponse.redirect(redirectUrl);
         }
      }
   }

   return NextResponse.next();
}

export const config: MiddlewareConfig = {
   matcher: '/:path*',
};
