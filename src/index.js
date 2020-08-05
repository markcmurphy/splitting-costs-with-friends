import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import store, { rrfProps } from "./store";

import App2 from "./App2";
import * as serviceWorker from "./serviceWorker";
// import "./index.css";
// import "./App.css";

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router>
        <App2 />
      </Router>
    </ReactReduxFirebaseProvider>
  </Provider>,

  document.getElementById("root")
);

serviceWorker.unregister();
