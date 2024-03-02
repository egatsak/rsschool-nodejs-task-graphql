import fp from 'fastify-plugin';
import sensible from '@fastify/sensible';

export const sensiblePluginTag = 'sensiblePluginTag';

export default fp(async (fastify) => await fastify.register(sensible), {
  name: sensiblePluginTag,
});
