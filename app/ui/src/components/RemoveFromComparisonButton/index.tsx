'use client';

import { Button } from '@radix-ui/themes';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useComparison } from '@/hooks/use-comparison';

interface Props {
   listingId: number;
}

export default function RemoveFromComparisonButton({ listingId }: Props) {
   const cmp = useComparison();
   const router = useRouter();

   const handleClick = () => {
      const filtered = cmp.remove(listingId);
      router.push(cmp.getUrl(filtered));
   };

   return (
      <Button variant="outline" color="red" onClick={handleClick}>
         Remove
         <X size={16} />
      </Button>
   );
}
