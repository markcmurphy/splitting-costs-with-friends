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
    return (
      <div>
        {!this.props.uid ? (
          <LoadingSpinner />
        ) : (
          <div>
            <h1>All Trips</h1>
            <Router>
              <ListTrips uid={this.props.uid} />
              <Switch>
                <Route
                  path="/trip/:id"
                  render={({ match }) => (
                    <Trip id={match.params.id} uid={this.props.uid} />
                  )}
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
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  connect(({ firestore: { data } }, props) => ({
    trips: data[`${props.uid}-trips`],
  }))
)(AllTrips);
