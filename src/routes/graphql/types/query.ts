import { GraphQLObjectType } from 'graphql';

import { memberType, memberTypes } from '../queries/memberType.js';
import { post, posts } from '../queries/post.js';
import { user, users } from '../queries/user.js';
import { profile, profiles } from '../queries/profile.js';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberType,
    memberTypes,
    post,
    posts,
    user,
    users,
    profile,
    profiles,
  }),
});
