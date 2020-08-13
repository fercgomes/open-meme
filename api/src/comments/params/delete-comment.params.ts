import { IsString } from 'class-validator';

export class DeleteVoteParams {
  @IsString()
  commentId: string;
}
