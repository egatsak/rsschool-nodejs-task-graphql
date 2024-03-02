import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Profile } from '@prisma/client';
import DataLoader from 'dataloader';

import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberType.js';
import { Context } from '../gqlContext.js';
import { MemberTypeIdType } from './memberTypeId.js';

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    userId: { type: UUIDType },
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
    memberTypeId: { type: MemberTypeIdType },

    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: (source, _, context) => {
        let loader = context.loaders.get('memberType');

        if (!loader) {
          loader = new DataLoader(async (ids: readonly string[]) => {
            const types = await context.prisma.memberType.findMany({
              where: { id: { in: [...ids] } },
            });
            return ids.map((id) => types.find((types) => types.id === id));
          });
          context.loaders.set('memberType', loader);
        }

        return loader.load(source.memberTypeId);
      },
    },
  }),
});
