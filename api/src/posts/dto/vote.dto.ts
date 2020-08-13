import { IsEnum } from 'class-validator';
import { VoteType } from '../../common/types';

/**
 * A vote encoded in a request body.
 * Can either be an upvote or a downvote.
 */
export class VoteDTO {
  @IsEnum(VoteType)
  type: VoteType;
}
