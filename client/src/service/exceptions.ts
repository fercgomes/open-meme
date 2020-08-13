import Logger from "js-logger";

export class NoAuthCookieException extends Error {
  constructor() {
    super();
    Logger.warn("Except | No auth cookie was found.");
  }
}
