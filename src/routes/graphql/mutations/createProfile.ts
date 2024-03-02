import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { ProfileType } from '../types/profile.js';
import { Context } from '../gqlContext.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeIdType } from '../types/memberTypeId.js';
import { Profile } from '@prisma/client';

interface Args {
  dto: Omit<Profile, 'id'>;
}

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdType) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

export const createProfile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
  resolve: (_src, args, context) => context.prisma.profile.create({ data: args.dto }),
};
