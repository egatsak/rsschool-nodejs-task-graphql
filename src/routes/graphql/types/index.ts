import { FastifyInstance } from "fastify";
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLOutputType
} from "graphql";

import { UserEntity } from "../../../utils/DB/entities/DBUsers";

const GraphQLMemberType: GraphQLOutputType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt }
  })
});

const GraphQLPost: GraphQLOutputType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  })
});

const GraphQLProfile: GraphQLOutputType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString }
  })
});

const GraphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: "GraphQLUser",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      resolve: async (
        parent: UserEntity,
        _,
        fastify: FastifyInstance
      ) =>
        fastify.db.profiles.findOne({
          key: "userId",
          equals: parent.id
        })
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (
        parent: UserEntity,
        _,
        fastify: FastifyInstance
      ) =>
        fastify.db.posts.findMany({
          key: "userId",
          equals: parent.id
        })
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (
        parent: UserEntity,
        _,
        fastify: FastifyInstance
      ) => {
        const userProfile = await fastify.db.profiles.findOne({
          key: "userId",
          equals: parent.id
        });

        if (!userProfile) {
          return null;
        }

        return fastify.db.memberTypes.findOne({
          key: "id",
          equals: userProfile.memberTypeId
        });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (
        parent: UserEntity,
        _,
        fastify: FastifyInstance
      ) =>
        Promise.all(
          parent.subscribedToUserIds.map(async (subscribedToUserId) =>
            fastify.db.users.findOne({
              key: "id",
              equals: subscribedToUserId
            })
          )
        )
    },

    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (
        parent: UserEntity,
        args: [],
        fastify: FastifyInstance
      ) =>
        fastify.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: parent.id
        })
    }
  })
});

export {
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUser
};
