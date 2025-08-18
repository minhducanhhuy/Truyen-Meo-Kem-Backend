import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  // ⬅️ SỬA: Đọc PORT từ .env hoặc default 3000
  const port = process.env.PORT || 3000;
  console.log(`🚀 Server running on http://localhost:${port}/api`); // ⬅️ Log để biết port
  
  await app.listen(port);
}
bootstrap();
