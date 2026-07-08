import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PermissionChecker } from 'src/helpers/checkPermission.helper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUserRequest.dto';
import { UpdateUserDto } from './dtos/UpdateUserRequest.dto';
import { User } from './entity/user.entity';
import { Role } from './enums/role.enum';

export type UpdateUserResult =
  | { type: 'SUCCESS'; user: User }
  | { type: 'FORBIDDEN' }
  | { type: 'NOT_FOUND' };

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    this.logger.log(`Attempting to create user email=${createUserDto.email}`);
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      this.logger.warn(
        `Create user failed. Email already exists email=${createUserDto.email}`,
      );
      return null;
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      role: Role.USER,
    });
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    newUser.password = hashedPassword;
    // this.logger.log(`User created email=${createUserDto.email}`);
    // return this.userRepository.save(newUser);
    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`User created email=${createUserDto.email}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<UpdateUserResult> {
    this.logger.log(`Attempting to update user id=${id}`);
    if (!PermissionChecker.checkPermission(id, currentUser)) {
      this.logger.warn(
        `Update user failed. User does not have permission to update id=${id}`,
      );
      return { type: 'FORBIDDEN' };
    }
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.logger.warn(`Update user failed. User not found id=${id}`);
      return { type: 'NOT_FOUND' };
    }
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    await this.userRepository.update(id, updateUserDto);
    this.logger.log(`User updated id=${id}`);
    const updatedUser = await this.userRepository.findOneBy({ id });
    return {
      type: 'SUCCESS',
      user: updatedUser!,
    };
  }

  async remove(id: number): Promise<boolean> {
    this.logger.log(`Deleting user id=${id}`);
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      this.logger.warn(`Delete failed. User not found id=${id}`);
      return false;
    }
    this.logger.log(`User deleted id=${id}`);
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user) {
      return null;
    }
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
      return null;
    }
    return user;
  }
}
