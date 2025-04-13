'use client';

import { Button, Select, TextArea, TextField } from '@radix-ui/themes';
import { Field, Form, Formik } from 'formik';
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
import { CreateListing } from '@/types/listing';

const initialValues = {
   brand: '',
   model: '',
   color: '',
   bodyStyle: '',
   carStatus: '',
   currency: '',
   description: '',
   drivetrain: '',
   fuelType: '',
   listingStatus: '',
   price: '',
   title: '',
   transmission: '',
   productionYear: '',
};

export default function NewListingForm() {
   const listingApi = ListingApi.getSingleton();
   const createListingMutation = useMutation({
      mutationFn: (dto: CreateListing) => listingApi.create(dto),
   });

   const createListing = async (values: typeof initialValues) => {
      await createListingMutation.mutateAsync({
         title: values.title,
         brand: values.brand,
         model: values.model,
         description: values.description || undefined,
         images: [],
         listingStatus: ListingStatus.Available,
         productionYear: +values.productionYear || undefined,
         price: +values.price || undefined,
         transmission: (values.transmission as Transmission) || undefined,
         color: values.color || undefined,
         bodyStyle: (values.bodyStyle as BodyStyle) || undefined,
         currency: (values.currency as Currency) || undefined,
         fuelType: (values.fuelType as FuelType) || undefined,
         drivetrain: (values.drivetrain as Drivetrain) || undefined,
         carStatus: (values.carStatus as CarStatus) || undefined,
         metadata: {
            createdAt: new Date(),
         },
      } satisfies CreateListing);
   };

   return (
      <Formik initialValues={initialValues} onSubmit={createListing}>
         {({ isSubmitting, values, setFieldValue }) => (
            <Form>
               <TextField.Root name="brand" required placeholder="Brand" />
               <TextField.Root name="model" required placeholder="Model" />
               <TextField.Root name="color" placeholder="Color" />
               <TextField.Root name="title" placeholder="Title" />
               <TextField.Root
                  name="price"
                  type="number"
                  min="0"
                  placeholder="Price"
               />
               <TextField.Root
                  name="productionYear"
                  type="number"
                  min="0"
                  placeholder="Production year"
               />
               <Field
                  as={TextArea}
                  name="description"
                  placeholder="Description"
               />

               <Select.Root
                  value={values.currency}
                  onValueChange={(v) => setFieldValue('currency', v)}
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
                  value={values.bodyStyle}
                  onValueChange={(v) => setFieldValue('bodyStyle', v)}
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
                  value={values.fuelType}
                  onValueChange={(v) => setFieldValue('fuelType', v)}
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
                  value={values.carStatus}
                  onValueChange={(v) => setFieldValue('carStatus', v)}
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
                  value={values.drivetrain}
                  onValueChange={(v) => setFieldValue('drivetrain', v)}
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
                  value={values.transmission}
                  onValueChange={(v) => setFieldValue('transmission', v)}
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

               <Button type="submit" disabled={isSubmitting}>
                  Create
               </Button>
            </Form>
         )}
      </Formik>
   );
}
