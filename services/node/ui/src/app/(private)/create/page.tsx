import { Card } from '@radix-ui/themes';

import { NewListingForm } from '@/components';

export default function CreateListingPage() {
   return (
      <div>
         <Card className="max-w-[620px]">
            <NewListingForm />
         </Card>
      </div>
   );
}
