'use client';

import {
   Button,
   Card,
   Checkbox,
   Select,
   Spinner,
   Table,
   Text,
   TextField,
} from '@radix-ui/themes';
import { CombineIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { ScrapeApi } from '@/api/scrape-api';
import { AppQueryKey } from '@/enums/app-query-key';
import { Platform } from '@/enums/scraping';

const platforms: Platform[] = [Platform.TripleNineMd, Platform.DaacHermes];

export default function DashboardScrapingPage() {
   const [platform, setPlatform] = useState(platforms[0]);
   const [startPage, setStartPage] = useState(0);
   const [endPage, setEndPage] = useState(0);
   const scrapeApi = ScrapeApi.getSingleton();
   const queryClient = useQueryClient();

   const scrape = useMutation({
      mutationFn: () => scrapeApi.scrape({ platform, startPage, endPage }),
      onSuccess: () => {
         toast.success('Scraping started');
         queryClient.invalidateQueries({ queryKey: [AppQueryKey.Scraping] });
      },
      onError: () => {
         toast.error('Could not start scraping');
      },
   });

   const historyQuery = useQuery({
      queryFn: () => scrapeApi.getHistory(),
      queryKey: [AppQueryKey.Scraping],
   });

   const handleScrape = async () => {
      if (startPage > endPage) {
         toast.error('Start page must be less than or equal to end page');
         return;
      }

      await scrape.mutateAsync();
   };

   return (
      <main className="flex flex-col gap-8">
         <section>
            <Text size="5" weight="bold">
               Scraping Controls
            </Text>

            <Card className="mt-4 flex flex-col gap-4 p-4">
               <div className="flex flex-wrap items-center gap-4">
                  <label className="flex flex-col gap-1">
                     <Text size="2" weight="medium">
                        Platform
                     </Text>
                     <Select.Root
                        value={platform}
                        onValueChange={(v) => setPlatform(v as Platform)}
                     >
                        <Select.Trigger />
                        <Select.Content>
                           {platforms.map((p) => (
                              <Select.Item
                                 value={p}
                                 key={p}
                                 className="capitalize"
                              >
                                 {p.replace(/([a-z])([A-Z])/g, '$1 $2')}
                              </Select.Item>
                           ))}
                        </Select.Content>
                     </Select.Root>
                  </label>

                  <label className="flex flex-col gap-1">
                     <Text size="2" weight="medium">
                        Start Page
                     </Text>
                     <TextField.Root
                        value={startPage}
                        type="number"
                        min={0}
                        onChange={(e) => setStartPage(e.target.valueAsNumber)}
                        className="w-32"
                     />
                  </label>

                  <label className="flex flex-col gap-1">
                     <Text size="2" weight="medium">
                        End Page
                     </Text>
                     <TextField.Root
                        value={endPage}
                        type="number"
                        min={0}
                        onChange={(e) => setEndPage(e.target.valueAsNumber)}
                        className="w-32"
                     />
                  </label>

                  <Button
                     onClick={handleScrape}
                     disabled={scrape.isLoading}
                     className="!mt-6"
                  >
                     {scrape.isLoading && <Spinner size="2" />}
                     {!scrape.isLoading && (
                        <>
                           <CombineIcon size={16} /> Scrape
                        </>
                     )}
                  </Button>
               </div>
            </Card>
         </section>

         <section>
            <Text size="5" weight="bold">
               Scraping History
            </Text>

            <Table.Root>
               <Table.Header>
                  <Table.Row>
                     <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Platform</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Success</Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>Pages</Table.ColumnHeaderCell>
                  </Table.Row>
               </Table.Header>
               <Table.Body>
                  {historyQuery.data?.items.map((record) => (
                     <Table.Row key={record.id}>
                        <Table.RowHeaderCell>{record.id}</Table.RowHeaderCell>
                        <Table.Cell>
                           {new Date(record.createdAt).toLocaleString('ro-RO')}
                        </Table.Cell>
                        <Table.Cell className="capitalize">
                           {record.platform.replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </Table.Cell>
                        <Table.Cell>
                           <Checkbox checked={record.success} />
                        </Table.Cell>
                        <Table.Cell>
                           {record.startPage} - {record.endPage}
                        </Table.Cell>
                     </Table.Row>
                  ))}

                  {historyQuery.isLoading && (
                     <Table.Row>
                        <Table.Cell colSpan={5}>
                           <div className="flex h-16 items-center justify-center">
                              <Spinner size="3" />
                           </div>
                        </Table.Cell>
                     </Table.Row>
                  )}
               </Table.Body>
            </Table.Root>
         </section>
      </main>
   );
}
