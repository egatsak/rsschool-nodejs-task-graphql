import { PrismaClient } from '@prisma/client';
export interface Context {
  prisma: PrismaClient;
}

export const gqlContext = (prisma: PrismaClient): Context => {
  return { prisma };
};
