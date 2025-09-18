import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMember } from '@entities/group.entity';
import { User } from '@entities/user.entity';
import { Message } from '@entities/message.entity';
import { MessageModule } from '@module/messages/message.module';
import { MessageService } from '@module/messages/message.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMember, User, Message]),
    MessageModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(process.env.JWT_SECRET as string) || process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ChatGateway, MessageService],
  exports: [MessageService]
})
export class ChatModule {}