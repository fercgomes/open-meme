import { IComment } from "./comments";

interface IBaseUser {
  id: string;
  username: string;
}

/** User data publicly available. */
export interface IUser extends IBaseUser {}

/** User data only shown to user. */
export interface IUserPrivate extends IBaseUser {
  email: string;
  comments?: IComment[];
  //? Post votes
  //? Comment votes
}
