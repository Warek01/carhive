import { Badge, Card, DataList } from '@radix-ui/themes';
import { ReactNode } from 'react';

import { Listing } from '@/types/listing';
import { cn } from '@/utils/cn';

import {
   bodyStyleBadgeColors,
   carStatusBadgeColors,
   currencyMap,
   drivetrainBadgeColors,
   fuelTypeBadgeColors,
   platformBadgeColors,
   transmissionBadgeColors,
} from './contants';

interface Props {
   listing: Listing;
   oneCol?: boolean;
   className?: string;
}

type Dl = Array<{
   label: ReactNode;
   value: ReactNode;
}>;

export default function ListingDataList(props: Props) {
   const { listing, className, oneCol = false } = props;

   let dl1: Dl = [
      { label: 'Brand', value: listing.brand },
      { label: 'Model', value: listing.model },
      {
         label: 'Price',
         value:
            listing.price !== null
               ? `${listing.price}${listing.currency ? ' ' + currencyMap[listing.currency] : ''}`
               : null,
      },
      { label: 'Year', value: listing.productionYear },
      { label: 'Color', value: listing.color },
      { label: 'Mileage', value: listing.mileage },
      {
         label: 'Transmission',
         value: listing.transmission && (
            <Badge color={transmissionBadgeColors[listing.transmission]}>
               {listing.transmission}
            </Badge>
         ),
      },
      {
         label: 'Fuel type',
         value: listing.fuelType && (
            <Badge color={fuelTypeBadgeColors[listing.fuelType]}>
               {listing.fuelType}
            </Badge>
         ),
      },
      {
         label: 'Body style',
         value: listing.bodyStyle && (
            <Badge color={bodyStyleBadgeColors[listing.bodyStyle]}>
               {listing.bodyStyle}
            </Badge>
         ),
      },
      {
         label: 'Status',
         value: listing.carStatus && (
            <Badge color={carStatusBadgeColors[listing.carStatus]}>
               {listing.carStatus}
            </Badge>
         ),
      },
      {
         label: 'Drivetrain',
         value: listing.drivetrain && (
            <Badge color={drivetrainBadgeColors[listing.drivetrain]}>
               {listing.drivetrain}
            </Badge>
         ),
      },
   ];

   let dl2: Dl | null = [
      {
         label: 'Platform',
         value: listing.metadata!.platform && (
            <Badge color={platformBadgeColors[listing.metadata!.platform]}>
               {listing.metadata!.platform}
            </Badge>
         ),
      },
      {
         label: 'Created at',
         value: new Date(listing.createdAt).toDateString(),
      },
   ];

   if (oneCol) {
      dl1 = dl1.concat(dl2);
      dl2 = null;
   }

   const renderDl = (dl: Dl) => (
      <DataList.Root>
         {dl.map(({ value, label }, index) => (
            <DataList.Item key={index}>
               <DataList.Label>{label}</DataList.Label>
               <DataList.Value className="capitalize">
                  {value || '-'}
               </DataList.Value>
            </DataList.Item>
         ))}
      </DataList.Root>
   );

   return (
      <Card className={cn('w-fit', className)}>
         <div className="flex items-start gap-6">
            {renderDl(dl1)}
            {dl2 && renderDl(dl2)}
         </div>
      </Card>
   );
}
