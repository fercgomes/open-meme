import { IAuthState, AuthActionTypes } from "./types";
import * as actions from "./types";

function updateObject<T>(oldObject: T, updatedProperties: object): T {
  return {
    ...oldObject,
    ...updatedProperties,
  };
}

const initialState: IAuthState = {
  token: undefined,
  user: undefined,
  authenticated: false,
  error: undefined,
  loading: false,
  authRedirectPath: "/",
};

const authStart = (state: IAuthState, action: AuthActionTypes): IAuthState => {
  return updateObject<IAuthState>(state, {
    error: null,
    loading: true,
  });
};

const authSuccess = (
  state: IAuthState,
  action: AuthActionTypes
): IAuthState => {
  return updateObject<IAuthState>(state, {
    //@ts-ignore
    token: action.token,
    authenticated: true,
    error: null,
    loading: false,
  });
};

const authFail = (state: IAuthState, action: AuthActionTypes): IAuthState => {
  return updateObject<IAuthState>(state, {
    //@ts-ignore
    token: action.token,
    authenticated: false,
    //@ts-ignore
    error: action.error,
    loading: false,
  });
};

const authLogout = (state: IAuthState, action: AuthActionTypes): IAuthState => {
  return updateObject<IAuthState>(state, {
    token: null,
    authenticated: false,
    user: null,
  });
};

const setAuthRedirectPath = (
  state: IAuthState,
  action: AuthActionTypes
): IAuthState => {
  return updateObject<IAuthState>(state, {
    //@ts-ignore
    authRedirectPath: action.path,
  });
};

const reducer = (state = initialState, action: AuthActionTypes): IAuthState => {
  switch (action.type) {
    case actions.AUTH_START:
      return authStart(state, action);
    case actions.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actions.AUTH_FAIL:
      return authFail(state, action);
    case actions.AUTH_LOGOUT:
      return authLogout(state, action);
    case actions.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
