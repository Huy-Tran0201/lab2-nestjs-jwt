import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CredentialsDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  private check(dto: CredentialsDto) {
    if (!dto?.userName || !dto?.password) {
      throw new BadRequestException('Thiếu userName hoặc password');
    }
  }

  // Tạo tài khoản (để có dữ liệu test). Không lưu mật khẩu dạng rõ: băm bcrypt chuỗi client gửi lên
  async register(dto: CredentialsDto) {
    this.check(dto);
    if (await this.users.findOneBy({ userName: dto.userName })) {
      throw new ConflictException('UserName đã tồn tại');
    }
    const user = await this.users.save(
      this.users.create({ userName: dto.userName, password: bcrypt.hashSync(dto.password, 10) }),
    );
    return { message: 'Đăng ký thành công', idUser: user.idUser };
  }

  // Kiểm tra tài khoản, mật khẩu rồi sinh JWT
  async login(dto: CredentialsDto) {
    this.check(dto);
    const user = await this.users.findOneBy({ userName: dto.userName });
    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }
    const token = await this.jwt.signAsync({ idUser: user.idUser, userName: user.userName });
    user.token = token; // lưu vào cột Token của bảng User
    await this.users.save(user);
    return { message: 'Đăng nhập thành công', token, tokenType: 'Bearer' };
  }

  async logout(idUser: number) {
    await this.users.update({ idUser }, { token: null });
    return { message: 'Đã đăng xuất' };
  }
}
