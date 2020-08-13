import { AuthActionTypes } from "./types";
import * as actions from "./types";

export function authStart(): AuthActionTypes {
  return {
    type: actions.AUTH_START,
  };
}

export function authSuccess(token: string): AuthActionTypes {
  return {
    type: actions.AUTH_SUCCESS,
    token: token,
  };
}

export function authFail(error: string): AuthActionTypes {
  return {
    type: actions.AUTH_FAIL,
    error: error,
  };
}

export function logout(): AuthActionTypes {
  return {
    type: actions.AUTH_INITIATE_LOGOUT,
  };
}

export function logoutSucceed(): AuthActionTypes {
  return {
    type: actions.AUTH_LOGOUT,
  };
}

export function checkAuthTimeout(expirationTime: number): AuthActionTypes {
  return {
    type: actions.AUTH_CHECK_TIMEOUT,
    expirationTime: expirationTime,
  };
}

export function auth(username: string, password: string): AuthActionTypes {
  return {
    type: actions.AUTH_USER,
    username: username,
    password: password,
  };
}

export function setAuthRedirectPath(path: string): AuthActionTypes {
  return {
    type: actions.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
}

export function authCheckState(): AuthActionTypes {
  return {
    type: actions.AUTH_CHECK_STATE,
  };
}
