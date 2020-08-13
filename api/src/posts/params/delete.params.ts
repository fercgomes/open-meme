import { IsNumberString } from 'class-validator';

export class DeleteParams {
  @IsNumberString()
  postId: number;
}
