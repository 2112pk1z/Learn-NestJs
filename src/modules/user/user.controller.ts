import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdateUserDto } from './dtos/UpdateUserRequest.dto';
import { User } from './entity/user.entity';
import {
  ApiDeleteUser,
  ApiGetUserById,
  ApiGetUsers,
  ApiUpdateUser,
} from './swagger/user.swagger';
import { UserService } from './user.service';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async create(
  //   @Body() createUserDto: CreateUserDto,
  // ): Promise<ResponseData<User>> {
  //   try {
  //     const newUser = await this.userService.create(createUserDto);
  //     return new ResponseData<User>(
  //       newUser,
  //       HttpStatus.CREATED,
  //       HttpMessage.CREATED,
  //     );
  //   } catch (error) {
  //     console.error('Lỗi khi tạo user:', error);
  //     return new ResponseData<User>(
  //       null,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       HttpMessage.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @ApiGetUsers()
  @Get()
  @UseGuards(new RoleGuard(['admin']))
  async findAll(): Promise<ResponseData<User>> {
    try {
      const users = await this.userService.findAll();
      if (!users || users.length === 0) {
        return new ResponseData<User>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        );
      }
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

  @ApiGetUserById()
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

  @ApiUpdateUser()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<ResponseData<User>> {
    try {
      const updatedUser = await this.userService.update(
        +id,
        updateUserDto,
        req.user as User,
      );

      if (updatedUser.type === 'FORBIDDEN') {
        return new ResponseData<User>(
          null,
          HttpStatus.FORBIDDEN,
          HttpMessage.FORBIDDEN,
        );
      }

      if (updatedUser.type === 'NOT_FOUND') {
        return new ResponseData<User>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        );
      }

      return new ResponseData<User>(
        updatedUser.user,
        HttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      console.error(`Lỗi cập nhật user ID ${id}:`, error);
      return new ResponseData<User>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(new RoleGuard(['admin']))
  @ApiDeleteUser()
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
