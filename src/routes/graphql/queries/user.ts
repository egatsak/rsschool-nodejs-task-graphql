import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  Kind,
  SelectionNode,
} from 'graphql';
import { Context } from '../gqlContext.js';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import DataLoader from 'dataloader';
import { User } from '@prisma/client';

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
  resolve: async (_source, _, context, info) => {
    const queryNodes = parseNodes(info.fieldNodes);

    const hasUserSubscribedTo = !!queryNodes.users?.userSubscribedTo;
    const hasSubscribedToUser = !!queryNodes.users?.subscribedToUser;

    const users = await context.prisma.user.findMany({
      include: {
        userSubscribedTo: hasUserSubscribedTo,
        subscribedToUser: hasSubscribedToUser,
      },
    });

    if (hasUserSubscribedTo) {
      let loader = context.loaders.get('userSubscribedTo');

      if (!loader) {
        loader = new DataLoader(async (ids: readonly string[]) => {
          const authors = await context.prisma.user.findMany({
            where: {
              subscribedToUser: {
                some: {
                  subscriberId: { in: [...ids] },
                },
              },
            },
            include: {
              subscribedToUser: true,
            },
          });

          const authorsGrouped = authors.reduce(
            (acc, curr) => {
              curr.subscribedToUser.forEach((user) => {
                if (!acc[user.subscriberId]) {
                  acc[user.subscriberId] = [];
                }
                acc[user.subscriberId].push(curr);
              });
              return acc;
            },
            {} as Record<string, User[]>,
          );
          return ids.map((id) => authorsGrouped[id]);
        });
        context.loaders.set('userSubscribedTo', loader);
      }
      users.forEach((user) => loader?.prime(user.id, user.userSubscribedTo));
    }

    if (hasSubscribedToUser) {
      let loader = context.loaders.get('subscribedToUser');
      if (!loader) {
        loader = new DataLoader(async (ids: readonly string[]) => {
          const subscribers = await context.prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: {
                  authorId: { in: [...ids] },
                },
              },
            },
            include: {
              userSubscribedTo: true,
            },
          });

          const subscribersGrouped = subscribers.reduce(
            (acc, curr) => {
              curr.userSubscribedTo.forEach((user) => {
                if (!acc[user.authorId]) {
                  acc[user.authorId] = [];
                }
                acc[user.authorId].push(curr);
              });
              return acc;
            },
            {} as Record<string, User[]>,
          );
          return ids.map((id) => subscribersGrouped[id]);
        });
        context.loaders.set('subscribedToUser', loader);
      }
      users.forEach((user) => loader?.prime(user.id, user.subscribedToUser));
    }

    return users;
  },
};

type ParsedNodes = {
  [key: string]: ParsedNodes | undefined;
};

function parseNodes(nodes: readonly SelectionNode[]) {
  const parsedNodes: ParsedNodes = {};

  nodes.forEach((node) => {
    if (node.kind === Kind.FIELD) {
      if (node.selectionSet) {
        parsedNodes[node.name.value] = parseNodes(node.selectionSet.selections);
      } else {
        parsedNodes[node.name.value] = {};
      }
    }
  });

  return parsedNodes;
}
