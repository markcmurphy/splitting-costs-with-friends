import React, { Component } from "react";
import "./App.css";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

import { compose } from "redux";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import Navbar from "./components/layout/Navbar";
import AllTrips from "./components/trips/AllTrips";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LoadingSpinner from "./components/loading/LoadingSpinner";
import { queryAllByAltText } from "@testing-library/react";
import Trip from "./components/trips/Trip";
import Sidebar from "./components/layout/Sidebar";
import RenderExpenseList from "./components/expense/RenderExpenseList";
import AddNewTrip from "./components/trips/AddNewTrip";
import ListTrips from "./components/trips/ListTrips";

class App extends Component {
  render() {
    const { auth, ...props } = this.props;
    console.log(this.props);
    return (
      <Router>
        <div className="App">
          <header>
            <Navbar />
          </header>
          <nav>
            <Switch>
              <Route
                {...props}
                exact
                path="/"
                component={
                  (this.UserIsAuthenticated = () =>
                    auth.uid ? <Sidebar uid={auth.uid} /> : null)
                }
              />
              <Route
                {...props}
                path="/trip/:id"
                component={
                  (this.UserIsAuthenticated = ({ match }) =>
                    auth.uid ? (
                      <Sidebar id={match.params.id} uid={auth.uid} />
                    ) : null)
                }
              />
            </Switch>
          </nav>
          <main>
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
                // {...props}
                exact
                path="/trip/:id"
                render={
                  (this.UserIsAuthenticated = ({ match }) =>
                    this.props.auth.uid ? (
                      <RenderExpenseList
                        tripId={match.params.id}
                        uid={this.props.auth.uid}
                      />
                    ) : //  <Trip id={match.params.id} uid={this.props.auth.uid} />
                    null)
                }
              />
              {/* <Route
                {...props}
                exact
                path="/trip/:id"
                render={
                  (this.UserIsAuthenticated = ({ match, props }) =>
                    this.props.auth.uid ? (
                      <Trip id={match.params.id} uid={this.props.auth.uid} />
                    ) : null)
                }
              /> */}

              {/* <Route
                exact
                path="/"
                component={UserIsAuthenticated(() => (
                  <AllTrips uid={auth.uid} />
                ))}
              /> */}
              <Route
                exact
                path="/"
                component={UserIsNotAuthenticated(LoadingSpinner)}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

// export default App;
export default compose(
  connect((state) => ({
    // tripID: state.id,
    auth: state.firebase.auth,
  }))
)(App);
