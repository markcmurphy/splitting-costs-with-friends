import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";
import AddNewTrip from "./AddNewTrip";
import ListTrips from "./ListTrips";
import Trip from "./Trip.js";

class AllTrips extends Component {
  render() {
    const { trips } = this.props;
    if (this.props) {
      console.log(this.props);
    }
    return (
      <div>
        {/* 
        <ul>
        {trips ? (
            Object.keys(trips).map((item) => {
              console.log(item);
              return <li key={item}>{item.tripName}</li>;
            })
            ) : (
              <LoadingSpinner />
              )}
            </ul> */}
        {!this.props.uid ? (
          <LoadingSpinner />
        ) : (
          <div>
            <h1>All Trips</h1>
            <Router>
              <ListTrips uid={this.props.uid} />
              {/* <ListTrips uid={"zOU9qXFd7sNlYpHasQxH6R6Ydp52"} /> */}
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route
                  path="/trip/:id"
                  render={({ match }) => <Trip id={match.params.id} />}
                />
              </Switch>
            </Router>

            <AddNewTrip uid={this.props.uid} />
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    // console.log(props),
    // {
    //   collection: "expenses",
    //   storeAs: "expense",
    // },
    // {
    //   collection: "friends",
    //   storeAs: "friend",
    // },
    {
      collection: "users",
      doc: props.uid,
      // doc: "zOU9qXFd7sNlYpHasQxH6R6Ydp52",
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  //   return [{ collection: "users", doc: props.uid, subcollections: [{ collection: "tasks" }], storeAs: `${props.uid}-tasks` }];

  connect(({ firestore: { data } }, props) => ({
    // expenses: data.expenses,
    // friends: data.friends,
    trips: data[`${props.uid}-trips`],
    // auth: auth,
  }))
)(AllTrips);
