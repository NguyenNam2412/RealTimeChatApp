import { Controller, Post, Get, Param, Body, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '@module/auth/jwt/jwtAuthGuard.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(req.user.sub, dto);
  }

  @Get()
  findMyGroups(@Req() req: any) {
    return this.groupsService.getMyGroups(req.user.sub);
  }

  @Post(':id/members')
  addMember(@Req() req: any, @Param('id') groupId: string, @Body() dto: AddMemberDto) {
    return this.groupsService.addMember(req.user.sub, groupId, dto);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Req() req: any, @Param('id') groupId: string, @Param('memberId') memberId: string) {
    return this.groupsService.removeMember(req.user.sub, groupId, memberId);
  }

  @Patch(':id/members/role')
  updateRole(@Req() req: any, @Param('id') groupId: string, @Body() dto: UpdateRoleDto) {
    return this.groupsService.updateRole(req.user.sub, groupId, dto);
  }

  @Delete(':id')
  deleteGroup(@Req() req: any, @Param('id') groupId: string) {
    return this.groupsService.deleteGroup(req.user.sub, groupId);
  }

  @Delete(':id/leave')
  leaveGroup(@Req() req: any, @Param('id') groupId: string) {
    return this.groupsService.leaveGroup(req.user.sub, groupId);
  }
}
