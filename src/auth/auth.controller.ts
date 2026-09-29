import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto';

// Router: định nghĩa các đường dẫn /register /login /auth /logout
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: CredentialsDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: CredentialsDto) {
    return this.auth.login(dto);
  }

  // GET /auth: đã đi qua AuthMiddleware nên chỉ cần trả thông tin trong token
  @Get('auth')
  verify(@Req() req: any) {
    const u = req.user;
    return {
      message: 'Token hợp lệ',
      user: u,
      issuedAt: new Date(u.iat * 1000).toISOString(),
      expiresAt: new Date(u.exp * 1000).toISOString(),
    };
  }

  @Post('logout')
  logout(@Req() req: any) {
    return this.auth.logout(req.user.idUser);
  }
}
