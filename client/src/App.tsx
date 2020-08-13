import React, { useCallback, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authCheckState } from "./store/auth/actions";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignOut from "./pages/Auth/SignOut/SignOut";
import Post from "./pages/Post/Post";
import NewPost from "./pages/NewPost/NewPost";
import SignUp from "./pages/Auth/SignUp/SignUp";

function App() {
  const dispatch = useDispatch();
  const tryAutoSignup = useCallback(() => dispatch(authCheckState()), [
    dispatch,
  ]);

  /** When entry point is rendered, trie to auto login user. */
  useEffect(() => {
    tryAutoSignup();
  }, [tryAutoSignup]);

  return (
    <>
      <Route path="/" exact component={Home} />

      <Route path="/auth/signin" component={SignIn} />
      <Route path="/auth/signout" component={SignOut} />

      <Route path="/sign-up" component={SignUp} />

      <Route path="/new-post" component={NewPost} />
      <Route path="/post/:postId" exact component={Post} />
    </>
  );
}

export default App;
