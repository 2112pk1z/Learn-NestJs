import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly internalClient: Minio.Client;
  private readonly publicClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    const accessKey = this.configService.getOrThrow<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.getOrThrow<string>('MINIO_SECRET_KEY');
    const region =
      this.configService.get<string>('MINIO_REGION') ?? 'us-east-1';

    this.internalClient = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: Number(this.configService.getOrThrow<string>('MINIO_PORT')),
      useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey,
      secretKey,
      region,
    });

    this.publicClient = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_PUBLIC_ENDPOINT'),
      port: Number(this.configService.getOrThrow<string>('MINIO_PUBLIC_PORT')),
      useSSL: this.configService.get<string>('MINIO_PUBLIC_USE_SSL') === 'true',
      accessKey,
      secretKey,
      region,
    });
  }

  async onModuleInit(): Promise<void> {
    const exists = await this.internalClient.bucketExists(this.bucketName);

    if (!exists) {
      await this.internalClient.makeBucket(this.bucketName);
      this.logger.log(`Created MinIO bucket=${this.bucketName}`);
      return;
    }

    this.logger.log(`MinIO bucket ready=${this.bucketName}`);
  }

  async uploadBuffer(params: {
    objectKey: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<void> {
    await this.internalClient.putObject(
      this.bucketName,
      params.objectKey,
      params.buffer,
      params.buffer.length,
      {
        'Content-Type': params.mimeType,
      },
    );

    this.logger.log(`Uploaded object to MinIO key=${params.objectKey}`);
  }

  async getPresignedGetUrl(
    objectKey: string,
    expiryInSeconds = 60 * 5,
    responseContentType?: string,
  ): Promise<string> {
    if (responseContentType) {
      return this.publicClient.presignedGetObject(
        this.bucketName,
        objectKey,
        expiryInSeconds,
        {
          'response-content-type': responseContentType,
        },
      );
    }

    return this.publicClient.presignedGetObject(
      this.bucketName,
      objectKey,
      expiryInSeconds,
    );
  }
}
