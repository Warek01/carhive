import { Button, Select, TextField } from '@radix-ui/themes';
import { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { orderByStrMap } from '@/config/listing-mappings';
import {
   BodyStyle,
   CarStatus,
   Drivetrain,
   FuelType,
   ListingOrderBy,
   Transmission,
} from '@/enums/listing';
import { ListingFilter } from '@/types/listing';

export interface Props {
   filters: ListingFilter;
   onFilterChange: (value: ListingFilter) => void;
   onReset: () => void;
}

export default function ListingFilters(props: Props) {
   const { filters, onFilterChange, onReset } = props;

   const onPriceMinChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         onFilterChange({ ...filters, priceMin: e.target.valueAsNumber });
      },
      500,
   );

   const onPriceMaxChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         onFilterChange({ ...filters, priceMax: e.target.valueAsNumber });
      },
      500,
   );

   const onMileageMinChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         onFilterChange({ ...filters, mileageMin: e.target.valueAsNumber });
      },
      500,
   );

   const onMileageMaxChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         onFilterChange({ ...filters, mileageMax: e.target.valueAsNumber });
      },
      500,
   );

   const onYearMinChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         onFilterChange({ ...filters, yearMin: e.target.valueAsNumber });
      },
      500,
   );

   const onYearMaxChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         onFilterChange({ ...filters, yearMax: e.target.valueAsNumber });
      },
      500,
   );

   return (
      <div
         className="flex flex-row flex-wrap justify-start gap-3"
         key={JSON.stringify(filters)}
      >
         <Select.Root
            value={filters.bodyStyles?.[0]}
            onValueChange={(v) =>
               onFilterChange({ ...filters, bodyStyles: [v as BodyStyle] })
            }
         >
            <Select.Trigger placeholder="Body style" />
            <Select.Content>
               {Object.values(BodyStyle).map((v) => (
                  <Select.Item key={v} value={v}>
                     {v[0].toUpperCase() + v.slice(1)}
                  </Select.Item>
               ))}
            </Select.Content>
         </Select.Root>

         <Select.Root
            value={filters.carStatuses?.[0]}
            onValueChange={(v) =>
               onFilterChange({ ...filters, carStatuses: [v as CarStatus] })
            }
         >
            <Select.Trigger placeholder="Car status" />
            <Select.Content>
               {Object.values(CarStatus).map((v) => (
                  <Select.Item key={v} value={v}>
                     {v[0].toUpperCase() + v.slice(1)}
                  </Select.Item>
               ))}
            </Select.Content>
         </Select.Root>

         <Select.Root
            value={filters.drivetrains?.[0]}
            onValueChange={(v) =>
               onFilterChange({ ...filters, drivetrains: [v as Drivetrain] })
            }
         >
            <Select.Trigger placeholder="Drivetrain" />
            <Select.Content>
               {Object.values(Drivetrain).map((v) => (
                  <Select.Item key={v} value={v}>
                     {v[0].toUpperCase() + v.slice(1)}
                  </Select.Item>
               ))}
            </Select.Content>
         </Select.Root>

         <Select.Root
            value={filters.fuelTypes?.[0]}
            onValueChange={(v) =>
               onFilterChange({ ...filters, fuelTypes: [v as FuelType] })
            }
         >
            <Select.Trigger placeholder="Fuel type" />
            <Select.Content>
               {Object.values(FuelType).map((v) => (
                  <Select.Item key={v} value={v}>
                     {v[0].toUpperCase() + v.slice(1).replace('_', ' ')}
                  </Select.Item>
               ))}
            </Select.Content>
         </Select.Root>

         <Select.Root
            value={filters.transmissions?.[0]}
            onValueChange={(v) =>
               onFilterChange({
                  ...filters,
                  transmissions: [v as Transmission],
               })
            }
         >
            <Select.Trigger placeholder="Transmission" />
            <Select.Content>
               {Object.values(Transmission).map((v) => (
                  <Select.Item key={v} value={v}>
                     {v[0].toUpperCase() + v.slice(1)}
                  </Select.Item>
               ))}
            </Select.Content>
         </Select.Root>

         <TextField.Root
            type="number"
            placeholder="Price min"
            onChange={onPriceMinChange}
         />
         <TextField.Root
            type="number"
            placeholder="Price max"
            onChange={onPriceMaxChange}
         />

         <TextField.Root
            type="number"
            placeholder="Mileage min"
            onChange={onMileageMinChange}
         />
         <TextField.Root
            type="number"
            placeholder="Mileage max"
            onChange={onMileageMaxChange}
         />

         <TextField.Root
            type="number"
            placeholder="Year min"
            onChange={onYearMinChange}
         />
         <TextField.Root
            type="number"
            placeholder="Year max"
            onChange={onYearMaxChange}
         />

         <Select.Root
            value={filters.orderBy}
            onValueChange={(v) =>
               onFilterChange({ ...filters, orderBy: v as ListingOrderBy })
            }
         >
            <Select.Trigger />
            <Select.Content>
               {Object.entries(orderByStrMap).map(([k, v]) => (
                  <Select.Item key={k} value={k}>
                     {v[0].toUpperCase() + v.slice(1)}
                  </Select.Item>
               ))}
            </Select.Content>
         </Select.Root>

         <Button type="button" onClick={onReset}>
            Reset
         </Button>
      </div>
   );
}
