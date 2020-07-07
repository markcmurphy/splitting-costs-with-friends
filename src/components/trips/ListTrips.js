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

class ListTrips extends Component {
  render() {
    console.log(this.props);
    const { trips, uid } = this.props;

    return (
      <ul>
        {trips ? (
          trips.map((item) => {
            return (
              <li key={item.id}>
                <Link
                  to={{
                    pathname: `/trip/${item.id}`,
                    tripProps: { uid: "uid" },
                  }}
                >
                  {item.tripName}
                </Link>
              </li>
            );
          })
        ) : (
          <LoadingSpinner />
        )}
      </ul>
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

  connect(({ firestore: { ordered } }, props) => ({
    trips: ordered[`${props.uid}-trips`],
  }))
)(ListTrips);
