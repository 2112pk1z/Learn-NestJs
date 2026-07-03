import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

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