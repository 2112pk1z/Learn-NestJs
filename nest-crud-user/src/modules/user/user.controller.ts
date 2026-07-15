import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
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
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @Get()
  @UseGuards(new RoleGuard(['admin']))
  async findAll(): Promise<ResponseData<User>> {
    const users = await this.userService.findAll();

    return new ResponseData<User>(users, HttpStatus.OK, HttpMessage.OK);
  }

  @UseGuards(new RoleGuard(['admin']))
  @ApiGetUserById()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<User>> {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException(
        new ResponseData<User>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        ),
      );
    }

    return new ResponseData<User>(user, HttpStatus.OK, HttpMessage.OK);
  }

  @ApiUpdateUser()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<ResponseData<User>> {
    const updatedUser = await this.userService.update(
      id,
      updateUserDto,
      req.user as User,
    );

    if (updatedUser.type === 'FORBIDDEN') {
      throw new ForbiddenException(
        new ResponseData<User>(
          null,
          HttpStatus.FORBIDDEN,
          HttpMessage.FORBIDDEN,
        ),
      );
    }

    if (updatedUser.type === 'NOT_FOUND') {
      throw new NotFoundException(
        new ResponseData<User>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        ),
      );
    }

    return new ResponseData<User>(
      updatedUser.user,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @UseGuards(new RoleGuard(['admin']))
  @ApiDeleteUser()
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<{ deletedId: number }>> {
    const isDeleted = await this.userService.remove(id);

    if (!isDeleted) {
      throw new NotFoundException(
        new ResponseData<{ deletedId: number }>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        ),
      );
    }

    return new ResponseData<{ deletedId: number }>(
      { deletedId: id },
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }
}
