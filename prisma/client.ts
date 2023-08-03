import { PrismaClient } from '@prisma/client';
import { env } from '~/utils/env.mjs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'info', 'warn'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
