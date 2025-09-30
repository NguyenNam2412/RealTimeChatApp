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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const group_entity_1 = require("../../entities/group.entity");
const group_entity_2 = require("../../entities/group.entity");
let SearchService = class SearchService {
    constructor(userRepo, groupRepo, groupMemberRepo) {
        this.userRepo = userRepo;
        this.groupRepo = groupRepo;
        this.groupMemberRepo = groupMemberRepo;
    }
    async search(dto, userId) {
        const { keyword, limit, offset } = dto;
        // 1. Tìm user theo username hoặc nickname
        const users = await this.userRepo.find({
            where: [
                { username: (0, typeorm_2.ILike)(`%${keyword}%`) },
                { nickname: (0, typeorm_2.ILike)(`%${keyword}%`) },
            ],
            select: ['id', 'username', 'nickname', 'isApproved'], // chỉ select field cần thiết
            take: limit,
            skip: offset,
        });
        // 2. Lấy danh sách group mà user là thành viên
        const memberships = await this.groupMemberRepo.find({
            where: { userId },
            select: ['groupId'],
        });
        const groupIds = memberships.map((m) => m.groupId);
        // 3. Tìm group theo tên, nhưng chỉ trong groupIds
        let groups = [];
        if (groupIds.length > 0) {
            groups = await this.groupRepo.find({
                where: {
                    id: (0, typeorm_2.In)(groupIds),
                    name: (0, typeorm_2.ILike)(`%${keyword}%`),
                },
                select: ['id', 'name', 'description'],
                take: limit,
                skip: offset,
            });
        }
        return {
            users,
            groups,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(2, (0, typeorm_1.InjectRepository)(group_entity_2.GroupMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
