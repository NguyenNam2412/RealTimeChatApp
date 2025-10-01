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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("../../entities/message.entity");
const user_entity_1 = require("../../entities/user.entity");
const group_entity_1 = require("../../entities/group.entity");
let MessageService = class MessageService {
    constructor(messageRepo, userRepo, groupRepo, groupMemberRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.groupRepo = groupRepo;
        this.groupMemberRepo = groupMemberRepo;
    }
    async create(senderId, dto) {
        const sender = await this.userRepo.findOne({ where: { id: senderId } });
        if (!sender)
            throw new common_1.NotFoundException('Sender not found');
        if (!dto.groupId && !dto.receiverId) {
            throw new common_1.BadRequestException('Provide groupId or receiverId');
        }
        if (dto.groupId && dto.receiverId) {
            throw new common_1.BadRequestException('Provide either groupId or receiverId, not both');
        }
        let group = null;
        let receiver = null;
        if (dto.groupId) {
            const membership = await this.groupMemberRepo.findOne({
                where: { groupId: dto.groupId, userId: senderId },
            });
            if (!membership)
                throw new common_1.ForbiddenException('You are not a member of this group');
            group = { id: dto.groupId };
        }
        if (dto.receiverId) {
            if (dto.receiverId === senderId) {
            }
            receiver = await this.userRepo.findOne({ where: { id: dto.receiverId } });
            if (!receiver)
                throw new common_1.NotFoundException('Receiver not found');
        }
        const msg = this.messageRepo.create({
            sender,
            group: group ?? null,
            receiver: receiver ?? null,
            content: dto.content,
        });
        return this.messageRepo.save(msg);
    }
    async update(senderId, messageId, dto) {
        const msg = await this.messageRepo.findOne({ where: { id: messageId }, relations: ['sender'] });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        if (msg.sender.id !== senderId) {
            throw new common_1.ForbiddenException('Not allowed to edit this message');
        }
        msg.content = dto.content;
        msg.isEdited = true;
        return this.messageRepo.save(msg);
    }
    async remove(senderId, messageId) {
        const msg = await this.messageRepo.findOne({ where: { id: messageId }, relations: ['sender'] });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        if (msg.sender.id !== senderId) {
            throw new common_1.ForbiddenException('Not allowed to delete this message');
        }
        msg.isDeleted = true;
        return this.messageRepo.save(msg);
    }
    async getGroupMessages(groupId, limit = 20, offset = 0) {
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
    async getPrivateMessages(userId, otherUserId, limit = 20, offset = 0) {
        const qb = this.messageRepo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.sender', 'sender')
            .leftJoinAndSelect('m.receiver', 'receiver')
            .where('m.isDeleted = false')
            .andWhere('((sender.id = :userId AND receiver.id = :otherId) OR (sender.id = :otherId AND receiver.id = :userId))', { userId, otherId: otherUserId })
            .orderBy('m.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const rows = await qb.getMany();
        // return oldest -> newest
        return rows.reverse();
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(3, (0, typeorm_1.InjectRepository)(group_entity_1.GroupMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MessageService);
