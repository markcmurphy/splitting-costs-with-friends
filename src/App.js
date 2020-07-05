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
    // console.log(props);
    return <AllTrips {...props} uid={this.props.auth.uid} />;
  };

  render() {
    const { auth } = this.props;
    if (this.props.auth) {
      console.log(this.props);
    }

    return (
      <div className="App">
        <Navbar />
        <div className="main">
          <Switch>
            {/* <AllTrips uid={"Dv8b8sjyMrX8HdWC13Gk3tZrUM22"} /> */}
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
            {!this.props.auth.uid ? (
              <LoadingSpinner />
            ) : (
              <Route
                exact
                path="/"
                component={UserIsAuthenticated(() => (
                  <AllTrips uid={auth.uid} />
                ))}
              />
            )}
            <Route
              exact
              path="/"
              component={UserIsNotAuthenticated(LoadingSpinner)}
            />
          </Switch>
          {/* <Vertbody /> */}
          {/* <RenderExpenseList /> */}
          {/* <AddExpense /> */}
          {/* <Friends /> */}
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
