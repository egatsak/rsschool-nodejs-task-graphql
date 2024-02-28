import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UserType } from '../types/user.type.js';
import { UUIDType } from '../types/uuid.type.js';
import { Context } from '../types/context.js';

interface Args {
  id: string;
}

export const user: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType as GraphQLObjectType<void, Context>,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, ctx) => ctx.prisma.user.findUnique({ where: { id } }),
};

export const users: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(UserType)),
  resolve: (_source, _args, ctx) => ctx.prisma.user.findMany(),
};
