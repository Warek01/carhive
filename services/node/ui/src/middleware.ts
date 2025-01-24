import { NextResponse, NextRequest, MiddlewareConfig } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
   // TODO: implement cookie jwt route protection
   return NextResponse.next();
}

export const config: MiddlewareConfig = {
   matcher: '/:path*',
};
