import { IUser } from "./users";
import { IComment } from "./comments";
import { VoteType } from "./common";

/** Base post interface. */
interface IBasePost {
  id: string;
  title: string;
  imageUrl: string;
  points: number;
  userVoted?: VoteType | null;

  // TODO put in API
  commentCount?: number;
}

/** API Response Types */

/** Represents a post returned by the API. */
export interface IPostResponse extends IBasePost {
  createdAt: string;
}

/** Represents a full post as returned by the API. */
export interface IFullPostResponse extends IPostResponse {
  author: IUser;
  comments: IComment[];
}

/** Transformed types. */

/** Represents a transformed post, which is used in post lists.
 */
export interface IPost extends IBasePost {
  createdAt: Date;
}

/** Full post object, shown in a post page. */
export interface IFullPost extends IPost {
  author: IUser;
  comments: IComment[];
}
