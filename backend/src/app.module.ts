import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from './config/configuration';
import { validate } from './config/validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@module/auth/auth.module';
import { MessageModule } from '@module/messages/message.module';
import { ChatModule } from '@module/chat/chat.module';
import { GroupsModule } from '@module/groups/group.module';
import { UsersModule } from '@module/users/users.module';
import { SearchModule } from '@module/search/search.module';
import { AdminModule } from '@module/admin/admin.module';

// assign controllers and services for other modules
@Module({
  imports: [
    // connect configuration and validate environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore as any,
        host: 'localhost',  // Redis host
        port: 6379,         // Redis port (mặc định 6379)
        ttl: 60 * 1000,     // 60s
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,   // 60 giây
        limit: 10, // 10 request / 60s / mỗi IP
      },
    ]),
    DatabaseModule,
    // feature
    AuthModule,
    MessageModule,
    ChatModule,
    GroupsModule,
    UsersModule,
    SearchModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
