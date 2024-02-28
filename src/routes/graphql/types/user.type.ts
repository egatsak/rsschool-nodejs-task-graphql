import { GraphQLList, GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from '@prisma/client';
import { ProfileType } from './profile.type.js';
import { PostType } from './post.type.js';
import { UUIDType } from './uuid.type.js';
import { Context } from './context.js';

export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (source, _args, context) =>
        context.prisma.post.findMany({ where: { authorId: source.id } }),
    },

    profile: {
      type: ProfileType,
      resolve: (source, _args, context) =>
        context.prisma.profile.findUnique({ where: { userId: source.id } }),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, _args, context) => {
        const authors = (
          await context.prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: source.id },
            select: { author: true },
          })
        ).map(({ author }) => author);
        return authors;
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, _args, context) => {
        const subs = (
          await context.prisma.subscribersOnAuthors.findMany({
            where: { authorId: source.id },
            select: { subscriber: true },
          })
        ).map(({ subscriber }) => subscriber);
        return subs;
      },
    },
  }),
});
