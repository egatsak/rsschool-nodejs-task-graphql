import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
export interface Context {
  prisma: PrismaClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loaders: Map<string, DataLoader<any, any>>;
}

export const gqlContext = (prisma: PrismaClient): Context => {
  return { loaders: new Map(), prisma };
};
