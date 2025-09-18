import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

// handle logic and return data to Controller
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private configService: ConfigService, 
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  
  private readonly logger = new Logger(AppService.name);

  onModuleInit() {
    this.logger.log('AppService initialized');
  }

  async getHello(): Promise<any> {
    let data = await this.cacheManager.get('hello'); //this.cacheManager.get('key');
    const port = this.configService.get<number>('port');
    if (!data) {
      data = { msg: 'Xin chào từ DB!' };
      await this.cacheManager.set('hello', data, 60000); // TTL 60s - this.cacheManager.set('key', 'value', 1000);
    };
    // delete - this.cacheManager.del('key');
    // clear - this.cacheManager.clear();
    this.logger.log(`App running on port: ${port}`);
    return data;
  }
}

