import { Controller } from '@nestjs/common';
import { DocumentChunkService } from './document-chunk.service';

@Controller('document-chunk')
export class DocumentChunkController {
  constructor(private readonly documentChunkService: DocumentChunkService) {}
}
