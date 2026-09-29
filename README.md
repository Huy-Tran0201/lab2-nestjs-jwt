# Bài thực hành số 2 – Router, Middleware và bảo mật với JWT trong RESTful API (NestJS)

Công nghệ: NestJS, TypeScript, @nestjs/jwt, TypeORM + SQLite (better-sqlite3), bcryptjs.

## Chạy project
```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run start            # http://localhost:3000
npm test                 # chạy kiểm thử tự động
```

## API
| Method | URL | Mô tả | Cần token |
|---|---|---|---|
| POST | /register | Tạo tài khoản `{userName, password}` | Không |
| POST | /login | Đăng nhập, trả về JWT | Không |
| GET | /auth | Xác thực token, trả thông tin user | Có |
| GET | /hello | API "Hello World" (bài 1) được bảo vệ | Có |
| POST | /logout | Đăng xuất, xóa token trong DB | Có |

Mật khẩu được mã hóa base64 (hoặc MD5) ở client trước khi gửi.
Tài khoản mẫu: `admin` / mật khẩu `123456` → gửi lên `MTIzNDU2`.
Token gửi qua header: `Authorization: Bearer <token>`.

## Cấu trúc
```
src/
  main.ts                     khởi động ứng dụng
  app.module.ts               module gốc, gắn Middleware vào route
  hello.controller.ts         Router GET /hello
  auth/auth.controller.ts     Router /register /login /auth /logout
  auth/auth.service.ts        xử lý đăng nhập, sinh JWT
  auth/auth.middleware.ts     Middleware xác thực JWT
  auth/auth.module.ts         cấu hình JwtModule
  users/user.entity.ts        bảng User
test/api-test.ts              kiểm thử tự động
```
