import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Context } from '../gqlContext.js';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';

interface Args {
  id: string;
}

export const user: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType as GraphQLObjectType<void, Context>,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, context) =>
    context.prisma.user.findUnique({ where: { id } }),
};

export const users: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(UserType)),
  resolve: (_source, _args, context) => context.prisma.user.findMany(),
};
