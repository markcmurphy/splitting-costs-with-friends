import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import { createStore, applyMiddleware } from "redux";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
// import reduxThunk from "redux-thunk";
// import reducers from "./reducers";
import store, { rrfProps } from "./store";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";

// const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router>
        <App />
      </Router>
    </ReactReduxFirebaseProvider>
  </Provider>,

  document.getElementById("root")
);

serviceWorker.unregister();
