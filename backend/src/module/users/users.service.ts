import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GroupMember } from '@entities/group.entity';
import { Message } from '@entities/message.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GroupMember) private readonly memberRepo: Repository<GroupMember>,
    @InjectRepository(Message) private readonly userMessRepo: Repository<Message>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getConversations(userId: string) {
    // Lấy danh sách otherUserId đã chat (join sender/receiver và dùng sender.id / receiver.id)
    const otherExpr = `CASE WHEN sender.id = :userId THEN receiver.id ELSE sender.id END`;
    const raw = await this.userMessRepo
      .createQueryBuilder("m")
      .leftJoin("m.sender", "sender")
      .leftJoin("m.receiver", "receiver")
      .select(`${otherExpr}`, "otherUserId")
      .addSelect("MAX(m.createdAt)", "lastMessageAt")
      .where("sender.id = :userId OR receiver.id = :userId", { userId })
      // group by the same expression (not the alias) so Postgres accepts it
      .groupBy(otherExpr)
      // order by the aggregate expression directly to avoid alias resolution issues in Postgres
      .orderBy("MAX(m.createdAt)", "DESC")
      .setParameter("userId", userId)
      .getRawMany();

    const conversations = [];
    for (const row of raw) {
      const otherUserId: string = row.otherUserId;
      const lastMessage = await this.userMessRepo.findOne({
        where: [
          { sender: { id: userId }, receiver: { id: otherUserId } },
          { sender: { id: otherUserId }, receiver: { id: userId } },
        ],
        relations: ["sender", "receiver"],
        order: { createdAt: "DESC" },
      });
      conversations.push({
        otherUserId,
        lastMessage,
      });
    }
    return conversations;
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
