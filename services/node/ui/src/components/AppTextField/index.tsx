'use client';

import { TextField } from '@radix-ui/themes';
import { FieldAttributes, useField } from 'formik';
import { PropsWithChildren } from 'react';

export default function AppTextField({
   children,
   ...props
}: PropsWithChildren<FieldAttributes<any>>) {
   const [field, meta] = useField(props);

   return (
      <div>
         <TextField.Root {...field} {...props}>
            {children && <TextField.Slot>{children}</TextField.Slot>}
         </TextField.Root>
         {meta.touched && meta.error && (
            <p className="text-xs text-red-600">{meta.error}</p>
         )}
      </div>
   );
}
