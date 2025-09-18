import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { User } from '@entities/user.entity';
import { Group } from '@entities/group.entity';
import { GroupMember } from '@entities/group.entity';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private readonly groupMemberRepo: Repository<GroupMember>,
  ) {}

  async search(dto: SearchDto, userId: string) {
    const { keyword, limit, offset } = dto;

    // 1. Tìm user theo username hoặc nickname
    const users = await this.userRepo.find({
      where: [
        { username: ILike(`%${keyword}%`) },
        { nickname: ILike(`%${keyword}%`) },
      ],
      select: ['id', 'username', 'nickname'], // chỉ select field cần thiết
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
    let groups: Group[] = [];
    if (groupIds.length > 0) {
      groups = await this.groupRepo.find({
        where: {
          id: In(groupIds),
          name: ILike(`%${keyword}%`),
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
}
