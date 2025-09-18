import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { Group } from '@entities/group.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Group])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
