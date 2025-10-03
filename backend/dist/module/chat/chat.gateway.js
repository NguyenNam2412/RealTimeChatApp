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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_service_1 = require("../messages/message.service");
const group_entity_1 = require("../../entities/group.entity");
const user_entity_1 = require("../../entities/user.entity");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(jwtService, messageService, groupMemberRepo, userRepo) {
        this.jwtService = jwtService;
        this.messageService = messageService;
        this.groupMemberRepo = groupMemberRepo;
        this.userRepo = userRepo;
        this.logger = new common_1.Logger(ChatGateway_1.name);
        // map userId -> set of socketIds
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            this.logger.log(`New socket connection: ${client.handshake.url}`);
            this.logger.log(`Full handshake: ${JSON.stringify(client.handshake, null, 2)}`);
            const token = (client.handshake.auth && client.handshake.auth.token) ||
                (client.handshake.query && client.handshake.query.token);
            if (!token) {
                this.logger.warn('Socket connection without token, disconnecting');
                client.disconnect(true);
                return;
            }
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });
                const userId = payload?.sub;
                if (!userId) {
                    this.logger.warn('Invalid token payload, disconnecting');
                    client.disconnect(true);
                    return;
                }
                const userEntity = await this.userRepo.findOne({ where: { id: userId } });
                if (!userEntity || userEntity.isApproved !== true) {
                    this.logger.warn(`User ${userId} not allowed to connect`);
                    client.disconnect(true);
                    return;
                }
                client.data.user = { id: userId, username: payload.username, role: payload.role };
                // track socket id
                const set = this.userSockets.get(userId) ?? new Set();
                set.add(client.id);
                this.userSockets.set(userId, set);
                // join private room
                client.join(`user:${userId}`);
                // join group rooms where user is member
                const memberships = await this.groupMemberRepo.find({ where: { userId }, select: ['groupId'] });
                for (const m of memberships) {
                    client.join(`group:${m.groupId}`);
                }
                this.logger.log(`User ${userId} connected (socket ${client.id})`);
                client.emit('connected', { userId });
            }
            catch (err) {
                this.logger.warn('Socket auth failed, disconnecting', err);
                client.disconnect(true);
            }
        }
        catch (err) {
            this.logger.warn('Invalid token, disconnecting', err);
            client.disconnect(true);
            return;
        }
    }
    handleDisconnect(client) {
        const user = client.data.user;
        if (user && user.id) {
            const set = this.userSockets.get(user.id);
            if (set) {
                set.delete(client.id);
                if (set.size === 0)
                    this.userSockets.delete(user.id);
            }
            this.logger.log(`User ${user.id} disconnected (socket ${client.id})`);
        }
    }
    async handlePrivateMessage(client, payload) {
        const sender = client.data.user;
        if (!sender || !sender.id) {
            client.emit('error', { message: 'Not authenticated' });
            return;
        }
        if (!payload?.to || !payload?.content) {
            client.emit('error', { message: 'Invalid payload' });
            return;
        }
        // validate receiver exists
        const receiver = await this.userRepo.findOne({ where: { id: payload.to } });
        if (!receiver) {
            client.emit('error', { message: 'Receiver not found' });
            return;
        }
        // persist message
        const saved = await this.messageService.create(sender.id, {
            content: payload.content,
            receiverId: payload.to,
        });
        const safeSaved = {
            ...saved,
            sender: saved.sender ? {
                id: saved.sender.id,
                username: saved.sender.username,
                nickname: saved.sender.nickname ?? null,
                createdAt: saved.sender.createdAt,
            } : null,
            receiver: saved.receiver ? {
                id: saved.receiver.id,
                username: saved.receiver.username,
                nickname: saved.receiver.nickname ?? null,
            } : null,
        };
        // emit to receiver and sender rooms
        this.server.to(`user:${payload.to}`).emit('new_private_message', safeSaved);
        this.server.to(`user:${sender.id}`).emit('new_private_message', safeSaved);
    }
    async handleGroupMessage(client, payload) {
        const sender = client.data.user;
        if (!sender || !sender.id) {
            client.emit('error', { message: 'Not authenticated' });
            return;
        }
        if (!payload?.groupId || !payload?.content) {
            client.emit('error', { message: 'Invalid payload' });
            return;
        }
        // check membership
        const membership = await this.groupMemberRepo.findOne({
            where: { groupId: payload.groupId, userId: sender.id },
        });
        if (!membership) {
            client.emit('error', { message: 'Not a member of group' });
            return;
        }
        // persist message
        const saved = await this.messageService.create(sender.id, {
            content: payload.content,
            groupId: payload.groupId,
        });
        // broadcast to group room
        this.server.to(`group:${payload.groupId}`).emit('new_group_message', saved);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('private_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handlePrivateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('group_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGroupMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ cors: { origin: ['http://localhost:3000'] }, transports: ["websocket"], pingInterval: 20000, pingTimeout: 20000 }),
    __param(2, (0, typeorm_1.InjectRepository)(group_entity_1.GroupMember)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        message_service_1.MessageService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatGateway);
