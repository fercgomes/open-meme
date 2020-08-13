/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post, PostVote } from '../posts/posts.entity';
import { Comment, CommentVote } from '../comments/comments.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  /**
   * Posts created by this user.
   */
  @OneToMany(
    type => Post,
    post => post.author,
  )
  posts: Post[];

  /** Comments given by this user. */
  @OneToMany(
    type => Comment,
    comment => comment.author,
  )
  comments: Comment[];

  /** Votes given by this user in a post. */
  @OneToMany(
    type => PostVote,
    postVote => postVote.user,
  )
  postVotes: PostVote[];

  /** Votes given by this user in a comment. */
  @OneToMany(
    type => CommentVote,
    commentVote => commentVote.user,
  )
  commentVotes: CommentVote[];
}
