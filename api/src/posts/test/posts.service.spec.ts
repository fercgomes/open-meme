import { PostsService } from '../posts.service';
import { Test } from '@nestjs/testing';
import { Post, PostVote } from '../posts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { MediaService } from '../../media/media.service';
import { Repository } from 'typeorm';

type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    query: jest.fn(entity => entity),
  }),
);

describe('Posts Service', () => {
  let postsService: PostsService;
  let postsRepository: MockType<Repository<Post>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Post),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PostVote),
          useFactory: repositoryMockFactory,
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MediaService,
          useValue: {
            findById: jest.fn(),
          },
        },
        PostsService,
      ],
    }).compile();

    postsService = moduleRef.get<PostsService>(PostsService);
    postsRepository = moduleRef.get(getRepositoryToken(Post));
  });

  describe('queryPosts', () => {
    it('should return post vote info if authenticated', async () => {
      const requestingUserId = '10';
      const user = { username: 'test', id: 12 };
      postsRepository.query.mockReturnValue(user);

      expect(await postsService.queryPosts(requestingUserId)).toEqual(user);
      expect(postsRepository.query).toHaveBeenCalledTimes(1);
    });

    // it('should not return post vote info if not authenticated', async () => {
    //   return false;
    // });
  });
});
