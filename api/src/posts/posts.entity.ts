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
import { Comment } from '../comments/comments.entity';
import { VoteType } from '../common/types';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime')
  createdAt: Date;

  @Column()
  title: string;

  @Column()
  imageUrl: string;

  @ManyToOne(
    type => User,
    user => user.posts,
  )
  author: User;

  @OneToMany(
    type => Comment,
    comment => comment.post,
  )
  comments: Comment[];

  /**
   * Points are calculated by (num of upvotes) - (num of downvotes)
   */
  @Column()
  points: number;

  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    type => PostVote,
    postVote => postVote.post,
  )
  votes: PostVote[];
}

/**
 * Represents a vote given by a user in a post.
 */
@Entity()
@Index(['post', 'user'], { unique: true })
export class PostVote {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Target post that is receiving a vote.
   */
  @ManyToOne(
    type => Post,
    post => post.votes,
  )
  post: Post;

  /**
   * User who is giving a vote to a post.
   */
  @ManyToOne(
    type => User,
    user => user.postVotes,
  )
  user: User;

  /**
   * A user can UPVOTE or DOWNVOTE a post.
   */
  @Column({
    type: 'enum',
    enum: VoteType,
  })
  voteType: VoteType;
}
