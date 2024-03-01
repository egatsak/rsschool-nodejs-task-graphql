import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../gqlContext.js';
import { UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  userId: string;
  authorId: string;
}

export const subscribeTo: GraphQLFieldConfig<void, Context, Args> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  type: UserType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_src, args, context) => {
    const result = await context.prisma.subscribersOnAuthors.create({
      data: { subscriberId: args.userId, authorId: args.authorId },
      include: { author: true },
    });
    return result.author;
  },
};
