import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseData<User>> {
    try {
      const newUser = await this.userService.create(createUserDto);
      return new ResponseData<User>(
        newUser,
        HttpStatus.CREATED,
        HttpMessage.CREATED,
      );
    } catch (error) {
      console.error('Lỗi khi tạo user:', error);
      return new ResponseData<User>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<ResponseData<User>> {
    try {
      const users = await this.userService.findAll();
      return new ResponseData<User>(users, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      console.log(error);
      return new ResponseData<User>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseData<User>> {
    try {
      const user = await this.userService.findOne(+id);

      if (!user) {
        return new ResponseData<User>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        );
      }

      return new ResponseData<User>(user, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      console.error(`Lỗi lấy user ID ${id}:`, error);
      return new ResponseData<User>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseData<User>> {
    try {
      const updatedUser = await this.userService.update(+id, updateUserDto);

      if (!updatedUser) {
        return new ResponseData<User>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        );
      }

      return new ResponseData<User>(updatedUser, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      console.error(`Lỗi cập nhật user ID ${id}:`, error);
      return new ResponseData<User>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<ResponseData<{ deletedId: number }>> {
    try {
      const isDeleted = await this.userService.remove(+id);

      if (!isDeleted) {
        return new ResponseData<{ deletedId: number }>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        );
      }

      return new ResponseData<{ deletedId: number }>(
        { deletedId: +id },
        HttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      console.error(`Lỗi xóa user ID ${id}:`, error);
      return new ResponseData<{ deletedId: number }>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
