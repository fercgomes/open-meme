import { IsEmail, IsString } from 'class-validator';

/**
 * Contains all the data required to register
 * a new user.
 */
export class CreateUserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

/**
 * TODO: field size requirements
 */
