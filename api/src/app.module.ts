import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Comment, CommentVote } from './comments/comments.entity';
import { Post, PostVote } from './posts/posts.entity';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '35.247.209.234',
      port: 3306,
      username: 'root',
      password: 'F3rn@nd0',
      database: 'geomeme',
      entities: [Comment, CommentVote, Post, PostVote, User],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
