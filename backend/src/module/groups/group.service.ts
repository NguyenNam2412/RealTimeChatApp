import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '@entities/user.entity'
import { Group, GroupMember } from '@entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private memberRepo: Repository<GroupMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createGroup(userId: string, dto: CreateGroupDto) {
    const group = this.groupRepo.create(dto);
    const savedGroup = await this.groupRepo.save(group);

    const owner = this.memberRepo.create({
      groupId: savedGroup.id,
      userId,
      role: 'owner',
    });
    await this.memberRepo.save(owner);

    return savedGroup;
  }

  async getMyGroups(userId: string) {
    const memberships = await this.memberRepo.find({ where: { userId } });
    const groupIds = memberships.map(m => m.groupId);
    if (!groupIds.length) {
      return [];
    }
    return this.groupRepo.find({ where: { id: In(groupIds) } });
  }

  async getMembers(userId: string, groupId: string) {
    // kiểm tra caller là member của group
    const requester = await this.memberRepo.findOne({ where: { userId, groupId } });
    if (!requester) {
      throw new ForbiddenException('Not a member of this group');
    }

    const members = await this.memberRepo.find({ where: { groupId } });
    const userIds = members.map(m => m.userId);

    const users = userIds.length
      ? await this.userRepo.find({
          where: { id: In(userIds) },
          select: ['id', 'username', 'nickname', 'createdAt'],
        })
      : [];

    const userMap = new Map(users.map(u => [u.id, u]));

    return members.map(m => ({
      user: userMap.get(m.userId) ?? { id: m.userId },
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  async addMember(userId: string, groupId: string, dto: AddMemberDto) {
    const requester = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (!requester || (requester.role !== 'owner' && requester.role !== 'moderator')) {
      throw new ForbiddenException('Not allowed to add member');
    }

    const userToAdd = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!userToAdd) throw new NotFoundException('User not found');

    const already = await this.memberRepo.findOne({ where: { groupId, userId: dto.userId } });
    if (already) throw new BadRequestException('User is already a member');

    const newMember = this.memberRepo.create({
      groupId,
      userId: dto.userId,
      role: 'member',
    });
    return this.memberRepo.save(newMember);
  }

  async removeMember(userId: string, groupId: string, memberId: string) {
    const requester = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (!requester || (requester.role !== 'owner' && requester.role !== 'moderator')) {
      throw new ForbiddenException('Not allowed to remove member');
    }

    await this.memberRepo.delete({ id: memberId });
    return { message: 'Member removed' };
  }

  async updateRole(userId: string, groupId: string, dto: UpdateRoleDto) {
    const requester = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (!requester || requester.role !== 'owner') {
      throw new ForbiddenException('Only owner can change roles');
    }

    const member = await this.memberRepo.findOne({ where: { id: dto.memberId, groupId } });
    if (!member) throw new NotFoundException('Member not found');

    member.role = dto.role;
    return this.memberRepo.save(member);
  }

  async deleteGroup(userId: string, groupId: string) {
    const owner = await this.memberRepo.findOne({ where: { groupId, userId, role: 'owner' } });
    if (!owner) throw new ForbiddenException('Only owner can delete group');

    await this.memberRepo.delete({ groupId });
    await this.groupRepo.delete(groupId);
    return { message: 'Group deleted' };
  }

  async leaveGroup(userId: string, groupId: string) {
    const member = await this.memberRepo.findOne({ where: { userId, groupId } });
    if (!member) throw new NotFoundException('You are not in this group');

    if (member.role === 'owner') {
      throw new ForbiddenException('Owner cannot leave the group, must delete it or transfer ownership');
    }

    await this.memberRepo.delete({ id: member.id });
    return { message: 'You left the group' };
  }
}
