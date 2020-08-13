import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** The login route. The login route is protected by a Local strategy
   * guard. The actual handler will only be called if the user was
   * authenticated.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req) {
    /** If authentication was succesful, the request will
     * populated by Passport.
     */
    return this.authService.login(req.user);
  }
}
