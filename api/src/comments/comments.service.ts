import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentVote } from './comments.entity';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { Post } from 'src/posts/posts.entity';
import { User } from 'src/users/users.entity';
import { VoteType } from 'src/common/types';
import { RedundantVoteException } from 'src/common/exceptions/RedundantVoteException';

@Injectable()
export class CommentsService {
  constructor(
    //! Too many dependencies
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,

    @InjectRepository(CommentVote)
    private commentVotesRepository: Repository<CommentVote>,

    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Returns a single comment with given id.
   * @param commentId
   */
  public findCommentById(commentId: string): Promise<Comment> {
    return this.commentsRepository.findOne(commentId);
  }

  /**
   * Returns comments belonging to a post with given id.
   * ! By now, returns all comments.
   * TODO: pagination.
   *
   * @param postId
   */
  public findCommentsByPost(postId: string): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.post = :postId', { postId: postId })
      .select(['comment', 'author.username', 'author.id'])
      .getMany();
  }

  /**
   * Returns all comments created by a user with given id.
   *
   * @param userId
   */
  public findCommentsByUser(userId: string): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.author = :authorId', { authorId: userId })
      .getMany();
  }

  /**
   * Creates a new comment, associated with user encoded in the request.
   *
   * TODO: more efficient way of creating a comment, without having to fetch user AND post
   *
   * @param createCommentDto transfer object containing the comment to be created
   * @param authorId id of user creating the comment
   */
  public async create(
    createCommentDto: CreateCommentDTO,
    postId: string,
    authorId: string,
  ): Promise<Comment> {
    //! This is a very inefficient way of creating a comment.
    //! There are two queries and one save
    const author = await this.usersRepository.findOne(authorId);
    const post = await this.postsRepository.findOne(postId);
    const comment = new Comment();

    comment.author = author;
    comment.post = post;
    comment.content = createCommentDto.content;
    comment.createdAt = new Date();
    comment.points = 0;

    return this.commentsRepository.save(comment);
  }

  /**
   * Deletes a comment with given id, if user encoded in request owns it.
   *
   * TODO: indicate that user can't delete a comment that isn't his
   *
   * @param commentId id of comment being deleted
   * @param requestingUserId id of user encoded in the request
   */
  public async delete(
    commentId: string,
    requestingUserId: string,
  ): Promise<void> {
    await this.commentsRepository
      .createQueryBuilder('comment')
      .delete()
      .where('comment.id = :commentId', { commentId: commentId })
      .andWhere('comment.author = :authorId', { authorId: requestingUserId })
      .execute();

    return;
  }

  //! This code is the EXACT same from posts
  //? Is there a way to make a generic version?

  /**
   * Will fetch every CommentVote entity and recompute the comment points.
   *
   *! this is run every time someone votes, so going through every
   *! comment vote is very inefficient
   *
   *? this can be done just checking for vote type,
   *? and doing a full recheck periodically
   *
   * @param commentId
   */
  public async updateCommentPoints(commentId: string): Promise<Comment> {
    /** Get comment */
    const comment = await this.commentsRepository.findOne(commentId);

    /** Get all votes from this comment */
    const commentVotes = await this.commentVotesRepository
      .createQueryBuilder('commentVote')
      .where('commentVote.comment = :commentId', { commentId: commentId })
      .getMany();

    let counter = 0;
    for (const vote of commentVotes) {
      counter +=
        vote.voteType === 'upvote' ? 1 : vote.voteType === 'downvote' ? -1 : 0;
    }

    comment.points = counter;
    return this.commentsRepository.save(comment);
  }

  /**
   * Creates a vote of a user in a comment.
   *
   * A user can upvote, downvote, or have no votes in a comment.
   * A vote is represented by a CommentVote, which relates a user
   * a comment, and a vote type (upvote or downvote).
   *
   * If a user has upvoted, he can only downvote or remove
   * the vote altogether. The same goes for downvoting.
   *
   * TODO: more efficient way of creating comment votes.
   *
   * @param commentId comment receiving the vote
   * @param votingUserId user giving the vote
   * @param vote the type of vote
   */
  public async vote(
    commentId: string,
    votingUserId: string,
    vote: VoteType,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne(commentId);
    const user = await this.usersRepository.findOne(votingUserId);
    let commentVote: CommentVote;

    try {
      commentVote = await this.commentVotesRepository.findOneOrFail({
        comment: comment,
        user: user,
      });
    } catch (err) {
      /** No comment vote found, create one */
      const commentVote = new CommentVote();
      commentVote.comment = comment;
      commentVote.user = user;
      commentVote.voteType = vote;

      await this.commentVotesRepository.save(commentVote);
      await this.updateCommentPoints(commentId);
      return comment;
    }

    /** There's a post vote already, check if update is needed */
    if (commentVote.voteType === vote) {
      throw new RedundantVoteException(vote);
    } else {
      this.commentVotesRepository
        .createQueryBuilder('commentVote')
        .update()
        .set({
          voteType: vote,
        })
        .where('comment = :commentId', { commentId: commentId })
        .andWhere('user = :userId', { userId: votingUserId })
        .execute();

      await this.updateCommentPoints(commentId);
    }

    return comment;
  }

  /**
   * Deletes a vote of an user in a post.
   *
   *! Doesn't work.
   *
   * @param commentId comment whose vote belongs to.
   * @param votingUserId user who voted.
   */
  public async deleteVote(
    commentId: string,
    votingUserId: string,
  ): Promise<void> {
    await this.commentVotesRepository
      .createQueryBuilder('commentVote')
      .delete()
      .where('commentVote.user = :userId', { userId: votingUserId })
      .andWhere('commentVote.post = :commentId', { commentId: commentId })
      .execute();
  }
}
