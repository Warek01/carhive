'use client';

import { Button } from '@radix-ui/themes';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

interface Props {
   className?: string;
   arrowProps?: ComponentProps<typeof ArrowLeftIcon>;
}

export default function GoBackButton({ className, arrowProps }: Props) {
   const router = useRouter();

   return (
      <Button onClick={router.back} variant="ghost" className={cn(className)}>
         <ArrowLeftIcon {...arrowProps} />
         Back
      </Button>
   );
}
