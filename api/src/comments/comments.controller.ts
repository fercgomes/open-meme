import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VoteDTO } from 'src/posts/dto/vote.dto';
import { RequestHandler } from '@nestjs/common/interfaces';
import { RequestingUser } from 'src/auth/types';
import { VoteCommentParams } from './params/vote-comment';
import { DeleteVoteParams } from './params/delete-comment.params';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  //! Code duplication from PostsController

  /**
   * Creates or updates a vote of an user in a post.
   *
   * @param voteDto encodes whether vote is an upvote or a downvote
   * @param request
   * @param params contains postId
   */
  @UseGuards(JwtAuthGuard)
  @Post(':commentId/vote')
  public userVote(
    @Body() voteDto: VoteDTO,
    @Request() request: RequestHandler & { user: RequestingUser },
    @Param() params: VoteCommentParams,
  ) {
    return this.commentsService.vote(
      params.commentId,
      request.user.userId,
      voteDto.type,
    );
  }

  /**
   * Requests deletion of a post vote by a given user.
   *
   * @param request
   * @param params
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId/vote')
  public deleteVote(
    @Request() request: RequestHandler & { user: RequestingUser },
    @Param() params: DeleteVoteParams,
  ) {
    return this.commentsService.deleteVote(
      params.commentId,
      request.user.userId,
    );
  }
}
