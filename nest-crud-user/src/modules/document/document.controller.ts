import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dtos/createDocument.dto';
import { UpdateDocumentDto } from './dtos/updateDocument.dto';
import { Document } from './entity/document.entity';

@Controller('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @UseGuards(new RoleGuard(['admin']))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'file'],
      properties: {
        title: {
          type: 'string',
          example: 'Bộ luật Dân sự 2015',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseData<Document>> {
    const document = await this.documentService.uploadDocument(
      createDocumentDto,
      file,
    );

    return new ResponseData<Document>(
      document,
      HttpStatus.CREATED,
      HttpMessage.CREATED,
    );
  }

  @Get()
  @UseGuards(new RoleGuard(['admin']))
  async findAll(
    @Query('search') search?: string,
  ): Promise<ResponseData<Document[]>> {
    const documents = await this.documentService.findAll(search);

    return new ResponseData<Document[]>(
      documents,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @Get(':id/view-url')
  @UseGuards(new RoleGuard(['admin']))
  async getViewUrl(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<{ url: string; expiresInSeconds: number }>> {
    const expiresInSeconds = 60 * 5;

    const url = await this.documentService.getViewUrl(id, expiresInSeconds);

    if (!url) {
      throw new NotFoundException(
        new ResponseData<null>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        ),
      );
    }

    return new ResponseData<{ url: string; expiresInSeconds: number }>(
      {
        url,
        expiresInSeconds,
      },
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['admin']))
  async updateTitle(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<ResponseData<Document>> {
    const document = await this.documentService.updateTitle(
      id,
      updateDocumentDto,
    );

    if (!document) {
      throw new NotFoundException(
        new ResponseData<Document>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        ),
      );
    }

    return new ResponseData<Document>(document, HttpStatus.OK, HttpMessage.OK);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<Document>> {
    const document = await this.documentService.softDelete(id);

    if (!document) {
      throw new NotFoundException(
        new ResponseData<Document>(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND,
        ),
      );
    }

    return new ResponseData<Document>(document, HttpStatus.OK, HttpMessage.OK);
  }
}
