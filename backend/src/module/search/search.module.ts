import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { User } from '@entities/user.entity';
import { Group, GroupMember } from '@entities/group.entity'

// connect Service and Controller
@Module({
  imports: [TypeOrmModule.forFeature([User, Group, GroupMember])],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})

export class SearchModule {}
