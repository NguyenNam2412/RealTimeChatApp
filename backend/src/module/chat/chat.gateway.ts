import { Logger, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '@module/messages/message.service';
import { GroupMember } from '@entities/group.entity';
import { User } from '@entities/user.entity';

interface PrivateMessageDto {
  to: string;
  content: string;
}

interface GroupMessageDto {
  groupId: string;
  content: string;
}

@Injectable()
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  // map userId -> set of socketIds
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    @InjectRepository(GroupMember) private readonly groupMemberRepo: Repository<GroupMember>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth && client.handshake.auth.token) ||
        (client.handshake.query && (client.handshake.query.token as string));
      if (!token) {
        this.logger.warn('Socket connection without token, disconnecting');
        client.disconnect(true);
        return;
      }

      const payload = this.jwtService.verify(token as string, {
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
      const set = this.userSockets.get(userId) ?? new Set<string>();
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
    } catch (err) {
      this.logger.warn('Socket auth failed, disconnecting', err as any);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user && user.id) {
      const set = this.userSockets.get(user.id);
      if (set) {
        set.delete(client.id);
        if (set.size === 0) this.userSockets.delete(user.id);
      }
      this.logger.log(`User ${user.id} disconnected (socket ${client.id})`);
    }
  }

  @SubscribeMessage('private_message')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PrivateMessageDto,
  ) {
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

  @SubscribeMessage('group_message')
  async handleGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: GroupMessageDto,
  ) {
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
}