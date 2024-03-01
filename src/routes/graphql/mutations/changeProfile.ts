import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { MemberTypeIdType } from '../types/memberTypeId.js';
import { Context } from '../gqlContext.js';
import { ProfileType } from '../types/profile.js';
import { Profile } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: string;
  dto: Omit<Profile, 'id' | 'userId'>;
}

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: MemberTypeIdType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});

export const changeProfile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
  },
  resolve: (_src, args, context) =>
    context.prisma.profile.update({ where: { id: args.id }, data: args.dto }),
};
