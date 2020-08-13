import {
  EventSubscriber,
  EntitySubscriberInterface,
  Connection,
  InsertEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { Post, PostVote } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Setting listeners to PostVote changes.
 */
@EventSubscriber()
export class PostVoteSubscriber implements EntitySubscriberInterface<PostVote> {
  constructor(
    connection: Connection,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
    connection.subscribers.push(this);
  }

  private updatePoints(postVote: PostVote) {
    this.postRepository
      .increment({ id: postVote.post.id }, 'points', postVote.voteType)
      .then(() => {
        console.log('updated');
      });
  }

  listenTo() {
    return PostVote;
  }

  afterInsert(event: InsertEvent<PostVote>) {
    const postVote = event.entity;
    console.log(`inserting postvote`, postVote);
    // this.updatePoints(postVote);
  }

  afterUpdate(event: UpdateEvent<PostVote>) {
    const postVote = event.entity;
    console.log(`updating postvote`, postVote);
    // this.updatePoints(postVote);
  }
}
