import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Lấy danh sách toàn bộ user
  async getAllUsers() {
    return this.userRepo.find();
  }

  // Lấy thông tin user theo id
  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Admin cập nhật thông tin user
  async updateUser(id: string, updateData: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateData.nickname) {
      const nickExist = await this.userRepo.findOne({ 
        where: { nickname: updateData.nickname },
      });
      if (nickExist && nickExist.id !== id) {
        throw new BadRequestException('Nickname already exists');
      }
      user.nickname = updateData.nickname;
    }

    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  // Duyệt user (approve/reject)
  async approveUser(id: string, approve: boolean) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.isApproved = approve;
    return this.userRepo.save(user);
  }

  // Xóa user
  async deleteUser(id: string) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
