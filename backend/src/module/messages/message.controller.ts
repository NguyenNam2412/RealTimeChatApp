import { Controller, Post, Body, UseGuards, Req, Patch, Param, Delete, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/jwt/jwtAuthGuard.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateMessageDto) {
    return this.messageService.create(req.user.sub, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messageService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.messageService.remove(req.user.sub, id);
  }

  @Get('group/:id')
  getGroupMessages(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const l = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    const o = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    return this.messageService.getGroupMessages(id, l, o);
  }

  @Get('private/:otherUserId')
  getPrivateMessages(
    @Req() req: any,
    @Param('otherUserId') otherUserId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const l = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    const o = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    return this.messageService.getPrivateMessages(req.user.sub, otherUserId, l, o);
  }
}
