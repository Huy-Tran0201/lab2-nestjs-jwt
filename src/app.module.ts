import { MiddlewareConsumer, Module, NestModule, RequestMethod, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { HelloController } from './hello.controller';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_FILE || 'data.db',
      entities: [User],
      synchronize: true, // tự tạo bảng User
    }),
    AuthModule,
  ],
  controllers: [HelloController],
  providers: [AuthMiddleware],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  // Gắn Middleware xác thực cho các route cần bảo vệ
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'auth', method: RequestMethod.GET },
        { path: 'hello', method: RequestMethod.GET },
        { path: 'logout', method: RequestMethod.POST },
      );
  }

  // Tạo sẵn tài khoản mẫu admin / 123456 (client gửi base64 của "123456" = MTIzNDU2)
  async onModuleInit() {
    if (!(await this.users.findOneBy({ userName: 'admin' }))) {
      await this.users.save(this.users.create({ userName: 'admin', password: bcrypt.hashSync('MTIzNDU2', 10) }));
    }
  }
}
