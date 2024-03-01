import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { User } from '@prisma/client';
import { Context } from '../gqlContext.js';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';

interface Args {
  id: string;
  dto: Omit<User, 'id'>;
}

const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

export const changeUser: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType as GraphQLObjectType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInputType) },
  },
  resolve: (_src, args, context) =>
    context.prisma.user.update({ where: { id: args.id }, data: args.dto }),
};
