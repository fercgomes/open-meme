/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Post } from '../posts/posts.entity';
import { VoteType } from '../common/types';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.comments,
  )
  author: User;

  @ManyToOne(
    type => Post,
    post => post.comments,
  )
  post: Post;

  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    type => CommentVote,
    commentVote => commentVote.comment,
  )
  votes: CommentVote[];

  @Column()
  content: string;

  @Column('datetime')
  createdAt: Date;

  @Column()
  points: number;
}

/**
 * Represents a vote given by a user in a comment.
 */
@Entity()
@Index(['comment', 'user'], { unique: true })
export class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Target comment that is receiving a vote.
   */
  @ManyToOne(
    type => Comment,
    comment => comment.votes,
  )
  comment: Comment;

  /**
   * User who is giving a vote to a comment.
   */
  @ManyToOne(
    type => User,
    user => user.commentVotes,
  )
  user: User;

  /**
   * A user can UPVOTE or DOWNVOTE a comment.
   */
  @Column({
    type: 'enum',
    enum: VoteType,
  })
  voteType: VoteType;
}
