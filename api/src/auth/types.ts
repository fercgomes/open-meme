/**
 * Represents the data encoded in a JWT token.
 */
export interface JWTPayload {
  username: string;
  sub: string;
}

/**
 * Represents the data returned to the user
 * whenever he is authenticated.
 */
export interface AuthResponse {
  token: string;
}

/**
 * Represents the data that will be encoded in
 * the Request object for route handlers.
 */
export interface RequestingUser {
  userId: string;
  username: string;
}
