import { GraphQLList, GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { Post, User } from '@prisma/client';
import DataLoader from 'dataloader';

import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { UUIDType } from './uuid.js';
import { Context } from '../gqlContext.js';

export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (source, _, context) => {
        let loader = context.loaders.get('posts');

        if (!loader) {
          loader = new DataLoader(async (ids: readonly string[]) => {
            const posts = await context.prisma.post.findMany({
              where: { authorId: { in: [...ids] } },
            });

            const groupedPosts = posts.reduce(
              (acc, post) => {
                if (!acc[post.authorId]) {
                  acc[post.authorId] = [];
                }

                acc[post.authorId].push(post);
                return acc;
              },
              {} as Record<string, Post[]>,
            );
            return ids.map((id) => groupedPosts[id]);
          });

          context.loaders.set('posts', loader);
        }

        return loader.load(source.id);
      },
    },

    profile: {
      type: ProfileType,
      resolve: (source, _, context) => {
        let loader = context.loaders.get('profile');

        if (!loader) {
          loader = new DataLoader(async (ids: readonly string[]) => {
            const profiles = await context.prisma.profile.findMany({
              where: { userId: { in: [...ids] } },
            });
            return ids.map((id) => profiles.find((profile) => profile.userId === id));
          });
          context.loaders.set('profile', loader);
        }

        return loader.load(source.id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, _, context) => {
        let loader = context.loaders.get('userSubscribedTo');

        if (!loader) {
          loader = new DataLoader(async (ids: readonly string[]) => {
            const subscribers = await context.prisma.subscribersOnAuthors.findMany({
              where: { subscriberId: { in: [...ids] } },
              select: { subscriberId: true, author: true },
            });

            const authorsGrouped = subscribers.reduce(
              (acc, curr) => {
                if (!acc[curr.subscriberId]) {
                  acc[curr.subscriberId] = [];
                }
                acc[curr.subscriberId].push(curr.author);
                return acc;
              },
              {} as Record<string, User[]>,
            );
            return ids.map((id) => authorsGrouped[id]);
          });

          context.loaders.set('userSubscribedTo', loader);
        }

        return loader.load(source.id);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, _, context) => {
        let loader = context.loaders.get('subscribedToUser');

        if (!loader) {
          loader = new DataLoader(async (ids: readonly string[]) => {
            const subscribers = await context.prisma.subscribersOnAuthors.findMany({
              where: { authorId: { in: [...ids] } },
              select: { authorId: true, subscriber: true },
            });

            const subscribersGrouped = subscribers.reduce(
              (acc, curr) => {
                if (!acc[curr.authorId]) {
                  acc[curr.authorId] = [];
                }
                acc[curr.authorId].push(curr.subscriber);
                return acc;
              },
              {} as Record<string, User[]>,
            );

            return ids.map((id) => subscribersGrouped[id]);
          });

          context.loaders.set('subscribedToUser', loader);
        }

        return loader.load(source.id);
      },
    },
  }),
});
