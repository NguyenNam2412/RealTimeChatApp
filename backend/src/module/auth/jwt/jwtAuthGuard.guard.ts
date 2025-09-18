import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// check user JWT token is valid
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
