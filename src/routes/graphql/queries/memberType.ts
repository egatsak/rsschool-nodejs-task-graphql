import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../gqlContext.js';
import { MemberTypeType } from '../types/memberType.js';
import { MemberTypeIdType } from '../types/memberTypeId.js';

interface Args {
  id: string;
}

export const memberType: GraphQLFieldConfig<void, Context, Args> = {
  type: MemberTypeType,
  args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
  resolve: (_source, args, context) =>
    context.prisma.memberType.findUnique({ where: { id: args.id } }),
};

export const memberTypes: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(MemberTypeType)),
  resolve: (_src, _, context) => context.prisma.memberType.findMany(),
};
