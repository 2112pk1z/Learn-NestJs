import { Module } from '@nestjs/common';
import { DocumentChunkService } from './document-chunk.service';
import { DocumentChunkController } from './document-chunk.controller';

@Module({
  controllers: [DocumentChunkController],
  providers: [DocumentChunkService],
})
export class DocumentChunkModule {}
