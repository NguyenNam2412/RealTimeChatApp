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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const group_entity_1 = require("../../entities/group.entity");
let UsersService = class UsersService {
    constructor(userRepo, memberRepo) {
        this.userRepo = userRepo;
        this.memberRepo = memberRepo;
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.nickname) {
            const exist = await this.userRepo.findOne({ where: { nickname: dto.nickname } });
            if (exist && exist.id !== userId) {
                throw new common_1.BadRequestException('Nickname already exists');
            }
            user.nickname = dto.nickname;
        }
        return this.userRepo.save(user);
    }
    async deleteAccount(userId) {
        await this.memberRepo.delete({ userId }); // remove from all groups
        await this.userRepo.delete(userId);
        return { message: 'Account deleted successfully' };
    }
    async leaveGroup(userId, groupId) {
        const member = await this.memberRepo.findOne({ where: { userId, groupId } });
        if (!member)
            throw new common_1.NotFoundException('You are not in this group');
        await this.memberRepo.delete({ id: member.id });
        return { message: 'You left the group' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(group_entity_1.GroupMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
