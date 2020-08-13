export interface IAuthState {
  token?: string;
  user?: string;
  authenticated: boolean;
  error?: string;
  loading: boolean;
  authRedirectPath: string;
}

export const AUTH_CHECK_STATE = "AUTH_CHECK_STATE";
export const AUTH_USER = "AUTH_USER";
export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const AUTH_CHECK_TIMEOUT = "AUTH_CHECK_TIMEOUT";
export const AUTH_INITIATE_LOGOUT = "AUTH_INITIATE_LOGOUT";
export const AUTH_LOGOUT = "AUTH_LOGOUT";
export const SET_AUTH_REDIRECT_PATH = "SET_AUTH_REDIRECT_PATH";

export interface IAuthStartAction {
  type: typeof AUTH_START;
}

export interface IAuthSuccessAction {
  type: typeof AUTH_SUCCESS;
  token: string;
}

export interface IAuthFailAction {
  type: typeof AUTH_FAIL;
  error: string;
}

export interface ILogoutStartAction {
  type: typeof AUTH_INITIATE_LOGOUT;
}

export interface ILogoutSucceedAction {
  type: typeof AUTH_LOGOUT;
}

export interface ICheckAuthTimeoutAction {
  type: typeof AUTH_CHECK_TIMEOUT;
  expirationTime: number;
}

export interface IAuthAction {
  type: typeof AUTH_USER;
  username: string;
  password: string;
}

export interface ISetAuthRedirectPathAction {
  type: typeof SET_AUTH_REDIRECT_PATH;
  path: string;
}

export interface IAuthCheckStateAction {
  type: typeof AUTH_CHECK_STATE;
}

export type AuthActionTypes =
  | IAuthStartAction
  | IAuthSuccessAction
  | IAuthFailAction
  | ILogoutStartAction
  | ILogoutSucceedAction
  | ICheckAuthTimeoutAction
  | IAuthAction
  | ISetAuthRedirectPathAction
  | IAuthCheckStateAction;
