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
  constructor(props) {
    super(props);
    this.state = {
      state: "i",
    };
  }
  render() {
    const { auth, ...props } = this.props;
    console.log(this.props);
    return (
      <div className="App">
        <header>
          <Navbar />
        </header>
        <Router>
          <nav>
            <Switch>
              <Route
                {...props}
                exact
                path="/trip/:id"
                render={
                  (this.UserIsAuthenticated = (
                    // console.log('hi')
                    { match, props }
                  ) =>
                    this.props.auth.uid
                      ? (console.log(match.params.id),
                        (
                          <Sidebar
                            id={match.params.id}
                            uid={this.props.auth.uid}
                          />
                        ))
                      : null)
                }
              />
              <Route
                // exact
                path="/"
                render={
                  (this.UserIsAuthenticated = ({ match, props }) =>
                    this.props.auth.uid ? (
                      <div className="nav-wrapper mt-3" style={{}} id="sidebar">
                        <>
                          <div class="alert alert-info mt-4" role="alert">
                            Add friend or friends prior to adding expense!
                          </div>
                          {/* <AddNewTrip uid={this.props.uid} />
                          <ListTrips uid={this.props.uid} /> */}
                        </>
                      </div>
                    ) : null)
                }
              />
              />
            </Switch>
            {/* </Router> */}
          </nav>
          <main>
            {/* <Router forceRefresh={true}> */}
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
                {...props}
                exact
                path="/trip/:id"
                component={
                  (this.UserIsAuthenticated = ({ match, props }) =>
                    // console.log(match.params.id);
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
        </Router>
        {/* <aside>side</aside> */}
        <footer>{/* <div>Footer</div> */}</footer>
      </div>
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
