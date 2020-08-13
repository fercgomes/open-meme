import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { JWTPayload, RequestingUser } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Passport decodes the JWT token in the request. Then it builds
   * the req.user with the return of validate.
   */
  public validate(payload: JWTPayload): RequestingUser {
    // TODO: More logic could go here. Maybe fetch the user and
    // put it into the request object?
    // Or doing token validation?
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
