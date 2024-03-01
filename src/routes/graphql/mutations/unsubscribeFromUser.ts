import { GraphQLFieldConfig, GraphQLInt, GraphQLNonNull } from 'graphql';
import { Context } from '../gqlContext.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  userId: string;
  authorId: string;
}

export const unsubscribeFrom: GraphQLFieldConfig<void, Context, Args> = {
  type: GraphQLInt,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_src, args, context) => {
    const result = await context.prisma.subscribersOnAuthors.deleteMany({
      where: { subscriberId: args.userId, authorId: args.authorId },
    });
    return result.count;
  },
};
