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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
const search_dto_1 = require("./dto/search.dto");
const jwtAuthGuard_guard_1 = require("../auth/jwt/jwtAuthGuard.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async search(query, user) {
        const userId = user?.sub;
        console.log(userId);
        return this.searchService.search(query, userId);
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    (0, common_1.UseGuards)(jwtAuthGuard_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
