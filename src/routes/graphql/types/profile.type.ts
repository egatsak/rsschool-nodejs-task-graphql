import { Profile } from '@prisma/client';
import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.type.js';
import { MemberTypeIdType } from './member-id.type.js';
import { MemberTypeType } from './member.type.js';
import { Context } from './context.js';

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    userId: { type: UUIDType },
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
    memberTypeId: { type: MemberTypeIdType },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: (source, _, context) =>
        context.prisma.memberType.findUnique({ where: { id: source.memberTypeId } }),
    },
  }),
});
