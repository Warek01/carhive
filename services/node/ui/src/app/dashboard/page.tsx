import { redirect } from 'next/navigation';

import { appRoute } from '@/config/app-route';

export default async function Dashboard() {
   redirect(appRoute.dashboardListing());
}
