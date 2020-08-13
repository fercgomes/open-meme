import { Post } from './posts.entity';
import { VoteType } from 'src/common/types';

/** Post response for anonymous user */
export type PostAnonymousResponse = Pick<
  Post,
  'id' | 'createdAt' | 'title' | 'imageUrl' | 'points'
>;

/** Post response for an authenticated user includes
 * the vote cast by the user in the post.
 */
export type PostAuthenticatedResponse = PostAnonymousResponse & {
  userVoted?: VoteType;
};
