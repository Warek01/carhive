import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
   DiskHealthIndicator,
   HealthCheck,
   HealthCheckResult,
   HealthCheckService,
   MemoryHealthIndicator,
} from '@nestjs/terminus';

import { Public } from '@/auth/decorators/auth.decorator';

@Controller('health')
@Public()
@ApiTags('Health')
export class HealthController {
   private readonly _heapThreshold = 512 * 1024 * 1024;

   constructor(
      private readonly _health: HealthCheckService,
      private readonly _disk: DiskHealthIndicator,
      private readonly _memory: MemoryHealthIndicator,
   ) {}

   @Get()
   @HealthCheck()
   check(): Promise<HealthCheckResult> {
      return this._health.check([
         () =>
            this._disk.checkStorage('storage', {
               path: '/',
               thresholdPercent: 0.85,
            }),
         () => this._memory.checkHeap('mem-heap', this._heapThreshold),
      ]);
   }
}
