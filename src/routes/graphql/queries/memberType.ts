import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { MemberTypeIdType } from '../types/member-id.type.js';
import { MemberTypeType } from '../types/member.type.js';
import { Context } from '../types/context.js';

interface Args {
  id: string;
}

export const memberType: GraphQLFieldConfig<void, Context, Args> = {
  type: MemberTypeType,
  args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
  resolve: (_source, args, ctx) =>
    ctx.prisma.memberType.findUnique({ where: { id: args.id } }),
};

export const memberTypes: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(MemberTypeType)),
  resolve: (_src, _, ctx) => ctx.prisma.memberType.findMany(),
};
