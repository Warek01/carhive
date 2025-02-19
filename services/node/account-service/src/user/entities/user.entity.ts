import {
   Column,
   CreateDateColumn,
   Entity,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '@/user/enums/user-role.enum';

@Entity('users')
export class User {
   @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
   id: number = null!;

   @Column({ name: 'email', length: 255, nullable: false, unique: true })
   email: string = null!;

   @Column({ name: 'username', length: 255, nullable: false })
   username: string = null!;

   @Column({ name: 'password', length: 255, nullable: false })
   password: string = null!;

   @CreateDateColumn({ name: 'created_at', nullable: false })
   createdAt: Date = new Date();

   @Column({
      name: 'role',
      enumName: 'user_role',
      enum: UserRole,
      type: 'enum',
      nullable: false,
   })
   role: UserRole = UserRole.User;

   @Column({ name: 'deleted', nullable: false })
   deleted: boolean = false;

   @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
   deletedAt: Date | null = null;

   @Column({ name: 'preferences', type: 'varchar', nullable: true })
   preferences: string | null = null;
}
