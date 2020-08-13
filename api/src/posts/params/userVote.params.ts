import { IsString } from 'class-validator';

export class UserVoteParams {
  @IsString()
  postId: string;
}
