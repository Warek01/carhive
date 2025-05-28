import {
   Button,
   Card,
   Popover,
   Progress,
   ProgressProps,
   Text,
   Tooltip,
} from '@radix-ui/themes';
import {
   Car,
   DollarSign,
   ExternalLink,
   FileText,
   Fuel,
   Gauge,
   Link2,
   Mountain,
   Route,
   Shield,
   Star,
   Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import qs from 'qs';

import { ListingApi } from '@/api';
import {
   ClearComparisonButton,
   ListingDataList,
   RemoveFromComparisonButton,
} from '@/components';
import { appRoute } from '@/config/app-route';
import { ListingRating } from '@/types/listing';
import { PageProps } from '@/types/next';
import { camelCaseToWords } from '@/utils/camel-case-to-words';

export default async function Page({ searchParams }: PageProps) {
   const params: any = qs.parse((await searchParams) as any);
   const ids: number[] = params.ids;

   if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return (
         <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="text-5xl">🤔</div>
            <h2 className="text-xl font-semibold">No listings selected</h2>
            <p className="max-w-md text-gray-500">
               You haven't selected any listings to compare yet. Go back and
               choose up to 3 items to see them side-by-side.
            </p>
            <Button asChild>
               <Link href={appRoute.listing()}>Browse Listings</Link>
            </Button>
         </div>
      );
   }

   const listingApi = ListingApi.getSingleton();
   const listings = await Promise.all(
      ids.map((id) => listingApi.findListing(id, { includeMetadata: true })),
   );

   const keys: Array<keyof ListingRating> = [
      'overall',
      'reliability',
      'price',
      'luxury',
      'fuelEfficiency',
      'mileage',
      'sport',
      'offroad',
      'family',
   ];
   const ratingIcons: Record<keyof ListingRating, React.ReactNode> = {
      overall: <Star size={16} />,
      reliability: <Shield size={16} />,
      price: <DollarSign size={16} />,
      luxury: <Car size={16} />,
      fuelEfficiency: <Fuel size={16} />,
      mileage: <Route size={16} />,
      sport: <Gauge size={16} />,
      offroad: <Mountain size={16} />,
      family: <Users size={16} />,
   };
   const progressColors: ProgressProps['color'][] = ['blue', 'bronze', 'grass'];

   return (
      <div className="space-y-6 py-6">
         <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Your Comparison</h1>
            <ClearComparisonButton />
         </div>

         <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
               <div key={l.id} className="flex flex-col gap-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                     <Image
                        src={l.images[0]}
                        alt="preview"
                        fill
                        className="object-cover"
                     />
                  </div>

                  <ListingDataList
                     listing={l}
                     className="w-full text-sm"
                     oneCol={true}
                  />

                  <div className="flex flex-wrap gap-3">
                     <Button asChild>
                        <Link href={l.metadata!.url} target="_blank">
                           <ExternalLink size={16} />
                           View Original
                        </Link>
                     </Button>

                     <Button asChild variant="surface">
                        <Link
                           href={appRoute.listingDetails({
                              id: l.id.toString(),
                           })}
                        >
                           <Link2 size={16} />
                           View
                        </Link>
                     </Button>

                     <Popover.Root>
                        <Popover.Trigger>
                           <Button variant="soft">
                              <FileText size={16} /> View Description
                           </Button>
                        </Popover.Trigger>
                        <Popover.Content>
                           <Text className="max-w-sm text-sm whitespace-pre-wrap">
                              {l.summary}
                           </Text>
                        </Popover.Content>
                     </Popover.Root>

                     <RemoveFromComparisonButton listingId={l.id} />
                  </div>
               </div>
            ))}
         </section>

         <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Comparison Breakdown</h2>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {keys.map((key) => (
                  <li key={key}>
                     <Card className="p-4">
                        <div className="flex flex-col gap-3">
                           <p className="flex items-center gap-3 font-semibold text-gray-300 capitalize">
                              {ratingIcons[key]}
                              {camelCaseToWords(key)}
                           </p>
                           {listings.map((listing, index) => (
                              <Tooltip
                                 key={listing.id}
                                 content={`${listing.title} ${listing.ratings![key]}/10`}
                              >
                                 <div className="flex items-center gap-3">
                                    {index + 1}
                                    <Progress
                                       size="3"
                                       color={progressColors[index]}
                                       value={listing.ratings![key]}
                                       max={10}
                                    />
                                 </div>
                              </Tooltip>
                           ))}
                        </div>
                     </Card>
                  </li>
               ))}
            </ul>
         </section>
      </div>
   );
}
