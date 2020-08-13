import { IsString } from 'class-validator';

/**
 * A transfer object for creating a comment.
 */
export class CreateCommentDTO {
  /**
   * Content of a comment being created.
   *
   * TODO: set a fixed size for a comment.
   */
  @IsString()
  content: string;
}
