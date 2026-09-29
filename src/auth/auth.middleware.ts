import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

// Middleware xác thực token: đọc header "Authorization: Bearer <token>"
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const [scheme, token] = (req.headers['authorization'] || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Thiếu token. Dùng header Authorization: Bearer <token>');
    }

    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(token); // kiểm tra chữ ký + hạn dùng
    } catch (err) {
      throw new UnauthorizedException(err.name === 'TokenExpiredError' ? 'Token đã hết hạn' : 'Token không hợp lệ');
    }

    // Đối chiếu với token lưu trong DB (đảm bảo chưa đăng xuất / không bị thay bằng token mới)
    const user = await this.users.findOneBy({ idUser: payload.idUser });
    if (!user || user.token !== token) {
      throw new UnauthorizedException('Token không còn hiệu lực (đã đăng xuất hoặc đăng nhập nơi khác)');
    }

    (req as any).user = payload;
    next();
  }
}
