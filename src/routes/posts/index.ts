import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    PostEntity[]
  > {
    const posts = await this.db.posts.findMany();
    return posts;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await this.db.posts.findOne({
        key: "id",
        equals: request.params.id
      });

      if (!post) {
        throw this.httpErrors.notFound("Post not found!");
      }

      return post;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema
      }
    },
    async function (request, reply): Promise<PostEntity> {
      // TODO: check post author!
      const { body } = request;
      const post = await this.db.posts.create(body);
      return post;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<PostEntity> {
      const { params } = request;

      const post = await this.db.posts.findOne({
        key: "id",
        equals: params.id
      });

      if (!post) {
        throw this.httpErrors.badRequest("Post not found!");
      }

      const deletedPost = await this.db.posts.delete(params.id);

      return deletedPost;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<PostEntity> {
      const { params, body } = request;
      try {
        const updatedPost = await this.db.posts.change(
          params.id,
          body
        );

        return updatedPost;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong!"
        );
      }
    }
  );
};

export default plugin;
