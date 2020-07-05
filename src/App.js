import React, { Component } from "react";
import "./App.css";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { compose } from "redux";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import Vertbody from "./components/layout/Vertbody";
import Navbar from "./components/layout/Navbar";
import AllTrips from "./components/trips/AllTrips";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LoadingSpinner from "./components/loading/LoadingSpinner";

class App extends Component {
  AllTripsPage = (props) => {
    return <AllTrips {...props} uid={this.props.auth.uid} />;
  };

  render() {
    const { auth } = this.props;

    return (
      <div className="App">
        <Navbar />
        <div className="main">
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
        </div>
      </div>
    );
  }
}

// export default App;
export default compose(
  firebaseConnect(),
  connect((state) => ({
    auth: state.firebase.auth,
    // settings: state.settings,
  }))
)(App);
