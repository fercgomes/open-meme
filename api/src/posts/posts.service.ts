import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, PostVote } from './posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { RedundantVoteException } from '../common/exceptions/RedundantVoteException';
import { VoteType } from '../common/types';
import { PostAnonymousResponse, PostAuthenticatedResponse } from './types';
import { MediaService } from '../media/media.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(PostVote)
    private postVotesRepository: Repository<PostVote>,
    private usersService: UsersService,
    private mediaService: MediaService,
  ) {}

  public async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  public async queryPosts(
    requestingUserId: string | undefined,
  ): Promise<PostAnonymousResponse[] | PostAuthenticatedResponse[]> {
    /** If the request is made by an
     * authenticated user, we append
     * whether he's voted in each
     * post.
     */
    if (requestingUserId) {
      return this.postsRepository.query(
        `
          SELECT
            post.id,
            post.createdAt,
            post.title,
            post.imageUrl,
            post.points,
            T.voteType as userVoted
          FROM post LEFT JOIN (
            SELECT *
            FROM post_vote
            WHERE post_vote.userId = ?
          ) as T
          ON post.id = T.postId
        `,
        [requestingUserId],
      );
    } else {
      return this.postsRepository
        .createQueryBuilder('post')
        .select('post')
        .getMany();
    }
  }

  public async findById(postId: string): Promise<Post> {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :id', { id: postId })
      .select([
        'post',
        'comment',
        'commentAuthor.id',
        'commentAuthor.username',
        'author.id',
        'author.username',
      ])
      .getOne();
  }

  public async create(
    createPostDto: CreatePostDTO,
    userId: string,
    contentRef: string,
  ): Promise<PostAuthenticatedResponse> {
    let author: User;
    try {
      author = await this.usersService.findById(userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid user');
    }

    const url = this.mediaService.validateReference(contentRef);

    const post = new Post();
    post.author = author;
    post.createdAt = new Date();
    post.imageUrl = url;
    post.points = 0;
    post.title = createPostDto.title;
    await this.postsRepository.save(post);
    post.author = undefined;
    // TODO this could be better

    return post;
  }

  public async delete(postId: number, requestingUserId: string): Promise<any> {
    try {
      await this.postsRepository
        .createQueryBuilder('post')
        .leftJoin('post.author', 'author')
        .where('post.id = :postId', { postId: postId })
        .andWhere('author.id = :userId', { userId: requestingUserId })
        .delete()
        .execute();

      return;
    } catch (err) {
      throw new UnauthorizedException('This post does not belong to you.');
    }
  }

  /**
   * Will fetch every PostEvent entity and recompute the post points.
   *
   *! this is run every time someone votes, so going through every
   *! post vote is very inefficient
   *
   *? this can be done just checking for vote type,
   *? and doing a full recheck periodically
   *
   * @param postId
   */
  public async updatePostPoints(postId: string): Promise<Post> {
    /** Get post */
    const post = await this.postsRepository.findOne(postId);

    /** Get all votes from this post */
    const postVotes = await this.postVotesRepository
      .createQueryBuilder('postVote')
      .where('postVote.post = :postId', { postId: postId })
      .getMany();

    let counter = 0;
    for (const vote of postVotes) {
      counter +=
        vote.voteType === 'upvote' ? 1 : vote.voteType === 'downvote' ? -1 : 0;
    }

    post.points = counter;
    return this.postsRepository.save(post);
  }

  /**
   * Creates a vote of a user in a post.
   *
   * A user can upvote, downvote, or have no votes in a post.
   * A vote is represented by a PostVote, which relates a user
   * a post, and a vote type (upvote or downvote).
   *
   * If a user has upvoted, he can only downvote or remove
   * the vote altogether. The same goes for downvoting.
   *
   * TODO: more efficient way of creating post votes.
   *
   * @param postId post receiving the vote
   * @param votingUserId user giving the vote
   * @param vote the type of vote
   */
  public async vote(
    postId: string,
    votingUserId: string,
    vote: VoteType,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne(postId);
    const user = await this.usersService.findById(votingUserId);
    let postVote: PostVote;

    try {
      postVote = await this.postVotesRepository.findOneOrFail({
        post: post,
        user: user,
      });
    } catch (err) {
      /** No post vote found, create one */
      const postVote = new PostVote();
      postVote.post = post;
      postVote.user = user;
      postVote.voteType = vote;
      await this.postVotesRepository.save(postVote);
      await this.updatePostPoints(postId);
      return post;
    }

    /** There's a post vote already, check if update is needed */
    if (postVote.voteType === vote) {
      throw new RedundantVoteException(vote);
    } else {
      this.postVotesRepository
        .createQueryBuilder('postVote')
        .update()
        .set({
          voteType: vote,
        })
        .where('post = :postId', { postId: postId })
        .andWhere('user = :userId', { userId: votingUserId })
        .execute();

      await this.updatePostPoints(postId);
      return post;
    }
  }

  /**
   * Deletes a vote of an user in a post.
   *
   *! Doesn't work.
   *
   * @param postId post whose vote belongs to.
   * @param votingUserId user who voted.
   */
  public async deleteVote(postId: string, votingUserId: string): Promise<void> {
    await this.postVotesRepository
      .createQueryBuilder('postVote')
      .delete()
      .where('postVote.user = :userId', { userId: votingUserId })
      .andWhere('postVote.post = :postId', { postId: postId })
      .execute();
  }
}
