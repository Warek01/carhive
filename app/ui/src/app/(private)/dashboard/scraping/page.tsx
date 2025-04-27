'use client';

import { Button, Checkbox, Select, Table, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { ScrapeApi } from '@/api/scrape-api';
import { AppQueryKey } from '@/enums/app-query-key';
import { Platform } from '@/enums/scraping';

const platforms = [Platform.TripleNineMd];

export default function DashboardScrapingPage() {
   const [platform, setPlatform] = useState(platforms[0]);
   const [startPage, setStartPage] = useState(0);
   const [endPage, setEndPage] = useState(0);
   const scrapeApi = ScrapeApi.getSingleton();
   const queryClient = useQueryClient();

   const scrape = useMutation({
      mutationFn: () => scrapeApi.scrape({ platform, startPage, endPage }),
   });

   const historyQuery = useQuery({
      queryFn: () => scrapeApi.getHistory(),
      enabled: true,
      queryKey: [AppQueryKey.Scraping],
   });

   const handleScrape = async () => {
      await scrape.mutateAsync();
      toast('Success');
   };

   return (
      <main className="flex flex-col gap-3">
         <label className="flex items-center gap-3">
            Platform
            <Select.Root
               value={platform}
               onValueChange={(v) => setPlatform(v as Platform)}
            >
               <Select.Trigger value={platform} />
               <Select.Content>
                  {platforms.map((p) => (
                     <Select.Item value={p} key={p}>
                        {p}
                     </Select.Item>
                  ))}
               </Select.Content>
            </Select.Root>
         </label>
         <label className="flex items-center gap-3">
            Start page
            <TextField.Root
               value={startPage}
               type="number"
               min="0"
               onChange={(e) => setStartPage(e.target.valueAsNumber)}
            />
         </label>
         <label className="flex items-center gap-3">
            End page
            <TextField.Root
               value={endPage}
               type="number"
               min="0"
               onChange={(e) => setEndPage(e.target.valueAsNumber)}
            />
         </label>
         <Button className="!w-36" onClick={handleScrape}>
            Scrape
         </Button>

         <div>
            <Table.Root>
               <Table.Header>
                  <Table.Row>
                     <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Platform</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Success</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Pages</Table.ColumnHeaderCell>
                  </Table.Row>
               </Table.Header>
               <Table.Body>
                  {historyQuery.isSuccess &&
                     historyQuery.data.items.map((record) => (
                        <Table.Row key={record.id}>
                           <Table.RowHeaderCell>
                              {record.id}
                           </Table.RowHeaderCell>
                           <Table.Cell>
                              {new Date(record.createdAt).toLocaleString(
                                 'ro-RO',
                              )}
                           </Table.Cell>
                           <Table.Cell>{record.platform}</Table.Cell>
                           <Table.Cell>
                              <Checkbox checked={record.success} />
                           </Table.Cell>
                           <Table.Cell>
                              {record.startPage} - {record.endPage}
                           </Table.Cell>
                        </Table.Row>
                     ))}
               </Table.Body>
            </Table.Root>
         </div>
      </main>
   );
}
