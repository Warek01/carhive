import { NextResponse, NextRequest, MiddlewareConfig } from 'next/server';
import { decode, JwtPayload } from 'jsonwebtoken';

import { appRoute } from '@/config/app-route';
import { PROTECTED_ROUTES } from '@/config/protected-routes';
import { AppCookie } from '@/config/app-cookie';

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
         if (route.startsWith(request.nextUrl.pathname)) {
            const redirectUrl = new URL(appRoute.login(), request.url);
            return NextResponse.redirect(redirectUrl);
         }
      }
   }

   return NextResponse.next();
}

export const config: MiddlewareConfig = {
   matcher: '/:path*',
};
