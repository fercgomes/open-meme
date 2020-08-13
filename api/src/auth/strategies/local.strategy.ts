import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Checks whether user/password is valid.
   *
   * @throws {UnauthorizedException}
   * @returns Authenticated user
   */
  public async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    return await this.authService.validateUser(username, password);
  }
}
