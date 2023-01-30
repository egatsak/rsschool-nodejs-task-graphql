import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    UserEntity[]
  > {
    const users = await this.db.users.findMany();
    return users;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({
        key: "id",
        equals: request.params.id
      });

      if (!user) {
        throw this.httpErrors.notFound("User not found!");
      }

      return user;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema
      }
    },
    async function (request, reply): Promise<UserEntity> {
      const { body } = request;
      const user = await this.db.users.create(body);
      return user;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<UserEntity> {
      const { params } = request;
      const userToDelete = await this.db.users.findOne({
        key: "id",
        equals: params.id
      });

      if (!userToDelete) {
        throw this.httpErrors.badRequest("User not found");
      }

      try {
        const posts = await this.db.posts.findMany({
          key: "userId",
          equals: params.id
        });

        const profile = await this.db.profiles.findOne({
          key: "userId",
          equals: params.id
        });

        if (profile) {
          await this.db.profiles.delete(profile.id);
        }

        const subscribers = await this.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: params.id
        });

        await Promise.all(
          posts.map(async (post) => {
            await this.db.posts.delete(post.id);
          })
        );

        await Promise.all(
          subscribers.map(async (subscriber) => {
            const filteredSubscriptions =
              subscriber.subscribedToUserIds.filter(
                (id) => id !== params.id
              );

            await this.db.users.change(subscriber.id, {
              subscribedToUserIds: filteredSubscriptions
            });
          })
        );

        const deletedUser = await this.db.users.delete(params.id);

        return deletedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong during user delete!"
        );
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<UserEntity> {
      const { body, params } = request;

      const user = await this.db.users.findOne({
        key: "id",
        equals: body.userId
      });

      const userToSubscribe = await this.db.users.findOne({
        key: "id",
        equals: params.id
      });

      if (!user) {
        throw this.httpErrors.badRequest("User not found!");
      }

      if (!userToSubscribe) {
        throw this.httpErrors.badRequest(
          "User to subscribe not found!"
        );
      }

      if (body.userId === params.id) {
        throw this.httpErrors.badRequest(
          `One shouldn't subscribe to oneself!`
        );
      }

      const isUserSubscribed = user.subscribedToUserIds.indexOf(
        params.id
      );

      if (~isUserSubscribed) {
        throw this.httpErrors.badRequest(`Already subscribed!`);
      }

      try {
        const subscribedUser = await this.db.users.change(
          body.userId,
          {
            subscribedToUserIds: [
              ...user.subscribedToUserIds,
              params.id
            ]
          }
        );
        return subscribedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong!"
        );
      }
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<UserEntity> {
      const { body, params } = request;

      const user = await this.db.users.findOne({
        key: "id",
        equals: body.userId
      });

      const userToUnsubscribe = await this.db.users.findOne({
        key: "id",
        equals: params.id
      });

      if (!user) {
        throw this.httpErrors.badRequest("User not found!");
      }

      if (!userToUnsubscribe) {
        throw this.httpErrors.badRequest(
          "User to unsubscribe not found!"
        );
      }

      if (body.userId === params.id) {
        throw this.httpErrors.badRequest(
          `One can't unsubscribe from oneself!`
        );
      }

      const isUserSubscribed = user.subscribedToUserIds.indexOf(
        params.id
      );

      if (!~isUserSubscribed) {
        throw this.httpErrors.badRequest(
          `You are not subscribed to this user!`
        );
      }

      try {
        const filteredSubscribedToUserIds =
          user.subscribedToUserIds.filter((id) => id !== params.id);

        const unsubscribedUser = await this.db.users.change(
          body.userId,
          {
            subscribedToUserIds: filteredSubscribedToUserIds
          }
        );
        return unsubscribedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong!"
        );
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const updatedUser = await this.db.users.change(
          request.params.id,
          request.body
        );

        return updatedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong!"
        );
      }
    }
  );
};

export default plugin;
