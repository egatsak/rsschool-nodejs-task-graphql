import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { gqlContext } from './gqlContext.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const { prisma } = fastify;
      const { query, variables } = req.body;

      const validationErrors = validate(gqlSchema, parse(query), [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        contextValue: gqlContext(prisma),
      });

      return result;
    },
  });
};

export default plugin;
