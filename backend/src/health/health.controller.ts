import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  @ApiOperation({ summary: 'Health check endpoint for Render/Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check() {
    this.logger.log('Health check probe requested');
    return {
      status: 'ok',
      service: 'NSFS Milestone Tracking Backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
