'use client';

import { useQuery } from 'react-query';

import { ListingApi } from '@/api';

export default function DashboardListingPage() {
   const api = ListingApi.getSingleton();

   const countQuery = useQuery({
      queryFn: () => api.getCount(),
      initialData: 0,
   });

   return (
      <main>
         <h2>Total listings: {countQuery.data}</h2>
      </main>
   );
}
