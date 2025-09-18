import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Group, GroupMember } from '@entities/group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember, User])],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService],
})
export class GroupsModule {}
