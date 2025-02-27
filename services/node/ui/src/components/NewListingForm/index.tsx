'use client';

import { Button, Select, TextArea } from '@radix-ui/themes';
import { Field, Form, Formik } from 'formik';
import { useMutation } from 'react-query';

import { ListingApi } from '@/api';
import { AppTextField } from '@/components';
import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
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
      console.log(values);
   };

   return (
      <Formik initialValues={initialValues} onSubmit={createListing}>
         {({ isSubmitting, values, setFieldValue }) => (
            <Form>
               <AppTextField name="brand" placeholder="Brand" />
               <AppTextField name="model" placeholder="Model" />
               <AppTextField name="color" placeholder="Color" />
               <AppTextField name="title" placeholder="Title" />
               <AppTextField
                  name="price"
                  type="number"
                  min="0"
                  placeholder="Price"
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
