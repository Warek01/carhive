import {
   BadRequestException,
   ConflictException,
   Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { validate } from 'class-validator';

import { User } from '@/user/entities/user.entity';
import { CreateUserDto } from '@/user/dto/request/create-user.dto';
import { UpdateUserDto } from '@/user/dto/request/update-user.dto';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User) private readonly userRepo: Repository<User>,
   ) {}

   findOne(id: number): Promise<User | null> {
      return this.userRepo.findOneBy({ id });
   }

   findOneByEmail(email: string): Promise<User | null> {
      return this.userRepo.findOneBy({ email });
   }

   async create(dto: CreateUserDto): Promise<User> {
      const user = new User();

      user.email = dto.email;
      user.username = dto.username;
      user.password = await hash(dto.password, 13);
      user.createdAt = new Date();
      user.role = dto.role;

      return this.userRepo.save(user);
   }

   async update(user: User, updateDto: UpdateUserDto): Promise<User> {
      if (updateDto.email) {
         const existingUser = await this.findOneByEmail(updateDto.email);
         if (existingUser !== null) {
            throw new ConflictException('email already taken');
         }
      }

      Object.entries(updateDto).forEach(([key, value]) => {
         if (value !== undefined) {
            (user as any)[key] = value;
         }
      });

      const errors = await validate(user);

      if (errors.length) {
         throw new BadRequestException(errors[0]);
      }

      return await this.userRepo.save(user);
   }

   async delete(user: User): Promise<User> {
      user.deleted = true;
      user.deletedAt = new Date();
      return this.userRepo.save(user);
   }

   async restore(user: User): Promise<User> {
      user.deleted = false;
      user.deletedAt = null;
      return this.userRepo.save(user);
   }

   async get(offset: number, limit: number): Promise<[User[], number]> {
      return this.userRepo.findAndCount({
         take: limit,
         skip: offset,
      });
   }

   async existsByUsername(username: string): Promise<boolean> {
      return this.userRepo.existsBy({ username });
   }

   async existsByEmail(email: string): Promise<boolean> {
      return this.userRepo.existsBy({ email });
   }
}
