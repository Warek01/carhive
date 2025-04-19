import { Card } from '@radix-ui/themes';

import { CreateListingForm } from '@/components';

export default function CreateListingPage() {
   return (
      <div className="flex flex-1 items-center justify-center">
         <Card className="max-w-[620px]">
            <CreateListingForm />
         </Card>
      </div>
   );
}
