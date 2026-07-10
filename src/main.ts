import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
    transform: true, // Tự động chuyển đổi kiểu dữ liệu (vĩ dụ: string thành number ở param)
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // --- Cấu hình Swagger ---
  const config = new DocumentBuilder()
    .setTitle('AI Legal Chatbot API')
    .setDescription('Tài liệu API quản lý hệ thống (Tuần 1)')
    .setVersion('1.0')
    .addBearerAuth() // Chuẩn bị sẵn cho phần JWT của Tuần 2
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // ------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();