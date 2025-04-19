'use client';

import { Button, Select, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

import { ScrapeApi } from '@/api/scrape-api';
import { Platform } from '@/enums/scraping';

const platforms = [Platform.TripleNineMd];

export default function DashboardScrapingPage() {
   const [platform, setPlatform] = useState(platforms[0]);
   const [startPage, setStartPage] = useState(0);
   const [endPage, setEndPage] = useState(0);
   const scrapeApi = ScrapeApi.getSingleton();

   const scrape = useMutation({
      mutationFn: () => scrapeApi.scrape({ platform, startPage, endPage }),
   });

   const handleScrape = async () => {
      await scrape.mutateAsync();
      toast('Success');
   };

   return (
      <main className="flex max-w-96 flex-col gap-3">
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
         <Button onClick={handleScrape}>Scrape</Button>
      </main>
   );
}
