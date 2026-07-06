// src/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Đọc file .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Trỏ tới tất cả các file entity hiện có
  entities: ['src/**/*.entity{.ts,.js}'],
  // Nơi lưu trữ các file migration sẽ được sinh ra
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
});