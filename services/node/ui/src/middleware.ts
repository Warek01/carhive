import { JwtPayload, decode } from 'jsonwebtoken';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { AppCookie } from '@/config/app-cookie';
import { appRoute } from '@/config/app-route';
import { PROTECTED_ROUTES } from '@/config/protected-routes';

export async function middleware(request: NextRequest): Promise<NextResponse> {
   const token = request.cookies.get(AppCookie.AccessToken);

   if (token) {
      const decoded = decode(token.value) as JwtPayload;
      if (Date.now() / 1000 > decoded.exp!) {
         const redirectUrl = new URL(appRoute.login(), request.url);
         const response = NextResponse.redirect(redirectUrl);
         response.cookies.delete(AppCookie.AccessToken);
         response.cookies.delete(AppCookie.Authenticated);
         return response;
      }
   }

   if (!token) {
      for (const route of PROTECTED_ROUTES) {
         if (request.nextUrl.pathname.startsWith(route)) {
            const redirectUrl = new URL(appRoute.login(), request.url);
            console.log('Redirecting', route, request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
         }
      }
   }

   return NextResponse.next();
}

export const config: MiddlewareConfig = {
   matcher: '/:path*',
};
