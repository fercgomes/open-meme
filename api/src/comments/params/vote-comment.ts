import { IsString } from 'class-validator';

export class VoteCommentParams {
  @IsString()
  commentId: string;
}
