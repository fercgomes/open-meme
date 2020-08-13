import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { JWTPayload, AuthResponse } from './types';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Fetches user and verifies the password match.
   * @param username the user requesting authentication
   * @param password the password provided by the user
   *
   * @returns A User object (without password).
   *
   * @throws {UnauthorizedException} if authentication wasn't successful
   */
  public async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    /** Fetch requesting user */
    const user = await this.usersService.findByUsername(username);

    /** If password is correct, send user data back, without password */
    if (user && compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    /** No password match */
    throw new UnauthorizedException(
      "User doesn't exist or password doesn't match.",
    );
  }

  /**
   * Encodes the authenticated user data into a JWT token,
   * and returns it. TODO: what else to pass back to user?
   * @param user the authenticated user
   */
  public login(user: any): AuthResponse {
    const payload: JWTPayload = {
      username: user.username,
      sub: user.id.toString(),
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
