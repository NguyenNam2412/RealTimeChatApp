import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { JwtAuthGuard } from '@module/auth/jwt/jwtAuthGuard.guard';
import { CurrentUser } from '@common/decorators/user.decorator'

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: SearchDto, @CurrentUser() user: any) {
    const userId = user?.sub;
    console.log(userId);
    return this.searchService.search(query, userId);
  }
}