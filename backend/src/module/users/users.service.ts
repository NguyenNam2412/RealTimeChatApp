import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GroupMember } from '@entities/group.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GroupMember) private readonly memberRepo: Repository<GroupMember>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.nickname) {
      const exist = await this.userRepo.findOne({ where: { nickname: dto.nickname } });
      if (exist && exist.id !== userId) {
        throw new BadRequestException('Nickname already exists');
      }
      user.nickname = dto.nickname;
    }

    return this.userRepo.save(user);
  }

  async deleteAccount(userId: string) {
    await this.memberRepo.delete({ userId }); // remove from all groups
    await this.userRepo.delete(userId);
    return { message: 'Account deleted successfully' };
  }

  async leaveGroup(userId: string, groupId: string) {
    const member = await this.memberRepo.findOne({ where: { userId, groupId } });
    if (!member) throw new NotFoundException('You are not in this group');
    await this.memberRepo.delete({ id: member.id });
    return { message: 'You left the group' };
  }
}
