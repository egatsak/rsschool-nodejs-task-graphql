import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { ProfileType } from '../types/profile.type.js';
import { UUIDType } from '../types/uuid.type.js';
import { Context } from '../types/context.js';

interface Args {
  id: string;
}

export const profile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_src, args, context) =>
    context.prisma.profile.findUnique({ where: { id: args.id } }),
};

export const profiles: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(ProfileType)),
  resolve: (_src, _args, context) => context.prisma.profile.findMany(),
};
