import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Xác định trạng thái lỗi (Mặc định là 500 nếu lỗi không xác định)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Lấy thông báo lỗi chi tiết (Đặc biệt là lỗi từ ValidationPipe)
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = exception.message || 'Lỗi hệ thống không mong muốn';
    
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      // Nếu là lỗi validation của class-validator, lấy mảng thông báo lỗi đầu tiên
      message = (exceptionResponse as any).message || message;
    }

    // Ghi nhận log lỗi ra terminal
    console.error('--- [GLOBAL ERROR LOG] ---');
    console.error(exception);

    // Trả về cấu trúc JSON đồng nhất chuẩn của bạn
    response.status(status).json({
      data: null,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message, // Nếu có nhiều lỗi validation, lấy lỗi đầu tiên
    });
  }
}