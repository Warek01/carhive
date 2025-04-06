import {
   Entity,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   Column,
} from 'typeorm';

import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

@Entity('list_scrapes')
export class ListScrape {
   @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
   id: number;

   @Column({
      name: 'platform',
      type: 'enum',
      enum: SupportedPlatform,
      enumName: 'supported_platform',
   })
   platform: SupportedPlatform;

   @Column({
      name: 'start_page',
      type: 'int',
      nullable: true,
   })
   startPage?: number;

   @Column({
      name: 'end_page',
      type: 'int',
      nullable: true,
   })
   endPage?: number;

   @Column({
      name: 'success',
      type: 'bool',
   })
   success: boolean;

   @Column({ name: 'error', type: 'jsonb', nullable: true })
   error?: object;

   @CreateDateColumn({ name: 'created_at' })
   createdAt: Date;
}
