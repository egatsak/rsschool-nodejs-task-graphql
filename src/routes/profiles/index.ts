import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createProfileBodySchema,
  changeProfileBodySchema
} from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    ProfileEntity[]
  > {
    const profiles = await this.db.profiles.findMany();
    return profiles;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: "id",
        equals: request.params.id
      });

      if (!profile) {
        throw this.httpErrors.notFound("Profile not found");
      }

      return profile;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema
      }
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body } = request;
      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: body.memberTypeId
      });

      if (!memberType) {
        throw this.httpErrors.badRequest("Member type not found!");
      }

      const hasUserProfile = await this.db.profiles.findOne({
        key: "userId",
        equals: body.userId
      });

      if (hasUserProfile) {
        throw this.httpErrors.badRequest(
          "User already has a profile!"
        );
      }

      const profile = await this.db.profiles.create(body);

      return profile;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { params } = request;
      const profile = await this.db.profiles.findOne({
        key: "id",
        equals: params.id
      });

      if (!profile) {
        throw this.httpErrors.badRequest("Profile not found");
      }

      const deletedProfile = await this.db.profiles.delete(params.id);
      return deletedProfile;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body, params } = request;

      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: body.memberTypeId!
      });

      if (!memberType) {
        throw this.httpErrors.badRequest("Member type not found!");
      }

      try {
        const updatedProfile = await this.db.profiles.change(
          params.id,
          body
        );

        return updatedProfile;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong!"
        );
      }
    }
  );
};

export default plugin;
