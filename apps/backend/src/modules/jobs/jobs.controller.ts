import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Part 4: API Specification - Job status endpoint

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get(':id')
  async getJobStatus(@Param('id') id: string) {
    return this.jobsService.getJobStatus(id);
  }
}
