/** Auth data that will be encoded in a cookie
 * for persistence.
 */
export interface AuthCookieObject {
  /** Returned token from login request. */
  token: string;
  expirationDate: Date;
}
