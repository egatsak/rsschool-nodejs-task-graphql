import { GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.type.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    authorId: { type: UUIDType },
    content: { type: GraphQLString },
  }),
});
