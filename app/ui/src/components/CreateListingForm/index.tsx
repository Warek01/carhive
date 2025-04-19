'use client';

import { Button, Select, TextArea, TextField } from '@radix-ui/themes';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

import { ListingApi } from '@/api';
import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingStatus,
   Transmission,
} from '@/enums/listing';
import { Platform } from '@/enums/scraping';
import { CreateListing } from '@/types/listing';

interface FormValues {
   brand: string;
   model: string;
   color: string;
   bodyStyle: BodyStyle;
   carStatus: CarStatus;
   currency: Currency;
   description: string;
   drivetrain: Drivetrain;
   fuelType: FuelType;
   listingStatus: ListingStatus;
   price: string;
   title: string;
   transmission: Transmission;
   productionYear: string;
   images: File[];
   mileage: number;
}

export default function CreateListingForm() {
   const listingApi = ListingApi.getSingleton();
   const createListingMutation = useMutation({
      mutationFn: (fd: FormData) => listingApi.create(fd),
   });

   const [imagesCount, setImagesCount] = useState<number | undefined>(
      undefined,
   );

   const {
      handleSubmit,
      register,
      setValue,
      watch,
      formState: { isSubmitting },
      reset,
   } = useForm<FormValues>();

   const imagesInputRef = useRef<HTMLInputElement>(null);
   const registerImages = register('images');

   const [
      currency,
      bodyStyle,
      fuelType,
      carStatus,
      drivetrain,
      transmission,
      images,
   ] = watch([
      'currency',
      'bodyStyle',
      'fuelType',
      'carStatus',
      'drivetrain',
      'transmission',
      'images',
   ]);

   console.log(images);

   const onSubmit = handleSubmit(async (values) => {
      const dto: CreateListing = {
         title: values.title,
         brand: values.brand,
         model: values.model,
         description: values.description || undefined,
         images: values.images || [],
         listingStatus: ListingStatus.Available,
         mileage: values.mileage || undefined,
         productionYear: +values.productionYear || undefined,
         price: +values.price || undefined,
         transmission: values.transmission || undefined,
         color: values.color || undefined,
         bodyStyle: values.bodyStyle || undefined,
         currency: values.currency || undefined,
         fuelType: values.fuelType || undefined,
         drivetrain: values.drivetrain || undefined,
         carStatus: values.carStatus || undefined,
         metadataCreatedAt: new Date().toISOString(),
         metadataPlatform: Platform.Carhive,
      };
      const fd = new FormData();
      for (const [key, value] of Object.entries(dto)) {
         if (key === 'images') {
            for (const im of value) {
               fd.append('images', im);
            }
         } else {
            if (value === '' || value === undefined) {
               continue;
            }
            fd.append(key, value);
         }
      }
      try {
         await createListingMutation.mutateAsync(fd);
         reset();
         imagesInputRef.current!.value = '';
         setImagesCount(undefined);
         toast('Success');
      } catch (err) {
         toast.error('Something went wrong');
         console.error(err);
      }
   });

   return (
      <>
         <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
            <div className="flex w-full flex-col gap-3">
               <TextField.Root
                  {...register('brand')}
                  required
                  placeholder="Brand"
               />
               <TextField.Root
                  {...register('model')}
                  required
                  placeholder="Model"
               />
               <TextField.Root {...register('color')} placeholder="Color" />
               <TextField.Root {...register('title')} required placeholder="Title" />
               <TextField.Root
                  {...register('mileage')}
                  type="number"
                  min="0"
                  placeholder="Mileage (km)"
               />
               <TextField.Root
                  {...register('price')}
                  type="number"
                  min="0"
                  placeholder="Price"
               />
               <TextField.Root
                  {...register('productionYear')}
                  type="number"
                  min="0"
                  placeholder="Production year"
               />
               <TextArea
                  {...register('description')}
                  name="description"
                  placeholder="Description"
               />
            </div>
            <div className="flex flex-row flex-wrap gap-3">
               <Select.Root
                  value={currency}
                  onValueChange={(v) => setValue('currency', v as Currency)}
               >
                  <Select.Trigger placeholder="Currency" />
                  <Select.Content>
                     {Object.values(Currency).map((v) => (
                        <Select.Item key={v} value={v}>
                           {v[0].toUpperCase() + v.slice(1)}
                        </Select.Item>
                     ))}
                  </Select.Content>
               </Select.Root>

               <Select.Root
                  value={bodyStyle}
                  onValueChange={(v) => setValue('bodyStyle', v as BodyStyle)}
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
                  value={fuelType}
                  onValueChange={(v) => setValue('fuelType', v as FuelType)}
               >
                  <Select.Trigger placeholder="Fuel type" />
                  <Select.Content>
                     {Object.values(FuelType).map((v) => (
                        <Select.Item key={v} value={v}>
                           {v[0].toUpperCase() + v.slice(1)}
                        </Select.Item>
                     ))}
                  </Select.Content>
               </Select.Root>

               <Select.Root
                  value={carStatus}
                  onValueChange={(v) => setValue('carStatus', v as CarStatus)}
                  required
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
                  value={drivetrain}
                  onValueChange={(v) => setValue('drivetrain', v as Drivetrain)}
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
                  value={transmission}
                  onValueChange={(v) =>
                     setValue('transmission', v as Transmission)
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

               <Button
                  type="button"
                  onClick={() => imagesInputRef.current?.click()}
               >
                  Upload images {!!imagesCount && `(${imagesCount})`}
               </Button>
            </div>

            <Button type="submit" className="!px-6" disabled={isSubmitting}>
               Create
            </Button>
            <input
               {...registerImages}
               ref={(el) => {
                  registerImages.ref(el);
                  imagesInputRef.current = el;
               }}
               className="absolute h-0 max-h-0 w-0 max-w-0 overflow-hidden opacity-0"
               type="file"
               multiple
               accept="image/*"
            />
         </form>
      </>
   );
}
