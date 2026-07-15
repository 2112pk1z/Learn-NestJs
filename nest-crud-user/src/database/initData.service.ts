import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/entity/user.entity';
import { Role } from '../modules/user/enums/role.enum';

@Injectable()
export class InitialDataService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.initializeAdmin();

    // Sau này thêm dữ liệu khởi tạo tại đây:
    // await this.initializeCategories();
    // await this.initializeSettings();
  }

  private async initializeAdmin(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    const adminExists = await userRepository.existsBy({
      role: Role.ADMIN,
    });

    if (adminExists) {
      return;
    }

    const password = await bcrypt.hash(
      this.configService.getOrThrow<string>('ADMIN_PASSWORD'),
      10,
    );

    await userRepository.save(
      userRepository.create({
        name: this.configService.get<string>('ADMIN_NAME') ?? 'Admin',
        email: this.configService
          .getOrThrow<string>('ADMIN_EMAIL')
          .trim()
          .toLowerCase(),
        password,
        phone: this.configService.get<string>('ADMIN_PHONE') ?? '0900000000',
        dateOfBirth: new Date(
          this.configService.get<string>('ADMIN_DATE_OF_BIRTH') ?? '2004-12-21',
        ),
        role: Role.ADMIN,
        isActive: true,
      }),
    );
  }
}
