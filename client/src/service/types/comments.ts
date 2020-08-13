import { IUser } from "./users";

/** Base comment interface. */
interface IBaseComment {
  id: string;
  content: string;
  points: string;
  author: IUser;
}

/** API Response Types */

/** Represents a post returned by the API. */
export interface ICommentResponse extends IBaseComment {
  createdAt: string;
}

/** Transformed types. */

/** Represents a transformed post, which is used in post lists.
 */
export interface IComment extends IBaseComment {
  createdAt: Date;
}
