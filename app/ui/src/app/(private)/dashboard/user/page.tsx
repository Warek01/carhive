'use client';

import {
   Button,
   Checkbox,
   Separator,
   Spinner,
   Table,
   Text,
} from '@radix-ui/themes';
import { ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { useImmer } from 'use-immer';

import { UserApi } from '@/api';
import { AppQueryKey } from '@/enums/app-query-key';
import { UserRole } from '@/enums/auth';
import { Pagination } from '@/types/api';

const roleStrMap = {
   [UserRole.User]: 'User',
   [UserRole.Admin]: 'Admin',
   [UserRole.SuperAdmin]: 'Super Admin',
};

const PAGE_LIMIT = 10;

export default function DashboardUserPage() {
   const userApi = UserApi.getSingleton();
   const queryClient = useQueryClient();
   const [pagination, setPagination] = useImmer<Pagination>({
      offset: 0,
      limit: PAGE_LIMIT,
   });

   const usersQuery = useQuery({
      queryFn: () => userApi.get(pagination),
      queryKey: [AppQueryKey.UserAdminData, pagination],
      keepPreviousData: true,
   });

   const handlePrev = () => {
      setPagination((draft) => {
         draft.offset = Math.max(0, draft.offset - draft.limit);
      });
   };

   const handleNext = () => {
      setPagination((draft) => {
         draft.offset = draft.offset + draft.limit;
      });
   };

   const currentPage = pagination.offset / pagination.limit + 1;
   const isLastPage =
      usersQuery.data?.items &&
      usersQuery.data.items.length !== 0 &&
      usersQuery.data.items.length < pagination.limit;

   const handleRefresh = () => {
      queryClient.invalidateQueries({
         queryKey: [AppQueryKey.UserAdminData],
      });
   };

   const isLoading = usersQuery.isLoading || usersQuery.isRefetching;

   return (
      <main>
         <div className="mb-6 flex items-center gap-3">
            <div className="grid grid-cols-3 items-center gap-1">
               <Button onClick={handlePrev} disabled={pagination.offset === 0}>
                  <ArrowLeftIcon size={16} />
                  Previous
               </Button>
               <Text size="2" className="text-center">
                  Page {currentPage}
               </Text>
               <Button onClick={handleNext} disabled={isLastPage}>
                  Next
                  <ArrowRightIcon size={16} />
               </Button>
            </div>
            <Separator orientation="vertical" />
            <Button onClick={handleRefresh} disabled={isLoading}>
               {isLoading ? <Spinner /> : <RefreshCwIcon size={16} />} Refresh
            </Button>
         </div>

         <Table.Root variant="surface">
            <Table.Header>
               <Table.Row>
                  <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created at</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Deleted</Table.ColumnHeaderCell>
               </Table.Row>
            </Table.Header>
            <Table.Body>
               {usersQuery.data?.items?.map((user) => (
                  <Table.Row key={user.id}>
                     <Table.RowHeaderCell>{user.id}</Table.RowHeaderCell>
                     <Table.Cell>{user.email}</Table.Cell>
                     <Table.Cell>{user.username ?? '-'}</Table.Cell>
                     <Table.Cell>{roleStrMap[user.role]}</Table.Cell>
                     <Table.Cell>
                        {new Date(user.createdAt).toLocaleString('ro-RO')}
                     </Table.Cell>
                     <Table.Cell>
                        <Checkbox checked={user.deleted} />
                     </Table.Cell>
                  </Table.Row>
               ))}
            </Table.Body>
         </Table.Root>
      </main>
   );
}
