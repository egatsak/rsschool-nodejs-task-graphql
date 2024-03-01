import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Post } from '@prisma/client';
import { Context } from '../gqlContext.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  dto: Omit<Post, 'id'>;
}

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const createPost: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
  resolve: (_src, args, context) => context.prisma.post.create({ data: args.dto }),
};
