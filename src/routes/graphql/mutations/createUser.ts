import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { User } from '@prisma/client';
import { Context } from '../gqlContext.js';
import { UserType } from '../types/user.js';

interface Args {
  dto: Omit<User, 'id'>;
}

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const createUser: GraphQLFieldConfig<void, Context, Args> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  type: UserType,
  args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
  resolve: (_src, args, context) => context.prisma.user.create({ data: args.dto }),
};
