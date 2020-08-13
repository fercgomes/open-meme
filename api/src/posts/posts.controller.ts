import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Request,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestHandler } from '@nestjs/common/interfaces';
import { RequestingUser } from '../auth/types';
import { DeleteParams } from './params/delete.params';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDTO } from 'src/comments/dto/create-comment.dto';
import { VoteDTO } from './dto/vote.dto';
import { UserVoteParams } from './params/userVote.params';
import { PostAuthenticatedResponse, PostAnonymousResponse } from './types';
import { Comment } from 'src/comments/comments.entity';
import { AuthGuard } from '@nestjs/passport';

/** Response Contracts */
type GetPostsResponse = Promise<
  PostAnonymousResponse | PostAuthenticatedResponse
>;
type CreatePostResponse = Promise<PostAuthenticatedResponse>;
type GetPostResponse = Promise<
  PostAnonymousResponse | PostAuthenticatedResponse
>;
type DeletePostResponse = Promise<void>;
type GetPostCommentsResponse = Promise<Comment[]>;
type CreatePostCommentResponse = Promise<Comment>;
type UserVoteResponse = Promise<PostAuthenticatedResponse>;
type DeleteVoteResponse = Promise<void>;

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  /**
   * Main post querying endpoint.
   *
   * TODO: query parameters to control the filtering of posts.
   */
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  @Get()
  public getPosts(@Request() request): any {
    return this.postsService.queryPosts(request.user.userId);
  }

  /**
   * Creates a new post whose author is encoded
   * in the JWT token.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  public createPost(
    @Request() request: RequestHandler & { user: RequestingUser },
    @Body() createPostDto: CreatePostDTO,
    @Query('ref') contentRef: string,
  ): CreatePostResponse {
    if (contentRef) {
      return this.postsService.create(
        createPostDto,
        request.user.userId,
        contentRef,
      );
    } else {
      throw new BadRequestException('Content reference not provided.');
    }
  }

  /**
   * Returns a post.
   *
   * TODO: send back post comments.
   */
  @Get(':postId')
  public async getPost(@Param() params): GetPostResponse {
    const post = await this.postsService.findById(params.postId);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  public async deletePost(
    @Request() request: RequestHandler & { user: RequestingUser },
    @Param() params: DeleteParams,
  ): DeletePostResponse {
    return this.postsService.delete(params.postId, request.user.userId);
  }

  /**
   * Returns comments beloging to a post.
   *
   * @param request
   * @param params
   */
  @Get(':postId/comments')
  public async getPostComments(
    @Request() request: RequestHandler,
    @Param() params: any,
  ): GetPostCommentsResponse {
    return this.commentsService.findCommentsByPost(params.postId);
  }

  /**
   * Creates a comment whose author is the user encoded in the request,
   * and whose post is encoded in the url params as postId.
   *
   * @param createCommentDto
   * @param request
   * @param params
   */
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  public async createPostComment(
    @Body() createCommentDto: CreateCommentDTO,
    @Request() request: RequestHandler & { user: RequestingUser },
    @Param() params: any,
  ): CreatePostCommentResponse {
    return this.commentsService.create(
      createCommentDto,
      params.postId,
      request.user.userId,
    );
  }

  /**
   * Creates or updates a vote of an user in a post.
   *
   * @param voteDto encodes whether vote is an upvote or a downvote
   * @param request
   * @param params contains postId
   */
  @UseGuards(JwtAuthGuard)
  @Post(':postId/vote')
  public userVote(
    @Body() voteDto: VoteDTO,
    @Request() request: RequestHandler & { user: RequestingUser },
    @Param() params: UserVoteParams,
  ): UserVoteResponse {
    return this.postsService.vote(
      params.postId,
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
  @Delete(':postId/vote')
  public deleteVote(
    @Request() request: RequestHandler & { user: RequestingUser },
    @Param() params: UserVoteParams,
  ): DeleteVoteResponse {
    return this.postsService.deleteVote(params.postId, request.user.userId);
  }
}
