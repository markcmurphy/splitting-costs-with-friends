import React, { Component } from "react";
import "./App.css";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { compose } from "redux";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import Navbar from "./components/layout/Navbar";
import AllTrips from "./components/trips/AllTrips";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LoadingSpinner from "./components/loading/LoadingSpinner";
import { queryAllByAltText } from "@testing-library/react";

class App extends Component {
  render() {
    const { auth } = this.props;

    return (
      <div className="App">
        <header>
          <Navbar />
        </header>
        <main className="main">
          <Switch>
            <Route
              exact
              path="/login"
              component={UserIsNotAuthenticated(Login)}
            />
            <Route
              exact
              path="/register"
              component={UserIsNotAuthenticated(Register)}
            />
            <Route
              exact
              path="/"
              component={UserIsAuthenticated(() => (
                <AllTrips uid={auth.uid} />
              ))}
            />
            <Route
              exact
              path="/"
              component={UserIsNotAuthenticated(LoadingSpinner)}
            />
          </Switch>
        </main>
        {/* <aside>side</aside> */}
        <footer>{/* <div>Footer</div> */}</footer>
      </div>
    );
  }
}

// export default App;
export default compose(
  firebaseConnect(),
  connect((state) => ({
    auth: state.firebase.auth,
  }))
)(App);
