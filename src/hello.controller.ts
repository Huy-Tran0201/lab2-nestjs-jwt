import { Controller, Get, Req } from '@nestjs/common';

// API "Hello World" của bài thực hành 1, nay được bảo vệ bằng AuthMiddleware
@Controller('hello')
export class HelloController {
  @Get()
  hello(@Req() req: any) {
    return `Hello World, ${req.user.userName}!`;
  }
}
