import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { PostType } from '../types/post.type.js';
import { UUIDType } from '../types/uuid.type.js';
import { Context } from '../types/context.js';

interface Args {
  id: string;
}

export const post: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_src, args, context) =>
    context.prisma.post.findUnique({ where: { id: args.id } }),
};

export const posts: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(PostType)),
  resolve: (_src, _, context) => context.prisma.post.findMany(),
};
