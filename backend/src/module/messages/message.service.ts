import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { Group, GroupMember } from '@entities/group.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private readonly groupMemberRepo: Repository<GroupMember>,
  ) {}

  async create(senderId: string, dto: CreateMessageDto) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    if (!sender) throw new NotFoundException('Sender not found');

     if (!dto.groupId && !dto.receiverId) {
      throw new BadRequestException('Provide groupId or receiverId');
    }
    if (dto.groupId && dto.receiverId) {
      throw new BadRequestException('Provide either groupId or receiverId, not both');
    }

    let group: Group | null = null;
    let receiver: User | null = null;

    if (dto.groupId) {
      const membership = await this.groupMemberRepo.findOne({
        where: { groupId: dto.groupId, userId: senderId },
      });
      if (!membership) throw new ForbiddenException('You are not a member of this group');

      group = { id: dto.groupId } as Group;
    }

    if (dto.receiverId) {
      if (dto.receiverId === senderId) {
      }
      receiver = await this.userRepo.findOne({ where: { id: dto.receiverId } });
      if (!receiver) throw new NotFoundException('Receiver not found');

    }

    const msg = this.messageRepo.create({
      sender,
      group: group ?? null,
      receiver: receiver ?? null,
      content: dto.content,
    });

    return this.messageRepo.save(msg);
  }

  async update(senderId: string, messageId: string, dto: UpdateMessageDto) {
    const msg = await this.messageRepo.findOne({ where: { id: messageId }, relations: ['sender'] });
    if (!msg) throw new NotFoundException('Message not found');

    if (msg.sender.id !== senderId) {
      throw new ForbiddenException('Not allowed to edit this message');
    }

    msg.content = dto.content;
    msg.isEdited = true;
    return this.messageRepo.save(msg);
  }

  async remove(senderId: string, messageId: string) {
    const msg = await this.messageRepo.findOne({ where: { id: messageId }, relations: ['sender'] });
    if (!msg) throw new NotFoundException('Message not found');

    if (msg.sender.id !== senderId) {
      throw new ForbiddenException('Not allowed to delete this message');
    }

    msg.isDeleted = true;
    return this.messageRepo.save(msg);
  }

  async getGroupMessages(groupId: string, limit = 20, offset = 0) {
    const qb = this.messageRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 'sender')
      .where('m.groupId = :groupId', { groupId })
      .andWhere('m.isDeleted = false')
      .orderBy('m.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const rows = await qb.getMany();
    // return oldest -> newest
    return rows.reverse();
  }

  async getPrivateMessages(userId: string, otherUserId: string, limit = 20, offset = 0) {
    const qb = this.messageRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 'sender')
      .leftJoinAndSelect('m.receiver', 'receiver')
      .where('m.isDeleted = false')
      .andWhere(
        '((sender.id = :userId AND receiver.id = :otherId) OR (sender.id = :otherId AND receiver.id = :userId))',
        { userId, otherId: otherUserId },
      )
      .orderBy('m.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const rows = await qb.getMany();
    // return oldest -> newest
    return rows.reverse();
  }
}
