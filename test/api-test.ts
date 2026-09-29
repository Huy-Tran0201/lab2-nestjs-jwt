// Kiểm thử tự động: npm test
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { unlinkSync, existsSync } from 'fs';

process.env.DB_FILE = 'test.db';
if (existsSync('test.db')) unlinkSync('test.db');

async function main() {
  const { AppModule } = await import('../src/app.module');
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(3999);
  const base = 'http://localhost:3999';
  const json = { 'Content-Type': 'application/json' };

  const show = async (title: string, p: Promise<Response>) => {
    const r = await p;
    const t = await r.text();
    console.log(`\n### ${title}\nHTTP ${r.status}\n${t}`);
    try { return JSON.parse(t); } catch { return t; }
  };

  await show('GET /hello (không token)', fetch(base + '/hello'));
  await show('POST /login (sai mật khẩu)', fetch(base + '/login', { method: 'POST', headers: json, body: JSON.stringify({ userName: 'admin', password: 'sai' }) }));
  const r = await show('POST /login (đúng: admin / base64 MTIzNDU2)', fetch(base + '/login', { method: 'POST', headers: json, body: JSON.stringify({ userName: 'admin', password: 'MTIzNDU2' }) }));
  const h = { Authorization: 'Bearer ' + r.token };
  console.log('\n(độ dài token:', r.token.length, 'ký tự)');
  await show('GET /auth (token hợp lệ)', fetch(base + '/auth', { headers: h }));
  await show('GET /hello (token hợp lệ)', fetch(base + '/hello', { headers: h }));
  await show('GET /hello (token giả)', fetch(base + '/hello', { headers: { Authorization: 'Bearer abc.def.ghi' } }));
  await show('POST /logout', fetch(base + '/logout', { method: 'POST', headers: h }));
  await show('GET /hello (sau khi logout)', fetch(base + '/hello', { headers: h }));

  await app.close();
  if (existsSync('test.db')) unlinkSync('test.db');
  process.exit(0);
}
main();
