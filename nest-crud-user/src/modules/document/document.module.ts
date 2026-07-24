import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '../minio/minio.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './entity/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), MinioModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
