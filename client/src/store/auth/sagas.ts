import { delay, put } from "redux-saga/effects";
import { all, takeEvery } from "redux-saga/effects";
import * as actions from "./actions";
import {
  Api,
  removeAuthCookie,
  setAuthCookie,
  getAuthCookie,
} from "../../service/api";
import Logger from "js-logger";
import {
  IAuthCheckStateAction,
  ICheckAuthTimeoutAction,
  IAuthAction,
  ILogoutStartAction,
} from "./types";
import {
  AUTH_CHECK_TIMEOUT,
  AUTH_INITIATE_LOGOUT,
  AUTH_USER,
  AUTH_CHECK_STATE,
} from "./types";
import { AuthCookieObject } from "../../service/types";

const log = Logger.get("Auth Saga");

/**
 * Removes the auth cookie.
 */
export function* logoutSaga(action: ILogoutStartAction) {
  log.info("Removing auth cookie.");
  removeAuthCookie();
  yield put(actions.logoutSucceed());
}

/** Schedules a logout action for when the token expires. */
export function* checkAuthTimeoutSaga(action: ICheckAuthTimeoutAction) {
  log.info(`Log out in ${action.expirationTime} seconds.`);
  yield delay(action.expirationTime * 1000);
  log.info("Logging out now.");
  yield put(actions.logout());
}

/** Requests authentication for a user. */
export function* authUserSaga(action: IAuthAction) {
  yield put(actions.authStart());
  const username = action.username;
  const password = action.password;

  try {
    const { token } = yield Api.auth.login(username, password);
    const expiresIn = 3600; // seconds (1 hour)
    const expirationDate = yield new Date(
      new Date().getTime() + expiresIn * 1000
    );
    log.info("New expiration date = ", expirationDate);

    setAuthCookie({ token, expirationDate });

    yield put(actions.authSuccess(token));
    yield put(actions.checkAuthTimeout(expiresIn));
  } catch (error) {
    log.error(error.response);
    const message = error.response
      ? error.response.data.message
      : error.request
      ? error.request.data.message
      : "Something went wrong...";
    yield put(actions.authFail(message));
  }
}

/** Checks whether the token has expired. */
export function* authCheckStateSaga(action: IAuthCheckStateAction) {
  try {
    const authCookie: AuthCookieObject = yield getAuthCookie();
    if (authCookie) {
      const token = authCookie.token;
      log.info("Found token stored in cookies.");

      if (
        new Date(authCookie.expirationDate).getTime() <= new Date().getTime()
      ) {
        log.info("Token has expired. Dispatching logout.");
        yield put(actions.logout());
      } else {
        log.info("Token is still good. Continuing.");
        yield put(actions.authSuccess(token));
        yield put(
          actions.checkAuthTimeout(
            (new Date(authCookie.expirationDate).getTime() -
              new Date().getTime()) /
              1000
          )
        );
      }
    }
  } catch (error) {
    log.warn("No auth cookie found.");
    yield put(actions.logout());
  }
}

export function* watchAuth() {
  yield all([
    takeEvery(AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(AUTH_USER, authUserSaga),
    takeEvery(AUTH_CHECK_STATE, authCheckStateSaga),
  ]);
}
