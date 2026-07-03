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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { CreateUserDto } from './dto/createUserRequest.dto';
import { UpdateUserDto } from './dto/UpdateUserRequest.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Quản lý người dùng (Users)') // Đổi tên nhóm hiển thị trên Swagger UI
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo mới một người dùng',
    description: 'Endpoint này tiếp nhận thông tin đăng ký, tự động mã hóa mật khẩu bằng Bcrypt và lưu trữ vào cơ sở dữ liệu PostgreSQL.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo tài khoản người dùng thành công.',
    type: ResponseData, // Chỉ định cấu trúc phản hồi tổng thể
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi hệ thống không mong muốn phát sinh tại server.',
  })
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
  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng',
    description: 'Truy vấn toàn bộ danh sách người dùng đang có trong hệ thống.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy dữ liệu thành công.',
  })
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
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết một người dùng theo ID',
    description: 'Tìm kiếm và trả về thông tin chi tiết của một người dùng dựa trên ID số nguyên được cung cấp.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mã số định danh (ID) của người dùng trong hệ thống',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tìm thấy thông tin người dùng.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy người dùng tương ứng với ID đã truyền.',
  })
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
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật một hoặc nhiều trường thông tin của người dùng. Nếu có thay đổi mật khẩu, hệ thống sẽ tự động băm lại mật khẩu mới.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng cần cập nhật thông tin',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin thành công.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy tài khoản người dùng để cập nhật.',
  })
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
  @ApiOperation({
    summary: 'Xóa người dùng khỏi hệ thống',
    description: 'Xóa hoàn toàn bản ghi người dùng ra khỏi cơ sở dữ liệu dựa trên ID truyền vào.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng cần xóa',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa người dùng thành công, trả về ID đã bị xóa.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy người dùng tương ứng với ID để thực hiện thao tác xóa.',
  })
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