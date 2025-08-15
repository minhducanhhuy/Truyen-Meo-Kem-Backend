import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMoudle } from './auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [AuthMoudle, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
