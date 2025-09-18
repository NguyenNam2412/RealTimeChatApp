import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Admin } from '@entities/admin.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  // User Register
  async register(dto: RegisterDto) {
    const nickname = dto.nickname?.trim() ?? null;
    if (nickname) {
      const nickExist = await this.userRepo.findOne({ where: { nickname } });
      if (nickExist) {
        throw new BadRequestException('Nickname already exists');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepo.create({
      username: dto.username,
      nickname: dto.nickname ?? null,
      passwordHash,
      isApproved: null, // pending
    });
    await this.userRepo.save(newUser);

    return { message: 'Registered successfully, waiting for admin approval' };
  }

  // User Login
  async loginUser(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.isApproved === null) {
      return { status: 'pending', message: 'Waiting for admin approval' };
    }
    if (user.isApproved === false) {
      return { status: 'rejected', message: 'Account rejected' };
    }

    const payload = { sub: user.id, username: user.username, nickname: user.nickname, role: 'user' };
    return {
      status: 'approved',
      access_token: this.jwtService.sign(payload),
    };
  }

  // Admin Login
  async loginAdmin(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { username: dto.username } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = {sub: admin.id, username: admin.username, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
