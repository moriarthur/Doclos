import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { StorageModule } from './modules/storage/storage.module';
import { OcrModule } from './modules/ocr/ocr.module';
import { AiModule } from './modules/ai/ai.module';
import { dataSourceOptions } from './database/data-source';

// Part 1: System Architecture - Root application module

@Module({
  imports: [
    // Configuration - loads .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // Database - TypeORM with PostgreSQL
    TypeOrmModule.forRoot(dataSourceOptions),

    // Queue - BullMQ with Redis
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),

    // Feature modules
    StorageModule,
    OcrModule,
    AiModule,
    AuthModule,
    DocumentsModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
