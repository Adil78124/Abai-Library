import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(200)
  check() {
    return this.healthService.check();
  }

  @Get('live')
  @HttpCode(200)
  live() {
    return this.healthService.live();
  }

  @Get('ready')
  @HttpCode(200)
  ready() {
    return this.healthService.check();
  }
}
