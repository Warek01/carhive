'use client';

import { TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

import { appRoute } from '@/config/app-route';
import { useComparison } from '@/hooks/use-comparison';

export default function ClearComparisonButton() {
   const cmp = useComparison();
   const router = useRouter();

   const handleClick = () => {
      cmp.clear();
      router.push(appRoute.home());
   };

   return (
      <Button className="!my-3" color="red" onClick={handleClick}>
         Clear Selection
         <TrashIcon />
      </Button>
   );
}
