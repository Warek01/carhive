import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
   imports: [TerminusModule.forRoot()],
   exports: [],
   controllers: [HealthController],
   providers: [HealthService],
})
export class HealthModule {}
