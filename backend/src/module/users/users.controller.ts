import { Controller, Get, Patch, Delete, Body, Req, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@module/auth/jwt/jwtAuthGuard.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Get('conversations')
  async getConversations(@Req() req: any) {
    return this.usersService.getConversations(req.user.sub);
  }

  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  @Delete('me')
  deleteAccount(@Req() req: any) {
    return this.usersService.deleteAccount(req.user.sub);
  }

  @Delete('me/groups/:groupId')
  leaveGroup(@Req() req: any, @Param('groupId') groupId: string) {
    return this.usersService.leaveGroup(req.user.sub, groupId);
  }
}
