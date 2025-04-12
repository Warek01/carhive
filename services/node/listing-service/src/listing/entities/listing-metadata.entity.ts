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
import { Platform } from '@/listing/enums';

@Entity('listing_metadata')
export class ListingMetadata {
   @PrimaryColumn({ name: 'listing_id', type: 'int' })
   listingId: number;

   @Column({ name: 'original_id', length: 255, nullable: true, unique: true })
   originalId?: string;

   @Column({ name: 'url', length: 255, nullable: true })
   url?: string;

   @Column({ name: 'created_at' })
   createdAt: Date;

   @Column({
      name: 'platform',
      type: 'enum',
      enum: Platform,
      enumName: 'platform',
      nullable: true,
   })
   platform?: Platform;

   @OneToOne(() => Listing, (listing) => listing.metadata, {
      onDelete: 'CASCADE',
      cascade: true,
   })
   @JoinColumn({
      name: 'listing_id',
      referencedColumnName: 'id',
   })
   listing?: Relation<Listing>;

   @Column({ name: 'author', type: 'jsonb', nullable: true })
   author?: ListingAuthor;
}
