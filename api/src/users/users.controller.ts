import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  createParamDecorator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

const User = createParamDecorator((data, req) => {
  return req.user;
});

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * **GET /users/:userId**
   *
   * Returns user's profile for user with id *userId*
   *
   * TODO: If user is requesting his own profile, send private profile.
   * TODO: Else, return public profile.
   * TODO: Type all response types.
   */
  @Get(':userId')
  public async getUserProfile(@User() user, @Param() params) {
    return this.usersService.getPrivateProfile(params.userId);
  }

  /**
   * **POST /users**
   *
   * Registers a new user.
   */
  @Post()
  public registerUser(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }
}
