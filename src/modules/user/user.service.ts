import { Injectable } from '@nestjs/common';
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
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      return null;
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      role: Role.USER,
    });
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    newUser.password = hashedPassword;
    return this.userRepository.save(newUser);
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
    if (!PermissionChecker.checkPermission(id, currentUser)) {
      return { type: 'FORBIDDEN' };
    }
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return { type: 'NOT_FOUND' };
    }
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    await this.userRepository.update(id, updateUserDto);

    const updatedUser = await this.userRepository.findOneBy({ id });
    return {
      type: 'SUCCESS',
      user: updatedUser!,
    };
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
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
