import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

type ServiceStatus = 'ok' | 'error';

export type HealthResponse = {
  status: 'ok' | 'degraded';
  timestamp: string;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    minio: ServiceStatus;
  };
};

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly timeoutMs = Number(process.env.HEALTH_CHECK_TIMEOUT_MS ?? 3000);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  live() {
    return {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  async check(): Promise<HealthResponse> {
    const [database, redis, minio] = await Promise.all([
      this.withTimeout('database', this.checkDatabase()),
      this.withTimeout('redis', this.checkRedis()),
      this.withTimeout('minio', this.checkMinio()),
    ]);

    const services = { database, redis, minio };
    const degraded = Object.values(services).some((status) => status !== 'ok');

    return {
      status: degraded ? 'degraded' : 'ok',
      timestamp: new Date().toISOString(),
      services,
    };
  }

  private async checkDatabase(): Promise<ServiceStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'ok';
    } catch (err) {
      this.logger.warn(`Database health check failed: ${this.formatError(err)}`);
      return 'error';
    }
  }

  private async checkRedis(): Promise<ServiceStatus> {
    const redisUrl = process.env.REDIS_URL?.trim();
    if (!redisUrl) return 'error';

    const client = createClient({ url: redisUrl });
    client.on('error', () => undefined);

    try {
      await client.connect();
      await client.ping();
      return 'ok';
    } catch (err) {
      this.logger.warn(`Redis health check failed: ${this.formatError(err)}`);
      return 'error';
    } finally {
      if (client.isOpen) {
        await client.quit().catch(() => undefined);
      }
    }
  }

  private async checkMinio(): Promise<ServiceStatus> {
    try {
      await this.storage.checkBucket();
      return 'ok';
    } catch (err) {
      this.logger.warn(`MinIO health check failed: ${this.formatError(err)}`);
      return 'error';
    }
  }

  private formatError(err: unknown): string {
    if (err instanceof Error) return err.message;
    return 'unknown error';
  }

  private async withTimeout(
    service: keyof HealthResponse['services'],
    check: Promise<ServiceStatus>,
  ): Promise<ServiceStatus> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        check,
        new Promise<ServiceStatus>((resolve) => {
          timer = setTimeout(() => {
            this.logger.warn(`${service} health check timed out`);
            resolve('error');
          }, this.timeoutMs);
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
