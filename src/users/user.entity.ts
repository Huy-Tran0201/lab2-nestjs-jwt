import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Bảng người dùng (User) theo phụ lục của đề bài
@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ name: 'IdUser' })
  idUser: number;

  @Column({ name: 'UserName', type: 'varchar', length: 255, unique: true })
  userName: string;

  @Column({ name: 'Password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'Token', type: 'varchar', length: 255, nullable: true })
  token: string | null;
}
