import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [],
  exports: [MediaService],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
