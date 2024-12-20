import {
   BadRequestException,
   ConflictException,
   Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';

import { User } from './entities/user.entity';
import { CreateUserDto } from '@/user/dto/request/create-user.dto';
import { UpdateUserDto } from '@/user/dto/request/update-user.dto';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User) private readonly _userRepo: Repository<User>,
   ) {}

   findOne(id: number): Promise<User | null> {
      return this._userRepo.findOneBy({ id });
   }

   findOneByEmail(email: string): Promise<User | null> {
      return this._userRepo.findOneBy({ email });
   }

   async create(dto: CreateUserDto): Promise<User> {
      const user = new User();

      user.email = dto.email;
      user.username = dto.username;
      user.password = await bcrypt.hash(dto.password, 13);
      user.createdAt = new Date();
      user.role = dto.role;

      return this._userRepo.save(user);
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

      return await this._userRepo.save(user);
   }

   async delete(user: User): Promise<User> {
      user.deleted = true;
      user.deletedAt = new Date();
      return this._userRepo.save(user);
   }

   async restore(user: User): Promise<User> {
      user.deleted = false;
      user.deletedAt = null;
      return this._userRepo.save(user);
   }

   async get(offset: number, limit: number): Promise<[User[], number]> {
      return this._userRepo.findAndCount({
         take: limit,
         skip: offset,
      });
   }
}
