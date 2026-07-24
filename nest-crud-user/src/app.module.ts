import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitialDataService } from './database/initData.service';
import { AuthModule } from './modules/auth/auth.module';
import { ChatMessagesModule } from './modules/chat-messages/chat-messages.module';
import { ChatSessionModule } from './modules/chat-session/chat-session.module';
import { DocumentChunkModule } from './modules/document-chunk/document-chunk.module';
import { DocumentModule } from './modules/document/document.module';
import { MinioModule } from './modules/minio/minio.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
    }),
    UserModule,
    AuthModule,
    ChatSessionModule,
    ChatMessagesModule,
    DocumentModule,
    DocumentChunkModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    InitialDataService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
