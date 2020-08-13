import { BadRequestException } from '@nestjs/common';
import { VoteType } from '../types';

export class RedundantVoteException extends BadRequestException {
  constructor(vote: VoteType) {
    super(
      `User has already ${
        vote === VoteType.UPVOTE ? 'upvoted' : 'downvoted'
      } this.`,
    );
  }
}
