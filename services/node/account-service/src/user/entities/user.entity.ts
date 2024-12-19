import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
   @PrimaryGeneratedColumn()
   id: number = null!;

   @Column({ name: 'email', length: 255 })
   email: string = null!;

   @Column({ name: 'username', length: 255 })
   username: string = null!;

   @Column({ name: 'password', length: 255 })
   password: string = null!;

   @CreateDateColumn({ name: 'created_at' })
   createdAt: Date = null!;
}
