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
    const { trips } = this.props;
    // const match = useRouteMatch();

    return (
      <ul>
        {trips ? (
          trips.map((item) => {
            // console.log(item);
            return (
              <li key={item.id}>
                <Link to={`/trip/${item.id}`}>{item.tripName}</Link>
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
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  //   return [{ collection: "users", doc: props.uid, subcollections: [{ collection: "tasks" }], storeAs: `${props.uid}-tasks` }];

  connect(({ firestore: { ordered } }, props) => ({
    // expenses: data.expenses,
    // friends: data.friends,
    trips: ordered[`${props.uid}-trips`],
  }))
)(ListTrips);
