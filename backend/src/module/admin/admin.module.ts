import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from '@entities/admin.entity';
import { User } from '@entities/user.entity'
import { AuthModule } from '@module/auth/auth.module';

// connect Service and Controller
@Module({
  imports: [TypeOrmModule.forFeature([Admin, User]), AuthModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})

export class AdminModule {}
