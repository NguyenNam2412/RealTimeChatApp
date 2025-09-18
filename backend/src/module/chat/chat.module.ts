import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from '@entities/group.entity';
import { User } from '@entities/user.entity';
import { MessageService } from '@module/messages/message.service';
import { Message } from '@entities/message.entity';
import { MessageModule } from '@module/messages/message.module';
import { AuthModule } from '@module/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMember, User, Message]),
    MessageModule,
    AuthModule,
  ],
  providers: [ChatGateway],
  exports: [],
})
export class ChatModule {}