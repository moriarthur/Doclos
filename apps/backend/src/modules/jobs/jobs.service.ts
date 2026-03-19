import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { AuditLog } from './entities/audit-log.entity';

// Part 4: API Specification - Job status tracking

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async getJobStatus(jobId: string) {
    const job = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Calculate progress based on status
    let progress = 0;
    switch (job.status) {
      case JobStatus.PENDING:
        progress = 0;
        break;
      case JobStatus.PROCESSING:
        progress = 50;
        break;
      case JobStatus.COMPLETED:
        progress = 100;
        break;
      case JobStatus.FAILED:
        progress = 0;
        break;
    }

    return {
      status: job.status,
      progress,
      error: job.last_error,
    };
  }

  async getAuditLogs(entityId?: string) {
    const qb = this.auditLogsRepository.createQueryBuilder('audit_log').leftJoinAndSelect('audit_log.user', 'user').orderBy('audit_log.created_at', 'DESC');

    if (entityId) {
      qb.andWhere('audit_log.entity_id = :entityId', { entityId });
    }

    return qb.getMany();
  }
}
