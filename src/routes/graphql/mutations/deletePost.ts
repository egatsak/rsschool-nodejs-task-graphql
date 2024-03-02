import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../gqlContext.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: string;
}

export const deletePost: GraphQLFieldConfig<void, Context, Args> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_src, args, context) => {
    const post = await context.prisma.post.delete({ where: { id: args.id } });
    return post.id;
  },
};
