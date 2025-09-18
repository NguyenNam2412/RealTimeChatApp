import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// get request and call service
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('helloWorld')
  async connect() {
    return this.appService.getHello();
  }
}
