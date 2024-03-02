import { GraphQLObjectType } from 'graphql';
import { createUser } from '../mutations/createUser.js';
import { changeUser } from '../mutations/changeUser.js';
import { deleteUser } from '../mutations/deleteUser.js';
import { createProfile } from '../mutations/createProfile.js';
import { changeProfile } from '../mutations/changeProfile.js';
import { deleteProfile } from '../mutations/deleteProfile.js';
import { createPost } from '../mutations/createPost.js';
import { changePost } from '../mutations/changePost.js';
import { deletePost } from '../mutations/deletePost.js';
import { subscribeTo } from '../mutations/subscribeToUser.js';
import { unsubscribeFrom } from '../mutations/unsubscribeFromUser.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser,
    changeUser,
    deleteUser,
    createProfile,
    changeProfile,
    deleteProfile,
    createPost,
    changePost,
    deletePost,
    subscribeTo,
    unsubscribeFrom,
  }),
});
