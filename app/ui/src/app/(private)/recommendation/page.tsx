import { RecommendationInput, RecommendationList } from '@/components';
import { PageProps } from '@/types/next';

export default async function RecommendationPage(props: PageProps) {
   return (
      <main>
         <RecommendationInput />
         <RecommendationList />
      </main>
   );
}
