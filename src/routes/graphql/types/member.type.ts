import { GraphQLObjectType, GraphQLFloat, GraphQLInt } from 'graphql';
import { MemberTypeIdType } from './member-id.type.js';

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
