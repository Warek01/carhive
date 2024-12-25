import {
   Column,
   Entity,
   JoinColumn,
   OneToOne,
   PrimaryColumn,
   Relation,
} from 'typeorm';

import { ListingAuthor } from '@/listing/types/listing-author.types';
import { Listing } from '@/listing/entities/listing.entity';

@Entity('listing_metadata')
export class ListingMetadata {
   @PrimaryColumn({ name: 'listing_id', type: 'int' })
   listingId: number;

   @Column({ name: 'original_id', length: 255 })
   originalId: string;

   @Column({ name: 'full_url', length: 255 })
   fullUrl: string;

   @Column({ name: 'relative_url', length: 255 })
   relativeUrl: string;

   @Column({ name: 'created_at' })
   createdAt: Date;

   @OneToOne(() => Listing, (listing) => listing.metadata)
   @JoinColumn({
      name: 'listing_id',
      referencedColumnName: 'id',
   })
   listing?: Relation<Listing>;

   @Column({ name: 'author', type: 'jsonb', nullable: true })
   author?: ListingAuthor;
}
