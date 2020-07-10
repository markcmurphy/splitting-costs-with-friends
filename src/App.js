import React, { Component } from "react";
import "./App.css";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
  useParams,
} from "react-router-dom";

import { compose } from "redux";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import Vertbody from "./components/layout/Vertbody";
import Navbar from "./components/layout/Navbar";
import AllTrips from "./components/trips/AllTrips";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LoadingSpinner from "./components/loading/LoadingSpinner";
import Sidebar from "./components/layout/Sidebar";
import { queryAllByAltText } from "@testing-library/react";

class App extends Component {
  navFun = () => {
    return (
      <Route
        path="/trip/:id"
        // component={
        //   UserIsAuthenticated(() => (
        //   <Sidebar props={this.props} uid={auth.uid} />
        //   ))
        // }
        // UserIsAuthenticated((=>))
        render={(props) =>
          // UserIsAuthenticated(() => (
          this.props.auth.uid ? (
            <Sidebar
              {...props}
              // title={`Props through component`}
              // id={match.params.id}
              uid={this.props.auth.uid}
            />
          ) : null
        }
        // ))
      />
    );
  };

  mainFunc = () => {
    return (
      <Switch>
        <Route exact path="/login" component={UserIsNotAuthenticated(Login)} />
        <Route
          exact
          path="/register"
          component={UserIsNotAuthenticated(Register)}
        />
        <Route
          exact
          path="/"
          component={UserIsAuthenticated(() => (
            <AllTrips uid={this.props.auth.uid} />
          ))}
        />
        <Route
          exact
          path="/"
          component={UserIsNotAuthenticated(LoadingSpinner)}
        />
      </Switch>
    );
  };

  render() {
    const { auth } = this.props;
    // console.log(useLocation());
    console.log(this.props);

    return (
      <div className="App">
        <header>
          <Navbar />
        </header>
        <nav>
          {/* <Switch> */}
          {/* {this.navFun()} */}
          {/* <Route
            path="/trip/:id"
            // component={
            //   UserIsAuthenticated(() => (
            //   <Sidebar props={this.props} uid={auth.uid} />
            //   ))
            // }
            // UserIsAuthenticated((=>))
            render={(props) =>
              // UserIsAuthenticated(() => (
              this.props.auth.uid ? (
                <Sidebar
                  {...props}
                  // title={`Props through component`}
                  // id={match.params.id}
                  uid={this.props.auth.uid}
                />
              ) : null
            }
            // ))
          /> */}
          {/* </Switch> */}
        </nav>
        <main className="main">
          {this.mainFunc()}
          {/* <Switch>
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
          </Switch> */}
        </main>
        <aside>side</aside>
        <footer>
          <div>Footer</div>
        </footer>
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
