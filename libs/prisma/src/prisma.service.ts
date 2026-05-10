import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // In Prisma 7, we pass the connection details here or use a config file
      // For direct connection:
      datasource: {
        url: process.env.DATABASE_URL,
      },
    } as any); // Type cast if types are not perfectly synced yet
  }

  async onModuleInit() {
    await this.$connect();
  }


  async onModuleDestroy() {
    await this.$disconnect();
  }
}

