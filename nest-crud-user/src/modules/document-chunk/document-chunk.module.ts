import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentChunkController } from './document-chunk.controller';
import { DocumentChunkService } from './document-chunk.service';
import { DocumentChunk } from './entity/documentChunk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentChunk])],
  controllers: [DocumentChunkController],
  providers: [DocumentChunkService],
})
export class DocumentChunkModule {}
