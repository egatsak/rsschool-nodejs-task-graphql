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
  id: string;
  dto: Omit<Post, 'id'>;
}

const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    authorId: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const changePost: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInputType) },
  },
  resolve: (_src, args, context) =>
    context.prisma.post.update({ where: { id: args.id }, data: args.dto }),
};
