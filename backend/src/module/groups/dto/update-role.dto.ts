import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsUUID()
  @IsNotEmpty()
  memberId!: string;

  @IsIn(['member', 'moderator', 'owner'])
  role!: 'member' | 'moderator' | 'owner';
}
