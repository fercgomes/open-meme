import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import authReducer from "./store/auth/reducers";
import { watchAuth } from "./store/auth/sagas";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import Logger from "js-logger";

Logger.useDefaults();

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? //@ts-ignore
      //@ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

export const rootReducer = combineReducers({
  auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
  // applyMiddleware(thunk, sagaMiddleware)
);

sagaMiddleware.run(watchAuth);

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    ,
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
