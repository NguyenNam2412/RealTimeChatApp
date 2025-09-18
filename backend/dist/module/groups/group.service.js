"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const group_entity_1 = require("../../entities/group.entity");
let GroupService = class GroupService {
    constructor(groupRepo, memberRepo, userRepo) {
        this.groupRepo = groupRepo;
        this.memberRepo = memberRepo;
        this.userRepo = userRepo;
    }
    async createGroup(userId, dto) {
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
    async getMyGroups(userId) {
        const memberships = await this.memberRepo.find({ where: { userId } });
        const groupIds = memberships.map(m => m.groupId);
        if (!groupIds.length) {
            return [];
        }
        return this.groupRepo.find({ where: { id: (0, typeorm_2.In)(groupIds) } });
    }
    async getMembers(userId, groupId) {
        // kiểm tra caller là member của group
        const requester = await this.memberRepo.findOne({ where: { userId, groupId } });
        if (!requester) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
        const members = await this.memberRepo.find({ where: { groupId } });
        const userIds = members.map(m => m.userId);
        const users = userIds.length
            ? await this.userRepo.find({
                where: { id: (0, typeorm_2.In)(userIds) },
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
    async addMember(userId, groupId, dto) {
        const requester = await this.memberRepo.findOne({ where: { groupId, userId } });
        if (!requester || (requester.role !== 'owner' && requester.role !== 'moderator')) {
            throw new common_1.ForbiddenException('Not allowed to add member');
        }
        const userToAdd = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!userToAdd)
            throw new common_1.NotFoundException('User not found');
        const already = await this.memberRepo.findOne({ where: { groupId, userId: dto.userId } });
        if (already)
            throw new common_1.BadRequestException('User is already a member');
        const newMember = this.memberRepo.create({
            groupId,
            userId: dto.userId,
            role: 'member',
        });
        return this.memberRepo.save(newMember);
    }
    async removeMember(userId, groupId, memberId) {
        const requester = await this.memberRepo.findOne({ where: { groupId, userId } });
        if (!requester || (requester.role !== 'owner' && requester.role !== 'moderator')) {
            throw new common_1.ForbiddenException('Not allowed to remove member');
        }
        await this.memberRepo.delete({ id: memberId });
        return { message: 'Member removed' };
    }
    async updateRole(userId, groupId, dto) {
        const requester = await this.memberRepo.findOne({ where: { groupId, userId } });
        if (!requester || requester.role !== 'owner') {
            throw new common_1.ForbiddenException('Only owner can change roles');
        }
        const member = await this.memberRepo.findOne({ where: { id: dto.memberId, groupId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        member.role = dto.role;
        return this.memberRepo.save(member);
    }
    async deleteGroup(userId, groupId) {
        const owner = await this.memberRepo.findOne({ where: { groupId, userId, role: 'owner' } });
        if (!owner)
            throw new common_1.ForbiddenException('Only owner can delete group');
        await this.memberRepo.delete({ groupId });
        await this.groupRepo.delete(groupId);
        return { message: 'Group deleted' };
    }
    async leaveGroup(userId, groupId) {
        const member = await this.memberRepo.findOne({ where: { userId, groupId } });
        if (!member)
            throw new common_1.NotFoundException('You are not in this group');
        if (member.role === 'owner') {
            throw new common_1.ForbiddenException('Owner cannot leave the group, must delete it or transfer ownership');
        }
        await this.memberRepo.delete({ id: member.id });
        return { message: 'You left the group' };
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(1, (0, typeorm_1.InjectRepository)(group_entity_1.GroupMember)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GroupService);
