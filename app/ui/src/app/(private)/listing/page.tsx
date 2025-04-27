'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Button, Select } from '@radix-ui/themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { ListingApi } from '@/api/listing-api';
import { ListingFilters, ListingList } from '@/components';
import { AppQueryKey } from '@/enums/app-query-key';
import { ListingOrderBy } from '@/enums/listing';
import { PaginationControl } from '@/types/api';
import { ListingFilter } from '@/types/listing';

export default function Page() {
   const listingApi = ListingApi.getSingleton();
   const params = useSearchParams();
   const pathname = usePathname();
   const router = useRouter();

   const [firstRender, setFirstRender] = useState(true);
   const [filters, setFilters] = useState<ListingFilter>({
      orderBy: ListingOrderBy.CreatedAtDesc,
   });
   const [pagination, setPagination] = useState<PaginationControl>({
      page: Number(params.get('page') ?? 0),
      itemsPerPage: Number(params.get('itemsPerPage') ?? 12),
      totalItems: undefined,
   });
   const { page, itemsPerPage, totalItems } = pagination;
   const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : null;

   const { data: listings, isLoading } = useQuery({
      queryFn: () =>
         listingApi.getListings({
            ...filters,
            limit: itemsPerPage,
            offset: page * itemsPerPage,
            includeMetadata: false,
         }),
      queryKey: [AppQueryKey.Listing, filters, page, itemsPerPage],
      onSuccess: (data) => {
         setPagination((p) => ({ ...p, totalItems: data.totalItems }));
      },
   });

   useEffect(() => {
      setFirstRender(false);
   }, []);

   useEffect(() => {
      if (firstRender) {
         return;
      }
      const newParams = new URLSearchParams(params);
      newParams.set('page', page.toString());
      newParams.set('itemsPerPage', itemsPerPage.toString());
      router.push(`${pathname}?${newParams}`);
   }, [page, itemsPerPage]);

   useEffect(() => {
      if (firstRender) {
         return;
      }
      setPagination({ ...pagination, page: 0 });
   }, [itemsPerPage]);

   useEffect(() => {
      if (firstRender) {
         return;
      }
      setPagination({
         ...pagination,
         page: 0,
         totalItems: undefined,
      });
   }, [filters]);

   return (
      <main>
         <div className="py-6">
            <ListingFilters filters={filters} onFilterChange={setFilters} />
         </div>
         <ListingList
            listings={listings?.items ?? []}
            skeletonCount={itemsPerPage}
            isLoading={isLoading}
         />

         <div className="flex items-center justify-start gap-6 pt-6">
            <Select.Root
               value={itemsPerPage.toString()}
               onValueChange={(v) =>
                  setPagination({ ...pagination, itemsPerPage: Number(v) })
               }
            >
               <Select.Trigger />
               <Select.Content>
                  <Select.Item value="12">12</Select.Item>
                  <Select.Item value="24">24</Select.Item>
                  <Select.Item value="48">48</Select.Item>
               </Select.Content>
            </Select.Root>
            {totalItems && (
               <div className="flex items-center justify-start gap-2">
                  <Button
                     disabled={page === 0}
                     onClick={() =>
                        setPagination({ ...pagination, page: page - 1 })
                     }
                  >
                     <ArrowLeftIcon />
                  </Button>
                  <p>Page {page + 1}</p>
                  <Button
                     disabled={!totalPages || page === totalPages - 1}
                     onClick={() =>
                        setPagination({ ...pagination, page: page + 1 })
                     }
                  >
                     <ArrowRightIcon />
                  </Button>
               </div>
            )}
         </div>
      </main>
   );
}
