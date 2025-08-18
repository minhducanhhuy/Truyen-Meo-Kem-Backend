import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ⬅️ THÊM
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ⬅️ THÊM
    PrismaModule,
    StoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
