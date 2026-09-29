// Dữ liệu client gửi lên (password đã mã hóa base64 hoặc MD5 tại client)
export class CredentialsDto {
  userName: string;
  password: string;
}
