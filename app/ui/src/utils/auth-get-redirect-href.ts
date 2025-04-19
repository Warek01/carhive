import { appRoute } from '@/config/app-route';

// get link that redirects to `redirectTo` search param or home
export function authGetRedirectHref(params: URLSearchParams): string {
   let redirectHref = params.get('redirectTo') ?? appRoute.home();

   const newSearchParams = new URLSearchParams(params);
   newSearchParams.delete('redirectTo');

   if (newSearchParams.size) {
      redirectHref = `${redirectHref}?${newSearchParams}`;
   }

   return redirectHref;
}
