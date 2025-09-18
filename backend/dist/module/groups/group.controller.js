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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const create_group_dto_1 = require("./dto/create-group.dto");
const add_member_dto_1 = require("./dto/add-member.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const jwtAuthGuard_guard_1 = require("../auth/jwt/jwtAuthGuard.guard");
let GroupController = class GroupController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    create(req, dto) {
        return this.groupsService.createGroup(req.user.sub, dto);
    }
    findMyGroups(req) {
        return this.groupsService.getMyGroups(req.user.sub);
    }
    addMember(req, groupId, dto) {
        return this.groupsService.addMember(req.user.sub, groupId, dto);
    }
    removeMember(req, groupId, memberId) {
        return this.groupsService.removeMember(req.user.sub, groupId, memberId);
    }
    updateRole(req, groupId, dto) {
        return this.groupsService.updateRole(req.user.sub, groupId, dto);
    }
    deleteGroup(req, groupId) {
        return this.groupsService.deleteGroup(req.user.sub, groupId);
    }
    leaveGroup(req, groupId) {
        return this.groupsService.leaveGroup(req.user.sub, groupId);
    }
};
exports.GroupController = GroupController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "findMyGroups", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Patch)(':id/members/role'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "deleteGroup", null);
__decorate([
    (0, common_1.Delete)(':id/leave'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "leaveGroup", null);
exports.GroupController = GroupController = __decorate([
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(jwtAuthGuard_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
