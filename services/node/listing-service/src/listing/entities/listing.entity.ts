import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   Index,
} from 'typeorm';

@Entity('listing')
export class Listing {
   @PrimaryGeneratedColumn('identity', { name: 'id', type: 'int' })
   id: number = null!;

   @Column({ name: 'brand', nullable: true, type: 'varchar', length: 255 })
   @Index()
   brand: string | null = null;

   @Column({ name: 'model', nullable: true, type: 'varchar', length: 255 })
   @Index()
   model: string | null = null;

   @Column({ name: 'price', nullable: true, type: 'float' })
   price: number | null = null;

   @Column({ name: 'publish_date', type: 'timestamp' })
   publishDate: Date = null!;

   @CreateDateColumn({ name: 'created_at' })
   createdAt: Date = null!;
}
