import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const memberTypes = await this.db.memberTypes.findMany();
    return memberTypes;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema
      }
    },

    async function (request, reply): Promise<MemberTypeEntity> {
      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: request.params.id
      });

      if (!memberType) {
        throw this.httpErrors.notFound("Member type not found!");
      }

      return memberType;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema
      }
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { params, body } = request;
      try {
        const updatedMemberType = await this.db.memberTypes.change(
          params.id,
          body
        );

        return updatedMemberType;
      } catch (e: any) {
        throw this.httpErrors.badRequest(
          e?.message ?? "Something went wrong!"
        );
      }
    }
  );
};

export default plugin;
