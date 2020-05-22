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
import AddNewTrip from "../trips/AddNewTrip";
import ListTrips from "../trips/ListTrips";
import Trip from "../trips/Trip.js";

class AllTrips extends Component {
  // let match = useRouteMatch();
  render() {
    const { trips } = this.props;
    // if (isLoaded(trips)) {
    //   console.log(this.props);
    // }

    return (
      <div>
        <h1>All Trips</h1>
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
        <Router>
          <ListTrips uid={this.props.uid} />
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
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "expenses",
      storeAs: "expense",
    },
    {
      collection: "friends",
      storeAs: "friend",
    },
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  //   return [{ collection: "users", doc: props.uid, subcollections: [{ collection: "tasks" }], storeAs: `${props.uid}-tasks` }];

  connect(({ firestore: { data } }, props) => ({
    expenses: data.expenses,
    friends: data.friends,
    trips: data[`${props.uid}-trips`],
  }))
)(AllTrips);
