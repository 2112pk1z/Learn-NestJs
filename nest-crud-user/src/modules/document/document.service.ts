import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { MinioService } from '../minio/minio.service';
import { CreateDocumentDto } from './dtos/createDocument.dto';
import { UpdateDocumentDto } from './dtos/updateDocument.dto';
import { Document } from './entity/document.entity';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    private readonly minioService: MinioService,
  ) {}

  async uploadDocument(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only PDF, DOCX, and TXT files are allowed',
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size must not exceed 10MB');
    }

    const extension = extname(file.originalname).toLowerCase();
    const objectKey = `documents/${randomUUID()}${extension}`;

    const storedMimeType =
      file.mimetype === 'text/plain'
        ? 'text/plain; charset=utf-8'
        : file.mimetype;

    await this.minioService.uploadBuffer({
      objectKey,
      buffer: file.buffer,
      mimeType: storedMimeType,
    });

    const document = this.documentRepository.create({
      title: createDocumentDto.title,
      originalFileName: file.originalname,
      objectKey,
      mimeType: storedMimeType,
      size: file.size,
      status: true,
    });

    this.logger.log(`Document uploaded title=${document.title}`);

    return this.documentRepository.save(document);
  }

  async findAll(search?: string): Promise<Document[]> {
    const query = this.documentRepository
      .createQueryBuilder('document')
      .where('document.status = :status', { status: true })
      .orderBy('document.uploadedAt', 'DESC');

    if (search?.trim()) {
      query.andWhere('LOWER(document.title) LIKE LOWER(:search)', {
        search: `%${search.trim()}%`,
      });
    }

    return query.getMany();
  }

  async updateTitle(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document | null> {
    const document = await this.documentRepository.findOne({
      where: {
        id,
        status: true,
      },
    });

    if (!document) {
      return null;
    }

    document.title = updateDocumentDto.title;

    return this.documentRepository.save(document);
  }

  async softDelete(id: number): Promise<Document | null> {
    const document = await this.documentRepository.findOne({
      where: {
        id,
        status: true,
      },
    });

    if (!document) {
      return null;
    }

    document.status = false;

    return this.documentRepository.save(document);
  }

  async getViewUrl(
    id: number,
    expiresInSeconds = 60 * 5,
  ): Promise<string | null> {
    const document = await this.documentRepository.findOne({
      where: {
        id,
        status: true,
      },
    });

    if (!document) {
      return null;
    }

    const responseContentType =
      document.mimeType === 'text/plain' ||
      document.mimeType === 'text/plain; charset=utf-8'
        ? 'text/plain; charset=utf-8'
        : document.mimeType;

    return this.minioService.getPresignedGetUrl(
      document.objectKey,
      expiresInSeconds,
      responseContentType,
    );
  }
}
