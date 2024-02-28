import { PrismaClient } from '@prisma/client';
import { Context } from './types/context.js';

export const gqlContext = (prisma: PrismaClient): Context => {
  return { prisma };
};
