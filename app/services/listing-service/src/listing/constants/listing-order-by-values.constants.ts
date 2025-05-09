import { ListingOrderBy } from '@/listing/enums';

// typeorm order by + offset + take bug https://github.com/typeorm/typeorm/issues/4742#issuecomment-783857414
export const LISTING_ORDER_BY_VALUES: Record<
   ListingOrderBy,
   [string, 'ASC' | 'DESC']
> = {
   createdAtAsc: ['createdAt', 'ASC'],
   createdAtDesc: ['createdAt', 'DESC'],
   yearAsc: ['production_year', 'ASC'],
   yearDesc: ['production_year', 'DESC'],
   priceAsc: ['price', 'ASC'],
   priceDesc: ['price', 'DESC'],
};
